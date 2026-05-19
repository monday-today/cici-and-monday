import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const CDN = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg'

const entries = [
  { path: '/dates', icon: '1F4C5', label: '纪念日', color: '#C8D8EA', desc: 'Our Days' },
  { path: '/food', icon: '1F372', label: '食记', color: '#B8CCE0', desc: 'Foodie' },
  { path: '/travel', icon: '1F30D', label: '旅行地图', color: '#C0D4E0', desc: 'Our Journeys' },
  { path: '/diary', icon: '1F4D4', label: '日记', color: '#C8D8EA', desc: 'Dear Diary' },
  { path: '/album', icon: '1F4F7', label: '相册', color: '#B8CCE0', desc: 'Moments' },
  { path: '/timeline', icon: '1F570', label: '时间线', color: '#C0D4E0', desc: 'Timeline' },
]

export function QuickEntryGrid() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="grid grid-cols-2 gap-2.5">
        {entries.map((entry) => (
          <motion.button
            key={entry.path}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(entry.path)}
            className="rounded-card bg-white/10 backdrop-blur-sm border border-white/10 shadow-sm
                       text-left flex items-center gap-3 transition-all"
            style={{ padding: 'clamp(0.6rem, 2.5vw, 1.2rem)' }}
          >
            <div
              className="rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: entry.color + '60', width: 'clamp(2rem, 8vw, 2.75rem)', height: 'clamp(2rem, 8vw, 2.75rem)' }}
            >
              <img src={`${CDN}/${entry.icon}.svg`} alt="" style={{ width: 'clamp(1.1rem, 4vw, 1.5rem)', height: 'clamp(1.1rem, 4vw, 1.5rem)' }} />
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
