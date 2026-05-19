import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'
import type { ImportantDate } from '../../hooks/useSupabase'

interface Props {
  open: boolean
  onClose: () => void
  date: ImportantDate
  onSave: (updates: Record<string, unknown>) => void
}

export function EditDateModal({ open, onClose, date, onSave }: Props) {
  const [title, setTitle] = useState(date.title)
  const [type, setType] = useState(date.type)
  const [dateStr, setDateStr] = useState(date.date)
  const [notes, setNotes] = useState(date.notes || '')
  const [images, setImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [existingPhotos, setExistingPhotos] = useState<string[]>(() => {
    try { return JSON.parse(date.photo_urls || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    setTitle(date.title)
    setType(date.type)
    setDateStr(date.date)
    setNotes(date.notes || '')
    try { setExistingPhotos(JSON.parse(date.photo_urls || '[]')) }
    catch { setExistingPhotos([]) }
  }, [date])

  const handleSave = async () => {
    if (!title || saving) return
    setSaving(true)
    const newUrls: string[] = []
    for (const f of images) {
      const url = await uploadImage(f, 'memories')
      if (url) newUrls.push(url)
    }
    const allPhotos = [...existingPhotos, ...newUrls]
    await onSave({ title, type, date: dateStr, notes, photo_urls: JSON.stringify(allPhotos) })
    setImages([])
    setSaving(false)
  }

  const removePhoto = (idx: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== idx))
  }

  const ic = 'w-full h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/40'
  const wrap = 'w-[92%]'

  return (
    <Modal open={open} onClose={onClose} title="编辑纪念日">
      <div className="space-y-4 flex flex-col items-center">
        <div className={wrap}>
          <p className="text-white/50 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>类型</p>
          <div className="flex gap-2">
            {(['anniversary', 'birthday'] as const).map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 h-10 rounded-xl text-sm transition-all ${type === t ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {t === 'anniversary' ? '纪念日' : '生日'}
              </button>
            ))}
          </div>
        </div>

        <div className={wrap}>
          <p className="text-white/50 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>标题</p>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={ic} />
        </div>

        <div className={wrap}>
          <p className="text-white/50 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>日期</p>
          <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} className={ic} />
        </div>

        <div className={wrap}>
          <p className="text-white/50 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>笔记</p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="想说的话..."
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none" />
        </div>

        <div className={wrap}>
          <p className="text-white/50 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>照片</p>
          {existingPhotos.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto mb-2">
              {existingPhotos.map((url, i) => (
                <div key={i} className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(i)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/50 flex items-center justify-center text-[8px] text-white">x</button>
                </div>
              ))}
            </div>
          )}
          <ImageUpload images={images} onChange={setImages} max={5} />
        </div>

        <div className={wrap}>
          <button onClick={handleSave} disabled={!title || saving}
            className="w-full h-12 rounded-btn font-medium bg-white/20 text-white hover:bg-white/30 disabled:opacity-30"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {saving ? '保存中...' : '保存修改'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
