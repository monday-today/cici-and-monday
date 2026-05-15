interface Props {
  icon?: string
  message: string
}

export function EmptyState({ icon = '💝', message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <span className="text-5xl mb-4 opacity-60">{icon}</span>
      <p className="text-warm-taupe/60 text-sm font-light text-center">{message}</p>
    </div>
  )
}
