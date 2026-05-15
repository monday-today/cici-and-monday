import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Heart {
  id: number
  startX: number
  driftX: number
  size: number
  duration: number
  delay: number
  opacity: number
  rotation: number
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const h = window.innerHeight
    const items: Heart[] = Array.from({ length: 30 }, (_, i) => {
      const angle = (Math.random() - 0.5) * 120
      const distance = h * (0.6 + Math.random() * 0.8)
      const driftX = Math.sin((angle * Math.PI) / 180) * distance
      return {
        id: i,
        startX: 45 + Math.random() * 10,
        driftX,
        size: 35 + Math.random() * 55,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.2,
        rotation: 180 + Math.random() * 360,
      }
    })
    setHearts(items)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.startX}%`,
            bottom: '0%',
            fontSize: h.size,
            opacity: 0,
            color: '#E2C8D4',
          }}
          animate={{
            y: [0, -(window.innerHeight * 0.7 + Math.random() * window.innerHeight * 0.4)],
            x: [0, h.driftX],
            rotate: [0, h.rotation],
            opacity: [0, h.opacity, h.opacity, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          ❤
        </motion.div>
      ))}
    </div>
  )
}
