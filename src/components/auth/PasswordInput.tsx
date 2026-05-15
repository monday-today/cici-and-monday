import { motion } from 'framer-motion'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  error?: string
  loading: boolean
}

export function PasswordInput({ value, onChange, onSubmit, error, loading }: Props) {
  return (
    <div className="w-[300px] mx-auto">
      <div className="relative">
        <input
          type="password"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          placeholder="密码"
          className="w-full h-14 px-1.5 pr-5 rounded-[4px] text-[30px] bg-white/70 backdrop-blur
                     border border-warm-sand/30 text-warm-brown placeholder:text-warm-taupe/50
                     focus:outline-none focus:border-warm-sand focus:bg-white/90
                     transition-all duration-300"
          autoFocus
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-warm-ivory text-[15px] mt-0.5 text-center"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        disabled={!value || loading}
        className="w-full h-14 rounded-[4px] bg-warm-sand/60 text-warm-brown font-medium text-center
                   hover:bg-warm-sand/80 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-all duration-300 backdrop-blur"
        style={{ marginTop: '40px', fontSize: '40px' }}
      >
        {loading ? (
          <span className="inline-flex items-center gap-0.5">
            <span className="w-2 h-2 border border-warm-brown/30 border-t-warm-brown rounded-full animate-spin" />
          </span>
        ) : (
          'ENTER'
        )}
      </motion.button>
    </div>
  )
}
