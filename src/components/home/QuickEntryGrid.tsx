import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Globe, BookOpen, Image, Heart, ListTodo } from 'lucide-react'

const entries = [
  { path: '/dates', icon: Calendar, label: '纪念日', color: '#C8D8EA', desc: 'Our Days' },
  { path: '/memories', icon: BookOpen, label: '回忆墙', color: '#B8CCE0', desc: 'Our Story' },
  { path: '/travel', icon: Globe, label: '旅行地图', color: '#C0D4E0', desc: 'Our Journeys' },
  { path: '/diary', icon: Heart, label: '日记', color: '#C8D8EA', desc: 'Dear Diary' },
  { path: '/album', icon: Image, label: '相册', color: '#B8CCE0', desc: 'Moments' },
  { path: '/wishes', icon: ListTodo, label: '心愿清单', color: '#C0D4E0', desc: 'Wishlist' },
]

export function QuickEntryGrid() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-warm-taupe font-light mb-3 pl-1" style={{ fontSize: 'clamp(0.7rem, 2.2vw, 0.9rem)' }}>快速入口</p>
      <div className="grid grid-cols-2 gap-2.5">
        {entries.map((entry) => (
          <motion.button
            key={entry.path}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(entry.path)}
            className="rounded-card bg-white border border-warm-sand/20 shadow-sm
                       text-left flex items-center gap-3 transition-all"
            style={{ padding: 'clamp(0.6rem, 2.5vw, 1.2rem)' }}
          >
            <div
              className="rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: entry.color + '60', width: 'clamp(2rem, 8vw, 2.75rem)', height: 'clamp(2rem, 8vw, 2.75rem)' }}
            >
              <entry.icon size={18} className="text-warm-brown/70" />
            </div>
            <div>
              <p className="font-medium text-warm-brown" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)' }}>{entry.label}</p>
              <p className="text-warm-taupe/50 font-light" style={{ fontSize: 'clamp(0.6rem, 2vw, 0.8rem)' }}>{entry.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
