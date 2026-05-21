import { DAY_NAMES } from '../../utils/format'

type Props = { value: number; onChange: (day: number) => void }

export default function DayPicker({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {DAY_NAMES.map((day, i) => (
        <button
          key={day}
          onClick={() => onChange(i)}
          className={`flex-1 py-1.5 rounded-md font-label-sm text-xs transition-all ${
            value === i
              ? 'bg-accent-terracotta text-white font-semibold'
              : 'bg-surface-container text-ink-secondary hover:text-ink-primary hover:bg-surface-container-high'
          }`}
        >
          {day.slice(0, 2)}
        </button>
      ))}
    </div>
  )
}
