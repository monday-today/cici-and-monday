import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { ChinaMap } from '../components/travel/ChinaMap'
import { TravelDetailModal } from '../components/travel/TravelDetailModal'
import { AddTravelModal } from '../components/travel/AddTravelModal'
import { useTravels, type Travel } from '../hooks/useSupabase'
import { lookupCity } from '../lib/cityCoordinates'

export default function TravelPage() {
  const { travels, loading, addTravel, removeTravel, updateTravel } = useTravels()
  const [selected, setSelected] = useState<Travel | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const fixedRef = useRef(false)

  // Auto-fix travels with missing coordinates
  useEffect(() => {
    if (fixedRef.current || !travels || travels.length === 0) return
    const needsFix = travels.filter(t => (t.lat === 0 || t.lat == null) && t.title)
    if (needsFix.length === 0) return
    fixedRef.current = true
    needsFix.forEach(async (t) => {
      const coords = lookupCity(t.title)
      if (coords) {
        await updateTravel(t.id, { lat: coords[0], lng: coords[1] })
      }
    })
  }, [travels, updateTravel])

  const sorted = [...(travels || [])].sort(
    (a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()
  )

  return (
    <PageTransition>
      <BottomNav />
      <div style={{ padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)', paddingBottom: '5rem' }}>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <img src="https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F30D.svg" alt="" className="w-6 h-6" />
            <h1 className="font-title text-white tracking-wider" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>旅行地图</h1>
          </div>
          <p className="text-white/30 text-[10px] tracking-[0.2em] mt-0.5 ml-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>OUR JOURNEYS</p>
        </div>

        {/* China Map */}
        {!loading && (
          <div className="mb-8">
            <ChinaMap
              travels={travels || []}
              onSelect={setSelected}
            />
          </div>
        )}

        {/* Travel cards */}
        {loading ? null : !travels || travels.length === 0 ? (
          <EmptyState icon="1F30D" message="还没有旅行记录，点击下方按钮添加吧" />
        ) : (
          <div className="space-y-3">
            {sorted.map((t) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(t)}
                className="w-full text-left rounded-card bg-white/10 backdrop-blur-sm border border-white/10 shadow-sm hover:bg-white/15 transition-all flex items-center gap-4 group"
                style={{ padding: 'clamp(0.5rem, 2vw, 1rem)' }}
              >
                {t.image_urls.length > 0 ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img src={t.image_urls[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-white/5">
                    <MapPin size={22} className="text-white/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">{t.title}</h3>
                  <p className="text-xs text-white/40 font-light mt-0.5">
                    {new Date(t.visit_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {t.story && (
                    <p className="text-xs text-white/30 font-light mt-1.5 line-clamp-1">{t.story}</p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' }}
          >
            <Plus size={22} className="text-white" />
          </motion.button>
        </div>
      </div>

      <TravelDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        travel={selected}
        onDelete={async () => {
          if (selected) {
            await removeTravel(selected.id)
            setSelected(null)
          }
        }}
        onUpdate={(id, updates) => {
          updateTravel(id, updates)
          setSelected(null)
        }}
      />

      <AddTravelModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (item) => {
          await addTravel(item as Record<string, unknown>)
          setShowAdd(false)
        }}
      />
    </PageTransition>
  )
}
