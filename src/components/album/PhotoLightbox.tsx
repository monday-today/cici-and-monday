import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Photo } from '../../hooks/useSupabase'

interface Props {
  photo: Photo | null
  onClose: () => void
}

export function PhotoLightbox({ photo, onClose }: Props) {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-warm-brown/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10
                   flex items-center justify-center hover:bg-white/20 transition-colors z-10"
      >
        <X size={22} className="text-white/80" />
      </button>

      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={photo.url}
        alt={photo.caption || ''}
        className="max-w-full max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {photo.caption && (
        <p className="absolute bottom-8 left-0 right-0 text-center text-white/70 text-sm font-light">
          {photo.caption}
        </p>
      )}
    </motion.div>
  )
}
