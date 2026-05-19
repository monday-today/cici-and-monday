import { motion } from 'framer-motion'
import { Trash2, Pencil } from 'lucide-react'
import type { DiaryEntry } from '../../hooks/useSupabase'

const CDN = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg'
const moodIcons: Record<string, string> = {
  happy: '1F60A', love: '1F495', calm: '1F60C', miss: '1F97A', grateful: '1F64F', excited: '1F389',
}

interface Props {
  entries: DiaryEntry[]
  onDelete: (id: string) => void
  onEdit: (entry: DiaryEntry) => void
  onView: (entry: DiaryEntry) => void
}

export function DiaryList({ entries, onDelete, onEdit, onView }: Props) {
  const grouped = entries.reduce<Record<string, DiaryEntry[]>>((acc, entry) => {
    const month = new Date(entry.entry_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
    if (!acc[month]) acc[month] = []
    acc[month].push(entry)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month}>
          <p className="text-sm text-warm-taupe/50 font-light mb-3 pl-1">{month}</p>
          <div className="space-y-3">
            {items.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onView(entry)}
                className="rounded-card bg-white/10 backdrop-blur-sm p-4 border border-white/10 shadow-sm cursor-pointer hover:bg-white/[0.14] transition-colors"
              >
                <div className="flex gap-3">
                  {/* Left: text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {moodIcons[entry.mood] && <img src={`${CDN}/${moodIcons[entry.mood]}.svg`} alt="" className="w-5 h-5" />}
                      <h3 className="text-sm font-medium text-warm-brown">{entry.title}</h3>
                    </div>
                    <p className="text-sm text-warm-brown/70 font-light whitespace-pre-wrap break-words">
                      {entry.content}
                    </p>
                    <p className="text-xs text-warm-taupe/40 font-light mt-2">
                      {new Date(entry.entry_date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                  </div>
                  {/* Right: photos — same height as text, keep original ratio */}
                  {entry.image_urls.length > 0 && (
                    <div
                      className="shrink-0 grid gap-2 min-h-0"
                      style={{
                        maxWidth: '30%',
                        gridTemplateRows: `repeat(${entry.image_urls.length}, 1fr)`,
                      }}
                    >
                      {entry.image_urls.map((url, i) => (
                        <div key={i} className="min-h-0">
                          <img src={url} alt="" className="w-full h-full rounded-xl object-contain" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Bottom action buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(entry) }}
                    className="flex-1 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Pencil size={11} />
                    编辑
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }}
                    className="flex-1 h-8 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-300/70 text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={11} />
                    删除
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
