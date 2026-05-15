import { motion } from 'framer-motion'

interface Props {
  days: number
  title: string
  date: string
}

export function CountdownCard({ days, title, date }: Props) {
  const label = days === 0 ? '就是今天！' : days > 0 ? `还有 ${days} 天` : `已过去 ${Math.abs(days)} 天`

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-card bg-white p-3 shadow-sm
                 border border-warm-sand/20 flex flex-col justify-center"
      style={{ width: 'clamp(90px, 24vw, 140px)', height: 'clamp(90px, 24vw, 140px)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1"
           style={{ background: 'linear-gradient(90deg, #C8D8EA, #B8CCE0, #C0D4E0)' }} />
      <p className="text-warm-taupe font-light mb-1" style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)' }}>{title}</p>
      <p className="font-display font-semibold text-warm-brown" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.5rem)' }}>{label}</p>
      <p className="text-warm-taupe/60 mt-2 font-light" style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)' }}>{date}</p>
    </motion.div>
  )
}
