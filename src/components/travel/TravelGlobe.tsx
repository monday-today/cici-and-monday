import { useState, useRef, useCallback } from 'react'
import type { Travel } from '../../hooks/useSupabase'

interface Props {
  travels: Travel[]
  onSelect: (travel: Travel) => void
}

function latLngToXY(lat: number, lng: number, w: number, h: number) {
  const x = ((lng + 180) / 360) * w
  const rad = (lat * Math.PI) / 180
  const merc = Math.log(Math.tan(Math.PI / 4 + rad / 2))
  const y = h / 2 - (merc / (2 * Math.PI)) * h
  return { x, y }
}

export function TravelGlobe({ travels, onSelect }: Props) {
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const filtered = travels.filter(t => t.lat && t.lng)

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => Math.min(5, Math.max(1, s - e.deltaY * 0.001)))
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setPos(p => ({ x: p.x + dx, y: p.y + dy }))
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing relative"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full min-w-[600px] min-h-[300px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect width="1200" height="600" fill="#623e2a" rx="8" />
          <g fill="rgba(255,255,255,0.12)" opacity="0.7">
            {/* Simplified continent shapes */}
            {/* North America */}
            <path d="M150 80 Q250 40 350 50 Q400 60 380 120 Q350 200 300 250 Q250 300 200 280 Q120 250 100 180 Q80 120 150 80Z" />
            {/* South America */}
            <path d="M280 300 Q320 280 340 320 Q360 400 320 500 Q280 550 260 480 Q240 400 280 300Z" />
            {/* Europe */}
            <path d="M520 60 Q600 30 680 50 Q720 80 700 130 Q680 180 620 180 Q560 170 520 120 Q500 90 520 60Z" />
            {/* Africa */}
            <path d="M550 180 Q620 160 680 190 Q700 250 680 380 Q640 500 580 520 Q540 480 530 380 Q520 250 550 180Z" />
            {/* Asia */}
            <path d="M700 40 Q850 10 1000 30 Q1100 60 1120 120 Q1140 200 1080 250 Q1000 280 900 240 Q800 200 750 150 Q700 100 700 40Z" />
            {/* Southeast Asia / Indonesia */}
            <ellipse cx="900" cy="280" rx="60" ry="15" />
            <ellipse cx="960" cy="300" rx="80" ry="12" />
            <ellipse cx="1020" cy="310" rx="50" ry="10" />
            {/* Australia */}
            <path d="M960 380 Q1020 360 1080 380 Q1100 420 1060 460 Q1000 480 960 440 Q940 400 960 380Z" />
            {/* Japan */}
            <ellipse cx="1100" cy="160" rx="8" ry="25" />
            {/* UK */}
            <ellipse cx="510" cy="90" rx="10" ry="15" />
          </g>
        </svg>

        {filtered.map(t => {
          const { x, y } = latLngToXY(t.lat, t.lng, 1200, 600)
          return (
            <div
              key={t.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${(x / 1200) * 100}%`,
                top: `${(y / 600) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(t)
              }}
            >
              <div className="w-4 h-4 rounded-full bg-blush-pink border-2 border-white shadow-md
                             group-hover:scale-150 transition-transform" />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap
                             bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px]
                             text-warm-brown font-medium opacity-0 group-hover:opacity-100
                             transition-opacity shadow-sm">
                {t.title}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
