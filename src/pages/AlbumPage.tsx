import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { PhotoGrid } from '../components/album/PhotoGrid'
import { PhotoLightbox } from '../components/album/PhotoLightbox'
import { usePhotos, uploadImage, type Photo } from '../hooks/useSupabase'

export default function AlbumPage() {
  const { photos, loading, addPhoto, removePhoto } = usePhotos()
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files) return
      setUploading(true)
      for (const f of Array.from(files)) {
        const url = await uploadImage(f, 'album')
        if (url) {
          await addPhoto({
            url,
            caption: '',
            taken_at: new Date().toISOString().split('T')[0],
          } as Record<string, unknown>)
        }
      }
      setUploading(false)
    }
    input.click()
  }

  return (
    <PageTransition>
      <BottomNav />
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-title text-warm-brown">相册</h1>
          <p className="text-sm text-warm-taupe/60 font-light mt-1">定格每一个美好瞬间</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={uploading}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #F2D0C4, #E8D5C4)' }}
        >
          {uploading ? (
            <span className="w-4 h-4 border-2 border-warm-brown/30 border-t-warm-brown rounded-full animate-spin" />
          ) : (
            <Upload size={20} className="text-warm-brown" />
          )}
        </motion.button>
      </div>

      <div className="px-5">
        {loading ? null : !photos || photos.length === 0 ? (
          <EmptyState icon="📷" message="还没有照片，点击右上角上传吧" />
        ) : (
          <PhotoGrid photos={photos} onSelect={setLightbox} onDelete={removePhoto} />
        )}
      </div>

      <PhotoLightbox photo={lightbox} onClose={() => setLightbox(null)} />
    </PageTransition>
  )
}
