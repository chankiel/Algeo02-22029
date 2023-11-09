package main

import (
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	"math"
	"os"
	"time"
)

type ImgComp struct{
    contrast,homogenity,entropy float64
}

func makeOcc(grayScale [][]uint8,xOffset int,yOffset int,sizeOcc int,heightImg int, widthImg int,minGray uint8)[][]float64{
    var occMtrx[][] float64

    //initialize 0
    for i:=0;i<sizeOcc;i++{
        var rowArr []float64
        for j:=0;j<sizeOcc;j++{
            rowArr = append(rowArr, 0)
        }
        occMtrx = append(occMtrx, rowArr)
    }

    for i := 0; i < heightImg; i++{
        for j := 0; j < widthImg; j++ { 
            grayFirst := grayScale[i][j]
            neighborY := i+yOffset
            neighborX := j+xOffset
            neighborValid := neighborX<widthImg && neighborY<heightImg && neighborX>=0 && neighborY>=0
            if neighborValid{
                graySecond := grayScale[neighborY][neighborX] // Get the right neighbor
                occMtrx[grayFirst-minGray][graySecond-minGray] += 1
            }
        }
    }

    glcmValue := 0
    for i:=0;i<sizeOcc;i++{
        for j:=0;j<sizeOcc;j++{
            glcmValue += int(occMtrx[i][j])
        }
    }

    for  i:=0;i<sizeOcc;i++{
        for j:=0;j<sizeOcc;j++{
            occMtrx[i][j] /= float64(glcmValue)
        }
    }
    return occMtrx
}

func makeImgComp(occMtrx [][]float64,sizeOcc int)ImgComp{
    var ImgTemp ImgComp
    for  i:=0;i<sizeOcc;i++{
        for j:=0;j<sizeOcc;j++{
            if(occMtrx[i][j]>0){
                ImgTemp.contrast += occMtrx[i][j]*float64((i-j)*(i-j))
                ImgTemp.homogenity += occMtrx[i][j]/(float64(1+(i-j)*(i-j)))
                ImgTemp.entropy -= occMtrx[i][j] * math.Log10(occMtrx[i][j])
            }
        }
    }
    return ImgTemp
}

func makeImgCompMean(occMtrx [4][][]float64,sizeOcc int)ImgComp{
    var imgCompMean ImgComp
    var contrastSum,homogenitySum,entropySum float64 = 0,0,0
    for i:=0;i<4;i++{
        imgCompMean = makeImgComp(occMtrx[i],sizeOcc)
        contrastSum += imgCompMean.contrast
        homogenitySum += imgCompMean.homogenity
        entropySum += imgCompMean.entropy
    }
    imgCompMean.contrast = contrastSum/4
    imgCompMean.homogenity = homogenitySum/4
    imgCompMean.entropy = entropySum/4
    return imgCompMean
}

func imgCompLength(imgComp ImgComp)float64{
    return (math.Sqrt(math.Pow(imgComp.contrast,2)+math.Pow(imgComp.entropy,2)+math.Pow(imgComp.homogenity,2)))
}

func textureSimilarity(img1 ImgComp,img2 ImgComp)float64{
    var cosineSim float64 = (img1.contrast*img2.contrast)+(img1.homogenity*img2.homogenity)+(img1.entropy*img2.entropy)
    cosineSim /= (imgCompLength(img1)*imgCompLength(img2))
    return cosineSim
}

func main() {
    starttime := time.Now()
    inputFile, err := os.Open("monaLisa1.jpg")
    if err != nil {
        fmt.Println("Error opening image:", err)
        return
    }
    defer inputFile.Close()

    img, _, err := image.Decode(inputFile)
    if err != nil {
        fmt.Println("Error decoding image:", err)
        return
    }


    var minGray,maxGray uint8 = 255,0
    size := img.Bounds().Size()
    var grayScale [][]uint8
    for i := 0; i < size.Y; i++ {
        var colArr[]uint8
        for j := 0; j < size.X; j++ {
            pixelColor := img.At(i,j)
            rgbaColor := color.RGBAModel.Convert(pixelColor).(color.RGBA)
            colGray := uint8(0.29*float64(rgbaColor.R)+0.587*float64(rgbaColor.G)+0.114*float64(rgbaColor.B))
            if colGray>maxGray{
                maxGray = colGray
            }
            if colGray<minGray{
                minGray = colGray
            }
            colArr = append(colArr, colGray)
        }
        grayScale = append(grayScale, colArr)
    }

    sizeOcc:=int(maxGray-minGray+1)
    var occMtrx [4][][]float64
    occMtrx[0] = makeOcc(grayScale,1,0,sizeOcc,size.Y,size.X,minGray)
    occMtrx[1] = makeOcc(grayScale,1,1,sizeOcc,size.Y,size.X,minGray)
    occMtrx[2] = makeOcc(grayScale,0,1,sizeOcc,size.Y,size.X,minGray)
    occMtrx[3] = makeOcc(grayScale,-1,1,sizeOcc,size.Y,size.X,minGray)
    
    var imgCompMean = makeImgCompMean(occMtrx,sizeOcc)
    fmt.Printf("Contrast: %v\nHomogenity: %v\nEntropy: %v\n",imgCompMean.contrast,imgCompMean.homogenity,imgCompMean.entropy)

    inputFile2, err2 := os.Open("apel2.jpeg")
    if err2 != nil {
        fmt.Println("Error opening image:", err2)
        return
    }
    defer inputFile2.Close()

    img2, _, err2 := image.Decode(inputFile2)
    if err2 != nil {
        fmt.Println("Error decoding image:", err2)
        return
    }


    var minGray2,maxGray2 uint8 = 255,0
    size2 := img2.Bounds().Size()
    var grayScale2 [][]uint8
    for i := 0; i < size2.Y; i++ {
        var colArr2[]uint8
        for j := 0; j < size2.X; j++ {
            pixelColor2 := img.At(i,j)
            rgbaColor2 := color.RGBAModel.Convert(pixelColor2).(color.RGBA)
            colGray2 := uint8(0.29*float64(rgbaColor2.R)+0.587*float64(rgbaColor2.G)+0.114*float64(rgbaColor2.B))
            if colGray2>maxGray2{
                maxGray2 = colGray2
            }
            if colGray2<minGray2{
                minGray2 = colGray2
            }
            colArr2 = append(colArr2, colGray2)
        }
        grayScale2 = append(grayScale2, colArr2)
    }

    sizeOcc2:=int(maxGray2-minGray2+1)
    var occMtrx2 [4][][]float64
    occMtrx2[0] = makeOcc(grayScale2,1,0,sizeOcc2,size2.Y,size2.X,minGray2)
    occMtrx2[1] = makeOcc(grayScale2,1,1,sizeOcc2,size2.Y,size2.X,minGray2)
    occMtrx2[2] = makeOcc(grayScale2,0,1,sizeOcc2,size2.Y,size2.X,minGray2)
    occMtrx2[3] = makeOcc(grayScale2,-1,1,sizeOcc2,size2.Y,size2.X,minGray2)
    
    var imgCompMean2 = makeImgCompMean(occMtrx2,sizeOcc2)
    fmt.Printf("Contrast: %v\nHomogenity: %v\nEntropy: %v\n",imgCompMean2.contrast,imgCompMean2.homogenity,imgCompMean2.entropy)

    var cosineSim float64
    cosineSim = textureSimilarity(imgCompMean,imgCompMean2)
    endtime := time.Now()
    difftime := endtime.Sub(starttime)
    fmt.Printf("Kemiripan: %v\n",cosineSim)
    fmt.Printf("%v\n",difftime)
}
