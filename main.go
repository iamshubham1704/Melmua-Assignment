package main

import (
	"log"
	"makeup-api/internal/handlers"
	"makeup-api/internal/middleware"
	"makeup-api/internal/services"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize services
	makeupService := services.NewMakeupService()
	imageService := services.NewImageService()

	// Initialize handlers
	makeupHandler := handlers.NewMakeupHandler(makeupService, imageService)

	// Setup Gin router
	r := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Middleware
	r.Use(middleware.Logger())
	r.Use(middleware.Recovery())

	// Routes
	api := r.Group("/api/v1")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok", "message": "Makeup API is running"})
		})

		// Makeup endpoints
		makeup := api.Group("/makeup")
		{
			makeup.POST("/upload", makeupHandler.UploadImage)
			makeup.POST("/apply/:style", makeupHandler.ApplyMakeupStyle)
			makeup.GET("/styles", makeupHandler.GetAvailableStyles)
			makeup.GET("/result/:id", makeupHandler.GetResult)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

