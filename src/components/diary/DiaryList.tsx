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
                className="rounded-card bg-white/10 backdrop-blur-sm p-4 border border-white/10 shadow-sm group cursor-pointer hover:bg-white/[0.14] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {moodIcons[entry.mood] && <img src={`${CDN}/${moodIcons[entry.mood]}.svg`} alt="" className="w-5 h-5" />}
                      <h3 className="text-sm font-medium text-warm-brown">{entry.title}</h3>
                    </div>
                    <p className="text-sm text-warm-brown/70 font-light whitespace-pre-wrap line-clamp-3 overflow-hidden break-words">
                      {entry.content}
                    </p>
                    {entry.image_urls.length > 0 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto">
                        {entry.image_urls.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-warm-taupe/40 font-light mt-2">
                      {new Date(entry.entry_date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(entry) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0
                                 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10"
                    >
                      <Pencil size={12} className="text-white/50" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0
                                 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50"
                    >
                      <Trash2 size={12} className="text-red-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
