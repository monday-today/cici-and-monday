import { useState } from 'react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { QuickEntryGrid } from '../components/home/QuickEntryGrid'
import { PhotoMarquee } from '../components/home/PhotoMarquee'
import { PhotoStrip } from '../components/home/PhotoStrip'
import { DanmakuBox } from '../components/home/DanmakuBox'
import { CountdownCard } from '../components/ui/CountdownCard'
import { DateDetailModal } from '../components/dates/DateDetailModal'
import { useImportantDates } from '../hooks/useSupabase'
import type { ImportantDate } from '../hooks/useSupabase'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { dates, loading, removeDate, updateDate } = useImportantDates()
  const [selectedDate, setSelectedDate] = useState<ImportantDate | null>(null)

  const upcomingDates = [...(dates || [])]
    .filter(d => d.show_on_home !== false)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <PageTransition>
      <BottomNav />
      <div className="space-y-6" style={{ background: '#623e2a', minHeight: '100%', padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)', paddingBottom: 'clamp(3.5rem, 10vh, 5rem)', overflowX: 'hidden' }}>
        <div className="flex gap-3 items-center" style={{ height: 'clamp(90px, 24vw, 140px)' }}>
          <div className="shrink-0" style={{ width: 'clamp(160px, 42vw, 260px)' }}>
            {(() => {
              const hour = new Date().getHours()
              const greeting = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
              const timeIcon = hour < 6 ? '1F309_color.png' : hour < 12 ? '1F304_color.png' : hour < 14 ? '1F3DD_color.png' : hour < 18 ? '1F307_color.png' : '1F303_color.png'
              return (
                <div className="h-full flex flex-col justify-center">
                  <img src={`${import.meta.env.BASE_URL}images/time/${timeIcon}`} alt="" style={{ width: 'clamp(2rem, 8vw, 3.5rem)' }} />
                  <h2 className="font-title text-white whitespace-nowrap" style={{ fontSize: 'clamp(0.85rem, 3.5vw, 1.3rem)' }}>
                    {greeting}，我最爱的宝宝
                  </h2>
                  <p className="text-white/60 font-light mt-1 whitespace-nowrap" style={{ fontSize: 'clamp(0.55rem, 2vw, 0.75rem)' }}>
                    {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </p>
                </div>
              )
            })()}
          </div>
          <PhotoMarquee />
        </div>

        {!loading && upcomingDates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-white/60 font-light mb-3 pl-1">我们的纪念日</p>
            <div className="flex gap-3">
              <div className="flex flex-wrap gap-3 flex-1">
              {upcomingDates.map((d) => {
                const today = new Date()
                const target = new Date(d.date)
                const mode = d.count_mode || 'countdown'
                target.setFullYear(today.getFullYear())
                if (mode === 'countdown') {
                  if (target < today) target.setFullYear(today.getFullYear() + 1)
                } else {
                  if (target > today) target.setFullYear(today.getFullYear() - 1)
                }
                const diffMs = mode === 'countdown'
                  ? target.getTime() - today.getTime()
                  : today.getTime() - target.getTime()
                const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
                return (
                  <CountdownCard
                    key={d.id}
                    days={days}
                    title={d.title}
                    date={target.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                    photoUrls={d.photo_urls}
                    onClick={() => setSelectedDate(d)}
                    countMode={mode}
                  />
                )
              })}
              </div>
              <DanmakuBox />
            </div>
          </motion.div>
        )}

        <QuickEntryGrid />
        <PhotoStrip />
      </div>

      {selectedDate && (
        <DateDetailModal
          open={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          date={selectedDate}
          onDelete={() => { removeDate(selectedDate.id); setSelectedDate(null) }}
          onUpdate={(updates) => { updateDate(selectedDate.id, updates); setSelectedDate(null) }}
        />
      )}
    </PageTransition>
  )
}
