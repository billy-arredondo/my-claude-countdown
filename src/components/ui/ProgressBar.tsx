import { colorForRemaining } from '../../utils/format'

type Props = { remainingPct: number }

export default function ProgressBar({ remainingPct }: Props) {
  const { bar, text } = colorForRemaining(remainingPct)
  return (
    <div
      className="flex items-center gap-2 mt-3"
      role="progressbar"
      aria-valuenow={remainingPct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Time remaining"
    >
      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className={`h-full ${bar} rounded-full transition-all duration-1000`}
          style={{ width: `${remainingPct}%` }}
        />
      </div>
      <span className={`font-label-sm text-xs tabular-nums w-9 text-right shrink-0 ${text}`}>
        {remainingPct}%
      </span>
    </div>
  )
}
