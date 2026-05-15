import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export function SwipeHint() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <ChevronUp size={20} className="text-warm-ivory/70" />
      <motion.p
        className="text-warm-ivory/50 font-body font-light"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '10px' }}
      >
        向上滑动 或 点击进入
      </motion.p>
    </motion.div>
  )
}
