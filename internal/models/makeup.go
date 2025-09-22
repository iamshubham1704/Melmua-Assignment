package models

import (
	"time"
)

// MakeupStyle represents different makeup styles available
type MakeupStyle struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"` // bridal, editorial, everyday, special-event
	Intensity   int    `json:"intensity"` // 1-10 scale
	PreviewURL  string `json:"preview_url,omitempty"`
}

// UploadRequest represents the image upload request
type UploadRequest struct {
	ImageData string `json:"image_data" binding:"required"` // base64 encoded image
	Format    string `json:"format"`                         // jpeg, png, webp
}

// MakeupApplicationRequest represents the makeup application request
type MakeupApplicationRequest struct {
	ImageID string `json:"image_id" binding:"required"`
	StyleID string `json:"style_id" binding:"required"`
}

// ProcessingResult represents the result of makeup processing
type ProcessingResult struct {
	ID          string    `json:"id"`
	OriginalID  string    `json:"original_id"`
	StyleID     string    `json:"style_id"`
	Status      string    `json:"status"` // processing, completed, failed
	ResultURL   string    `json:"result_url,omitempty"`
	Error       string    `json:"error,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	CompletedAt time.Time `json:"completed_at,omitempty"`
}

// UploadedImage represents an uploaded image
type UploadedImage struct {
	ID        string    `json:"id"`
	Filename  string    `json:"filename"`
	FilePath  string    `json:"file_path"`
	Format    string    `json:"format"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"created_at"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

