import { TOTAL_5H } from '../../stores/countdownStore'
import { colorForRemaining } from '../../utils/format'

const RADIUS = 122
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type Props = { secondsLeft: number }

export default function HeroCountdown({ secondsLeft }: Props) {
  const hours = Math.floor(secondsLeft / 3600)
  const mins = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60
  const hhmm = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  const ss = String(secs).padStart(2, '0')
  const pctRemaining = Math.min(100, Math.round((secondsLeft / TOTAL_5H) * 100))
  const dashOffset = CIRCUMFERENCE * (1 - secondsLeft / TOTAL_5H)
  const { text } = colorForRemaining(pctRemaining)

  return (
    <section className="flex flex-col items-center justify-center py-10 bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm">
      <span className="font-label-sm text-ink-secondary mb-8 uppercase tracking-widest">Next Reset In</span>
      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="w-full h-full" aria-hidden="true">
          <circle
            className="text-surface-container"
            cx="128" cy="128" r={RADIUS}
            fill="transparent" stroke="currentColor" strokeWidth="2"
          />
          <circle
            className={`${text} progress-ring__circle`}
            cx="128" cy="128" r={RADIUS}
            fill="transparent" stroke="currentColor"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round" strokeWidth="2.5"
          />
        </svg>
        <div className="absolute flex flex-col items-center gap-0.5">
          <div className="flex items-baseline gap-0.5 tabular-nums">
            <span className="text-4xl font-medium tracking-tight text-ink-primary">{hhmm}</span>
            <span className="text-2xl font-normal tracking-tight text-ink-primary/40">:{ss}</span>
          </div>
          <span className="font-label-sm text-xs text-ink-secondary">remaining</span>
          <span className="font-label-sm text-xs tabular-nums mt-0.5 text-ink-secondary/50">
            {pctRemaining}%
          </span>
        </div>
      </div>
    </section>
  )
}
