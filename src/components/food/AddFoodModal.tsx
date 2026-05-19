import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: Record<string, unknown>) => Promise<{ error?: unknown }>
}

export function AddFoodModal({ open, onClose, onSave }: Props) {
  const [dishName, setDishName] = useState('')
  const [restaurant, setRestaurant] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [allergies, setAllergies] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [images, setImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSave = async () => {
    if (!dishName || saving) return
    setSaving(true)
    setUploading(images.length > 0)
    try {
      const photoUrls: string[] = []
      for (const f of images) {
        const url = await uploadImage(f, 'memories')
        if (url) photoUrls.push(url)
      }
      setUploading(false)
      const { error } = await onSave({
        dish_name: dishName,
        restaurant,
        location,
        photo_url: JSON.stringify(photoUrls),
        notes,
        allergies,
        record_date: date,
      })
      if (error) {
        setErrorMsg('保存失败，请重试')
        return
      }
      setDishName('')
      setRestaurant('')
      setLocation('')
      setNotes('')
      setAllergies('')
      setDate(new Date().toISOString().split('T')[0])
      setImages([])
      setErrorMsg('')
    } catch {
      setErrorMsg('保存失败，请检查网络后重试')
    }
    setSaving(false)
    setUploading(false)
  }

  const inputClass = 'w-full h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/40'
  const labelClass = 'text-white/50 text-xs font-medium mb-1 block'
  const labelStyle = { fontFamily: "'Montserrat', sans-serif" }

  return (
    <Modal open={open} onClose={onClose} title="美食打卡">
      <div className="space-y-5 flex flex-col items-center">
        <div className="w-[92%]">
          <p className={labelClass} style={labelStyle}>菜品名称</p>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="例如：提拉米苏"
            className={inputClass}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 w-[92%]">
          <div>
            <p className={labelClass} style={labelStyle}>餐厅/店名</p>
            <input
              type="text"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              placeholder="可选"
              className={inputClass}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            />
          </div>
          <div>
            <p className={labelClass} style={labelStyle}>用餐地点</p>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="可选"
              className={inputClass}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            />
          </div>
        </div>

        <div className="w-[92%]">
          <p className={labelClass} style={labelStyle}>打卡日期</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="w-[92%]">
          <p className={labelClass} style={labelStyle}>美食照片</p>
          <ImageUpload images={images} onChange={setImages} max={20} />
        </div>

        <div className="w-[92%]">
          <p className={labelClass} style={labelStyle}>用餐笔记</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="口味如何？有什么特别之处..."
            rows={3}
            className="w-full px-4 py-3 rounded-input border border-white/20 bg-white/10 text-white/90
                       placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
        </div>

        <div className="w-[92%]">
          <p className={labelClass} style={labelStyle}>忌口/过敏备注</p>
          <textarea
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="过敏食材、不吃的配料、饮食偏好..."
            rows={2}
            className="w-full px-4 py-3 rounded-input border border-white/20 bg-white/10 text-white/90
                       placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
        </div>

        {errorMsg && (
          <p className="text-red-300/80 text-sm text-center bg-red-400/10 rounded-lg py-2 px-3">{errorMsg}</p>
        )}
        <button
          onClick={handleSave}
          disabled={!dishName || saving}
          className="w-full h-12 rounded-btn font-medium transition-all
                     bg-white/20 text-white hover:bg-white/30
                     disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {uploading ? '上传照片中...' : saving ? '保存中...' : '保存打卡'}
        </button>
      </div>
    </Modal>
  )
}
