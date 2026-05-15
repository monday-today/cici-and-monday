import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'

interface Props {
  images: File[]
  onChange: (files: File[]) => void
  max?: number
}

export function ImageUpload({ images, onChange, max = 5 }: Props) {
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback((files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    const combined = [...images, ...newFiles].slice(0, max)
    onChange(combined)
  }, [images, max, onChange])

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files) }}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer
                   transition-all duration-300 ${dragOver ? 'border-warm-sand bg-warm-sand/10' : 'border-warm-sand/30 hover:border-warm-sand/60'}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          max={max}
          onChange={e => handleFile(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Upload size={28} className="mx-auto mb-2 text-warm-taupe/50" />
        <p className="text-sm text-warm-taupe/60 font-light">
          拖拽或点击上传照片（{images.length}/{max}）
        </p>
      </div>

      {images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((file, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden"
            >
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-warm-brown/60
                           flex items-center justify-center"
              >
                <X size={12} className="text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
