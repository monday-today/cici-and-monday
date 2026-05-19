import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { DiaryList } from '../components/diary/DiaryList'
import { DiaryEditor } from '../components/diary/DiaryEditor'
import { useDiaryEntries } from '../hooks/useSupabase'
import type { DiaryEntry } from '../hooks/useSupabase'

const CDN = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg'
const moodIcons: Record<string, string> = {
  happy: '1F60A', love: '1F495', calm: '1F60C', miss: '1F97A', grateful: '1F64F', excited: '1F389',
}

export default function DiaryPage() {
  const { entries, loading, addEntry, removeEntry, updateEntry } = useDiaryEntries()
  const [showEditor, setShowEditor] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null)

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setShowEditor(true)
  }

  const handleView = (entry: DiaryEntry) => {
    setViewingEntry(entry)
  }

  const handleSave = async (item: Record<string, unknown>) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, item)
    } else {
      await addEntry(item as Record<string, unknown>)
    }
    setShowEditor(false)
    setEditingEntry(null)
  }

  const handleClose = () => {
    setShowEditor(false)
    setEditingEntry(null)
  }

  return (
    <PageTransition>
      <BottomNav />
      <div style={{ padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)', paddingBottom: '5rem' }}>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <img src="https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F4D4.svg" alt="" className="w-6 h-6" />
            <h1 className="font-title text-white tracking-wider" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>日记</h1>
          </div>
          <p className="text-white/30 text-[10px] tracking-[0.2em] mt-0.5 ml-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>DEAR DIARY</p>
        </div>

        {loading ? null : !entries || entries.length === 0 ? (
          <EmptyState icon="1F4DD" message="快来跟你的宝宝说话吧~" />
        ) : (
          <DiaryList entries={entries} onDelete={removeEntry} onEdit={handleEdit} onView={handleView} />
        )}

        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEditor(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' }}
          >
            <Plus size={22} className="text-warm-brown" />
          </motion.button>
        </div>
      </div>

      <DiaryEditor
        open={showEditor}
        onClose={handleClose}
        onSave={handleSave}
        editEntry={editingEntry}
      />

      <Modal open={!!viewingEntry} onClose={() => setViewingEntry(null)} title={viewingEntry?.title}>
        {viewingEntry && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {moodIcons[viewingEntry.mood] && (
                <img src={`${CDN}/${moodIcons[viewingEntry.mood]}.svg`} alt="" className="w-8 h-8" />
              )}
              <div>
                <p className="text-xs text-warm-taupe/50 font-light">
                  {new Date(viewingEntry.entry_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                </p>
              </div>
            </div>
            <p className="text-sm text-warm-brown/80 font-light whitespace-pre-wrap leading-relaxed">
              {viewingEntry.content}
            </p>
            {viewingEntry.image_urls.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {viewingEntry.image_urls.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-28 h-28 rounded-2xl object-cover shrink-0" />
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}
