import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Calendar } from 'lucide-react'

const tabs = [
  { path: '/home', icon: Home, label: '首页' },
  { path: '/dates', icon: Calendar, label: '纪念日' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg
                     border-t border-divider">
      <div className="flex items-center justify-around w-full px-4" style={{ height: 'clamp(3.5rem, 10vh, 5rem)' }}>
        {tabs.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 py-1"
            >
              <tab.icon
                size={20}
                className={active ? 'text-warm-brown' : 'text-warm-taupe/50'}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`font-medium ${active ? 'text-warm-brown' : 'text-warm-taupe/50'}`} style={{ fontSize: 'clamp(0.55rem, 1.6vw, 0.7rem)' }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
