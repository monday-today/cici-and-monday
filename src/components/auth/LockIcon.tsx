import { motion } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'

export function LockIcon({ locked }: { locked: boolean }) {
  return (
    <motion.div
      className="flex items-center justify-center w-20 h-20 rounded-full mb-8 mx-auto"
      style={{ background: locked ? 'rgba(232,213,196,0.3)' : 'rgba(212,224,208,0.3)' }}
      animate={{ scale: locked ? 1 : [1, 1.15, 1] }}
      transition={{ duration: 0.5 }}
    >
      {locked ? (
        <Lock size={36} className="text-warm-brown/60" />
      ) : (
        <Unlock size={36} className="text-warm-brown/60" />
      )}
    </motion.div>
  )
}
