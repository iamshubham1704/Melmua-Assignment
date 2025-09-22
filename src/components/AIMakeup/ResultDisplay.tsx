import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, RotateCcw, Eye, EyeOff, Sparkles } from 'lucide-react'
import type { ProcessingResult } from '../../types'

interface ResultDisplayProps {
  originalImage: string
  result?: ProcessingResult
  isLoading?: boolean
  onReset: () => void
}

export default function ResultDisplay({
  originalImage,
  result,
  isLoading = false,
  onReset,
}: ResultDisplayProps) {
  const [showComparison, setShowComparison] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Reset image error when result changes
  useEffect(() => {
    if (result?.result_url) {
      setImageError(false)
      console.log('Result updated:', {
        url: result.result_url,
        status: result.status,
        id: result.id
      })
    }
  }, [result?.result_url, result?.id])

  const handleImageError = () => {
    setImageError(true)
    console.error('Failed to load result image:', result?.result_url)
    console.error('Image URL details:', {
      url: result?.result_url,
      status: result?.status,
      id: result?.id
    })
  }

  const handleDownload = async () => {
    if (!result?.result_url) return

    try {
      const response = await fetch(result.result_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `makeup-result-${result.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShare = async () => {
    if (!result?.result_url) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Makeup Transformation',
          text: 'Check out my makeup transformation!',
          url: result.result_url,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(result.result_url)
    }
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Applying Makeup...
              </h3>
              <p className="text-gray-600">
                Our AI is working its magic on your photo
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!result || result.status !== 'completed') {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Transformation</h2>
          <p className="text-gray-600">Here's your photo with the applied makeup style</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 flex items-center space-x-2"
          >
            {showComparison ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="relative">
        {showComparison ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Original
                </div>
              </div>
            </motion.div>

            {/* Result Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                {imageError ? (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <p>Image not available</p>
                      <p className="text-sm">Processing may still be in progress</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={result.result_url}
                    alt="Result"
                    className="w-full h-96 object-cover"
                    onError={handleImageError}
                    onLoad={() => setImageError(false)}
                  />
                )}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Enhanced</span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              {imageError ? (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p>Image not available</p>
                    <p className="text-sm">Processing may still be in progress</p>
                  </div>
                </div>
              ) : (
                <img
                  src={result.result_url}
                  alt="Result"
                  className="w-full h-96 object-cover"
                  onError={handleImageError}
                  onLoad={() => setImageError(false)}
                />
              )}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Enhanced</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 flex items-center space-x-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Another Style</span>
        </motion.button>
      </div>

      {/* Processing Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Sparkles className="h-5 w-5 text-pink-500 mr-2" />
          AI Analysis
        </h3>
        {result.analysis ? (
          <div className="text-gray-700 whitespace-pre-wrap">
            {result.analysis}
          </div>
        ) : (
          <p className="text-gray-600">Analysis completed successfully!</p>
        )}
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <p>Processed on {new Date(result.completed_at || '').toLocaleString()}</p>
          <p>Result ID: {result.id}</p>
        </div>
      </div>
    </motion.div>
  )
}

