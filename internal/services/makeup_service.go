package services

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"image/png"
	"makeup-api/internal/models"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/google/uuid"
	"gocv.io/x/gocv"
)

type MakeupService struct {
	styles map[string]models.MakeupStyle
}

func NewMakeupService() *MakeupService {
	service := &MakeupService{
		styles: make(map[string]models.MakeupStyle),
	}
	service.initializeStyles()
	return service
}

func (ms *MakeupService) initializeStyles() {
	styles := []models.MakeupStyle{
		{
			ID:          "natural",
			Name:        "Natural Beauty",
			Description: "Subtle enhancement for everyday wear",
			Category:    "everyday",
			Intensity:   3,
		},
		{
			ID:          "bridal",
			Name:        "Bridal Glow",
			Description: "Romantic and timeless bridal makeup",
			Category:    "bridal",
			Intensity:   6,
		},
		{
			ID:          "editorial",
			Name:        "Editorial Bold",
			Description: "High-fashion editorial look",
			Category:    "editorial",
			Intensity:   9,
		},
		{
			ID:          "evening",
			Name:        "Evening Glam",
			Description: "Dramatic evening makeup",
			Category:    "special-event",
			Intensity:   8,
		},
		{
			ID:          "professional",
			Name:        "Professional Polish",
			Description: "Business-appropriate makeup",
			Category:    "everyday",
			Intensity:   4,
		},
		{
			ID:          "creative",
			Name:        "Creative Artistry",
			Description: "Bold and experimental makeup",
			Category:    "editorial",
			Intensity:   10,
		},
	}

	for _, style := range styles {
		ms.styles[style.ID] = style
	}
}

func (ms *MakeupService) GetAvailableStyles() []models.MakeupStyle {
	styles := make([]models.MakeupStyle, 0, len(ms.styles))
	for _, style := range ms.styles {
		styles = append(styles, style)
	}
	return styles
}

func (ms *MakeupService) GetStyle(styleID string) (models.MakeupStyle, bool) {
	style, exists := ms.styles[styleID]
	return style, exists
}

func (ms *MakeupService) ApplyMakeupStyle(imagePath string, styleID string) (string, error) {
	style, exists := ms.GetStyle(styleID)
	if !exists {
		return "", fmt.Errorf("style %s not found", styleID)
	}

	// Load the image
	img := gocv.IMRead(imagePath, gocv.IMReadColor)
	if img.Empty() {
		return "", fmt.Errorf("failed to load image: %s", imagePath)
	}
	defer img.Close()

	// Detect faces
	faceCascade := gocv.NewCascadeClassifier()
	defer faceCascade.Close()

	// Load face detection model
	if !faceCascade.Load("haarcascade_frontalface_alt.xml") {
		return "", fmt.Errorf("failed to load face cascade classifier")
	}

	faces := faceCascade.DetectMultiScale(img)
	if len(faces) == 0 {
		return "", fmt.Errorf("no faces detected in the image")
	}

	// Process the first detected face
	face := faces[0]

	// Apply makeup based on style
	resultImg := ms.applyMakeupToFace(img, face, style)

	// Save the result
	resultID := uuid.New().String()
	resultPath := filepath.Join("uploads", "results", resultID+".jpg")
	
	// Ensure directory exists
	os.MkdirAll(filepath.Dir(resultPath), 0755)

	// Convert back to regular image and save
	resultImage := ms.matToImage(resultImg)
	defer resultImage.Close()

	file, err := os.Create(resultPath)
	if err != nil {
		return "", fmt.Errorf("failed to create result file: %v", err)
	}
	defer file.Close()

	err = jpeg.Encode(file, resultImage, &jpeg.Options{Quality: 95})
	if err != nil {
		return "", fmt.Errorf("failed to encode result image: %v", err)
	}

	return resultPath, nil
}

func (ms *MakeupService) applyMakeupToFace(img gocv.Mat, face gocv.Rectangle, style models.MakeupStyle) gocv.Mat {
	// Create a copy of the original image
	result := img.Clone()
	defer img.Close()

	// Extract face region
	faceROI := result.Region(face)
	defer faceROI.Close()

	// Apply different makeup effects based on style
	switch style.ID {
	case "natural":
		ms.applyNaturalMakeup(faceROI)
	case "bridal":
		ms.applyBridalMakeup(faceROI)
	case "editorial":
		ms.applyEditorialMakeup(faceROI)
	case "evening":
		ms.applyEveningMakeup(faceROI)
	case "professional":
		ms.applyProfessionalMakeup(faceROI)
	case "creative":
		ms.applyCreativeMakeup(faceROI)
	default:
		ms.applyNaturalMakeup(faceROI)
	}

	return result
}

func (ms *MakeupService) applyNaturalMakeup(faceROI gocv.Mat) {
	// Subtle skin enhancement
	ms.enhanceSkin(faceROI, 0.1)
	// Light lip enhancement
	ms.enhanceLips(faceROI, color.RGBA{255, 200, 200, 100})
	// Soft eye enhancement
	ms.enhanceEyes(faceROI, 0.05)
}

func (ms *MakeupService) applyBridalMakeup(faceROI gocv.Mat) {
	// Glowing skin
	ms.enhanceSkin(faceROI, 0.2)
	// Romantic lip color
	ms.enhanceLips(faceROI, color.RGBA{255, 150, 150, 150})
	// Soft eye makeup
	ms.enhanceEyes(faceROI, 0.1)
	// Add subtle blush
	ms.addBlush(faceROI, color.RGBA{255, 180, 180, 80})
}

func (ms *MakeupService) applyEditorialMakeup(faceROI gocv.Mat) {
	// Dramatic skin enhancement
	ms.enhanceSkin(faceROI, 0.3)
	// Bold lip color
	ms.enhanceLips(faceROI, color.RGBA{200, 50, 50, 200})
	// Dramatic eye makeup
	ms.enhanceEyes(faceROI, 0.2)
	// Add contouring
	ms.addContouring(faceROI)
}

func (ms *MakeupService) applyEveningMakeup(faceROI gocv.Mat) {
	// Glamorous skin
	ms.enhanceSkin(faceROI, 0.25)
	// Bold lip color
	ms.enhanceLips(faceROI, color.RGBA{180, 30, 30, 180})
	// Smoky eyes
	ms.enhanceEyes(faceROI, 0.15)
	// Add shimmer
	ms.addShimmer(faceROI)
}

func (ms *MakeupService) applyProfessionalMakeup(faceROI gocv.Mat) {
	// Clean, polished skin
	ms.enhanceSkin(faceROI, 0.15)
	// Neutral lip color
	ms.enhanceLips(faceROI, color.RGBA{220, 180, 180, 120})
	// Subtle eye enhancement
	ms.enhanceEyes(faceROI, 0.08)
}

func (ms *MakeupService) applyCreativeMakeup(faceROI gocv.Mat) {
	// Dramatic skin enhancement
	ms.enhanceSkin(faceROI, 0.4)
	// Bold creative colors
	ms.enhanceLips(faceROI, color.RGBA{100, 50, 200, 200})
	// Artistic eye makeup
	ms.enhanceEyes(faceROI, 0.3)
	// Add creative elements
	ms.addCreativeElements(faceROI)
}

func (ms *MakeupService) enhanceSkin(faceROI gocv.Mat, intensity float64) {
	// Apply Gaussian blur for skin smoothing
	blurred := gocv.NewMat()
	defer blurred.Close()
	gocv.GaussianBlur(faceROI, &blurred, image.Pt(15, 15), 0, 0, gocv.BorderDefault)
	
	// Blend with original
	gocv.AddWeighted(faceROI, 1-intensity, blurred, intensity, 0, &faceROI)
}

func (ms *MakeupService) enhanceLips(faceROI gocv.Mat, lipColor color.RGBA) {
	// This is a simplified lip enhancement
	// In a real implementation, you would use more sophisticated lip detection
	// For now, we'll apply a subtle color overlay to the lower face region
	
	// Create a mask for lip area (simplified)
	mask := gocv.NewMatWithSize(faceROI.Rows(), faceROI.Cols(), gocv.MatTypeCV8UC1)
	defer mask.Close()
	
	// Create lip color overlay
	overlay := gocv.NewMatWithSize(faceROI.Rows(), faceROI.Cols(), gocv.MatTypeCV8UC3)
	defer overlay.Close()
	overlay.SetTo(gocv.NewScalar(float64(lipColor.B), float64(lipColor.G), float64(lipColor.R), 0))
	
	// Apply overlay with alpha blending
	gocv.AddWeighted(faceROI, 0.8, overlay, 0.2, 0, &faceROI)
}

func (ms *MakeupService) enhanceEyes(faceROI gocv.Mat, intensity float64) {
	// Apply subtle eye enhancement
	// This would typically involve eyeliner, eyeshadow, and mascara effects
	// For now, we'll apply a subtle darkening effect to the upper face region
	
	kernel := gocv.GetStructuringElement(gocv.MorphEllipse, image.Pt(5, 5))
	defer kernel.Close()
	
	// Apply morphological operations for eye enhancement
	enhanced := gocv.NewMat()
	defer enhanced.Close()
	gocv.MorphologyEx(faceROI, &enhanced, gocv.MorphClose, kernel)
	
	gocv.AddWeighted(faceROI, 1-intensity, enhanced, intensity, 0, &faceROI)
}

func (ms *MakeupService) addBlush(faceROI gocv.Mat, blushColor color.RGBA) {
	// Add subtle blush to cheek area
	overlay := gocv.NewMatWithSize(faceROI.Rows(), faceROI.Cols(), gocv.MatTypeCV8UC3)
	defer overlay.Close()
	overlay.SetTo(gocv.NewScalar(float64(blushColor.B), float64(blushColor.G), float64(blushColor.R), 0))
	
	gocv.AddWeighted(faceROI, 0.9, overlay, 0.1, 0, &faceROI)
}

func (ms *MakeupService) addContouring(faceROI gocv.Mat) {
	// Add subtle contouring effect
	kernel := gocv.GetStructuringElement(gocv.MorphEllipse, image.Pt(3, 3))
	defer kernel.Close()
	
	contoured := gocv.NewMat()
	defer contoured.Close()
	gocv.MorphologyEx(faceROI, &contoured, gocv.MorphGradient, kernel)
	
	gocv.AddWeighted(faceROI, 0.95, contoured, 0.05, 0, &faceROI)
}

func (ms *MakeupService) addShimmer(faceROI gocv.Mat) {
	// Add subtle shimmer effect
	kernel := gocv.GetStructuringElement(gocv.MorphEllipse, image.Pt(7, 7))
	defer kernel.Close()
	
	shimmer := gocv.NewMat()
	defer shimmer.Close()
	gocv.MorphologyEx(faceROI, &shimmer, gocv.MorphTopHat, kernel)
	
	gocv.AddWeighted(faceROI, 0.9, shimmer, 0.1, 0, &faceROI)
}

func (ms *MakeupService) addCreativeElements(faceROI gocv.Mat) {
	// Add creative artistic elements
	// This could include colorful accents, artistic patterns, etc.
	
	// Apply a creative color filter
	kernel := gocv.NewMatWithSize(3, 3, gocv.MatTypeCV32F)
	defer kernel.Close()
	
	// Creative color transformation matrix
	kernel.SetFloatAt(0, 0, 1.2) // Red enhancement
	kernel.SetFloatAt(1, 1, 0.8) // Green reduction
	kernel.SetFloatAt(2, 2, 1.1) // Blue enhancement
	
	creative := gocv.NewMat()
	defer creative.Close()
	gocv.Filter2D(faceROI, &creative, gocv.MatTypeCV8U, kernel, image.Pt(-1, -1), 0, gocv.BorderDefault)
	
	gocv.AddWeighted(faceROI, 0.7, creative, 0.3, 0, &faceROI)
}

func (ms *MakeupService) matToImage(mat gocv.Mat) image.Image {
	// Convert gocv.Mat to Go image.Image
	buf, err := gocv.IMEncode(".jpg", mat)
	if err != nil {
		return nil
	}
	defer buf.Close()
	
	img, _, err := image.Decode(strings.NewReader(string(buf.GetBytes())))
	if err != nil {
		return nil
	}
	
	return img
}

