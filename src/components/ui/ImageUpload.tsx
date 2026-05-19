import { useCallback, useRef, useState } from 'react'
import { X, ImagePlus, Upload } from 'lucide-react'

interface Props {
  images: File[]
  onChange: (files: File[]) => void
  max?: number
}

export function ImageUpload({ images, onChange, max = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback((files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    const combined = [...images, ...newFiles].slice(0, max)
    onChange(combined)
  }, [images, max, onChange])

  const remove = (i: number) => onChange(images.filter((_, j) => j !== i))

  return (
    <div className="space-y-3">
      <label
        className="block w-full cursor-pointer"
        onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }}
        onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }}
        onDrop={e => { e.preventDefault(); e.stopPropagation(); setDragOver(false); handleFile(e.dataTransfer.files) }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={e => { handleFile(e.target.files); e.target.value = '' }}
          className="absolute opacity-0 w-0 h-0"
        />
        <span className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed transition-all ${
          dragOver
            ? 'border-white/60 bg-white/10 text-white/80'
            : 'border-white/20 text-white/60 hover:text-white/80 hover:border-white/40'
        }`}>
          {dragOver ? <Upload size={20} /> : <ImagePlus size={20} />}
          <span className="text-sm">{dragOver ? '松开以上传' : `选择或拖拽照片（${images.length}/${max}）`}</span>
        </span>
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((file, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden border border-white/10" style={{ aspectRatio: '4/3' }}>
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
