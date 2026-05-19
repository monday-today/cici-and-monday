import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FloatingHearts } from '../components/welcome/FloatingHearts'
import { TitleReveal } from '../components/welcome/TitleReveal'
import { SwipeHint } from '../components/welcome/SwipeHint'

export default function WelcomePage() {
  const navigate = useNavigate()

  const handleNext = () => navigate('/home')

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden cursor-pointer"
      onClick={handleNext}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      {/* Cool blue-gray background */}
      <div
        className="absolute inset-0"
        style={{ background: '#623e2a' }}
      />

      {/* Background photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/微信图片_20260515031637_736_79.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(98,62,42,0.8), rgba(98,62,42,0.1))',
        }}
      />

      <FloatingHearts />

      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <TitleReveal />
      </div>

      <SwipeHint />
    </motion.div>
  )
}
