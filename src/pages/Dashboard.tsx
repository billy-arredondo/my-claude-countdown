import { useState, useEffect } from 'react'
import type { Page } from '../types'

const TOTAL_DURATION = 5 * 60 * 60
const RADIUS = 122
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Dashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [totalSeconds, setTotalSeconds] = useState(TOTAL_DURATION)

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds(s => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const timeDisplay = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  const dashOffset = CIRCUMFERENCE * (1 - totalSeconds / TOTAL_DURATION)

  return (
    <div className="font-body-md pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-paper-warm/80 backdrop-blur-md flex justify-between items-center px-margin-mobile py-4 border-b border-surface-container">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-accent-terracotta">sync</span>
          <h1 className="font-headline-md text-xl font-medium text-ink-primary">Claude Token Tracker</h1>
        </div>
        <button className="hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined text-outline">account_circle</span>
        </button>
      </header>

      <main className="mt-24 px-margin-mobile max-w-2xl mx-auto space-y-gutter">
        {/* Countdown */}
        <section className="flex flex-col items-center justify-center py-10 bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm">
          <span className="font-label-sm text-ink-secondary mb-8 uppercase tracking-[0.1em]">Next Reset In</span>
          <div className="relative flex items-center justify-center w-64 h-64">
            <svg className="w-full h-full" aria-hidden="true">
              <circle
                className="text-surface-container"
                cx="128" cy="128"
                r={RADIUS}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                className="text-accent-terracotta progress-ring__circle"
                cx="128" cy="128"
                r={RADIUS}
                fill="transparent"
                stroke="currentColor"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-medium tracking-tight text-ink-primary tabular-nums">
                {timeDisplay}
              </span>
              <span className="font-label-md text-ink-secondary mt-1">remaining</span>
            </div>
          </div>
          <button
            onClick={() => setTotalSeconds(TOTAL_DURATION)}
            className="mt-10 bg-accent-terracotta text-white px-8 py-3.5 rounded-full font-label-md font-semibold hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm shadow-accent-terracotta/20"
          >
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            Start/Update Tracker
          </button>
        </section>

        {/* Stats cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* 5-Hour Window */}
          <div className="p-6 rounded-xl bg-surface-container-low border border-surface-container shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-headline-md text-lg text-ink-primary">5-Hour Window</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-ink-secondary">schedule</span>
                  <span className="font-label-sm text-ink-secondary">Rolling period</span>
                </div>
              </div>
              <span className="bg-surface-container-highest text-ink-primary font-label-sm px-2.5 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <div className="mt-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display-lg text-2xl text-ink-primary">42</span>
                <button className="ml-2 hover:text-accent-terracotta transition-colors flex items-center">
                  <span className="material-symbols-outlined text-[16px] text-outline">edit</span>
                </button>
                <span className="font-body-md text-ink-secondary">/ 50 messages</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-accent-terracotta rounded-full w-[84%]" />
              </div>
            </div>
          </div>

          {/* Weekly Reset */}
          <div className="p-6 rounded-xl bg-surface-container-low border border-surface-container shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-headline-md text-lg text-ink-primary">Weekly Reset</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-ink-secondary">calendar_today</span>
                  <span className="font-label-sm text-ink-secondary">Sunday 12:00 AM</span>
                </div>
              </div>
              <button className="hover:text-accent-terracotta transition-colors">
                <span className="material-symbols-outlined text-[18px] text-outline">edit</span>
              </button>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-display-lg text-2xl text-ink-primary">4</span>
                  <span className="font-body-md text-ink-secondary">Days left</span>
                </div>
                <button className="hover:text-accent-terracotta transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-outline">edit</span>
                </button>
              </div>
            </div>
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
      </main>

      {/* Bottom NavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-paper-warm border-t border-surface-container">
        <button className="flex flex-col items-center justify-center gap-1 text-accent-terracotta px-4 py-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-sm">Dashboard</span>
        </button>
        <button
          onClick={() => onNavigate('history')}
          className="flex flex-col items-center justify-center gap-1 text-ink-secondary px-4 py-1 hover:text-ink-primary transition-colors"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-sm">History</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className="flex flex-col items-center justify-center gap-1 text-ink-secondary px-4 py-1 hover:text-ink-primary transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-sm">Settings</span>
        </button>
      </nav>
    </div>
  )
}
