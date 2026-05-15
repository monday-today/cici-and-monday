import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { DiaryList } from '../components/diary/DiaryList'
import { DiaryEditor } from '../components/diary/DiaryEditor'
import { useDiaryEntries } from '../hooks/useSupabase'

export default function DiaryPage() {
  const { entries, loading, addEntry, removeEntry } = useDiaryEntries()
  const [showEditor, setShowEditor] = useState(false)

  return (
    <PageTransition>
      <BottomNav />
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-title text-warm-brown">日记</h1>
          <p className="text-sm text-warm-taupe/60 font-light mt-1">写给你，也写给自己</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEditor(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #F2D0C4, #E8D5C4)' }}
        >
          <Plus size={20} className="text-warm-brown" />
        </motion.button>
      </div>

      <div className="px-5">
        {loading ? null : !entries || entries.length === 0 ? (
          <EmptyState icon="📝" message="还没有日记，写下第一封情书吧" />
        ) : (
          <DiaryList entries={entries} onDelete={removeEntry} />
        )}
      </div>

      <DiaryEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={async (item) => {
          await addEntry(item as Record<string, unknown>)
          setShowEditor(false)
        }}
      />
    </PageTransition>
  )
}
