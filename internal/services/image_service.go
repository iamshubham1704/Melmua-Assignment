package services

import (
	"encoding/base64"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"makeup-api/internal/models"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

type ImageService struct {
	uploadDir string
}

func NewImageService() *ImageService {
	uploadDir := "uploads"
	os.MkdirAll(uploadDir, 0755)
	os.MkdirAll(filepath.Join(uploadDir, "results"), 0755)
	
	return &ImageService{
		uploadDir: uploadDir,
	}
}

func (is *ImageService) SaveImageFromBase64(imageData string, format string) (*models.UploadedImage, error) {
	// Remove data URL prefix if present
	if strings.Contains(imageData, ",") {
		parts := strings.SplitN(imageData, ",", 2)
		if len(parts) == 2 {
			imageData = parts[1]
		}
	}

	// Decode base64 data
	decoded, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return nil, fmt.Errorf("failed to decode base64 image: %v", err)
	}

	// Generate unique filename
	imageID := uuid.New().String()
	filename := fmt.Sprintf("%s.%s", imageID, format)
	filePath := filepath.Join(is.uploadDir, filename)

	// Create file
	file, err := os.Create(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to create file: %v", err)
	}
	defer file.Close()

	// Write image data
	_, err = file.Write(decoded)
	if err != nil {
		return nil, fmt.Errorf("failed to write image data: %v", err)
	}

	// Get file info
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to get file info: %v", err)
	}

	return &models.UploadedImage{
		ID:        imageID,
		Filename:  filename,
		FilePath:  filePath,
		Format:    format,
		Size:      fileInfo.Size(),
	}, nil
}

func (is *ImageService) ValidateImageFormat(format string) error {
	allowedFormats := []string{"jpg", "jpeg", "png", "webp"}
	for _, allowed := range allowedFormats {
		if strings.ToLower(format) == allowed {
			return nil
		}
	}
	return fmt.Errorf("unsupported image format: %s", format)
}

func (is *ImageService) ValidateImageSize(imageData string) error {
	// Remove data URL prefix if present
	if strings.Contains(imageData, ",") {
		parts := strings.SplitN(imageData, ",", 2)
		if len(parts) == 2 {
			imageData = parts[1]
		}
	}

	// Decode to check size
	decoded, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return fmt.Errorf("failed to decode image: %v", err)
	}

	// Check file size (max 10MB)
	maxSize := 10 * 1024 * 1024 // 10MB
	if len(decoded) > maxSize {
		return fmt.Errorf("image too large: %d bytes (max %d bytes)", len(decoded), maxSize)
	}

	return nil
}

func (is *ImageService) GetImageDimensions(filePath string) (int, int, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to open image file: %v", err)
	}
	defer file.Close()

	// Decode image to get dimensions
	img, format, err := image.DecodeConfig(file)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to decode image: %v", err)
	}

	// Validate format
	if format != "jpeg" && format != "png" {
		return 0, 0, fmt.Errorf("unsupported image format: %s", format)
	}

	return img.Width, img.Height, nil
}

func (is *ImageService) ResizeImage(filePath string, maxWidth, maxHeight int) error {
	// Open the image file
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open image: %v", err)
	}
	defer file.Close()

	// Decode the image
	img, format, err := image.Decode(file)
	if err != nil {
		return fmt.Errorf("failed to decode image: %v", err)
	}

	// Get original dimensions
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Calculate new dimensions maintaining aspect ratio
	newWidth, newHeight := width, height
	if width > maxWidth || height > maxHeight {
		ratio := float64(width) / float64(height)
		if width > height {
			newWidth = maxWidth
			newHeight = int(float64(maxWidth) / ratio)
		} else {
			newHeight = maxHeight
			newWidth = int(float64(maxHeight) * ratio)
		}
	}

	// Only resize if necessary
	if newWidth != width || newHeight != height {
		// Create resized image
		resized := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))
		
		// Simple nearest neighbor resize (for better performance)
		for y := 0; y < newHeight; y++ {
			for x := 0; x < newWidth; x++ {
				srcX := x * width / newWidth
				srcY := y * height / newHeight
				resized.Set(x, y, img.At(srcX, srcY))
			}
		}

		// Save the resized image
		outFile, err := os.Create(filePath)
		if err != nil {
			return fmt.Errorf("failed to create resized image: %v", err)
		}
		defer outFile.Close()

		// Encode based on original format
		switch format {
		case "jpeg":
			err = jpeg.Encode(outFile, resized, &jpeg.Options{Quality: 95})
		case "png":
			err = png.Encode(outFile, resized)
		default:
			return fmt.Errorf("unsupported format for resizing: %s", format)
		}

		if err != nil {
			return fmt.Errorf("failed to encode resized image: %v", err)
		}
	}

	return nil
}

func (is *ImageService) CleanupOldFiles() error {
	// This function would clean up old uploaded files
	// Implementation depends on your cleanup strategy
	return nil
}

func (is *ImageService) GetImageURL(filePath string) string {
	// Convert file path to URL
	// This would typically involve your CDN or static file serving setup
	return "/uploads/" + filepath.Base(filePath)
}

