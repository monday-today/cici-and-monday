import { motion } from 'framer-motion'

const chars = '宝宝520快乐！'.split('')

const charVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5,
    },
  },
}

export function TitleReveal() {
  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="font-title tracking-[0.15em] select-none"
      style={{ fontSize: 'clamp(48px, 10vw, 72px)', color: '#FFFFFF' }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          className="inline-block"
          style={{ textShadow: '0 2px 12px rgba(255,255,255,0.12)' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  )
}
