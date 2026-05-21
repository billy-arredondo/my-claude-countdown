type Props = { elapsedPct: number; remainingPct: number }

export default function ProgressBar({ elapsedPct, remainingPct }: Props) {
  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-terracotta rounded-full transition-all duration-1000"
          style={{ width: `${elapsedPct}%` }}
        />
      </div>
      <span className="font-label-sm text-xs text-ink-secondary tabular-nums w-9 text-right shrink-0">
        {remainingPct}%
      </span>
    </div>
  )
}
