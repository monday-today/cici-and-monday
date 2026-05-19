import { motion } from 'framer-motion'

interface Props {
  days: number
  title: string
  date: string
  photoUrls?: string
  onClick?: () => void
  countMode?: 'countdown' | 'anniversary'
}

export function CountdownCard({ days, title, date, photoUrls, onClick, countMode }: Props) {
  const mode = countMode || 'countdown'
  const label = days === 0 ? '就是今天！' : mode === 'countdown' ? `还有 ${days} 天` : `已经 ${days} 天`

  const photos: string[] = (() => {
    try { return JSON.parse(photoUrls || '[]') }
    catch { return [] }
  })()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-card bg-white/10 backdrop-blur-sm shadow-sm border border-white/10 cursor-pointer"
      style={{ width: 'clamp(90px, 24vw, 140px)', height: 'clamp(90px, 24vw, 140px)' }}
    >
      {/* Photo as background */}
      {photos.length > 0 && (
        <img
          src={photos[0]}
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}

      {/* White translucent overlay */}
      {photos.length > 0 && (
        <div className="absolute inset-0 bg-white/30" />
      )}

      {/* Text on top */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-2 py-3">
        <p className="text-warm-taupe font-light mb-0.5" style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.75rem)' }}>{title}</p>
        <p className="font-semibold text-warm-brown" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)' }}>{label}</p>
        <p className="text-warm-taupe/60 mt-1 font-light" style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)' }}>{date}</p>
      </div>
    </motion.div>
  )
}
