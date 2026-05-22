import { useState } from 'react'
import { TOTAL_5H, computeNextHHMM } from '../../stores/countdownStore'
import { formatResetLabel } from '../../utils/format'
import ProgressBar from '../ui/ProgressBar'
import EditFormActions from '../ui/EditFormActions'

type Props = {
  secondsLeft: number
  resetAt: number
  onSet: (resetAt: number) => void
}

export default function FiveHourCard({ secondsLeft, resetAt, onSet }: Props) {
  const [editing, setEditing] = useState(false)
  const [editMode, setEditMode] = useState<'duration' | 'endTime'>('duration')
  const [editHour, setEditHour] = useState(0)
  const [editMinute, setEditMinute] = useState(0)
  const [endHour, setEndHour] = useState(0)
  const [endMinute, setEndMinute] = useState(0)

  const hours = Math.floor(secondsLeft / 3600)
  const mins = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60
  const hhmm = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  const ss = String(secs).padStart(2, '0')
  const pctRemaining = Math.min(100, Math.round((secondsLeft / TOTAL_5H) * 100))

  function openEdit() {
    setEditHour(hours)
    setEditMinute(mins)
    const projected = new Date(Date.now() + secondsLeft * 1000)
    setEndHour(projected.getHours())
    setEndMinute(projected.getMinutes())
    setEditing(true)
  }

  function save() {
    let newResetAt: number
    if (editMode === 'duration') {
      const totalSec = Math.min(editHour * 3600 + editMinute * 60, TOTAL_5H)
      if (totalSec <= 0) return
      newResetAt = Date.now() + totalSec * 1000
    } else {
      const target = computeNextHHMM(endHour, endMinute)
      newResetAt = Math.min(target, Date.now() + TOTAL_5H * 1000)
    }
    onSet(newResetAt)
    setEditing(false)
  }

  const confirmDisabled =
    editMode === 'duration'
      ? editHour === 0 && editMinute === 0
      : endHour === 0 && endMinute === 0

  return (
    <div className="rounded-xl bg-surface-container-low border border-surface-container shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col justify-between min-h-35">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-headline-md text-lg text-ink-primary">5-Hour Window</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[14px] text-ink-secondary">schedule</span>
              <span className="font-label-sm text-ink-secondary">{formatResetLabel(resetAt)}</span>
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
          <div className="flex rounded-lg border border-surface-container-high overflow-hidden">
            <button
              type="button"
              onClick={() => setEditMode('duration')}
              className={`flex-1 px-3 py-1.5 font-label-sm text-xs transition-colors ${
                editMode === 'duration'
                  ? 'bg-accent-terracotta text-white'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              Duration
            </button>
            <button
              type="button"
              onClick={() => setEditMode('endTime')}
              className={`flex-1 px-3 py-1.5 font-label-sm text-xs transition-colors ${
                editMode === 'endTime'
                  ? 'bg-accent-terracotta text-white'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              End time
            </button>
          </div>

          {editMode === 'duration' ? (
            <>
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
            </>
          ) : (
            <>
              <p className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest">
                Session ends at · capped to 5h
              </p>
              <input
                type="time"
                value={`${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`}
                onChange={e => {
                  const [h, m] = e.target.value.split(':').map(Number)
                  if (!isNaN(h) && !isNaN(m)) { setEndHour(h); setEndMinute(m) }
                }}
                className="w-full bg-surface-container border border-surface-container-high rounded-lg px-3 py-2.5 font-code-snippet text-sm text-ink-primary outline-none focus:border-accent-terracotta transition-colors"
              />
            </>
          )}

          <EditFormActions
            onCancel={() => setEditing(false)}
            onConfirm={save}
            confirmLabel="Set Timer"
            confirmDisabled={confirmDisabled}
          />
        </div>
      )}
    </div>
  )
}
