import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhotoLightbox } from '../album/PhotoLightbox'
import type { DiaryEntry, Photo } from '../../hooks/useSupabase'

const CDN = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg'
const moodMap: Record<string, { hex: string; label: string }> = {
  love: { hex: '1F495', label: '爱' },
  happy: { hex: '1F60A', label: '开心' },
  calm: { hex: '1F60C', label: '平静' },
  miss: { hex: '1F97A', label: '想念' },
  grateful: { hex: '1F64F', label: '感恩' },
  excited: { hex: '1F389', label: '兴奋' },
}

interface Props {
  open: boolean
  onClose: () => void
  entry: DiaryEntry | null
  onEdit: (entry: DiaryEntry) => void
  onDelete: (id: string) => void
}

export function DiaryDetailModal({ open, onClose, entry, onEdit, onDelete }: Props) {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  if (!entry || !open) return null

  const mood = moodMap[entry.mood]
  const photos = entry.image_urls || []
  const btnStyle = { fontFamily: "'Montserrat', sans-serif" }

  const handleDelete = () => {
    if (window.confirm('确定要删除这篇日记吗？')) {
      onDelete(entry.id)
      onClose()
    }
  }

  const makePhoto = (url: string): Photo => ({ id: '', url, caption: '', taken_at: '' })

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#3a2018] border border-white/10 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header photo */}
            {photos.length > 0 && (
              <div className="relative overflow-hidden rounded-t-3xl cursor-pointer" onClick={() => setLightboxPhoto(makePhoto(photos[0]))}>
                <img src={photos[0]} alt="" className="w-full h-auto block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a2018] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* Mood + Title */}
              <div className="flex items-center gap-3">
                {mood && (
                  <div className="flex flex-col items-center gap-1">
                    <img src={`${CDN}/${mood.hex}.svg`} alt={mood.label} className="w-10 h-10" />
                    <span className="text-xs text-white/40" style={btnStyle}>{mood.label}</span>
                  </div>
                )}
                <h2 className="text-white text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{entry.title}</h2>
              </div>

              {/* Date */}
              <p className="text-white/35 text-sm" style={btnStyle}>
                {new Date(entry.entry_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </p>

              {/* Content */}
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap" style={btnStyle}>
                {entry.content}
              </p>

              {/* Photo thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setLightboxPhoto(makePhoto(url))}
                    />
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { onEdit(entry); onClose() }}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
                  style={btnStyle}
                >
                  编辑
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 h-11 rounded-xl bg-red-400/10 hover:bg-red-400/25 text-red-300 text-sm transition-colors"
                  style={btnStyle}
                >
                  删除
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <PhotoLightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </>
  )
}
