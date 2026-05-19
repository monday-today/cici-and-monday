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
  shape: number
}

const heartPaths = [
  // Classic heart
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  // Rounded chubby heart
  'M12 22C12 22 21 14.5 21 8.5C21 5.5 18.5 3 15.5 3C13.5 3 12 4.5 12 6.5C12 4.5 10.5 3 8.5 3C5.5 3 3 5.5 3 8.5C3 14.5 12 22 12 22Z',
  // Slim elegant heart
  'M12 22C12 22 22 14 22 7.5C22 4.5 19.5 2 16.5 2C14.5 2 12.8 3.5 12 5.5C11.2 3.5 9.5 2 7.5 2C4.5 2 2 4.5 2 7.5C2 14 12 22 12 22Z',
]

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const items: Heart[] = Array.from({ length: 40 }, (_, i) => {
      const angle = (Math.random() - 0.5) * 100
      const distance = window.innerHeight * (0.5 + Math.random() * 0.6)
      const driftX = Math.sin((angle * Math.PI) / 180) * distance
      return {
        id: i,
        startX: 40 + Math.random() * 20,
        driftX,
        size: 18 + Math.random() * 36,
        duration: 3.5 + Math.random() * 5,
        delay: Math.random() * 4,
        opacity: 0.15 + Math.random() * 0.45,
        shape: Math.floor(Math.random() * heartPaths.length),
      }
    })
    setHearts(items)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.startX}%`,
            bottom: '-40px',
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: [0, -(window.innerHeight * 0.8 + Math.random() * window.innerHeight * 0.3)],
            x: [0, h.driftX],
            opacity: [0, h.opacity, h.opacity, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,0.15)"
            style={{ opacity: h.opacity }}
          >
            <path d={heartPaths[h.shape]} />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
