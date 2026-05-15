import { motion } from 'framer-motion'

const title = '宝宝520快乐！'

const charVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5 + i * 0.12,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

export function TitleReveal() {
  return (
    <h1 className="text-[10vw] text-warm-ivory font-title tracking-[0.15em] select-none">
      {title.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={charVariants}
          initial="hidden"
          animate="visible"
          className="inline-block drop-shadow-[0_2px_8px_rgba(92,74,61,0.3)]"
        >
          {char}
        </motion.span>
      ))}
    </h1>
  )
}
