interface Props {
  icon?: string
  message: string
}

const CDN = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg'

export function EmptyState({ icon, message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      {icon && <img src={`${CDN}/${icon}.svg`} alt="" className="w-12 h-12 mb-4 opacity-60" />}
      <p className="text-warm-taupe/60 text-sm font-light text-center">{message}</p>
    </div>
  )
}
