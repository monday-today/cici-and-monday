import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-warm-brown/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md
                   max-h-[85vh] overflow-y-auto shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-xl font-title text-warm-brown">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto w-9 h-9 rounded-full flex items-center justify-center
                       bg-warm-ivory hover:bg-warm-sand/30 transition-colors"
          >
            <X size={18} className="text-warm-taupe" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}
