import { motion } from 'framer-motion'
import { Check, Trash2 } from 'lucide-react'
import type { Wish } from '../../hooks/useSupabase'

interface Props {
  wish: Wish
  onToggle: () => void
  onDelete: () => void
}

export function WishCard({ wish, onToggle, onDelete }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-card p-4 flex items-center gap-3 group transition-all border
                  ${wish.completed
                    ? 'bg-warm-ivory/50 border-warm-sand/10'
                    : 'bg-white border-warm-sand/20 shadow-sm'}`}
    >
      <button
        onClick={onToggle}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0
                   transition-all ${wish.completed
                     ? 'bg-soft-sage border-soft-sage'
                     : 'border-warm-sand/40 hover:border-soft-sage'}`}
      >
        {wish.completed && <Check size={14} className="text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${wish.completed ? 'text-warm-taupe/40 line-through' : 'text-warm-brown font-medium'}`}>
          {wish.title}
        </p>
        {wish.description && (
          <p className={`text-xs mt-0.5 font-light ${wish.completed ? 'text-warm-taupe/30' : 'text-warm-taupe/50'}`}>
            {wish.description}
          </p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0
                   w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50"
      >
        <Trash2 size={12} className="text-red-300" />
      </button>
    </motion.div>
  )
}
