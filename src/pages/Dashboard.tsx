import { useState, useEffect } from 'react'
import { useCountdownStore, computeWeeklyReset, TOTAL_5H } from '../stores/countdownStore'

const RADIUS = 122
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatWeeklyTime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hrs = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (seconds >= 2 * 86400) return `${days}d ${String(hrs).padStart(2, '0')}h`
  if (seconds >= 3600) {
    if (days > 0) return `${days}d ${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`
    return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatResetLabel(resetAt: number): string {
  const d = new Date(resetAt)
  const hour = d.getHours()
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 || 12
  return `${DAY_NAMES[d.getDay()]} ${h}:${String(d.getMinutes()).padStart(2, '0')} ${ampm}`
}

export default function Dashboard() {
  // countdown store (persisted)
  const fiveHourResetAt = useCountdownStore(s => s.fiveHourResetAt)
  const fiveHourSetAt   = useCountdownStore(s => s.fiveHourSetAt)
  const weeklyResetAt   = useCountdownStore(s => s.weeklyResetAt)
  const weeklySetAt     = useCountdownStore(s => s.weeklySetAt)
  const setFiveHour     = useCountdownStore(s => s.setFiveHour)
  const setWeekly       = useCountdownStore(s => s.setWeekly)
  const tick            = useCountdownStore(s => s.tick)

  // cd-5h (UI only)
  const [editing5h, setEditing5h] = useState(false)
  const [editHour5h, setEditHour5h] = useState(0)
  const [editMinute5h, setEditMinute5h] = useState(0)
  // cd-1w (UI only)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [editingWeekly, setEditingWeekly] = useState(false)
  const [editDay, setEditDay] = useState(0)
  const [editHour, setEditHour] = useState(0)
  const [editMinute, setEditMinute] = useState(0)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    tick(Date.now())
    setNowMs(Date.now())
    const id = setInterval(() => {
      const now = Date.now()
      tick(now)
      setNowMs(now)
    }, 1000)
    return () => clearInterval(id)
  }, [tick])

  function showToast(message: string) {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2200)
  }

  // cd-5h derived
  const secsLeft5h    = Math.max(0, Math.floor((fiveHourResetAt - nowMs) / 1000))
  const totalDur5h    = Math.max(1, Math.floor((fiveHourResetAt - fiveHourSetAt) / 1000))
  const hours         = Math.floor(secsLeft5h / 3600)
  const mins          = Math.floor((secsLeft5h % 3600) / 60)
  const secs          = secsLeft5h % 60
  const hhmm          = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  const ss            = String(secs).padStart(2, '0')
  const dashOffset    = CIRCUMFERENCE * (1 - secsLeft5h / totalDur5h)
  const pct5hRemaining = Math.round((secsLeft5h / totalDur5h) * 100)
  const pct5hElapsed  = 100 - pct5hRemaining

  // cd-1w derived
  const weeklySecsLeft = Math.max(0, Math.floor((weeklyResetAt - nowMs) / 1000))
  const weeklyTotalDuration = Math.max(1, Math.floor((weeklyResetAt - weeklySetAt) / 1000))
  const weeklyElapsedPct = Math.min(100, Math.round(((weeklyTotalDuration - weeklySecsLeft) / weeklyTotalDuration) * 100))
  const weeklyRemainingPct = 100 - weeklyElapsedPct
  const weeklyFormatted = formatWeeklyTime(weeklySecsLeft)
  const isWeeklyLive = weeklySecsLeft < 3600 && weeklySecsLeft > 0

  function open5hEdit() {
    setEditHour5h(hours)
    setEditMinute5h(mins)
    setEditing5h(true)
  }

  function close5hEdit() {
    setEditing5h(false)
  }

  function save5h() {
    const totalSec = Math.min(editHour5h * 3600 + editMinute5h * 60, TOTAL_5H)
    if (totalSec <= 0) return
    const now = Date.now()
    setFiveHour(now + totalSec * 1000, now)
    close5hEdit()
    showToast('Timer set')
  }

  function openWeeklyEdit() {
    const d = new Date(weeklyResetAt)
    setEditDay(d.getDay())
    setEditHour(d.getHours())
    setEditMinute(d.getMinutes())
    setEditingWeekly(true)
  }

  function saveWeekly() {
    const newResetAt = computeWeeklyReset(editDay, editHour, editMinute)
    setWeekly(newResetAt, Date.now())
    setEditingWeekly(false)
    showToast('Reset time updated')
  }

  return (
    <main className="px-margin-mobile max-w-2xl mx-auto space-y-gutter py-6 lg:py-8">

      {/* Hero — 5h countdown (display only) */}
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
              className="text-accent-terracotta progress-ring__circle"
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
              {pct5hRemaining}%
            </span>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">

        {/* 5h card */}
        <div className="rounded-xl bg-surface-container-low border border-surface-container shadow-sm overflow-hidden">

          <div className="p-6 flex flex-col justify-between min-h-35">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-headline-md text-lg text-ink-primary">5-Hour Window</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-ink-secondary">schedule</span>
                  <span className="font-label-sm text-ink-secondary">Rolling period</span>
                </div>
              </div>
              <button
                onClick={open5hEdit}
                aria-label="Set custom remaining time"
                className={`transition-colors ${editing5h ? 'text-accent-terracotta' : 'text-outline hover:text-accent-terracotta'}`}
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <div className="mt-6">
              <div className="flex items-baseline gap-0.5 tabular-nums">
                <span className="font-display-lg text-2xl text-ink-primary">{hhmm}</span>
                <span className="font-display-lg text-lg text-ink-primary/40">:{ss}</span>
              </div>
              <span className="font-label-sm text-xs text-ink-secondary mt-0.5 block">until reset</span>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-terracotta rounded-full transition-all duration-1000"
                    style={{ width: `${pct5hElapsed}%` }}
                  />
                </div>
                <span className="font-label-sm text-xs text-ink-secondary tabular-nums w-9 text-right shrink-0">
                  {pct5hRemaining}%
                </span>
              </div>
            </div>
          </div>

          {editing5h && (
            <div className="border-t border-surface-container px-6 pt-4 pb-6 bg-surface-container-lowest space-y-3">
              <p className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest">
                Set remaining time · max 5:00
              </p>
              <input
                type="time"
                max="05:00"
                value={`${String(editHour5h).padStart(2, '0')}:${String(editMinute5h).padStart(2, '0')}`}
                onChange={e => {
                  const [h, m] = e.target.value.split(':').map(Number)
                  if (!isNaN(h) && !isNaN(m)) { setEditHour5h(h); setEditMinute5h(m) }
                }}
                className="w-full bg-surface-container border border-surface-container-high rounded-lg px-3 py-2.5 font-code-snippet text-sm text-ink-primary outline-none focus:border-accent-terracotta transition-colors"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={close5hEdit}
                  className="flex-1 py-2.5 rounded-full font-label-md text-sm border border-surface-container text-ink-secondary hover:text-ink-primary hover:border-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save5h}
                  disabled={editHour5h === 0 && editMinute5h === 0}
                  className="flex-1 py-2.5 rounded-full font-label-md text-sm bg-accent-terracotta text-white hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Timer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Weekly card */}
        <div className="rounded-xl bg-surface-container-low border border-surface-container shadow-sm overflow-hidden">

          <div className="p-6 flex flex-col justify-between min-h-35">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-headline-md text-lg text-ink-primary">Weekly Reset</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-ink-secondary">calendar_today</span>
                  <span className="font-label-sm text-ink-secondary">{formatResetLabel(weeklyResetAt)}</span>
                </div>
              </div>
              <button
                onClick={openWeeklyEdit}
                aria-label="Edit weekly reset time"
                className={`transition-colors ${editingWeekly ? 'text-accent-terracotta' : 'text-outline hover:text-accent-terracotta'}`}
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <div className="mt-6">
              <span className={`font-display-lg text-2xl tabular-nums ${isWeeklyLive ? 'text-accent-terracotta' : 'text-ink-primary'}`}>
                {weeklyFormatted}
              </span>
              <span className="font-label-sm text-xs text-ink-secondary mt-0.5 block">until reset</span>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-terracotta rounded-full transition-all duration-1000"
                    style={{ width: `${weeklyElapsedPct}%` }}
                  />
                </div>
                <span className="font-label-sm text-xs text-ink-secondary tabular-nums w-9 text-right shrink-0">
                  {weeklyRemainingPct}%
                </span>
              </div>
            </div>
          </div>

          {editingWeekly && (
            <div className="border-t border-surface-container px-6 pt-4 pb-6 bg-surface-container-lowest space-y-3">
              <p className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest">
                Next automatic reset
              </p>

              <div className="flex gap-1">
                {DAY_NAMES.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => setEditDay(i)}
                    className={`flex-1 py-1.5 rounded-md font-label-sm text-xs transition-all ${
                      editDay === i
                        ? 'bg-accent-terracotta text-white font-semibold'
                        : 'bg-surface-container text-ink-secondary hover:text-ink-primary hover:bg-surface-container-high'
                    }`}
                  >
                    {day.slice(0, 2)}
                  </button>
                ))}
              </div>

              <input
                type="time"
                value={`${String(editHour).padStart(2, '0')}:${String(editMinute).padStart(2, '0')}`}
                onChange={e => {
                  const [h, m] = e.target.value.split(':').map(Number)
                  if (!isNaN(h) && !isNaN(m)) { setEditHour(h); setEditMinute(m) }
                }}
                className="w-full bg-surface-container border border-surface-container-high rounded-lg px-3 py-2.5 font-code-snippet text-sm text-ink-primary outline-none focus:border-accent-terracotta transition-colors"
              />

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditingWeekly(false)}
                  className="flex-1 py-2.5 rounded-full font-label-md text-sm border border-surface-container text-ink-secondary hover:text-ink-primary hover:border-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveWeekly}
                  className="flex-1 py-2.5 rounded-full font-label-md text-sm bg-accent-terracotta text-white hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  Set Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Decorative quote */}
      <div className="relative w-full py-12 px-gutter bg-surface-secondary/30 rounded-xl border border-surface-container-high overflow-hidden">
        <div className="relative z-10 text-center max-w-sm mx-auto">
          <p className="font-display-lg text-xl text-ink-primary italic leading-relaxed">
            "Your concentration is the true resource. We just track the tokens."
          </p>
          <div className="mt-4 w-8 h-px bg-accent-terracotta/40 mx-auto" />
        </div>
      </div>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-surface-container-low border border-surface-container shadow-lg rounded-xl px-4 py-3 font-label-sm text-sm text-ink-primary">
          <span className="material-symbols-outlined text-[16px] text-accent-terracotta">check_circle</span>
          {toastMessage}
        </div>
      )}
    </main>
  )
}
