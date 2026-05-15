import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: Record<string, unknown>) => void
}

const defaultLocations: { title: string; lat: number; lng: number }[] = [
  { title: '上海', lat: 31.23, lng: 121.47 },
  { title: '北京', lat: 39.91, lng: 116.40 },
  { title: '成都', lat: 30.57, lng: 104.07 },
  { title: '大理', lat: 25.61, lng: 100.27 },
  { title: '厦门', lat: 24.48, lng: 118.09 },
  { title: '三亚', lat: 18.25, lng: 109.50 },
  { title: '东京', lat: 35.68, lng: 139.76 },
  { title: '巴黎', lat: 48.86, lng: 2.35 },
  { title: '伦敦', lat: 51.51, lng: -0.13 },
  { title: '纽约', lat: 40.71, lng: -74.01 },
  { title: '首尔', lat: 37.57, lng: 126.98 },
  { title: '曼谷', lat: 13.75, lng: 100.50 },
]

export function AddTravelModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [images, setImages] = useState<File[]>([])
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [saving, setSaving] = useState(false)

  const handleLocationPick = (loc: typeof defaultLocations[0]) => {
    setTitle(loc.title)
    setLat(loc.lat)
    setLng(loc.lng)
  }

  const handleSave = async () => {
    if (!title || saving) return
    setSaving(true)
    const urls: string[] = []
    for (const f of images) {
      const url = await uploadImage(f, 'travel')
      if (url) urls.push(url)
    }
    await onSave({ title, story, visit_date: date, image_urls: urls, lat, lng })
    setTitle('')
    setStory('')
    setDate(new Date().toISOString().split('T')[0])
    setImages([])
    setLat(0)
    setLng(0)
    setSaving(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="添加旅行记录">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-warm-taupe font-light block mb-2">快速选择地点</label>
          <div className="flex flex-wrap gap-2">
            {defaultLocations.map(loc => (
              <button
                key={loc.title}
                onClick={() => handleLocationPick(loc)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all
                           ${title === loc.title
                             ? 'bg-warm-sand/40 text-warm-brown font-medium'
                             : 'bg-warm-sand/10 text-warm-taupe/60 hover:bg-warm-sand/20'}`}
              >
                {loc.title}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="地点名称"
          className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand"
        />

        <textarea
          value={story}
          onChange={e => setStory(e.target.value)}
          placeholder="这次旅行的故事..."
          rows={4}
          className="w-full px-4 py-3 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand resize-none"
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown"
        />

        <ImageUpload images={images} onChange={setImages} max={5} />

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
