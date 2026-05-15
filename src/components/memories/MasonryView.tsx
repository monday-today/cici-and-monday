import { MemoryCard } from './MemoryCard'
import type { Memory } from '../../hooks/useSupabase'

interface Props {
  memories: Memory[]
  onDelete: (id: string) => void
}

export function MasonryView({ memories, onDelete }: Props) {
  return (
    <div className="columns-2 gap-3 space-y-3">
      {memories.map((m) => (
        <div key={m.id} className="break-inside-avoid">
          <MemoryCard memory={m} onDelete={() => onDelete(m.id)} compact />
        </div>
      ))}
    </div>
  )
}
