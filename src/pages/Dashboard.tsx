import { useCountdownStore, computeWeeklyReset } from '../stores/countdownStore'
import { useNowTick } from '../hooks/useNowTick'
import { useToast } from '../hooks/useToast'
import HeroCountdown from '../components/dashboard/HeroCountdown'
import FiveHourCard from '../components/dashboard/FiveHourCard'
import WeeklyCard from '../components/dashboard/WeeklyCard'
import QuoteBlock from '../components/dashboard/QuoteBlock'
import Toast from '../components/ui/Toast'

export default function Dashboard() {
  const fiveHourResetAt = useCountdownStore(s => s.fiveHourResetAt)
  const weeklyResetAt   = useCountdownStore(s => s.weeklyResetAt)
  const setFiveHour     = useCountdownStore(s => s.setFiveHour)
  const setWeekly       = useCountdownStore(s => s.setWeekly)
  const tick            = useCountdownStore(s => s.tick)

  const nowMs = useNowTick(tick)
  const toast = useToast()

  const secsLeft5h     = Math.max(0, Math.floor((fiveHourResetAt - nowMs) / 1000))
  const weeklySecsLeft = Math.max(0, Math.floor((weeklyResetAt - nowMs) / 1000))

  function handleSet5h(totalSec: number) {
    const now = Date.now()
    setFiveHour(now + totalSec * 1000, now)
    toast.show('Timer set')
  }

  function handleSetWeekly(day: number, hour: number, minute: number) {
    setWeekly(computeWeeklyReset(day, hour, minute), Date.now())
    toast.show('Reset time updated')
  }

  return (
    <main className="px-margin-mobile max-w-2xl mx-auto space-y-gutter py-6 lg:py-8">
      <HeroCountdown secondsLeft={secsLeft5h} />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <FiveHourCard secondsLeft={secsLeft5h} onSet={handleSet5h} />
        <WeeklyCard
          secondsLeft={weeklySecsLeft}
          resetAt={weeklyResetAt}
          onSet={handleSetWeekly}
        />
      </section>
      <QuoteBlock />
      <Toast message={toast.message} />
    </main>
  )
}
