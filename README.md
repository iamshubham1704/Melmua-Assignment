# Makeup AI - Complete Application

A full-stack application that applies different makeup styles to user-uploaded photos using AI and computer vision techniques. Features a modern React frontend and a powerful Go backend.

## 🎨 Features

- **6 Makeup Styles**: Natural, Bridal, Editorial, Evening, Professional, and Creative
- **AI-Powered Processing**: Automatic face detection and makeup application
- **Modern Frontend**: Beautiful React interface with drag-and-drop upload
- **Real-time Processing**: Live progress updates and smooth animations
- **Responsive Design**: Works perfectly on all devices
- **Download & Share**: Save and share your transformed photos

## Features

- 🎨 **Multiple Makeup Styles**: Natural, Bridal, Editorial, Evening, Professional, and Creative
- 📸 **Face Detection**: Automatic face detection using OpenCV
- 🖼️ **Image Processing**: Support for JPEG, PNG, and WebP formats
- 🚀 **High Performance**: Built with Gin framework for optimal performance
- 🐳 **Docker Ready**: Complete Docker configuration for easy deployment
- 🔒 **Security**: Rate limiting, CORS, and security headers
- 📊 **RESTful API**: Clean and well-documented API endpoints

## Available Makeup Styles

| Style ID | Name | Description | Category | Intensity |
|----------|------|-------------|----------|-----------|
| `natural` | Natural Beauty | Subtle enhancement for everyday wear | everyday | 3/10 |
| `bridal` | Bridal Glow | Romantic and timeless bridal makeup | bridal | 6/10 |
| `editorial` | Editorial Bold | High-fashion editorial look | editorial | 9/10 |
| `evening` | Evening Glam | Dramatic evening makeup | special-event | 8/10 |
| `professional` | Professional Polish | Business-appropriate makeup | everyday | 4/10 |
| `creative` | Creative Artistry | Bold and experimental makeup | editorial | 10/10 |

## API Endpoints

### Health Check
```
GET /api/v1/health
```

### Upload Image
```
POST /api/v1/makeup/upload
Content-Type: application/json

{
  "image_data": "base64_encoded_image_data",
  "format": "jpg"
}
```

### Apply Makeup Style
```
POST /api/v1/makeup/apply/{style_id}
Content-Type: application/json

{
  "image_id": "uploaded_image_id",
  "style_id": "natural"
}
```

### Get Available Styles
```
GET /api/v1/makeup/styles
```

### Get Processing Result
```
GET /api/v1/makeup/result/{result_id}
```

## 🚀 Quick Start

### Option 1: Full Stack with Docker (Recommended)

1. **Clone and setup**:
```bash
git clone <repository>
cd makeup-booking-platform
```

2. **Start all services**:
```bash
docker-compose up -d
```

3. **Access the application**:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Nginx Proxy**: http://localhost:80

### Option 2: Development Mode

#### Backend Only
```bash
# Start Go backend
go run main.go
```

#### Frontend Only
```bash
# Start React frontend
cd frontend
npm install
npm start
```

### Manual Installation

1. **Prerequisites**:
   - Go 1.21+
   - OpenCV 4.x
   - GCC compiler

2. **Install dependencies**:
```bash
go mod download
```

3. **Run the application**:
```bash
go run main.go
```

## Usage Examples

### 1. Upload an Image

```bash
curl -X POST http://localhost:8080/api/v1/makeup/upload \
  -H "Content-Type: application/json" \
  -d '{
    "image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "format": "jpg"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
    "file_path": "uploads/550e8400-e29b-41d4-a716-446655440000.jpg",
    "format": "jpg",
    "size": 245760
  }
}
```

### 2. Apply Makeup Style

```bash
curl -X POST http://localhost:8080/api/v1/makeup/apply/bridal \
  -H "Content-Type: application/json" \
  -d '{
    "image_id": "550e8400-e29b-41d4-a716-446655440000",
    "style_id": "bridal"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Makeup applied successfully",
  "data": {
    "id": "result-uuid",
    "original_id": "550e8400-e29b-41d4-a716-446655440000",
    "style_id": "bridal",
    "status": "completed",
    "result_url": "/uploads/results/result-uuid.jpg",
    "created_at": "2024-01-20T10:30:00Z",
    "completed_at": "2024-01-20T10:30:05Z"
  }
}
```

### 3. Get Available Styles

```bash
curl http://localhost:8080/api/v1/makeup/styles
```

Response:
```json
{
  "success": true,
  "message": "Styles retrieved successfully",
  "data": [
    {
      "id": "natural",
      "name": "Natural Beauty",
      "description": "Subtle enhancement for everyday wear",
      "category": "everyday",
      "intensity": 3
    },
    {
      "id": "bridal",
      "name": "Bridal Glow",
      "description": "Romantic and timeless bridal makeup",
      "category": "bridal",
      "intensity": 6
    }
  ]
}
```

## Frontend Integration

### JavaScript/TypeScript Example

```javascript
class MakeupAPI {
  constructor(baseURL = 'http://localhost:8080/api/v1') {
    this.baseURL = baseURL;
  }

  async uploadImage(imageFile) {
    const base64 = await this.fileToBase64(imageFile);
    const response = await fetch(`${this.baseURL}/makeup/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_data: base64,
        format: imageFile.type.split('/')[1]
      })
    });
    return response.json();
  }

  async applyMakeup(imageId, styleId) {
    const response = await fetch(`${this.baseURL}/makeup/apply/${styleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_id: imageId,
        style_id: styleId
      })
    });
    return response.json();
  }

  async getStyles() {
    const response = await fetch(`${this.baseURL}/makeup/styles`);
    return response.json();
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}

// Usage
const api = new MakeupAPI();

// Upload image
const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];
const uploadResult = await api.uploadImage(file);

// Apply makeup
const result = await api.applyMakeup(uploadResult.data.id, 'bridal');
console.log('Result URL:', result.data.result_url);
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8080 | Server port |
| `GIN_MODE` | release | Gin mode (debug/release) |
| `MAX_FILE_SIZE` | 10485760 | Max file size in bytes (10MB) |
| `UPLOAD_DIR` | uploads | Upload directory |
| `ALLOWED_FORMATS` | jpg,jpeg,png,webp | Allowed image formats |
| `CORS_ORIGINS` | http://localhost:3000,http://localhost:5173 | CORS origins |

## Development

### Project Structure

```
makeup-api/
├── main.go                 # Application entry point
├── go.mod                  # Go module file
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── nginx.conf             # Nginx configuration
├── internal/
│   ├── handlers/          # HTTP handlers
│   ├── middleware/        # HTTP middleware
│   ├── models/           # Data models
│   └── services/          # Business logic
└── uploads/               # Upload directory
```

### Adding New Makeup Styles

1. **Add style to service**:
```go
// In internal/services/makeup_service.go
func (ms *MakeupService) initializeStyles() {
    styles := []models.MakeupStyle{
        // ... existing styles
        {
            ID:          "new_style",
            Name:        "New Style Name",
            Description: "Description of the new style",
            Category:    "category",
            Intensity:   5,
        },
    }
    // ...
}
```

2. **Implement makeup application**:
```go
// Add new case in applyMakeupToFace method
case "new_style":
    ms.applyNewStyle(faceROI)
```

3. **Create application function**:
```go
func (ms *MakeupService) applyNewStyle(faceROI gocv.Mat) {
    // Implement your makeup application logic
    ms.enhanceSkin(faceROI, 0.2)
    ms.enhanceLips(faceROI, color.RGBA{255, 200, 200, 150})
    // ... more effects
}
```

## Performance Considerations

- **Image Size**: Images are automatically resized to max 1920x1080
- **Face Detection**: Only processes the first detected face
- **Memory Usage**: Images are processed in memory for speed
- **Caching**: Consider implementing Redis for result caching
- **CDN**: Use CDN for serving processed images

## Security Features

- ✅ Rate limiting
- ✅ CORS protection
- ✅ File type validation
- ✅ File size limits
- ✅ Security headers
- ✅ Input validation
- ✅ Error handling

## Troubleshooting

### Common Issues

1. **OpenCV not found**:
   ```bash
   # Install OpenCV development libraries
   sudo apt-get install libopencv-dev
   ```

2. **Face detection fails**:
   - Ensure the image contains a clear face
   - Check image quality and lighting
   - Verify OpenCV cascade file is present

3. **Memory issues**:
   - Reduce image size limits
   - Implement image cleanup
   - Monitor memory usage

### Logs

Check application logs:
```bash
docker-compose logs makeup-api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation#   M e l m u a - A s s i g n m e n t  
 #   M e l m u a - A s s i g n m e n t  
 