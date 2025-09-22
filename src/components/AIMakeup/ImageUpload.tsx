import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, X, AlertCircle } from 'lucide-react'
import type { ImageFile } from '../../types'
import { validateImageFile } from '../../services/aiApi'

interface ImageUploadProps {
  onImageSelect: (image: ImageFile) => void
  onImageRemove: () => void
  selectedImage?: ImageFile
  isLoading?: boolean
}

export default function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  isLoading = false,
}: ImageUploadProps) {
  const [error, setError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setError('')

    // Create preview URL
    const preview = URL.createObjectURL(file)
    const imageFile: ImageFile = {
      file,
      preview,
      id: Math.random().toString(36).substr(2, 9),
    }

    onImageSelect(imageFile)
  }, [onImageSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onDrop([file])
    }
  }

  const handleRemove = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview)
    }
    onImageRemove()
    setError('')
  }

  return (
    <div className="w-full">
      {!selectedImage ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div
            className={`
              border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
              hover:border-pink-400 hover:bg-gray-50
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !isLoading && document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={isLoading}
            />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full">
                <ImageIcon className="h-8 w-8 text-pink-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Upload Your Photo
                </h3>
                <p className="text-gray-600 mb-4">
                  Click to browse or drag and drop an image
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPEG, PNG, WebP (max 10MB)
                </p>
              </div>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={selectedImage.preview}
              alt="Selected"
              className="w-full h-64 object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  <span className="text-sm text-gray-600">Processing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Image info */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {selectedImage.file.name}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
