import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { Memory } from '../../hooks/useSupabase'

interface Props {
  memory: Memory
  onDelete: () => void
  compact?: boolean
}

export function MemoryCard({ memory, onDelete, compact }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-card bg-white border border-warm-sand/20 shadow-sm group
                  ${compact ? 'p-3' : 'p-5'}`}
    >
      {memory.image_urls.length > 0 && (
        <div className={`${compact ? 'mb-2' : 'mb-4'} -mx-3 -mt-3 overflow-hidden rounded-t-card`}>
          <img
            src={memory.image_urls[0]}
            alt=""
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-warm-brown ${compact ? 'text-sm' : 'text-base'}`}>
            {memory.title}
          </h3>
          {memory.content && (
            <p className={`text-warm-taupe/60 font-light mt-1 ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>
              {memory.content}
            </p>
          )}
          <p className="text-xs text-warm-taupe/40 font-light mt-2">
            {new Date(memory.memory_date).toLocaleDateString('zh-CN', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0
                     w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50"
        >
          <Trash2 size={12} className="text-red-300" />
        </button>
      </div>
    </motion.div>
  )
}
