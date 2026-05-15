import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Travel } from '../../hooks/useSupabase'

interface Props {
  travel: Travel | null
  onClose: () => void
  onDelete: () => void
}

export function TravelStoryModal({ travel, onClose, onDelete }: Props) {
  const [photoIdx, setPhotoIdx] = useState(0)

  if (!travel) return null

  const images = travel.image_urls || []
  const hasMultiplePhotos = images.length > 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-warm-brown/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md
                   max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        {images.length > 0 && (
          <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-3xl">
            <img
              src={images[photoIdx]}
              alt=""
              className="w-full h-full object-cover"
            />
            {hasMultiplePhotos && (
              <>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${i === photoIdx ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
                {photoIdx > 0 && (
                  <button
                    onClick={() => setPhotoIdx(p => p - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                               bg-white/60 backdrop-blur-sm flex items-center justify-center"
                  >
                    <ChevronLeft size={18} className="text-warm-brown" />
                  </button>
                )}
                {photoIdx < images.length - 1 && (
                  <button
                    onClick={() => setPhotoIdx(p => p + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                               bg-white/60 backdrop-blur-sm flex items-center justify-center"
                  >
                    <ChevronRight size={18} className="text-warm-brown" />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-title text-warm-brown">{travel.title}</h2>
              <p className="text-sm text-warm-taupe/60 font-light mt-1">
                {new Date(travel.visit_date).toLocaleDateString('zh-CN', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onDelete}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50"
              >
                <Trash2 size={16} className="text-red-300" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-warm-sand/20"
              >
                <X size={18} className="text-warm-taupe" />
              </button>
            </div>
          </div>

          {travel.story && (
            <p className="text-sm text-warm-brown/80 font-light leading-relaxed whitespace-pre-wrap">
              {travel.story}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
