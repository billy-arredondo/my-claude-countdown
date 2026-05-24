import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const TOTAL_5H = 5 * 60 * 60
export const TOTAL_1W = 7 * 24 * 60 * 60

export function computeNextHHMM(hour: number, minute: number, fromMs = Date.now()): number {
  const target = new Date(fromMs)
  target.setHours(hour, minute, 0, 0)
  if (target.getTime() <= fromMs) target.setDate(target.getDate() + 1)
  return target.getTime()
}

export function computeWeeklyReset(dayOfWeek: number, hour: number, minute: number): number {
  const now = new Date()
  let daysUntil = (dayOfWeek - now.getDay() + 7) % 7
  const todayCandidate = new Date(now)
  todayCandidate.setHours(hour, minute, 0, 0)
  if (daysUntil === 0 && todayCandidate.getTime() <= now.getTime()) daysUntil = 7
  const target = new Date(now)
  target.setDate(now.getDate() + daysUntil)
  target.setHours(hour, minute, 0, 0)
  return target.getTime()
}

function initWeeklyState() {
  const now = new Date()
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7
  const nextSunday = new Date(now)
  nextSunday.setDate(now.getDate() + daysUntilSunday)
  nextSunday.setHours(0, 0, 0, 0)
  const resetAt = nextSunday.getTime()
  return { resetAt, setAt: resetAt - TOTAL_1W * 1000 }
}

interface CountdownStore {
  fiveHourResetAt: number
  fiveHourSetAt: number
  fiveHourNextResetAt: number | null
  weeklyResetAt: number
  weeklySetAt: number
  setFiveHour: (resetAt: number, setAt: number, nextResetAt?: number | null) => void
  setWeekly: (resetAt: number, setAt: number) => void
  tick: (now: number) => void
}

const INITIAL_WEEKLY = initWeeklyState()
const INITIAL_NOW = Date.now()

export const useCountdownStore = create<CountdownStore>()(
  persist(
    (set, get) => ({
      fiveHourResetAt: INITIAL_NOW + TOTAL_5H * 1000,
      fiveHourSetAt: INITIAL_NOW,
      fiveHourNextResetAt: null,
      weeklyResetAt: INITIAL_WEEKLY.resetAt,
      weeklySetAt: INITIAL_WEEKLY.setAt,
      setFiveHour: (resetAt, setAt, nextResetAt = null) => set({ fiveHourResetAt: resetAt, fiveHourSetAt: setAt, fiveHourNextResetAt: nextResetAt }),
      setWeekly: (resetAt, setAt) => set({ weeklyResetAt: resetAt, weeklySetAt: setAt }),
      tick: (now) => {
        const { fiveHourResetAt, fiveHourNextResetAt, weeklyResetAt } = get()
        const updates: Partial<Pick<CountdownStore, 'fiveHourResetAt' | 'fiveHourSetAt' | 'fiveHourNextResetAt' | 'weeklyResetAt' | 'weeklySetAt'>> = {}
        if (now >= fiveHourResetAt) {
          if (fiveHourNextResetAt !== null) {
            let next = fiveHourNextResetAt
            while (next <= now) next += TOTAL_5H * 1000
            updates.fiveHourResetAt = next
            updates.fiveHourSetAt = next - TOTAL_5H * 1000
            updates.fiveHourNextResetAt = next + TOTAL_5H * 1000
          } else {
            updates.fiveHourResetAt = now + TOTAL_5H * 1000
            updates.fiveHourSetAt = now
          }
        }
        if (now >= weeklyResetAt) {
          const d = new Date(weeklyResetAt)
          const newResetAt = computeWeeklyReset(d.getDay(), d.getHours(), d.getMinutes())
          updates.weeklyResetAt = newResetAt
          updates.weeklySetAt = newResetAt - TOTAL_1W * 1000
        }
        if (Object.keys(updates).length > 0) set(updates)
      },
    }),
    {
      name: 'countdown',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fiveHourResetAt: state.fiveHourResetAt,
        fiveHourSetAt: state.fiveHourSetAt,
        fiveHourNextResetAt: state.fiveHourNextResetAt,
        weeklyResetAt: state.weeklyResetAt,
        weeklySetAt: state.weeklySetAt,
      }),
    }
  )
)
