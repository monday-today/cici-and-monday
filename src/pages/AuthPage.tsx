import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth'

export default function AuthPage() {
  const [showInput, setShowInput] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!password || loading) return
    setLoading(true)
    setError('')
    const result = await login(password)
    setLoading(false)
    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error ?? '验证失败')
      setPassword('')
    }
  }

  return (
    <div className="h-full relative overflow-hidden" style={{ background: '#623e2a' }}>
      {/* Background image with 20% opacity and sketch-fill entrance */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/auth-cover.jpg)`,
          opacity: 0.2,
        }}
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: 'inset(0% 0 0 0)' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Gradient fade to solid background at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 70%, #623e2a 100%)',
        }}
      />

      {/* ── Single layout, title always visible ── */}
      <div className="relative z-10 h-full flex flex-col items-center px-6">
        {/* spacer: pushes WELCOME TO to ~25% from top */}
        <div className="flex-1" />

        <motion.p
          className="tracking-[0.3em]"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(12px, 2vw, 14px)',
            color: 'rgba(255,255,255,0.9)',
          }}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          WELCOME TO
        </motion.p>

        {/* spacer: pushes middle content to ~50% */}
        <div className="flex-1" />

        <div className="flex flex-col items-center">
          <motion.h1
            className="leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(52px, 12vw, 106px)',
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            CICI&amp;MONDAY&apos;S
          </motion.h1>

          <motion.p
            className="leading-none mt-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px, 5vw, 40px)',
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            LOVE STORY
          </motion.p>

        </div>

        {/* spacer + password input: centers between LOVE STORY and ENTER */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence>
            {showInput && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="输入密码"
                  className="w-[260px] h-11 px-4 rounded-full text-center text-white placeholder:text-white/50
                             border-2 border-white/50 bg-white/20
                             focus:outline-none focus:border-white/70 focus:bg-white/25
                             transition-all duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(14px, 3vw, 22px)' }}
                  autoFocus
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm mt-3 font-light"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ENTER button always visible */}
        <motion.button
          className="px-10 py-3 rounded-full border-2 border-white/80 text-white tracking-[0.25em]"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(18px, 4vw, 32px)',
            background: 'transparent',
          }}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          whileHover={{ background: 'rgba(255,255,255,0.12)', scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (showInput) {
              handleSubmit()
            } else {
              setShowInput(true)
            }
          }}
          disabled={showInput && (!password || loading)}
        >
          {showInput && loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'ENTER'
          )}
        </motion.button>

        {/* spacer: remaining space at bottom */}
        <div className="flex-1" />
      </div>
    </div>
  )
}
