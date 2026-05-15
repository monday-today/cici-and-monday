import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { TravelStoryModal } from '../components/travel/TravelStoryModal'
import { AddTravelModal } from '../components/travel/AddTravelModal'
import { useTravels, type Travel } from '../hooks/useSupabase'

export default function TravelPage() {
  const { travels, loading, addTravel, removeTravel } = useTravels()
  const [selected, setSelected] = useState<Travel | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <PageTransition>
      <BottomNav />
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-title text-warm-brown">旅行地图</h1>
          <p className="text-sm text-warm-taupe/60 font-light mt-1">一起走过的世界</p>
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

      <div className="px-5 pb-6">
        {loading ? null : !travels || travels.length === 0 ? (
          <EmptyState icon="🌍" message="还没有旅行记录，点击右上角添加吧" />
        ) : (
          <div className="space-y-3">
            {travels.map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(t)}
                className="w-full text-left rounded-card p-4 border border-warm-sand/20
                           bg-white/60 backdrop-blur-sm hover:bg-white/90
                           transition-all duration-300 flex items-center gap-4 group"
              >
                {t.image_urls.length > 0 ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                    <img src={t.image_urls[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                       style={{ background: 'linear-gradient(135deg, #F2D0C440, #E8D5C440)' }}>
                    <MapPin size={22} className="text-warm-taupe/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-warm-brown">{t.title}</h3>
                  <p className="text-xs text-warm-taupe/50 font-light mt-0.5">
                    {new Date(t.visit_date).toLocaleDateString('zh-CN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  {t.story && (
                    <p className="text-xs text-warm-taupe/40 font-light mt-1.5 line-clamp-1">
                      {t.story}
                    </p>
                  )}
                </div>
                {(t.image_urls.length > 1) && (
                  <span className="text-[10px] text-warm-taupe/40 font-light shrink-0">
                    +{t.image_urls.length - 1}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <TravelStoryModal
        travel={selected}
        onClose={() => setSelected(null)}
        onDelete={async () => {
          if (selected) {
            await removeTravel(selected.id)
            setSelected(null)
          }
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
