import { useState } from 'react'
import { Modal } from '../ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: Record<string, unknown>) => void
}

export function AddWishModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = () => {
    if (!title) return
    onSave({ title, description, completed: false })
    setTitle('')
    setDescription('')
  }

  return (
    <Modal open={open} onClose={onClose} title="添加心愿">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="想一起做的事..."
          className="w-full h-11 px-4 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand"
          autoFocus
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="详细描述（可选）"
          rows={2}
          className="w-full px-4 py-3 rounded-input border border-warm-sand/30 text-warm-brown
                     placeholder:text-warm-taupe/40 focus:outline-none focus:border-warm-sand resize-none"
        />
        <button
          onClick={handleSave}
          disabled={!title}
          className="w-full h-12 rounded-btn font-medium transition-all
                     bg-warm-sand/60 text-warm-brown hover:bg-warm-sand/80
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          添加心愿
        </button>
      </div>
    </Modal>
  )
}
