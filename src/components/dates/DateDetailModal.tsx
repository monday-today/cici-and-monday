import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'
import type { ImportantDate } from '../../hooks/useSupabase'

interface Props {
  open: boolean
  onClose: () => void
  date: ImportantDate
  onDelete: () => void
  onUpdate: (updates: Record<string, unknown>) => void
}

export function DateDetailModal({ open, onClose, date, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(date.title)
  const [dateStr, setDateStr] = useState(date.date)
  const [type, setType] = useState(date.type)
  const [notes, setNotes] = useState(date.notes || '')
  const [countMode, setCountMode] = useState(date.count_mode || 'countdown')
  const [images, setImages] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>(() => {
    try { return JSON.parse(date.photo_urls || '[]') }
    catch { return [] }
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(date.title)
    setDateStr(date.date)
    setType(date.type)
    setNotes(date.notes || '')
    setCountMode(date.count_mode || 'countdown')
    try { setExistingPhotos(JSON.parse(date.photo_urls || '[]')) }
    catch { setExistingPhotos([]) }
    setEditing(false)
  }, [date, open])

  if (!open) return null

  const today = new Date()
  const target = new Date(date.date)
  const mode = date.count_mode || 'countdown'
  target.setFullYear(today.getFullYear())
  if (mode === 'countdown') {
    if (target < today) target.setFullYear(today.getFullYear() + 1)
  } else {
    if (target > today) target.setFullYear(today.getFullYear() - 1)
  }
  const diffMs = mode === 'countdown'
    ? target.getTime() - today.getTime()
    : today.getTime() - target.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const label = days === 0 ? '就是今天！' : mode === 'countdown' ? `还有 ${days} 天` : `已经 ${days} 天`

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', year: 'numeric' }) }
    catch { return d }
  }

  const handleSave = async () => {
    if (!title || saving) return
    setSaving(true)
    const newUrls: string[] = []
    for (const f of images) {
      const url = await uploadImage(f, 'memories')
      if (url) newUrls.push(url)
    }
    const allPhotos = [...existingPhotos, ...newUrls]
    await onUpdate({ title, type, date: dateStr, notes, count_mode: countMode, photo_urls: JSON.stringify(allPhotos) })
    setImages([])
    setSaving(false)
    setEditing(false)
  }

  const removePhoto = (idx: number) => setExistingPhotos(prev => prev.filter((_, i) => i !== idx))

  const photos = existingPhotos
  const ic = 'w-full h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40'
  const btnStyle = { fontFamily: "'Montserrat', sans-serif" }

  return (
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image / countdown */}
        <div style={{ aspectRatio: '4/3' }} className="relative overflow-hidden rounded-t-3xl bg-white/5">
          {photos.length > 0 ? (
            <img src={photos[0]} alt="" className="w-full h-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a2018] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {!editing ? (
              <>
                <h2 className="text-white text-2xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{date.title}</h2>
                <p className="text-white/50 text-sm mt-1" style={btnStyle}>{fmtDate(date.date)}</p>
              </>
            ) : (
              <div className="space-y-2">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={ic} placeholder="标题" />
                <div className="flex gap-2">
                  <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} className={ic} />
                  <button onClick={() => setType(t => t === 'birthday' ? 'anniversary' : 'birthday')}
                    className={`shrink-0 px-3 h-10 rounded-xl text-sm transition-all ${type === 'birthday' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`} style={btnStyle}>
                    {type === 'birthday' ? '生日' : '纪念日'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCountMode(m => m === 'anniversary' ? 'countdown' : 'anniversary')}
                    className={`flex-1 h-10 rounded-xl text-sm transition-all ${countMode === 'anniversary' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`} style={btnStyle}>
                    {countMode === 'anniversary' ? '纪念日（已经X天）' : '倒数日（还有X天）'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Countdown */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <span className="font-bold text-white/80 text-lg" style={btnStyle}>{days === 0 ? '!' : days}</span>
            </div>
            <div>
              <p className="text-white/80 font-semibold" style={btnStyle}>{label}</p>
              <p className="text-white/30 text-xs" style={btnStyle}>{date.type === 'birthday' ? '生日' : '纪念日'}</p>
            </div>
          </div>

          {/* Notes */}
          {!editing ? (
            date.notes ? (
              <p className="text-white/50 text-sm leading-relaxed" style={btnStyle}>{date.notes}</p>
            ) : null
          ) : (
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="想说的话..."
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none" />
          )}

          {/* Photo gallery */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((url, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '4/3' }}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {editing && (
                    <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-[10px] text-white">x</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add photos (edit mode) */}
          {editing && (
            <ImageUpload images={images} onChange={setImages} max={5} />
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {!editing ? (
              <>
                <button onClick={() => setEditing(true)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors" style={btnStyle}>
                  编辑
                </button>
                <button onClick={onDelete}
                  className="flex-1 h-11 rounded-xl bg-red-400/10 hover:bg-red-400/25 text-red-300 text-sm transition-colors" style={btnStyle}>
                  删除
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} disabled={!title || saving}
                  className="flex-1 h-11 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm transition-colors disabled:opacity-30" style={btnStyle}>
                  {saving ? '保存中...' : '保存'}
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 text-sm transition-colors" style={btnStyle}>
                  取消
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
