package handlers

import (
	"net/http"
	"makeup-api/internal/models"
	"makeup-api/internal/services"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MakeupHandler struct {
	makeupService *services.MakeupService
	imageService  *services.ImageService
}

func NewMakeupHandler(makeupService *services.MakeupService, imageService *services.ImageService) *MakeupHandler {
	return &MakeupHandler{
		makeupService: makeupService,
		imageService:  imageService,
	}
}

// UploadImage handles image upload requests
func (h *MakeupHandler) UploadImage(c *gin.Context) {
	var req models.UploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Error:   err.Error(),
		})
		return
	}

	// Validate image format
	if err := h.imageService.ValidateImageFormat(req.Format); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid image format",
			Error:   err.Error(),
		})
		return
	}

	// Validate image size
	if err := h.imageService.ValidateImageSize(req.ImageData); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Image validation failed",
			Error:   err.Error(),
		})
		return
	}

	// Save the image
	uploadedImage, err := h.imageService.SaveImageFromBase64(req.ImageData, req.Format)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to save image",
			Error:   err.Error(),
		})
		return
	}

	// Resize image if too large
	if err := h.imageService.ResizeImage(uploadedImage.FilePath, 1920, 1080); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to process image",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Image uploaded successfully",
		Data:    uploadedImage,
	})
}

// ApplyMakeupStyle handles makeup application requests
func (h *MakeupHandler) ApplyMakeupStyle(c *gin.Context) {
	styleID := c.Param("style")
	
	var req models.MakeupApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Error:   err.Error(),
		})
		return
	}

	// Validate style exists
	style, exists := h.makeupService.GetStyle(styleID)
	if !exists {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Makeup style not found",
			Error:   "Style " + styleID + " does not exist",
		})
		return
	}

	// Check if image exists
	imagePath := filepath.Join("uploads", req.ImageID+".jpg")
	if _, err := filepath.Abs(imagePath); err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Image not found",
			Error:   "Image " + req.ImageID + " does not exist",
		})
		return
	}

	// Create processing result record
	resultID := uuid.New().String()
	result := models.ProcessingResult{
		ID:         resultID,
		OriginalID: req.ImageID,
		StyleID:    styleID,
		Status:     "processing",
		CreatedAt:  time.Now(),
	}

	// Apply makeup style (this would typically be done asynchronously)
	resultPath, err := h.makeupService.ApplyMakeupStyle(imagePath, styleID)
	if err != nil {
		result.Status = "failed"
		result.Error = err.Error()
		result.CompletedAt = time.Now()
		
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to apply makeup style",
			Error:   err.Error(),
			Data:    result,
		})
		return
	}

	// Update result with success
	result.Status = "completed"
	result.ResultURL = h.imageService.GetImageURL(resultPath)
	result.CompletedAt = time.Now()

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Makeup applied successfully",
		Data:    result,
	})
}

// GetAvailableStyles returns all available makeup styles
func (h *MakeupHandler) GetAvailableStyles(c *gin.Context) {
	styles := h.makeupService.GetAvailableStyles()
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Styles retrieved successfully",
		Data:    styles,
	})
}

// GetResult retrieves a processing result
func (h *MakeupHandler) GetResult(c *gin.Context) {
	resultID := c.Param("id")
	
	// In a real implementation, you would store and retrieve results from a database
	// For now, we'll return a mock response
	result := models.ProcessingResult{
		ID:         resultID,
		Status:     "completed",
		ResultURL:  "/uploads/results/" + resultID + ".jpg",
		CreatedAt:  time.Now().Add(-5 * time.Minute),
		CompletedAt: time.Now().Add(-2 * time.Minute),
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Result retrieved successfully",
		Data:    result,
	})
}

// GetStyleDetails returns details for a specific makeup style
func (h *MakeupHandler) GetStyleDetails(c *gin.Context) {
	styleID := c.Param("style")
	
	style, exists := h.makeupService.GetStyle(styleID)
	if !exists {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Style not found",
			Error:   "Style " + styleID + " does not exist",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Style details retrieved successfully",
		Data:    style,
	})
}

// GetProcessingStatus returns the status of a makeup application
func (h *MakeupHandler) GetProcessingStatus(c *gin.Context) {
	resultID := c.Param("id")
	
	// Mock processing status
	status := c.Query("status")
	if status == "" {
		status = "completed"
	}

	result := models.ProcessingResult{
		ID:         resultID,
		Status:     status,
		ResultURL:  "/uploads/results/" + resultID + ".jpg",
		CreatedAt:  time.Now().Add(-10 * time.Minute),
		CompletedAt: time.Now().Add(-5 * time.Minute),
	}

	if status == "failed" {
		result.Error = "Processing failed due to face detection issues"
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Status retrieved successfully",
		Data:    result,
	})
}

