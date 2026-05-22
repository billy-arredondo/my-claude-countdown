type Props = { message: string | null }

export default function Toast({ message }: Props) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-surface-container-low border border-surface-container shadow-lg rounded-xl px-4 py-3 font-label-sm text-sm text-ink-primary">
      <span className="material-symbols-outlined text-[16px] text-accent-terracotta">check_circle</span>
      {message}
    </div>
  )
}
