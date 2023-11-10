package main

import (
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"math"
	"os"
	"runtime"
	"sort"
	"sync"
	"time"
)

func convertHSV(paint color.Color) (float64, float64, float64) {
	r, g, b, _ := paint.RGBA()
	R := float64(r>>8) / 255
	G := float64(g>>8) / 255
	B := float64(b>>8) / 255
	v := math.Max(R, math.Max(G, B))
	min := math.Min(R, math.Min(G, B))
	delta := v - min
	var s, h float64
	if v == 0 {
		s = 0
	} else {
		s = delta / v
	}
	if delta == 0 {
		h = 0
	} else if v == R {
		h = (G - B) / delta
		if h < 0 {
			h += 6
		}
	} else if v == G {
		h = (B-R)/delta + 2
	} else {
		h = (R-G)/delta + 2
	}
	h *= 60
	return h, s, v
}

func indexHSV(paint color.Color) int32 {
	h, s, v := convertHSV(paint)
	var H, S, V int32
	if h >= 316 && h <= 360 {
		H = 0
	} else if h >= 1 && h <= 25 {
		H = 1
	} else if h >= 25 && h <= 40 {
		H = 2
	} else if h >= 40 && h <= 120 {
		H = 3
	} else if h >= 120 && h <= 190 {
		H = 4
	} else if h >= 190 && h <= 270 {
		H = 5
	} else if h >= 270 && h <= 295 {
		H = 6
	} else if h >= 295 && h <= 315 {
		H = 7
	} else {
		H = 0
	}
	if s < 0.2 {
		S = 0
	} else if s < 0.7 {
		S = 1
	} else {
		S = 2
	}
	if v < 0.2 {
		V = 0
	} else if v < 0.7 {
		V = 1
	} else {
		V = 2
	}
	return H*9 + S*3 + V
}

func lengDorm(bins [72]int32) float64 {
	var temp float64 = 0
	for i := 0; i < 72; i++ {
		temp += float64(bins[i]) * float64(bins[i])
	}
	ret := math.Sqrt(temp)
	return ret
}

func cosineSimiliarity(bins1 [9][72]int32, data Vektor, resultChan chan tuplePercentage, wg *sync.WaitGroup) {
	defer wg.Done()
	var down1 [9]float64
	var down2 [9]float64
	var accum [9]float64
	for i := 0; i < 9; i++ {
		down1[i] = lengDorm(bins1[i])
		down2[i] = lengDorm(data.Bins[i])
	}
	//fmt.Printf("%v %v ----- ", down1, down2)
	var finalRes float64 = 0
	for k := 0; k < 9; k++ {
		for i := 0; i < 72; i++ {
			accum[k] += float64(bins1[k][i]) * float64(data.Bins[k][i])
		}
		//if down1[k] == 0 || down2[k] == 0 {
		//	if down1[k] == 0 || down2[k] == 0 {
		//		accum[k] = 1
		//	} else {
		//		accum[k] = 0
		//	}
		//} else {
		accum[k] /= (down1[k] * down2[k])
		//}
	}
	finalRes = accum[0] + 2*accum[1] + accum[2] + 2*accum[3] + 4*accum[4] + 2*accum[5] + accum[6] + 2*accum[7] + accum[8]
	//fmt.Printf("%v -- %v\n", data.ImgName, finalRes)
	finalRes = finalRes * 100 / 16
	var res tuplePercentage
	res.Path = data.ImgName
	res.Percentage = finalRes
	select {
	case resultChan <- res:
	default:
	}
}

func readImage(path string) image.Image {
	f, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	img, _, err := image.Decode(f)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return img
}

type Vektor struct {
	ImgName string       `json:"imgName"`
	Bins    [9][72]int32 `json:"bins"`
}

func calculateSingleVector(path string) [9][72]int32 {
	img := readImage(path)
	var vektor [9][72]int32
	if img == nil {
		fmt.Println("Image is not extracted.")
		return vektor
	}
	var width, height int
	size := img.Bounds().Size()
	width = (size.X) / 4
	height = (size.Y) / 4
	for x := 0; x < width; x++ { // 0
		for y := 0; y < height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[0][index]++
		}
	}
	for x := 0; x < width; x++ { // 1
		for y := height; y < 3*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[1][index]++
		}
	}
	for x := 0; x < width; x++ { // 2
		for y := 3 * height; y < 4*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[2][index]++
		}
	}
	for x := width; x < 3*width; x++ { // 3
		for y := 0; y < height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[3][index]++
		}
	}
	for x := width; x < 3*width; x++ { // 4
		for y := height; y < 3*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[4][index]++
		}
	}
	for x := width; x < 3*width; x++ { // 5
		for y := 3 * height; y < 4*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[5][index]++
		}
	}
	for x := 3 * width; x < 4*width; x++ { // 6
		for y := 0; y < height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[6][index]++
		}
	}
	for x := 3 * width; x < 4*width; x++ { // 7
		for y := height; y < 3*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[7][index]++
			//fmt.Println(x, y, index)
		}
	}
	for x := 3 * width; x < 4*width; x++ { // 8
		for y := 3 * height; y < 4*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor[8][index]++
			//fmt.Println(x, y, index)
		}
	}
	return vektor
}

func extractColorVector(filePath string) []Vektor {
	file, err := os.Open(filePath)
	var temp []Vektor
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return temp
	}
	defer file.Close()
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&temp)
	if err != nil {
		fmt.Println("Error decoding")
		return temp
	}
	return temp
}

type tuplePercentage struct {
	Path       string  `json:"path"`
	Percentage float64 `json:"percentage"`
}

type ByPercentage []tuplePercentage

func (a ByPercentage) Len() int           { return len(a) }
func (a ByPercentage) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByPercentage) Less(i, j int) bool { return a[i].Percentage > a[j].Percentage }

func searchImageColor(imageSearched string, binsFile string, targetFile string) {
	runtime.GOMAXPROCS(12)
	mainVector := calculateSingleVector(imageSearched)
	dataVector := extractColorVector(binsFile)
	length := len(dataVector)
	fmt.Println("Banyak data :", length)
	maxProccess := 299
	var tempFoundImage []tuplePercentage
	resultChan := make(chan tuplePercentage, maxProccess)
	var wg sync.WaitGroup
	for i, fileName := range dataVector {
		wg.Add(1)
		go cosineSimiliarity(mainVector, fileName, resultChan, &wg)
		if (i+1)%(maxProccess) == 0 || (i+1) == length {
			wg.Wait()
			close(resultChan)
			for res := range resultChan {
				tempFoundImage = append(tempFoundImage, res)
			}
			resultChan = make(chan tuplePercentage, maxProccess)
		}
	}
	var finalImage []tuplePercentage
	for _, tuple := range tempFoundImage {
		//fmt.Println(tuple)
		if tuple.Percentage >= 60 {
			finalImage = append(finalImage, tuple)
		}
	}
	sort.Sort(ByPercentage(finalImage))

	fmt.Println("Banyak gambar yang ditemukan:", len(finalImage))

	file, err := os.Create(targetFile)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)

	err = encoder.Encode(finalImage)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return
	}
	fmt.Printf("Data written to %v\n", targetFile)
}

func main() {
	stime := time.Now()
	searchImageColor("334.jpg", "busImage.json", "resultBus.json")
	etime := time.Now()
	dtime := etime.Sub(stime)
	fmt.Println("Diff Time:", dtime)
}
