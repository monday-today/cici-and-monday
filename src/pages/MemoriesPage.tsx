import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, LayoutList, LayoutGrid } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { TimelineView } from '../components/memories/TimelineView'
import { MasonryView } from '../components/memories/MasonryView'
import { AddMemoryModal } from '../components/memories/AddMemoryModal'
import { useMemories } from '../hooks/useSupabase'

type ViewMode = 'timeline' | 'masonry'

export default function MemoriesPage() {
  const { memories, loading, addMemory, removeMemory } = useMemories()
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [showAdd, setShowAdd] = useState(false)

  return (
    <PageTransition>
      <BottomNav />
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-title text-warm-brown">回忆墙</h1>
          <p className="text-sm text-warm-taupe/60 font-light mt-1">属于我们的故事</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-warm-sand/20 p-0.5">
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-full transition-all ${viewMode === 'timeline' ? 'bg-white/10 backdrop-blur-sm shadow-sm' : ''}`}
            >
              <LayoutList size={16} className="text-warm-brown/70" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-full transition-all ${viewMode === 'masonry' ? 'bg-white/10 backdrop-blur-sm shadow-sm' : ''}`}
            >
              <LayoutGrid size={16} className="text-warm-brown/70" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' }}
          >
            <Plus size={20} className="text-warm-brown" />
          </motion.button>
        </div>
      </div>

      <div className="px-5">
        {loading ? null : !memories || memories.length === 0 ? (
          <EmptyState icon="1F4D6" message="还没有回忆，点击右上角记录你们的第一个故事吧" />
        ) : viewMode === 'timeline' ? (
          <TimelineView memories={memories} onDelete={removeMemory} />
        ) : (
          <MasonryView memories={memories} onDelete={removeMemory} />
        )}
      </div>

      <AddMemoryModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (item) => {
          await addMemory(item as Record<string, unknown>)
          setShowAdd(false)
        }}
      />
    </PageTransition>
  )
}
