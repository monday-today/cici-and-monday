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
    <div className="w-[280px] mx-auto">
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSubmit()}
        placeholder="密码"
        className="w-full h-12 px-4 rounded-lg text-lg bg-white/80 backdrop-blur
                   border border-white/20 text-white/90 placeholder:text-white/30
                   focus:outline-none focus:border-white/40 focus:bg-white/15
                   transition-all duration-300"
        autoFocus
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-300 text-sm mt-2 text-center font-light"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={!value || loading}
        className="w-full h-12 rounded-lg font-medium text-center
                   transition-all duration-300 mt-5"
        style={{
          background: !value || loading ? 'rgba(255,255,255,0.05)' : '#D9CCBE',
          color: !value || loading ? 'rgba(93,64,55,0.4)' : '#FFFFFF',
        }}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#5D4037]/20 border-t-[#5D4037] rounded-full animate-spin" />
          </span>
        ) : (
          '进入'
        )}
      </motion.button>
    </div>
  )
}
