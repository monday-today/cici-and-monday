import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { Photo } from '../../hooks/useSupabase'

interface Props {
  photos: Photo[]
  onSelect: (photo: Photo) => void
  onDelete: (id: string) => void
}

export function PhotoGrid({ photos, onSelect, onDelete }: Props) {
  return (
    <div className="columns-2 sm:columns-3 gap-3 space-y-3">
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="break-inside-avoid relative group cursor-pointer rounded-img overflow-hidden"
          onClick={() => onSelect(photo)}
        >
          <img
            src={photo.url}
            alt={photo.caption || ''}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/40 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity" />
          {photo.caption && (
            <p className="absolute bottom-2 left-3 text-white text-xs font-light
                          opacity-0 group-hover:opacity-100 transition-opacity">
              {photo.caption}
            </p>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(photo.id) }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-warm-brown/50
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-opacity hover:bg-red-400/70"
          >
            <Trash2 size={12} className="text-white" />
          </button>
        </motion.div>
      ))}
    </div>
  )
}
