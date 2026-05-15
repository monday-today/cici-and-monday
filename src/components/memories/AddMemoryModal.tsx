import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: Record<string, unknown>) => void
}

export function AddMemoryModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [images, setImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title || saving) return
    setSaving(true)
    const urls: string[] = []
    for (const f of images) {
      const url = await uploadImage(f, 'memories')
      if (url) urls.push(url)
    }
    await onSave({ title, content, memory_date: date, image_urls: urls })
    setTitle('')
    setContent('')
    setDate(new Date().toISOString().split('T')[0])
    setImages([])
    setSaving(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="添加回忆">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="标题"
          className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="写下这段回忆..."
          rows={3}
          className="w-full px-4 py-3 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand resize-none"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown"
        />
        <ImageUpload images={images} onChange={setImages} max={3} />
        <button
          onClick={handleSave}
          disabled={!title || saving}
          className="w-full h-12 rounded-btn font-medium transition-all
                     bg-warm-sand/60 text-warm-brown hover:bg-warm-sand/80
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </Modal>
  )
}
