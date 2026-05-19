import { useState } from 'react'
import { motion } from 'framer-motion'

const PHOTOS = Array.from({ length: 9 }, (_, i) => `${import.meta.env.BASE_URL}images/zhaopian/${i + 1}.webp`)

export function PhotoStrip() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div
        className="flex justify-between overflow-x-auto pb-2"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {PHOTOS.map((src, i) => (
          <motion.div
            key={i}
            className="shrink-0 rounded-xl overflow-hidden border border-white/10"
            style={{
              width: 'clamp(90px, 28vw, 140px)',
              height: 'clamp(120px, 38vw, 180px)',
              scrollSnapAlign: 'start',
            }}
            animate={activeIdx === i ? { rotate: [0, -4, 4, -4, 4, -2, 2, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onTouchStart={() => setActiveIdx(i)}
            onTouchEnd={() => setActiveIdx(null)}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
