const CDN = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg'

const moods = [
  { value: 'love', hex: '1F495', label: '爱' },
  { value: 'happy', hex: '1F60A', label: '开心' },
  { value: 'calm', hex: '1F60C', label: '平静' },
  { value: 'miss', hex: '1F97A', label: '想念' },
  { value: 'grateful', hex: '1F64F', label: '感恩' },
  { value: 'excited', hex: '1F389', label: '兴奋' },
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
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all
                       ${value === m.value ? 'bg-white/25 scale-110 ring-1 ring-white/20' : 'hover:bg-white/10'}`}
            title={m.label}
          >
            <img src={`${CDN}/${m.hex}.svg`} alt={m.label} className="w-6 h-6 pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  )
}
