import { motion } from 'framer-motion'
import { Heart, Sparkles, Crown, Moon, Briefcase, Palette } from 'lucide-react'
import type { MakeupStyle } from '../../types'

interface MakeupStyleSelectorProps {
  styles: MakeupStyle[]
  selectedStyle?: MakeupStyle
  onStyleSelect: (style: MakeupStyle) => void
  isLoading?: boolean
}

export default function MakeupStyleSelector({
  styles,
  selectedStyle,
  onStyleSelect,
  isLoading = false,
}: MakeupStyleSelectorProps) {
  const getStyleIcon = (styleId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      natural: <Heart className="h-6 w-6" />,
      bridal: <Crown className="h-6 w-6" />,
      editorial: <Sparkles className="h-6 w-6" />,
      evening: <Moon className="h-6 w-6" />,
      professional: <Briefcase className="h-6 w-6" />,
      creative: <Palette className="h-6 w-6" />,
    }
    return iconMap[styleId] || <Sparkles className="h-6 w-6" />
  }

  const getStyleColor = (styleId: string) => {
    const colorMap: { [key: string]: string } = {
      natural: 'from-green-400 to-emerald-500',
      bridal: 'from-pink-400 to-rose-500',
      editorial: 'from-purple-400 to-violet-500',
      evening: 'from-indigo-400 to-blue-500',
      professional: 'from-gray-400 to-slate-500',
      creative: 'from-orange-400 to-red-500',
    }
    return colorMap[styleId] || 'from-pink-400 to-purple-500'
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-100 text-green-800'
    if (intensity <= 6) return 'bg-yellow-100 text-yellow-800'
    if (intensity <= 8) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 3) return 'Subtle'
    if (intensity <= 6) return 'Moderate'
    if (intensity <= 8) return 'Bold'
    return 'Dramatic'
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Choose Your Style</h2>
        <p className="text-gray-600 text-center">
          Select a makeup style to apply to your photo
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style, index) => (
          <motion.div
            key={style.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`
                bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group
                ${selectedStyle?.id === style.id ? 'ring-2 ring-pink-500 bg-gradient-to-br from-pink-50 to-purple-50' : ''}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !isLoading && onStyleSelect(style)}
            >
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-full bg-gradient-to-r ${getStyleColor(style.id)} 
                flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300
              `}>
                {getStyleIcon(style.id)}
              </div>

              {/* Style Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {style.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {style.description}
                  </p>
                </div>

                {/* Category and Intensity */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {style.category}
                  </span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${getIntensityColor(style.intensity)}
                  `}>
                    {getIntensityLabel(style.intensity)}
                  </span>
                </div>

                {/* Intensity Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Intensity</span>
                    <span>{style.intensity}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getStyleColor(style.id)} transition-all duration-500`}
                      style={{ width: `${(style.intensity / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              {selectedStyle?.id === style.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedStyle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-8 h-8 rounded-full bg-gradient-to-r ${getStyleColor(selectedStyle.id)} 
              flex items-center justify-center text-white
            `}>
              {getStyleIcon(selectedStyle.id)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{selectedStyle.name}</h4>
              <p className="text-sm text-gray-600">{selectedStyle.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

