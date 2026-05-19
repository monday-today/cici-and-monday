import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Heart, Cake } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: { title: string; date: string; type: string; count_mode?: string; icon?: string }) => void
}

export function AddDateModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('anniversary')
  const [countMode, setCountMode] = useState('countdown')

  const handleSave = () => {
    if (!title || !date) return
    onSave({ title, date, type, count_mode: countMode })
    setTitle('')
    setDate('')
    setType('anniversary')
    setCountMode('countdown')
  }

  return (
    <Modal open={open} onClose={onClose} title="添加重要日期">
      <div className="space-y-5">
        <div>
          <label className="text-sm text-warm-taupe font-light block mb-2">类型</label>
          <div className="flex gap-3">
            {[
              { value: 'anniversary', label: '纪念日', icon: Heart },
              { value: 'birthday', label: '生日', icon: Cake },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2
                           transition-all border text-sm font-medium
                           ${type === opt.value
                             ? 'border-warm-sand bg-warm-sand/20 text-warm-brown'
                             : 'border-warm-sand/20 text-warm-taupe/60'}`}
              >
                <opt.icon size={18} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-warm-taupe font-light block mb-2">计数方式</label>
          <div className="flex gap-3">
            {[
              { value: 'countdown', label: '倒数日' },
              { value: 'anniversary', label: '纪念日' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setCountMode(opt.value)}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2
                           transition-all border text-sm font-medium
                           ${countMode === opt.value
                             ? 'border-warm-sand bg-warm-sand/20 text-warm-brown'
                             : 'border-warm-sand/20 text-warm-taupe/60'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-warm-taupe font-light block mb-2">标题</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="例如：在一起的第一天"
            className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown
                       placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand"
          />
        </div>

        <div>
          <label className="text-sm text-warm-taupe font-light block mb-2">日期</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown
                       focus:outline-none focus:border-warm-sand"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!title || !date}
          className="w-full h-12 rounded-btn font-medium transition-all
                     bg-warm-sand/60 text-warm-brown hover:bg-warm-sand/80
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          保存
        </button>
      </div>
    </Modal>
  )
}
