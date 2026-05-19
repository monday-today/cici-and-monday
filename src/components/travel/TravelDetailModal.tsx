import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'
import type { Travel } from '../../hooks/useSupabase'

interface Props {
  open: boolean
  onClose: () => void
  travel: Travel | null
  onDelete: () => void
  onUpdate: (id: string, updates: Record<string, unknown>) => void
}

export function TravelDetailModal({ open, onClose, travel, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    if (travel && open) {
      setTitle(travel.title)
      setStory(travel.story || '')
      setVisitDate(travel.visit_date || '')
      setLat(travel.lat || 0)
      setLng(travel.lng || 0)
      setExistingPhotos(travel.image_urls || [])
      setNewPhotos([])
      setEditing(false)
      setPhotoIdx(0)
    }
  }, [travel, open])

  if (!travel || !open) return null

  const photos = existingPhotos
  const hasPhotos = photos.length > 0

  const handleSave = async () => {
    if (!title || saving) return
    setSaving(true)
    const urls: string[] = []
    for (const f of newPhotos) {
      const url = await uploadImage(f, 'memories')
      if (url) urls.push(url)
    }
    await onUpdate(travel.id, {
      title,
      story,
      visit_date: visitDate,
      lat,
      lng,
      image_urls: [...existingPhotos, ...urls],
    })
    setSaving(false)
    setEditing(false)
    onClose()
  }

  const removePhoto = (idx: number) => setExistingPhotos(prev => prev.filter((_, i) => i !== idx))

  const nextPhoto = () => { if (photos.length > 1) setPhotoIdx(p => (p + 1) % photos.length) }
  const prevPhoto = () => { if (photos.length > 1) setPhotoIdx(p => (p - 1 + photos.length) % photos.length) }

  const ic = 'w-full h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40'
  const btnStyle = { fontFamily: "'Montserrat', sans-serif" }

  return (
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
          {/* Photo gallery */}
          {hasPhotos && (
            <div className="relative overflow-hidden rounded-t-3xl"
              onTouchStart={e => { const t = e.touches[0]; (e.target as HTMLDivElement).dataset.sx = String(t.clientX) }}
              onTouchEnd={e => {
                const sx = parseFloat((e.target as HTMLDivElement).dataset.sx || '0')
                const dx = e.changedTouches[0].clientX - sx
                if (Math.abs(dx) > 40) { if (dx < 0) nextPhoto(); else prevPhoto() }
              }}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={photoIdx}
                  src={photos[photoIdx]}
                  alt=""
                  className="w-full h-auto block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2018] via-transparent to-transparent" />
              {photos.length > 1 && (
                <>
                  <button onClick={prevPhoto} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white text-lg">‹</button>
                  <button onClick={nextPhoto} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white text-lg">›</button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {photos.map((_, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)} className={`w-2 h-2 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-5 space-y-4">
            {!editing ? (
              <>
                <h2 className="text-white text-xl font-semibold text-center" style={{ fontFamily: "'Playfair Display', serif" }}>{travel.title}</h2>
                <p className="text-white/35 text-sm text-center" style={btnStyle}>
                  {new Date(travel.visit_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {travel.lat !== 0 && (
                  <p className="text-white/25 text-xs text-center" style={btnStyle}>
                    📍 {travel.lat.toFixed(2)}, {travel.lng.toFixed(2)}
                  </p>
                )}
                {travel.story && (
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap" style={btnStyle}>{travel.story}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(true)}
                    className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors" style={btnStyle}>编辑</button>
                  <button onClick={() => { onDelete(); onClose() }}
                    className="flex-1 h-11 rounded-xl bg-red-400/10 hover:bg-red-400/25 text-red-300 text-sm transition-colors" style={btnStyle}>删除</button>
                </div>
              </>
            ) : (
              <>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={ic} placeholder="标题" />
                <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} className={ic} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={lat} onChange={e => setLat(parseFloat(e.target.value) || 0)} step="0.01" className={ic} placeholder="纬度" />
                  <input type="number" value={lng} onChange={e => setLng(parseFloat(e.target.value) || 0)} step="0.01" className={ic} placeholder="经度" />
                </div>
                <textarea value={story} onChange={e => setStory(e.target.value)} rows={4}
                  className={ic + ' resize-none py-3'} placeholder="旅行故事..." />
                {existingPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {existingPhotos.map((url, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-white/10" style={{ aspectRatio: '4/3' }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-[10px] text-white">x</button>
                      </div>
                    ))}
                  </div>
                )}
                <ImageUpload images={newPhotos} onChange={setNewPhotos} max={10 - existingPhotos.length} />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={!title || saving}
                    className="flex-1 h-11 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm transition-colors disabled:opacity-30" style={btnStyle}>
                    {saving ? '保存中...' : '保存'}
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 text-sm transition-colors" style={btnStyle}>取消</button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
