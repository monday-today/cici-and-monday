import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { WishCard } from '../components/wishes/WishCard'
import { AddWishModal } from '../components/wishes/AddWishModal'
import { useWishes } from '../hooks/useSupabase'

export default function WishesPage() {
  const { wishes, loading, addWish, removeWish, updateWish } = useWishes()
  const [showAdd, setShowAdd] = useState(false)

  const pending = (wishes || []).filter(w => !w.completed)
  const done = (wishes || []).filter(w => w.completed)

  return (
    <PageTransition>
      <BottomNav />
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-title text-warm-brown">心愿清单</h1>
          <p className="text-sm text-warm-taupe/60 font-light mt-1">想和你一起做的事</p>
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

      <div className="px-5 space-y-4">
        {loading ? null : !wishes || wishes.length === 0 ? (
          <EmptyState icon="✨" message="还没有心愿，一起写下你们的愿望吧" />
        ) : (
          <>
            {pending.length > 0 && (
              <div>
                <p className="text-xs text-warm-taupe/50 font-light mb-2 pl-1">
                  进行中 ({pending.length})
                </p>
                <div className="space-y-2">
                  {pending.map((w) => (
                    <WishCard
                      key={w.id}
                      wish={w}
                      onToggle={() => updateWish(w.id, { completed: true, completed_at: new Date().toISOString() })}
                      onDelete={() => removeWish(w.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            {done.length > 0 && (
              <div>
                <p className="text-xs text-warm-taupe/50 font-light mb-2 pl-1">
                  已完成 ({done.length})
                </p>
                <div className="space-y-2">
                  {done.map((w) => (
                    <WishCard
                      key={w.id}
                      wish={w}
                      onToggle={() => updateWish(w.id, { completed: false, completed_at: null })}
                      onDelete={() => removeWish(w.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddWishModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (item) => {
          await addWish(item as Record<string, unknown>)
          setShowAdd(false)
        }}
      />
    </PageTransition>
  )
}
