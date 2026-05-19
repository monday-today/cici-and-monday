import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { ImageUpload } from '../ui/ImageUpload'
import { MoodPicker } from './MoodPicker'
import { uploadImage } from '../../hooks/useSupabase'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: Record<string, unknown>) => void
  editEntry?: { id: string; title: string; content: string; mood: string; entry_date: string; image_urls?: string[] } | null
}

export function DiaryEditor({ open, onClose, onSave, editEntry }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('love')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [images, setImages] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Reset form when opened or editEntry changes
  useEffect(() => {
    if (open) {
      if (editEntry) {
        setTitle(editEntry.title)
        setContent(editEntry.content)
        setMood(editEntry.mood)
        setDate(editEntry.entry_date)
        setExistingPhotos(editEntry.image_urls || [])
      } else {
        setTitle('')
        setContent('')
        setMood('love')
        setDate(new Date().toISOString().split('T')[0])
        setExistingPhotos([])
      }
      setImages([])
    }
  }, [open, editEntry])

  const handleRemoveExistingPhoto = (url: string) => {
    setExistingPhotos(prev => prev.filter(p => p !== url))
  }

  const handleSave = async () => {
    if (!title || !content || saving) return
    setSaving(true)
    const urls: string[] = []
    for (const f of images) {
      const url = await uploadImage(f, 'diary')
      if (url) urls.push(url)
    }
    const allPhotos = [...existingPhotos, ...urls]
    await onSave({ title, content, mood, entry_date: date, image_urls: allPhotos })
    setTitle('')
    setContent('')
    setMood('love')
    setDate(new Date().toISOString().split('T')[0])
    setImages([])
    setExistingPhotos([])
    setSaving(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="写日记">
      <div className="space-y-4">
        <MoodPicker value={mood} onChange={setMood} />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="日记标题"
          className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="今天想说的话..."
          rows={6}
          className="w-full px-4 py-3 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand resize-none"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown"
        />
        {existingPhotos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {existingPhotos.map((url, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemoveExistingPhoto(url)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-400/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <ImageUpload images={images} onChange={setImages} max={3} />
        <button
          onClick={handleSave}
          disabled={!title || !content || saving}
          className="w-full h-12 rounded-btn font-medium transition-all
                     bg-warm-sand/60 text-warm-brown hover:bg-warm-sand/80
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? '保存中...' : '保存日记'}
        </button>
      </div>
    </Modal>
  )
}
