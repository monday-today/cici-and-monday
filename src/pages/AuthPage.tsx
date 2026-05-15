import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { PasswordInput } from '../components/auth/PasswordInput'

export default function AuthPage() {
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
    <div className="h-full flex items-center justify-center px-6 relative" style={{ background: '#ECF0F5' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute flex items-center justify-center"
        style={{
          top: '15%',
          left: '15%',
          right: '15%',
          bottom: '15%',
        }}
      >
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat rounded-[32px] shadow-lg"
          style={{
            backgroundImage: 'url(/images/auth-bg.jpg)',
            opacity: 0.45,
          }}
        />
        <div
          className="absolute inset-0 rounded-[32px]"
          style={{ background: 'rgba(255, 255, 255, 0.5)' }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[10vw] text-warm-brown mb-1 font-title tracking-[0.3em] whitespace-nowrap">
            次次和礼拜一
          </h1>
          <p className="text-warm-taupe/70 font-body font-light tracking-[0.2em]" style={{ marginTop: '40px', marginBottom: '60px', fontSize: '40px' }}>
            这是属于我们的小世界
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <PasswordInput
            value={password}
            onChange={(v) => { setPassword(v); setError('') }}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  )
}
