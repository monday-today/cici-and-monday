import { motion } from 'framer-motion'

export function GreetingCard() {
  const hour = new Date().getHours()
  const greeting = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
  const emoji = hour < 6 ? '🌙' : hour < 12 ? '☀️' : hour < 14 ? '🌸' : hour < 18 ? '🍃' : '✨'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card bg-white p-6 border border-warm-sand/20 shadow-sm"
    >
      <p className="mb-2" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>{emoji}</p>
      <h2 className="font-title text-warm-brown" style={{ fontSize: 'clamp(1.25rem, 5vw, 2rem)' }}>
        {greeting}，我最爱的宝宝
      </h2>
      <p className="text-warm-taupe/60 font-light mt-2" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)' }}>
        {new Date().toLocaleDateString('zh-CN', {
          year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
        })}
      </p>
    </motion.div>
  )
}
