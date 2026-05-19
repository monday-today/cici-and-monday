import { useState } from 'react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { DateCard } from '../components/dates/DateCard'
import { AddDateModal } from '../components/dates/AddDateModal'
import { useImportantDates } from '../hooks/useSupabase'

const CALENDAR_ICON = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F4C5.svg'

export default function DatesPage() {
  const { dates, loading, addDate, removeDate, updateDate } = useImportantDates()
  const [showAdd, setShowAdd] = useState(false)

  const sorted = [...(dates || [])].sort((a, b) => {
    const ao = a.sort_order ?? 0
    const bo = b.sort_order ?? 0
    if (ao !== bo) return ao - bo
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  const moveItem = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[target]
    await updateDate(a.id, { sort_order: (b.sort_order ?? 0) })
    await updateDate(b.id, { sort_order: (a.sort_order ?? 0) })
  }

  return (
    <PageTransition>
      <BottomNav />
      <div style={{ padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)', paddingBottom: '5rem' }}>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <img src={CALENDAR_ICON} alt="" className="w-6 h-6" />
            <h1 className="font-title text-white tracking-wider" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>
              纪念日
            </h1>
          </div>
          <p className="text-white/30 text-[10px] tracking-[0.2em] mt-0.5 ml-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            SPECIAL DAYS
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState icon="" message="还没有重要日期" />
        ) : (
          <div className="space-y-3">
            {sorted.map((d, i) => (
              <DateCard
                key={d.id}
                date={d}
                onDelete={() => removeDate(d.id)}
                onUpdate={(id, updates) => updateDate(id, updates)}
                onMoveUp={() => moveItem(i, -1)}
                onMoveDown={() => moveItem(i, 1)}
                isFirst={i === 0}
                isLast={i === sorted.length - 1}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white/90 px-5 py-2.5 transition-all text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            + 添加
          </button>
        </div>
      </div>

      <AddDateModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (item) => {
          const maxOrder = Math.max(0, ...(dates || []).map(d => d.sort_order ?? 0))
          await addDate({ ...item, sort_order: maxOrder - 1 } as Record<string, unknown>)
          setShowAdd(false)
        }}
      />
    </PageTransition>
  )
}
