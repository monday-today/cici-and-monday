import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageUpload } from '../ui/ImageUpload'
import { uploadImage } from '../../hooks/useSupabase'

interface Recipe {
  id: string
  name: string
  ingredients: string
  steps: string
  cooking_time: string
  notes: string
  photo_url: string
  created_at: string
}

interface Props {
  recipe: Recipe
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Record<string, unknown>) => void
}

const CHEF_ICON = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F469-200D-1F373.svg'
const CLOCK_ICON = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/23F3.svg'

export function RecipeCard({ recipe, onDelete, onUpdate }: Props) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const touchStart = useRef(0)
  const touchStartY = useRef(0)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(recipe.name)
  const [ingredients, setIngredients] = useState(recipe.ingredients || '')
  const [steps, setSteps] = useState(recipe.steps || '')
  const [cookingTime, setCookingTime] = useState(recipe.cooking_time || '')
  const [notes, setNotes] = useState(recipe.notes || '')
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>(() => {
    try { return JSON.parse(recipe.photo_url || '[]') }
    catch { return recipe.photo_url ? [recipe.photo_url] : [] }
  })
  const [saving, setSaving] = useState(false)

  const photos: string[] = existingPhotos

  useEffect(() => {
    if (detailOpen) {
      setName(recipe.name)
      setIngredients(recipe.ingredients || '')
      setSteps(recipe.steps || '')
      setCookingTime(recipe.cooking_time || '')
      setNotes(recipe.notes || '')
      try { setExistingPhotos(JSON.parse(recipe.photo_url || '[]')) }
      catch { setExistingPhotos(recipe.photo_url ? [recipe.photo_url] : []) }
      setNewPhotos([])
      setEditing(false)
      setPhotoIdx(0)
    }
  }, [detailOpen])

  const handleSave = async () => {
    if (!name || saving) return
    setSaving(true)
    const urls: string[] = []
    for (const f of newPhotos) {
      const url = await uploadImage(f, 'memories')
      if (url) urls.push(url)
    }
    const allPhotos = [...existingPhotos, ...urls]
    await onUpdate(recipe.id, {
      name, ingredients, steps, cooking_time: cookingTime, notes, photo_url: JSON.stringify(allPhotos),
    })
    setSaving(false)
    setEditing(false)
    setDetailOpen(false)
  }

  const removePhoto = (idx: number) => setExistingPhotos(prev => prev.filter((_, i) => i !== idx))

  const nextPhoto = useCallback(() => {
    if (photos.length <= 1) return
    setPhotoIdx(prev => (prev + 1) % photos.length)
  }, [photos.length])

  const prevPhoto = useCallback(() => {
    if (photos.length <= 1) return
    setPhotoIdx(prev => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      if (dx < 0) nextPhoto()
      else prevPhoto()
    }
  }

  const btnStyle = { fontFamily: "'Montserrat', sans-serif" }

  return (
    <>
      <div
        className="rounded-card bg-white/10 backdrop-blur-sm border border-white/10 shadow-sm overflow-hidden cursor-pointer group"
        onClick={() => setDetailOpen(true)}
      >
        {photos.length > 0 && (
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={photos[photoIdx]}
              alt=""
              className="w-full h-auto block select-none transition-opacity duration-200"
              draggable={false}
            />
            {photos.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevPhoto() }}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">‹</button>
                <button onClick={(e) => { e.stopPropagation(); nextPhoto() }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">›</button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIdx ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="p-3 space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <img src={CHEF_ICON} alt="" className="w-4 h-4 opacity-60" />
            <h3 className="font-semibold text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}>
              {recipe.name}
            </h3>
          </div>
          {recipe.cooking_time && (
            <div className="flex items-center justify-center gap-1">
              <img src={CLOCK_ICON} alt="" className="w-3.5 h-3.5 opacity-50" />
              <span className="text-white/45 text-xs" style={btnStyle}>{recipe.cooking_time}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {detailOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setDetailOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#3a2018] border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {existingPhotos.length > 0 && (
                <div className="relative overflow-hidden rounded-t-3xl"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={existingPhotos[photoIdx]}
                    alt=""
                    className="w-full h-auto block select-none transition-opacity duration-200"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3a2018] via-transparent to-transparent" />
                  {existingPhotos.length > 1 && (
                    <>
                      <button onClick={() => prevPhoto()}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white text-lg">‹</button>
                      <button onClick={() => nextPhoto()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white text-lg">›</button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {existingPhotos.map((_, i) => (
                          <button key={i} onClick={() => setPhotoIdx(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === photoIdx ? 'bg-white' : 'bg-white/40'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="p-5 space-y-4">
                {!editing ? (
                  <>
                    <h2 className="text-white text-xl font-semibold text-center" style={{ fontFamily: "'Playfair Display', serif" }}>{recipe.name}</h2>
                    {recipe.cooking_time && (
                      <p className="text-white/40 text-sm text-center" style={btnStyle}>{recipe.cooking_time}</p>
                    )}
                    {recipe.ingredients && (
                      <div>
                        <p className="text-white/40 text-xs mb-1" style={btnStyle}>用料</p>
                        <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed" style={btnStyle}>{recipe.ingredients}</p>
                      </div>
                    )}
                    {recipe.steps && (
                      <div>
                        <p className="text-white/40 text-xs mb-1" style={btnStyle}>步骤</p>
                        <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed" style={btnStyle}>{recipe.steps}</p>
                      </div>
                    )}
                    {recipe.notes && (
                      <div>
                        <p className="text-white/40 text-xs mb-1" style={btnStyle}>笔记</p>
                        <p className="text-white/60 text-sm whitespace-pre-wrap leading-relaxed" style={btnStyle}>{recipe.notes}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setEditing(true)}
                        className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors" style={btnStyle}>编辑</button>
                      <button onClick={() => { onDelete(recipe.id); setDetailOpen(false) }}
                        className="flex-1 h-11 rounded-xl bg-red-400/10 hover:bg-red-400/25 text-red-300 text-sm transition-colors" style={btnStyle}>删除</button>
                    </div>
                  </>
                ) : (
                  <>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40" placeholder="菜谱名称" />
                    <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none" placeholder="用料（每行一个）" />
                    <textarea value={steps} onChange={e => setSteps(e.target.value)} rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none" placeholder="步骤（每行一个）" />
                    <input type="text" value={cookingTime} onChange={e => setCookingTime(e.target.value)}
                      className="w-full h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40" placeholder="烹饪时间" />
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none" placeholder="笔记" />
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
                      <button onClick={handleSave} disabled={!name || saving}
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
        )}
      </AnimatePresence>
    </>
  )
}
