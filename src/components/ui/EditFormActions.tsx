type Props = {
  onCancel: () => void
  onConfirm: () => void
  confirmLabel: string
  confirmDisabled?: boolean
}

export default function EditFormActions({ onCancel, onConfirm, confirmLabel, confirmDisabled }: Props) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-full font-label-md text-sm border border-surface-container text-ink-secondary hover:text-ink-primary hover:border-surface-container-high transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={confirmDisabled}
        className="flex-1 py-2.5 rounded-full font-label-md text-sm bg-accent-terracotta text-white hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {confirmLabel}
      </button>
    </div>
  )
}
