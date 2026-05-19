import { MemoryCard } from './MemoryCard'
import type { Memory } from '../../hooks/useSupabase'

interface Props {
  memories: Memory[]
  onDelete: (id: string) => void
}

export function TimelineView({ memories, onDelete }: Props) {
  const sorted = [...memories].sort(
    (a, b) => new Date(b.memory_date).getTime() - new Date(a.memory_date).getTime()
  )

  return (
    <div className="relative pl-8">
      <div className="absolute left-[13px] top-0 bottom-0 w-px bg-warm-sand/40" />
      <div className="space-y-5">
        {sorted.map((m) => (
          <div key={m.id} className="relative">
            <div
              className="absolute -left-[21px] top-4 w-[17px] h-[17px] rounded-full border-2 border-white/20 bg-[#4a3020]"
            />
            <MemoryCard memory={m} onDelete={() => onDelete(m.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
