import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const TOTAL_5H = 5 * 60 * 60
export const TOTAL_1W = 7 * 24 * 60 * 60

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
  weeklyResetAt: number
  weeklySetAt: number
  setFiveHour: (resetAt: number, setAt: number) => void
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
      weeklyResetAt: INITIAL_WEEKLY.resetAt,
      weeklySetAt: INITIAL_WEEKLY.setAt,
      setFiveHour: (resetAt, setAt) => set({ fiveHourResetAt: resetAt, fiveHourSetAt: setAt }),
      setWeekly: (resetAt, setAt) => set({ weeklyResetAt: resetAt, weeklySetAt: setAt }),
      tick: (now) => {
        const { fiveHourResetAt, weeklyResetAt } = get()
        const updates: Partial<Pick<CountdownStore, 'fiveHourResetAt' | 'fiveHourSetAt' | 'weeklyResetAt' | 'weeklySetAt'>> = {}
        if (now >= fiveHourResetAt) {
          updates.fiveHourResetAt = now + TOTAL_5H * 1000
          updates.fiveHourSetAt = now
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
        weeklyResetAt: state.weeklyResetAt,
        weeklySetAt: state.weeklySetAt,
      }),
    }
  )
)
