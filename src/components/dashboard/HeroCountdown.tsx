import { TOTAL_5H } from '../../stores/countdownStore'
import { colorForRemaining } from '../../utils/format'

const RADIUS = 122
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatHeroTime(secondsLeft: number): { value: string; unit: string }[] {
  const hours = Math.floor(secondsLeft / 3600)
  const mins  = Math.floor((secondsLeft % 3600) / 60)
  const secs  = secondsLeft % 60

  if (secondsLeft >= 3600) return [
    { value: String(hours), unit: 'h' },
    { value: String(mins),  unit: 'm' },
  ]
  if (secondsLeft >= 60) return [
    { value: String(mins),                  unit: 'm' },
    { value: String(secs).padStart(2, '0'), unit: 's' },
  ]
  return [{ value: String(secs), unit: 's' }]
}

type Props = { secondsLeft: number }

export default function HeroCountdown({ secondsLeft }: Props) {
  const pctRemaining = Math.min(100, Math.round((secondsLeft / TOTAL_5H) * 100))
  const dashOffset   = CIRCUMFERENCE * (1 - secondsLeft / TOTAL_5H)
  const { text }     = colorForRemaining(pctRemaining)
  const parts        = formatHeroTime(secondsLeft)

  return (
    <section className="flex flex-col items-center justify-center py-10 bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm">
      <span className="font-label-sm text-ink-secondary mb-6 uppercase tracking-widest">Next Reset In</span>

      <div className="relative flex items-center justify-center w-56 sm:w-64 lg:w-72 h-56 sm:h-64 lg:h-72">
        <svg viewBox="0 0 256 256" className="w-full h-full" aria-hidden="true">
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
        <div className="absolute flex items-baseline gap-2 tabular-nums">
          {parts.map(({ value, unit }) => (
            <span key={unit} className="flex items-baseline gap-0.5">
              <span className="text-5xl font-medium tracking-tight text-ink-primary">{value}</span>
              <span className="text-xl font-normal text-ink-secondary">{unit}</span>
            </span>
          ))}
        </div>
      </div>

      <span className={`font-label-sm text-sm tabular-nums mt-3 ${text}`}>
        {pctRemaining}%
      </span>
    </section>
  )
}
