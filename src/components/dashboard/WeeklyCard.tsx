import { useState } from 'react'
import { formatWeeklyTime, formatResetLabel } from '../../utils/format'
import { TOTAL_1W } from '../../stores/countdownStore'
import ProgressBar from '../ui/ProgressBar'
import EditFormActions from '../ui/EditFormActions'
import DayPicker from '../ui/DayPicker'

type Props = {
  secondsLeft: number
  resetAt: number
  onSet: (dayOfWeek: number, hour: number, minute: number) => void
}

export default function WeeklyCard({ secondsLeft, resetAt, onSet }: Props) {
  const [editing, setEditing] = useState(false)
  const [editDay, setEditDay] = useState(0)
  const [editHour, setEditHour] = useState(0)
  const [editMinute, setEditMinute] = useState(0)

  const remainingPct = Math.min(100, Math.round((secondsLeft / TOTAL_1W) * 100))
  const isLive = secondsLeft < 3600 && secondsLeft > 0

  function openEdit() {
    const d = new Date(resetAt)
    setEditDay(d.getDay())
    setEditHour(d.getHours())
    setEditMinute(d.getMinutes())
    setEditing(true)
  }

  function save() {
    onSet(editDay, editHour, editMinute)
    setEditing(false)
  }

  return (
    <div className="rounded-xl bg-surface-container-low border border-surface-container shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col justify-between min-h-35">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-headline-md text-lg text-ink-primary">Weekly Reset</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[14px] text-ink-secondary">calendar_today</span>
              <span className="font-label-sm text-ink-secondary">{formatResetLabel(resetAt)}</span>
            </div>
          </div>
          <button
            onClick={openEdit}
            aria-label="Edit weekly reset time"
            className={`transition-colors ${editing ? 'text-accent-terracotta' : 'text-outline hover:text-accent-terracotta'}`}
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
        <div className="mt-6">
          <span className={`font-display-lg text-2xl tabular-nums ${isLive ? 'text-accent-terracotta' : 'text-ink-primary'}`}>
            {formatWeeklyTime(secondsLeft)}
          </span>
          <span className="font-label-sm text-xs text-ink-secondary mt-0.5 block">until reset</span>
          <ProgressBar remainingPct={remainingPct} />
        </div>
      </div>

      {editing && (
        <div className="border-t border-surface-container px-6 pt-4 pb-6 bg-surface-container-lowest space-y-3">
          <p className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest">
            Next automatic reset
          </p>
          <DayPicker value={editDay} onChange={setEditDay} />
          <input
            type="time"
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
            confirmLabel="Set Reset"
          />
        </div>
      )}
    </div>
  )
}
