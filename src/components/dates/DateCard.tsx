import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Pin } from 'lucide-react'
import type { ImportantDate } from '../../hooks/useSupabase'
import { DateDetailModal } from './DateDetailModal'

interface Props {
  date: ImportantDate
  onDelete: () => void
  onUpdate: (id: string, updates: Record<string, unknown>) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
}

export function DateCard({ date, onDelete, onUpdate, onMoveUp, onMoveDown, isFirst, isLast }: Props) {
  const [showDetail, setShowDetail] = useState(false)

  const today = new Date()
  const target = new Date(date.date)
  const mode = date.count_mode || 'countdown'
  target.setFullYear(today.getFullYear())
  if (mode === 'countdown') {
    if (target < today) target.setFullYear(today.getFullYear() + 1)
  } else {
    if (target > today) target.setFullYear(today.getFullYear() - 1)
  }
  const diffMs = mode === 'countdown'
    ? target.getTime() - today.getTime()
    : today.getTime() - target.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const label = days === 0 ? '就是今天！' : mode === 'countdown' ? `还有 ${days} 天` : `已经 ${days} 天`

  const photos: string[] = (() => {
    try { return JSON.parse(date.photo_urls || '[]') }
    catch { return [] }
  })()

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) }
    catch { return d }
  }

  const toggleHome = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdate(date.id, { show_on_home: !date.show_on_home })
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-card bg-white/10 backdrop-blur-sm border border-white/10 shadow-sm cursor-pointer relative group"
        whileHover={{ scale: 1.01 }}
        onClick={() => setShowDetail(true)}
      >
        {/* Order controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-0.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp?.() }}
            disabled={isFirst}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center disabled:opacity-20 transition-all"
          >
            <ChevronUp size={12} className="text-white/70" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown?.() }}
            disabled={isLast}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center disabled:opacity-20 transition-all"
          >
            <ChevronDown size={12} className="text-white/70" />
          </button>
        </div>

        {/* Pin toggle */}
        <button
          onClick={toggleHome}
          className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            date.show_on_home !== false
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/20 hover:bg-white/15'
          }`}
          title={date.show_on_home !== false ? '已在首页展示' : '点击在首页展示'}
        >
          <Pin size={11} className={date.show_on_home !== false ? 'fill-white/30' : ''} />
        </button>

        <div className="flex" style={{ maxWidth: '480px' }}>
          {/* Left: info */}
          <div className="w-[55%] shrink-0 py-4 px-4 flex flex-col justify-center items-center text-center overflow-hidden">
            <h3 className="font-semibold text-white leading-snug break-words" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(0.9rem, 2.6vw, 1.2rem)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {date.title}
            </h3>
            <p className="text-white/35 text-xs mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {fmtDate(date.date)}
            </p>
            <p className="font-semibold text-white/70 mt-1.5" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
              {label}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/40 mt-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {date.type === 'birthday' ? '生日' : '纪念日'}
            </span>
            {date.notes && (
              <p className="text-white/40 text-[11px] mt-2 line-clamp-2 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {date.notes}
              </p>
            )}
          </div>

          {/* Right: photos at original size */}
          {photos.length > 0 && (
            <div className="flex-1 flex flex-col gap-1 p-2 overflow-hidden">
              {photos.map((url, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-white/10" style={{ width: 'clamp(80px, 28vw, 140px)' }}>
                  <img src={url} alt="" className="w-full h-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <DateDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        date={date}
        onDelete={() => { onDelete(); setShowDetail(false) }}
        onUpdate={(updates) => { onUpdate(date.id, updates); setShowDetail(false) }}
      />
    </>
  )
}
