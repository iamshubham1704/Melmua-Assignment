import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Camera, Palette, Download, ArrowLeft, Wand2 } from 'lucide-react'
import Button from '../components/ui/Button'
import ImageUpload from '../components/AIMakeup/ImageUpload'
import MakeupStyleSelector from '../components/AIMakeup/MakeupStyleSelector'
import ResultDisplay from '../components/AIMakeup/ResultDisplay'
import { MakeupAPI, fileToBase64, getImageFormat } from '../services/aiApi'
import type { MakeupStyle, ImageFile, ProcessingResult } from '../types'
import toast from 'react-hot-toast'

type AppStep = 'upload' | 'style' | 'processing' | 'result'

interface AIMakeupProps {
  onBack: () => void
}

export default function AIMakeup({ onBack }: AIMakeupProps) {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload')
  const [selectedImage, setSelectedImage] = useState<ImageFile | undefined>(undefined)
  const [selectedStyle, setSelectedStyle] = useState<MakeupStyle | undefined>(undefined)
  const [styles, setStyles] = useState<MakeupStyle[]>([])
  const [result, setResult] = useState<ProcessingResult | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Load available styles on component mount
  useEffect(() => {
    const loadStyles = async () => {
      try {
        const response = await MakeupAPI.getAvailableStyles()
        if (response.success && response.data) {
          setStyles(response.data)
        } else {
          toast.error('Failed to load makeup styles')
        }
      } catch (error) {
        console.error('Error loading styles:', error)
        toast.error('Failed to load makeup styles')
      }
    }

    loadStyles()
  }, [])

  const handleImageSelect = (image: ImageFile) => {
    setSelectedImage(image)
    setError('')
    setCurrentStep('style')
  }

  const handleImageRemove = () => {
    setSelectedImage(undefined)
    setSelectedStyle(undefined)
    setResult(undefined)
    setCurrentStep('upload')
  }

  const handleStyleSelect = (style: MakeupStyle) => {
    setSelectedStyle(style)
    setError('')
  }

  const handleApplyMakeup = async () => {
    if (!selectedImage || !selectedStyle) return

    setIsLoading(true)
    setCurrentStep('processing')
    setError('')

    try {
      // Convert image to base64
      const base64Data = await fileToBase64(selectedImage.file)
      const format = getImageFormat(selectedImage.file)

      // Upload image
      toast.loading('Uploading your photo...', { id: 'upload' })
      const uploadResponse = await MakeupAPI.uploadImage(base64Data, format)
      
      if (!uploadResponse.success || !uploadResponse.data) {
        throw new Error(uploadResponse.error || 'Upload failed')
      }

      toast.success('Photo uploaded successfully!', { id: 'upload' })

      // Apply makeup style
      toast.loading('Applying makeup style...', { id: 'makeup' })
      const makeupResponse = await MakeupAPI.applyMakeupStyle(
        uploadResponse.data.id,
        selectedStyle.id
      )

      if (!makeupResponse.success || !makeupResponse.data) {
        throw new Error(makeupResponse.error || 'Makeup application failed')
      }

      toast.success('Makeup applied successfully!', { id: 'makeup' })
      
      setResult(makeupResponse.data)
      setCurrentStep('result')
    } catch (error) {
      console.error('Error applying makeup:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      setCurrentStep('style')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(undefined)
    setSelectedStyle(undefined)
    setResult(undefined)
    setError('')
    setCurrentStep('upload')
  }

  const getStepIcon = (step: AppStep) => {
    switch (step) {
      case 'upload':
        return <Camera className="h-5 w-5" />
      case 'style':
        return <Palette className="h-5 w-5" />
      case 'processing':
        return <Sparkles className="h-5 w-5" />
      case 'result':
        return <Download className="h-5 w-5" />
      default:
        return <Camera className="h-5 w-5" />
    }
  }

  const getStepTitle = (step: AppStep) => {
    switch (step) {
      case 'upload':
        return 'Upload Photo'
      case 'style':
        return 'Choose Style'
      case 'processing':
        return 'Processing'
      case 'result':
        return 'Your Result'
      default:
        return 'Upload Photo'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Artists
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    AI Makeup Studio
                  </h1>
                  <p className="text-sm text-gray-600">Transform your photos with AI-powered makeup</p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center space-x-4">
              {(['upload', 'style', 'processing', 'result'] as AppStep[]).map((step, index) => (
                <div
                  key={step}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
                    ${currentStep === step 
                      ? 'bg-pink-100 text-pink-700' 
                      : index < (['upload', 'style', 'processing', 'result'] as AppStep[]).indexOf(currentStep)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  {getStepIcon(step)}
                  <span className="text-sm font-medium">{getStepTitle(step)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto"
            >
              <ImageUpload
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                selectedImage={selectedImage}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {currentStep === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-6xl mx-auto"
            >
              <MakeupStyleSelector
                styles={styles}
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
                isLoading={isLoading}
              />

              {selectedStyle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center"
                >
                  <Button
                    onClick={handleApplyMakeup}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Apply {selectedStyle.name}
                  </Button>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-700 text-center">{error}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {(currentStep === 'processing' || currentStep === 'result') && selectedImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-6xl mx-auto"
            >
              <ResultDisplay
                originalImage={selectedImage.preview}
                result={result}
                isLoading={currentStep === 'processing'}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
