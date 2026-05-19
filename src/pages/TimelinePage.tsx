import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { ImageUpload } from '../components/ui/ImageUpload'
import { useImportantDates, useMemories, useTravels, useTimelinePhotos, uploadImage } from '../hooks/useSupabase'

interface TimelineItem {
  id: string
  date: string
  title: string
  description: string
  type: 'date' | 'memory' | 'travel'
  source: 'date' | 'memory' | 'travel' | 'custom'
  photos: { url: string; caption: string }[]
}

export default function TimelinePage() {
  const { dates, updateDate } = useImportantDates()
  const { memories, updateMemory } = useMemories()
  const { travels, updateTravel } = useTravels()
  const { photos: customPhotos, addPhoto, updatePhoto } = useTimelinePhotos()
  const [showAddPhoto, setShowAddPhoto] = useState(false)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editPhotos, setEditPhotos] = useState<File[]>([])
  const [editExistingPhotos, setEditExistingPhotos] = useState<string[]>([])
  const dragIdx = useRef<number | null>(null)

  const items = useMemo(() => {
    const all: TimelineItem[] = [
      ...(dates || []).map((d) => {
        let datePhotos: { url: string; caption: string }[] = []
        try { datePhotos = (JSON.parse(d.photo_urls || '[]') as string[]).map((u: string) => ({ url: u, caption: '' })) } catch {}
        return { id: d.id, date: d.date, title: d.title, description: d.type === 'birthday' ? '生日' : '纪念日', type: 'date' as const, source: 'date' as const, photos: datePhotos }
      }),
      ...(memories || []).map((m) => ({ id: m.id, date: m.memory_date, title: m.title, description: m.content, type: 'memory' as const, source: 'memory' as const, photos: (m.image_urls || []).map((u: string) => ({ url: u, caption: '' })) })),
      ...(travels || []).map((t) => ({ id: t.id, date: t.visit_date, title: t.title, description: t.story, type: 'travel' as const, source: 'travel' as const, photos: (t.image_urls || []).map((u: string) => ({ url: u, caption: '' })) })),
      ...(customPhotos || []).map((p) => ({ id: p.id, date: p.created_at, title: p.caption || '照片', description: '', type: 'memory' as const, source: 'custom' as const, photos: [{ url: p.url, caption: p.caption }] })),
    ]
    return all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [dates, memories, travels, customPhotos])

  const leftItems = items.filter((_, i) => i % 2 === 0)
  const rightItems = items.filter((_, i) => i % 2 === 1)

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) }
    catch { return d }
  }

  const handleAddPhoto = async () => {
    if (photoFiles.length === 0 || saving) return
    setSaving(true)
    for (const f of photoFiles) {
      const url = await uploadImage(f, 'memories')
      if (url) await addPhoto({ url, caption: '' })
    }
    setPhotoFiles([])
    setSaving(false)
    setShowAddPhoto(false)
  }

  const openEdit = (item: TimelineItem) => {
    setEditingItem(item)
    setEditTitle(item.title)
    setEditDesc(item.description)
    setEditDate(item.date)
    setEditExistingPhotos(item.photos.map(p => p.url))
    setEditPhotos([])
  }

  const handleEditSave = async () => {
    if (!editingItem || saving) return
    setSaving(true)
    const newUrls: string[] = []
    for (const f of editPhotos) {
      const url = await uploadImage(f, 'memories')
      if (url) newUrls.push(url)
    }
    const allUrls = [...editExistingPhotos, ...newUrls]
    const updates: Record<string, unknown> = { title: editTitle, date: editDate }

    switch (editingItem.source) {
      case 'date':
        await updateDate(editingItem.id, { ...updates, notes: editDesc })
        break
      case 'memory':
        await updateMemory(editingItem.id, { ...updates, content: editDesc, image_urls: allUrls })
        break
      case 'travel':
        await updateTravel(editingItem.id, { ...updates, story: editDesc, image_urls: allUrls })
        break
      case 'custom':
        await updatePhoto(editingItem.id, { caption: editTitle, url: allUrls[0] || editExistingPhotos[0] || '' })
        break
    }
    setEditingItem(null)
    setSaving(false)
  }

  const removeEditPhoto = (idx: number) => {
    setEditExistingPhotos(prev => prev.filter((_, i) => i !== idx))
  }

  const renderCard = (item: TimelineItem, idx: number, side: 'left' | 'right') => {
    const hasPhotos = item.photos.length > 0
    const isLeft = side === 'left'
    return (
      <div key={item.id} className="relative">
        {/* Node dot */}
        <div
          className="absolute z-10 w-[10px] h-[10px] rounded-full border-2 border-white/50 bg-transparent"
          style={{ top: 12, [isLeft ? 'right' : 'left']: -17 }}
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.3, delay: idx * 0.02 }}
          className="rounded-card bg-white/10 backdrop-blur-sm border border-white/10 shadow-sm cursor-pointer hover:bg-white/15 transition-colors"
          style={{
            display: 'inline-block',
            padding: 'clamp(0.5rem, 2vw, 0.75rem)',
          }}
          onClick={() => openEdit(item)}
        >
          {hasPhotos && (
            <div className="grid grid-cols-3 gap-1 mb-2">
              {item.photos.map((p, pi) => (
                <div key={pi} className="rounded-md overflow-hidden border border-white/10">
                  <img src={p.url} alt={p.caption} className="max-w-full h-auto" style={{ maxWidth: '120px' }} />
                </div>
              ))}
            </div>
          )}
          <h2 className="font-semibold text-white leading-snug" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(0.8rem, 2.4vw, 1.1rem)', marginBottom: item.description ? '0.35rem' : '0.15rem' }}>
            {item.title}
          </h2>
          {item.description && (
            <p className="text-white/45 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)', marginBottom: '0.35rem' }}>
              {item.description}
            </p>
          )}
          <span className="inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-white/8 text-white/35" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {fmtDate(item.date)}
          </span>
        </motion.div>
      </div>
    )
  }

  const total = items.length
  const ic = 'w-full h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40'

  return (
    <PageTransition>
      <BottomNav />
      <div style={{ padding: 'clamp(1rem, 5vw, 2.5rem) 0.5rem', paddingBottom: '5rem' }}>
        <div className="mb-6 px-2">
          <h1 className="font-title text-white tracking-wider" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>时间线</h1>
          <p className="text-white/30 text-[10px] tracking-[0.2em] mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>OUR TIMELINE</p>
        </div>

        {total === 0 ? (
          <EmptyState icon="" message="还没有记录" />
        ) : (
          <div className="relative w-full pb-8">
            {/* Center dashed line */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: 0, borderLeft: '1.5px dashed rgba(255,255,255,0.3)' }} />

            <div className="flex">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-end" style={{ gap: 20, paddingRight: 12 }}>
                {leftItems.map((item, i) => renderCard(item, i, 'left'))}
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col items-start" style={{ gap: 20, paddingLeft: 12, paddingTop: 120 }}>
                {rightItems.map((item, i) => renderCard(item, i, 'right'))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button onClick={() => setShowAddPhoto(true)}
            className="rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white/90 px-5 py-2.5 transition-all text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            + 照片
          </button>
        </div>
      </div>

      <Modal open={showAddPhoto} onClose={() => { setShowAddPhoto(false); setPhotoFiles([]) }} title="添加照片到时间线">
        <div className="space-y-4">
          <ImageUpload images={photoFiles} onChange={setPhotoFiles} max={10} />
          <button onClick={handleAddPhoto} disabled={photoFiles.length === 0 || saving}
            className="w-full h-12 rounded-btn font-medium bg-white/20 text-white hover:bg-white/30 disabled:opacity-30"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {saving ? '上传中...' : '添加照片'}
          </button>
        </div>
      </Modal>

      <Modal open={!!editingItem} onClose={() => setEditingItem(null)} title="编辑卡片">
        <div className="space-y-4">
          <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={ic} placeholder="标题" />
          <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className={ic + ' resize-none py-3'} placeholder="描述" />
          <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className={ic} />
          {editExistingPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {editExistingPhotos.map((url, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => { dragIdx.current = i }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (dragIdx.current !== null && dragIdx.current !== i) {
                      const arr = [...editExistingPhotos]
                      const [item] = arr.splice(dragIdx.current, 1)
                      arr.splice(i, 0, item)
                      setEditExistingPhotos(arr)
                      dragIdx.current = i
                    }
                  }}
                  onDragEnd={() => { dragIdx.current = null }}
                  className="relative rounded-lg overflow-hidden border border-white/10 cursor-grab active:cursor-grabbing"
                  style={{ aspectRatio: '4/3' }}
                >
                  <img src={url} alt="" className="w-full h-full object-cover pointer-events-none" />
                  <button onClick={() => removeEditPhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-[10px] text-white">x</button>
                </div>
              ))}
            </div>
          )}
          <ImageUpload images={editPhotos} onChange={setEditPhotos} max={10 - editExistingPhotos.length} />
          <button onClick={handleEditSave} disabled={!editTitle || saving}
            className="w-full h-12 rounded-btn font-medium bg-white/20 text-white hover:bg-white/30 disabled:opacity-30"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </Modal>
    </PageTransition>
  )
}
