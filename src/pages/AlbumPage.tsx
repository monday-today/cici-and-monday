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
      <div style={{ padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)', paddingBottom: '5rem' }}>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <img src="https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F4F7.svg" alt="" className="w-6 h-6" />
            <h1 className="font-title text-white tracking-wider" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>相册</h1>
          </div>
          <p className="text-white/30 text-[10px] tracking-[0.2em] mt-0.5 ml-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>OUR MOMENTS</p>
        </div>

        {loading ? null : !photos || photos.length === 0 ? (
          <EmptyState icon="1F4F7" message="还没有照片，点击下方按钮上传吧" />
        ) : (
          <PhotoGrid photos={photos} onSelect={setLightbox} onDelete={removePhoto} />
        )}

        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            disabled={uploading}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' }}
          >
            {uploading ? (
              <span className="w-4 h-4 border-2 border-warm-brown/30 border-t-warm-brown rounded-full animate-spin" />
            ) : (
              <Upload size={22} className="text-warm-brown" />
            )}
          </motion.button>
        </div>
      </div>

      <PhotoLightbox photo={lightbox} onClose={() => setLightbox(null)} />
    </PageTransition>
  )
}
