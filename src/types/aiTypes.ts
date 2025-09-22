export interface MakeupStyle {
  id: string
  name: string
  description: string
  category: 'bridal' | 'special-event' | 'editorial' | 'everyday' | 'other'
  intensity: number
  preview_url?: string
}

export interface UploadedImage {
  id: string
  filename: string
  file_path: string
  format: string
  size: number
}

export interface ProcessingResult {
  id: string
  original_id: string
  style_id: string
  status: 'processing' | 'completed' | 'failed'
  result_url?: string
  analysis?: string
  error?: string
  created_at: string
  completed_at?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}


export interface UploadRequest {
  image_data: string
  format: string
}

export interface MakeupApplicationRequest {
  image_id: string
  style_id: string
}

export interface ImageFile {
  file: File
  preview: string
  id: string
}
