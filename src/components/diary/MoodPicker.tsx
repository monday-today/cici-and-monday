const moods = [
  { value: 'love', emoji: '💕', label: '爱' },
  { value: 'happy', emoji: '😊', label: '开心' },
  { value: 'calm', emoji: '😌', label: '平静' },
  { value: 'miss', emoji: '🥺', label: '想念' },
  { value: 'grateful', emoji: '🙏', label: '感恩' },
  { value: 'excited', emoji: '🎉', label: '兴奋' },
]

interface Props {
  value: string
  onChange: (v: string) => void
}

export function MoodPicker({ value, onChange }: Props) {
  return (
    <div>
      <label className="text-sm text-warm-taupe font-light block mb-2">今天的心情</label>
      <div className="flex gap-2">
        {moods.map(m => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xl transition-all
                       ${value === m.value
                         ? 'bg-warm-sand/30 scale-110'
                         : 'hover:bg-warm-sand/10'}`}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
