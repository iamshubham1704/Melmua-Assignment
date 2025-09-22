import axios from 'axios'
import type { 
  MakeupStyle, 
  UploadedImage, 
  ProcessingResult, 
  ApiResponse,
  UploadRequest, 
  MakeupApplicationRequest 
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for image processing
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export class MakeupAPI {
  // Health check
  static async healthCheck(): Promise<ApiResponse<{ status: string; message: string }>> {
    const response = await api.get('/health')
    return response.data
  }

  // Upload image
  static async uploadImage(imageData: string, format: string): Promise<ApiResponse<UploadedImage>> {
    const request: UploadRequest = {
      image_data: imageData,
      format: format,
    }
    
    const response = await api.post('/makeup/upload', request)
    return response.data
  }

  // Apply makeup style
  static async applyMakeupStyle(
    imageId: string, 
    styleId: string
  ): Promise<ApiResponse<ProcessingResult>> {
    const request: MakeupApplicationRequest = {
      image_id: imageId,
      style_id: styleId,
    }
    
    const response = await api.post(`/makeup/apply/${styleId}`, request)
    return response.data
  }

  // Get available styles
  static async getAvailableStyles(): Promise<ApiResponse<MakeupStyle[]>> {
    const response = await api.get('/makeup/styles')
    return response.data
  }

  // Get processing result
  static async getResult(resultId: string): Promise<ApiResponse<ProcessingResult>> {
    const response = await api.get(`/makeup/result/${resultId}`)
    return response.data
  }

  // Get style details
  static async getStyleDetails(styleId: string): Promise<ApiResponse<MakeupStyle>> {
    const response = await api.get(`/makeup/style/${styleId}`)
    return response.data
  }
}

// Utility functions
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)',
    }
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 10MB',
    }
  }

  return { valid: true }
}

export const getImageFormat = (file: File): string => {
  const formatMap: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  return formatMap[file.type] || 'jpg'
}

export default api
