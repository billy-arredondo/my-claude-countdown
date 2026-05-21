import { useState } from 'react'
import { TOTAL_5H } from '../../stores/countdownStore'
import ProgressBar from '../ui/ProgressBar'
import EditFormActions from '../ui/EditFormActions'

type Props = {
  secondsLeft: number
  onSet: (totalSeconds: number) => void
}

export default function FiveHourCard({ secondsLeft, onSet }: Props) {
  const [editing, setEditing] = useState(false)
  const [editHour, setEditHour] = useState(0)
  const [editMinute, setEditMinute] = useState(0)

  const hours = Math.floor(secondsLeft / 3600)
  const mins = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60
  const hhmm = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  const ss = String(secs).padStart(2, '0')
  const pctRemaining = Math.min(100, Math.round((secondsLeft / TOTAL_5H) * 100))

  function openEdit() {
    setEditHour(hours)
    setEditMinute(mins)
    setEditing(true)
  }

  function save() {
    const totalSec = Math.min(editHour * 3600 + editMinute * 60, TOTAL_5H)
    if (totalSec <= 0) return
    onSet(totalSec)
    setEditing(false)
  }

  return (
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
            onClick={openEdit}
            aria-label="Set custom remaining time"
            className={`transition-colors ${editing ? 'text-accent-terracotta' : 'text-outline hover:text-accent-terracotta'}`}
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
          <ProgressBar remainingPct={pctRemaining} />
        </div>
      </div>

      {editing && (
        <div className="border-t border-surface-container px-6 pt-4 pb-6 bg-surface-container-lowest space-y-3">
          <p className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest">
            Set remaining time · max 5:00
          </p>
          <input
            type="time"
            max="05:00"
            value={`${String(editHour).padStart(2, '0')}:${String(editMinute).padStart(2, '0')}`}
            onChange={e => {
              const [h, m] = e.target.value.split(':').map(Number)
              if (!isNaN(h) && !isNaN(m)) { setEditHour(h); setEditMinute(m) }
            }}
            className="w-full bg-surface-container border border-surface-container-high rounded-lg px-3 py-2.5 font-code-snippet text-sm text-ink-primary outline-none focus:border-accent-terracotta transition-colors"
          />
          <EditFormActions
            onCancel={() => setEditing(false)}
            onConfirm={save}
            confirmLabel="Set Timer"
            confirmDisabled={editHour === 0 && editMinute === 0}
          />
        </div>
      )}
    </div>
  )
}
