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
      <div
        className="absolute inset-0"
        style={{ background: '#E4ECF2' }}
      />
      <div
        className="absolute"
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
            backgroundImage: 'url(/images/微信图片_20260515031637_736_79.jpg)',
            opacity: 0.3,
          }}
        />
      </div>

      <FloatingHearts />

      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <TitleReveal />
      </div>

      <SwipeHint />
    </motion.div>
  )
}
