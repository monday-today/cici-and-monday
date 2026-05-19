import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDanmaku } from '../../hooks/useSupabase'

const LANE_TOP = [6, 24, 42, 60, 76] // % positions for each lane
const SYNC_KEY = 'danmaku-seen-ids'

function loadSeenIds(): string[] {
  try {
    const raw = localStorage.getItem(SYNC_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveSeenIds(ids: string[]) {
  try { localStorage.setItem(SYNC_KEY, JSON.stringify(ids.slice(-200))) } catch {}
}

interface DisplayMessage {
  id: string
  text: string
  top: number
  lane: number
  duration: number
  likes: number
}

export function DanmakuBox() {
  const { messages: serverMessages, addMessage, likeMessage, deleteMessage } = useDanmaku()
  const [input, setInput] = useState('')
  const [pausedId, setPausedId] = useState<string | null>(null)
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([])
  const seenIdsRef = useRef<Set<string>>(new Set(loadSeenIds()))
  const busyLanesRef = useRef<Set<number>>(new Set())

  const pickLane = useCallback(() => {
    const free = LANE_TOP.map((_, i) => i).filter(i => !busyLanesRef.current.has(i))
    if (free.length === 0) return Math.floor(Math.random() * LANE_TOP.length)
    return free[Math.floor(Math.random() * free.length)]
  }, [])

  // Sync server messages to display queue
  useEffect(() => {
    const newItems: DisplayMessage[] = []
    for (const msg of serverMessages) {
      if (!seenIdsRef.current.has(msg.id)) {
        seenIdsRef.current.add(msg.id)
        saveSeenIds([...seenIdsRef.current])
        const lane = pickLane()
        busyLanesRef.current.add(lane)
        newItems.push({
          id: msg.id,
          text: msg.text,
          top: LANE_TOP[lane],
          lane,
          duration: 12 + Math.random() * 6,
          likes: msg.likes,
        })
      }
    }
    if (newItems.length > 0) {
      setDisplayMessages((prev) => [...newItems, ...prev].slice(0, 40))
    }
  }, [serverMessages, pickLane])

  const handleSend = async () => {
    if (!input.trim()) return
    await addMessage(input.trim())
    setInput('')
  }

  const handleComplete = (id: string) => {
    setDisplayMessages((prev) => {
      const msg = prev.find((m) => m.id === id)
      if (!msg) return prev
      busyLanesRef.current.delete(msg.lane)
      const filtered = prev.filter((m) => m.id !== id)
      const lane = pickLane()
      busyLanesRef.current.add(lane)
      return [...filtered, { ...msg, top: LANE_TOP[lane], lane, duration: 12 + Math.random() * 6 }]
    })
  }

  const handleLike = async (e: React.MouseEvent | React.TouchEvent, id: string, likes: number) => {
    e.stopPropagation()
    await likeMessage(id, likes)
    setDisplayMessages((prev) => prev.map((m) => (m.id === id ? { ...m, likes: likes + 1 } : m)))
  }

  const handleDelete = async (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation()
    await deleteMessage(id)
    setDisplayMessages((prev) => {
      const msg = prev.find((m) => m.id === id)
      if (msg) busyLanesRef.current.delete(msg.lane)
      return prev.filter((m) => m.id !== id)
    })
    setPausedId(null)
  }

  const pause = (id: string) => setPausedId(id)
  const resume = () => setPausedId(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex-1 rounded-card bg-white/10 backdrop-blur-sm border border-white/10 shadow-sm overflow-hidden flex flex-col"
      style={{ height: 'clamp(90px, 24vw, 140px)' }}
    >
      <div className="flex-1 relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
        <AnimatePresence>
          {displayMessages.map((m) => {
            const paused = pausedId === m.id
            return (
              <motion.div
                key={m.id}
                className="absolute whitespace-nowrap text-white/90 font-medium cursor-pointer select-none"
                style={{
                  top: `${m.top}%`,
                  left: '100%',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(0.7rem, 2vw, 0.95rem)',
                }}
                initial={{ x: '0%' }}
                animate={paused ? { x: '0%' } : { x: `calc(-100vw - 200px)` }}
                transition={
                  paused ? { duration: 9999, ease: 'linear' }
                    : { duration: m.duration, ease: 'linear' }
                }
                onAnimationComplete={() => {
                  if (pausedId !== m.id) handleComplete(m.id)
                }}
                onMouseEnter={() => pause(m.id)}
                onMouseLeave={resume}
                onTouchStart={() => (pausedId === m.id ? resume() : pause(m.id))}
              >
                <span className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] relative">
                  {m.text}
                  <AnimatePresence>
                    {paused && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#3a2018] rounded-full px-2 py-0.5 shadow-lg z-10"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <button
                          onMouseDown={(e) => handleLike(e, m.id, m.likes)}
                          onTouchStart={(e) => handleLike(e, m.id, m.likes)}
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-400/40 flex items-center justify-center text-[10px] transition-colors"
                        >
                          <img src="https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2764.svg" alt="" className="w-4 h-4" />
                        </button>
                        <span className="text-white/70 text-[10px] font-normal min-w-[8px] text-center">
                          {m.likes > 0 ? m.likes : ''}
                        </span>
                        <button
                          onMouseDown={(e) => handleDelete(e, m.id)}
                          onTouchStart={(e) => handleDelete(e, m.id)}
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/40 flex items-center justify-center text-[10px] transition-colors"
                        >
                          ✕
                        </button>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="px-2 py-2 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="说点什么..."
          className="flex-1 min-w-0 h-7 px-2.5 rounded-full text-white/90 placeholder:text-white/30
                     border border-white/20 bg-white/10 text-xs focus:outline-none focus:border-white/40"
          style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.6rem, 1.6vw, 0.75rem)' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="shrink-0 px-2.5 h-7 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white transition-colors"
          style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.55rem, 1.4vw, 0.7rem)', fontWeight: 600 }}
        >
          发送
        </button>
      </div>
    </motion.div>
  )
}
