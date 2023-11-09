package main

import (
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"math"
	"os"
	"time"
)

func convertHSV(paint color.Color) (int32, float64, float64) {
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
	rh := int32(h)
	return rh, s, v
}

func indexHSV(paint color.Color) int32 {
	h, s, v := convertHSV(paint)
	var H, S, V int32
	if h == 0 || (h >= 316 && h <= 360) {
		H = 0
	} else if h >= 1 && h <= 25 {
		H = 1
	} else if h >= 26 && h <= 40 {
		H = 2
	} else if h >= 41 && h <= 120 {
		H = 3
	} else if h >= 121 && h <= 190 {
		H = 4
	} else if h >= 191 && h <= 270 {
		H = 5
	} else if h >= 271 && h <= 295 {
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

func cosineSimiliarity(bins1, bins2 [72]int32) float64 {
	down1 := lengDorm(bins1)
	down2 := lengDorm(bins2)
	var accum float64 = 0
	for i := 0; i < 72; i++ {
		accum += float64(bins1[i]) * float64(bins2[i])
	}
	accum = accum / down1 / down2
	return accum
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

func calculateVector(path string) [9][72]int32 {
	img := readImage(path)
	var mVektor [9][72]int32
	if img == nil {
		fmt.Println("Image is not extracted.")
		return mVektor
	}
	var width, height int
	size := img.Bounds().Size()
	width = (size.X) / 3
	height = (size.Y) / 3
	var vektorIdx int = 0
	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			for x := i * width; x < (i+1)*width; x++ {
				for y := j * height; y < (j+1)*height; y++ {
					idx := indexHSV(img.At(x, y))
					mVektor[vektorIdx][idx]++
				}
			}
			vektorIdx++
		}
	}
	return mVektor
}

func main() {
	startTime := time.Now()
	vImage1 := calculateVector("121.jpg")
	vImage2 := calculateVector("122.jpg")
	var accum float64 = 0
	for i := 0; i < 9; i++ {
		accum += cosineSimiliarity(vImage1[i], vImage2[i])
	}
	accum /= 9
	accum *= 100
	endTime := time.Now()
	timeDiff := endTime.Sub(startTime)
	fmt.Printf("Similiarity: %v%%\n", accum)
	fmt.Println("Beda:", timeDiff)
	/*startTime := time.Now()
	f, err := os.Open("k20PanciBolong.jpg")
	defer f.Close()
	rdr := bufio.NewReader(f)
	img, _, err := image.Decode(rdr)
	if err != nil {
		fmt.Println(err)
		return
	}

	var bins [72]int32
	size := img.Bounds().Size()
	for i := 0; i < size.X; i++ {
		for j := 0; j < size.Y; j++ {
			index := indexHSV(img.At(i, j))
			bins[index]++
		}
	}
	ff, err := os.Open("ll.png")
	defer ff.Close()
	rdr2 := bufio.NewReader(ff)
	img2, _, err2 := image.Decode(rdr2)
	if err2 != nil {
		fmt.Println(err2)
		return
	}
	var bins2 [72]int32
	size2 := img2.Bounds().Size()
	for i := 0; i < size2.X; i++ {
		for j := 0; j < size2.Y; j++ {
			index := indexHSV(img2.At(i, j))
			bins2[index]++
		}
	}

	similiarity := cosineSimiliarity(bins, bins2)
	similiarity *= 100
	fmt.Printf("Similiarity: %v%%\n", similiarity)
	endTime := time.Now()
	timeDiff := endTime.Sub(startTime)
	fmt.Println("Beda: ", timeDiff)
	*/

}
