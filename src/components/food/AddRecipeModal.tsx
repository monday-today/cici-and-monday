import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: Record<string, unknown>) => void
}

export function AddRecipeModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [cookingTime, setCookingTime] = useState('')
  const [notes, setNotes] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name || saving) return
    setSaving(true)
    const photoUrls: string[] = []
    for (const f of images) {
      const url = await uploadImage(f, 'memories')
      if (url) photoUrls.push(url)
    }
    await onSave({
      name, ingredients, steps,
      cooking_time: cookingTime, notes,
      photo_url: JSON.stringify(photoUrls),
    })
    setName(''); setIngredients(''); setSteps('')
    setCookingTime(''); setNotes(''); setImages([])
    setSaving(false)
  }

  const inputClass = 'w-full h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/40'
  const areaClass = 'w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none'
  const labelClass = 'text-white/50 text-xs font-medium mb-1 block'
  const labelStyle = { fontFamily: "'Montserrat', sans-serif" }
  const wrapClass = 'w-[92%]'

  return (
    <Modal open={open} onClose={onClose} title="添加食谱">
      <div className="space-y-5 flex flex-col items-center">
        <div className={wrapClass}>
          <p className={labelClass} style={labelStyle}>菜品名称</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="例如：红烧排骨" className={inputClass}
            style={{ fontFamily: "'Montserrat', sans-serif" }} />
        </div>

        <div className={wrapClass}>
          <p className={labelClass} style={labelStyle}>用料</p>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)}
            placeholder="每行一个食材：&#10;排骨 500g&#10;生抽 2勺&#10;老抽 1勺&#10;冰糖 适量"
            rows={5} className={areaClass}
            style={{ fontFamily: "'Montserrat', sans-serif" }} />
        </div>

        <div className={wrapClass}>
          <p className={labelClass} style={labelStyle}>制作步骤</p>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)}
            placeholder="每行一个步骤：&#10;1. 排骨焯水去血沫&#10;2. 热油炒糖色&#10;3. 加入排骨翻炒..."
            rows={5} className={areaClass}
            style={{ fontFamily: "'Montserrat', sans-serif" }} />
        </div>

        <div className={wrapClass}>
          <p className={labelClass} style={labelStyle}>火候 / 时间</p>
          <input type="text" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)}
            placeholder="例如：中火 30 分钟，小火收汁" className={inputClass}
            style={{ fontFamily: "'Montserrat', sans-serif" }} />
        </div>

        <div className={wrapClass}>
          <p className={labelClass} style={labelStyle}>笔记</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="口感调整、注意事项..."
            rows={2} className={areaClass}
            style={{ fontFamily: "'Montserrat', sans-serif" }} />
        </div>

        <div className={wrapClass}>
          <p className={labelClass} style={labelStyle}>成品照片</p>
          <ImageUpload images={images} onChange={setImages} max={10} />
        </div>

        <div className={wrapClass}>
          <button onClick={handleSave} disabled={!name || saving}
            className="w-full h-12 rounded-btn font-medium transition-all
                       bg-white/20 text-white hover:bg-white/30
                       disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {saving ? '保存中...' : '保存食谱'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
