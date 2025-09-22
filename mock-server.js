import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import GeminiImageService from './gemini-service.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('🔑 Environment variables loaded:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// Initialize Gemini service
const geminiService = new GeminiImageService();
console.log('🤖 Gemini service initialized');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Mock makeup styles
const mockStyles = [
  {
    id: 'natural',
    name: 'Natural Beauty',
    description: 'Subtle enhancement for everyday wear',
    category: 'everyday',
    intensity: 3,
    preview_url: null
  },
  {
    id: 'bridal',
    name: 'Bridal Glow',
    description: 'Romantic and timeless bridal makeup',
    category: 'bridal',
    intensity: 6,
    preview_url: null
  },
  {
    id: 'editorial',
    name: 'Editorial Bold',
    description: 'High-fashion editorial look',
    category: 'editorial',
    intensity: 9,
    preview_url: null
  },
  {
    id: 'evening',
    name: 'Evening Glam',
    description: 'Dramatic evening makeup',
    category: 'special-event',
    intensity: 8,
    preview_url: null
  },
  {
    id: 'professional',
    name: 'Professional Polish',
    description: 'Business-appropriate makeup',
    category: 'everyday',
    intensity: 4,
    preview_url: null
  },
  {
    id: 'creative',
    name: 'Creative Artistry',
    description: 'Bold and experimental makeup',
    category: 'editorial',
    intensity: 10,
    preview_url: null
  }
];

// Routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Makeup API is running',
    data: {
      status: 'ok',
      message: 'Mock server is running'
    }
  });
});

app.get('/api/v1/makeup/styles', async (req, res) => {
  try {
    // Enhance mock styles with Gemini descriptions
    const enhancedStyles = await Promise.all(
      mockStyles.map(async (style) => {
        const description = await geminiService.generateMakeupDescription(style.id);
        return {
          ...style,
          description: description || style.description
        };
      })
    );

    res.json({
      success: true,
      message: 'Styles retrieved successfully',
      data: enhancedStyles
    });
  } catch (error) {
    console.error('Error getting styles:', error);
    res.json({
      success: true,
      message: 'Styles retrieved successfully',
      data: mockStyles
    });
  }
});

app.post('/api/v1/makeup/upload', (req, res) => {
  try {
    const { image_data, format } = req.body;
    
    if (!image_data || !format) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: image_data and format'
      });
    }

    // Generate a unique ID
    const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const filename = `${imageId}.${format}`;
    const filePath = path.join(uploadsDir, filename);

    // Convert base64 to image buffer and save
    let imageBuffer;
    if (image_data.startsWith('data:')) {
      // Remove data URL prefix if present
      const base64Data = image_data.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      imageBuffer = Buffer.from(image_data, 'base64');
    }
    
    fs.writeFileSync(filePath, imageBuffer);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: imageId,
        filename: filename,
        file_path: `uploads/${filename}`,
        format: format,
        size: imageBuffer.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Upload failed: ' + error.message
    });
  }
});

app.post('/api/v1/makeup/apply/:style', async (req, res) => {
  try {
    const { style } = req.params;
    const { image_id, style_id } = req.body;

    if (!image_id || !style_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: image_id and style_id'
      });
    }

    console.log(`🎨 Processing makeup application: ${style_id} for image: ${image_id}`);

    // Simulate processing time
    setTimeout(async () => {
      try {
        const resultId = 'result_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const resultFilename = `${resultId}.jpg`;
        const resultPath = path.join(uploadsDir, resultFilename);
        
        // Find the original image file
        const originalFiles = fs.readdirSync(uploadsDir).filter(file => file.startsWith(image_id));
        
        let analysis = 'Beautiful makeup application completed!';
        
        if (originalFiles.length > 0) {
          const originalPath = path.join(uploadsDir, originalFiles[0]);
          
          // Use Gemini to analyze the image and provide makeup guidance
          const geminiResult = await geminiService.processImageWithMakeup(originalPath, style_id);
          analysis = geminiResult.analysis;
          
          console.log('🔎 Debug Gemini result:');
          console.log('- processedImagePath:', geminiResult.processedImagePath);
          console.log('- exists:', geminiResult.processedImagePath ? fs.existsSync(geminiResult.processedImagePath) : 'N/A');
          
          // Use the enhanced image created by Gemini instead of copying original
          if (geminiResult.processedImagePath && fs.existsSync(geminiResult.processedImagePath)) {
            // Copy the enhanced image to the result path
            fs.copyFileSync(geminiResult.processedImagePath, resultPath);
            console.log(`✨ Using enhanced image: ${geminiResult.processedImagePath}`);
            console.log(`✨ Copied to result path: ${resultPath}`);
          } else {
            // Fallback: copy original image if enhanced image creation failed
            fs.copyFileSync(originalPath, resultPath);
            console.log(`⚠️ Enhanced image not found, using original`);
            console.log(`⚠️ Original path: ${originalPath}`);
          }
          
          console.log(`🎨 Gemini Analysis: ${analysis.substring(0, 100)}...`);
        } else {
          // Fallback: create a placeholder image
          const placeholderImageData = Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=', 'base64');
          fs.writeFileSync(resultPath, placeholderImageData);
        }

        res.json({
          success: true,
          message: 'Makeup applied successfully',
          data: {
            id: resultId,
            original_id: image_id,
            style_id: style_id,
            status: 'completed',
            result_url: `http://localhost:8080/${resultFilename}`,
            analysis: analysis,
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          }
        });
        
        console.log(`✅ Created result image: ${resultFilename}`);
        console.log(`🔗 Result URL: http://localhost:8080/${resultFilename}`);
        
      } catch (error) {
        console.error('Error in processing:', error);
        res.status(500).json({
          success: false,
          error: 'Processing failed: ' + error.message
        });
      }
    }, 3000); // 3 second delay to simulate AI processing
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Makeup application failed: ' + error.message
    });
  }
});

app.get('/api/v1/makeup/result/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: 'Result retrieved successfully',
    data: {
      id: id,
      original_id: 'original_id',
      style_id: 'natural',
      status: 'completed',
      result_url: `http://localhost:8080/${id}.jpg`,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Mock Makeup API server running on http://localhost:${port}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   GET  /api/v1/health`);
  console.log(`   GET  /api/v1/makeup/styles`);
  console.log(`   POST /api/v1/makeup/upload`);
  console.log(`   POST /api/v1/makeup/apply/:style`);
  console.log(`   GET  /api/v1/makeup/result/:id`);
});