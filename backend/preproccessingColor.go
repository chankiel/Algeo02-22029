package main

import (
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"io/fs"
	"log"
	"math"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

func isImage(file fs.DirEntry) bool {
	extent := strings.ToLower(filepath.Ext(file.Name()))
	return extent == ".jpg" || extent == ".jpeg" || extent == ".png"
}

func listImageInDir(dirpath string) ([]fs.DirEntry, int) {
	files, err := os.ReadDir(dirpath)
	if err != nil {
		fmt.Println("Read Error")
		log.Fatal(err)
		return nil, 0
	}
	count := 0
	for _, file := range files {
		if isImage(file) {
			count++
		}
	}
	return files, count
}

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
	if h > 315 && h <= 360 {
		H = 0
	} else if h >= 0 && h <= 25 {
		H = 1
	} else if h > 25 && h <= 40 {
		H = 2
	} else if h > 40 && h <= 120 {
		H = 3
	} else if h > 120 && h <= 190 {
		H = 4
	} else if h > 190 && h <= 270 {
		H = 5
	} else if h > 270 && h <= 295 {
		H = 6
	} else {
		H = 7
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

func calculateVector(path string, resultChan chan Vektor, wg *sync.WaitGroup) {
	defer wg.Done()
	img := readImage(path)
	var vektor Vektor
	if img == nil {
		fmt.Println("Image is not extracted.")
		return
	}
	vektor.ImgName = path
	var width, height int
	size := img.Bounds().Size()
	width = (size.X) / 4
	height = (size.Y) / 4
	for x := 0; x < width; x++ { // 0
		for y := 0; y < height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[0][index]++
		}
	}
	for x := 0; x < width; x++ { // 1
		for y := height; y < 3*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[1][index]++
		}
	}
	for x := 0; x < width; x++ { // 2
		for y := 3 * height; y < 4*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[2][index]++
		}
	}
	for x := width; x < 3*width; x++ { // 3
		for y := 0; y < height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[3][index]++
		}
	}
	for x := width; x < 3*width; x++ { // 4
		for y := height; y < 3*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[4][index]++
		}
	}
	for x := width; x < 3*width; x++ { // 5
		for y := 3 * height; y < 4*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[5][index]++
		}
	}
	for x := 3 * width; x < 4*width; x++ { // 6
		for y := 0; y < height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[6][index]++
		}
	}
	for x := 3 * width; x < 4*width; x++ { // 7
		for y := height; y < 3*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[7][index]++
		}
	}
	for x := 3 * width; x < 4*width; x++ { // 8
		for y := 3 * height; y < 4*height; y++ {
			index := indexHSV(img.At(x, y))
			vektor.Bins[8][index]++
		}
	}
	select {
	case resultChan <- vektor:
	default:
	}
}

func createDataExtraction(dirpath string) []Vektor {
	runtime.GOMAXPROCS(14)
	var data []Vektor
	maxProccess := 299
	var resultChan = make(chan Vektor, maxProccess)
	var wg sync.WaitGroup
	listFiles, length := listImageInDir(dirpath)
	fmt.Println("Banyak data:", length)
	count := 0
	for _, path := range listFiles {
		if isImage(path) {
			wg.Add(1)
			go calculateVector(dirpath+"/"+path.Name(), resultChan, &wg)
			count++
		}
		if (count)%(maxProccess) == 0 || count == length {
			wg.Wait()
			close(resultChan)
			// Menggabungkan hasil dari goroutine ke dalam slice sementara
			for res := range resultChan {
				data = append(data, res)
			}
			resultChan = make(chan Vektor, maxProccess)
		}
	}
	return data
}

func preproccessImage(dirpath string, destFile string) {
	data := createDataExtraction(dirpath)

	file, err := os.Create(destFile)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)

	err = encoder.Encode(data)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return
	}
	fmt.Printf("Data written to %v\n", destFile)
}

func main() {
	sTime := time.Now()
	preproccessImage("bus", "busImage.json")
	eTime := time.Now()
	dTime := eTime.Sub(sTime)
	fmt.Println("Diff time: ", dTime)
}
