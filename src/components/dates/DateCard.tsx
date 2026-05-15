import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { ImportantDate } from '../../hooks/useSupabase'

interface Props {
  date: ImportantDate
  onDelete: () => void
}

export function DateCard({ date, onDelete }: Props) {
  const today = new Date()
  const target = new Date(date.date)
  target.setFullYear(today.getFullYear())
  if (target < today) target.setFullYear(today.getFullYear() + 1)
  const days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const label = days === 0 ? '就是今天！' : `还有 ${days} 天`
  const emoji = date.type === 'birthday' ? '🎂' : '💕'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="rounded-card bg-white p-5 border border-warm-sand/20 shadow-sm
                 flex items-center gap-4 group"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
           style={{ background: date.type === 'birthday' ? '#C8D8EA60' : '#C0D4E060' }}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-warm-brown">{date.title}</p>
        <p className="text-xs text-warm-taupe/60 font-light mt-0.5">
          {new Date(date.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-display font-semibold text-warm-brown">{label}</p>
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0
                   w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50"
      >
        <Trash2 size={14} className="text-red-300" />
      </button>
    </motion.div>
  )
}
