import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { QuickEntryGrid } from '../components/home/QuickEntryGrid'
import { PhotoMarquee } from '../components/home/PhotoMarquee'
import { CountdownCard } from '../components/ui/CountdownCard'
import { useImportantDates } from '../hooks/useSupabase'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { dates, loading } = useImportantDates()

  const upcomingDates = [...(dates || [])]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(d => {
      const now = new Date()
      const target = new Date(d.date)
      target.setFullYear(now.getFullYear())
      if (target < now) target.setFullYear(now.getFullYear() + 1)
      return true
    })
    .slice(0, 3)

  return (
    <PageTransition>
      <BottomNav />
      <div className="space-y-6" style={{ padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)', paddingBottom: '6rem' }}>
        <div className="flex gap-3 items-center" style={{ height: 'clamp(90px, 24vw, 140px)' }}>
          <div className="shrink-0" style={{ width: 'clamp(140px, 38vw, 200px)' }}>
            {(() => {
              const hour = new Date().getHours()
              const greeting = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
              const emoji = hour < 6 ? '🌙' : hour < 12 ? '☀️' : hour < 14 ? '🌸' : hour < 18 ? '🍃' : '✨'
              return (
                <div className="h-full flex flex-col justify-center">
                  <p style={{ fontSize: 'clamp(1.5rem, 7vw, 2.5rem)' }}>{emoji}</p>
                  <h2 className="font-title text-warm-brown whitespace-nowrap" style={{ fontSize: 'clamp(0.85rem, 3.5vw, 1.3rem)' }}>
                    {greeting}，我最爱的宝宝
                  </h2>
                  <p className="text-warm-taupe/50 font-light mt-1 whitespace-nowrap" style={{ fontSize: 'clamp(0.55rem, 2vw, 0.75rem)' }}>
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
            <p className="text-sm text-warm-taupe font-light mb-3 pl-1">我们的纪念日</p>
            <div className="flex flex-wrap gap-3">
              {upcomingDates.map((d) => {
                const today = new Date()
                const target = new Date(d.date)
                target.setFullYear(today.getFullYear())
                if (target < today) target.setFullYear(today.getFullYear() + 1)
                const days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <CountdownCard
                    key={d.id}
                    days={days}
                    title={d.title}
                    date={target.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                  />
                )
              })}
            </div>
          </motion.div>
        )}

        <QuickEntryGrid />
      </div>
    </PageTransition>
  )
}
