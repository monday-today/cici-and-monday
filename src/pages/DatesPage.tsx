import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { DateCard } from '../components/dates/DateCard'
import { AddDateModal } from '../components/dates/AddDateModal'
import { useImportantDates } from '../hooks/useSupabase'

export default function DatesPage() {
  const { dates, loading, addDate, removeDate } = useImportantDates()
  const [showAdd, setShowAdd] = useState(false)

  const sorted = [...(dates || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <PageTransition>
      <BottomNav />
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-title text-warm-brown">纪念日 & 生日</h1>
          <p className="text-sm text-warm-taupe/60 font-light mt-1">每一个重要的日子都值得记住</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #F2D0C4, #E8D5C4)' }}
        >
          <Plus size={20} className="text-warm-brown" />
        </motion.button>
      </div>

      <div className="px-5 space-y-3">
        {loading ? null : sorted.length === 0 ? (
          <EmptyState icon="📅" message="还没有重要日期，点击右上角添加吧" />
        ) : (
          sorted.map((d) => (
            <DateCard
              key={d.id}
              date={d}
              onDelete={() => removeDate(d.id)}
            />
          ))
        )}
      </div>

      <AddDateModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (item) => {
          await addDate(item as unknown as Record<string, unknown>)
          setShowAdd(false)
        }}
      />
    </PageTransition>
  )
}
