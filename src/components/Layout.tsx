import { useState, useEffect, useRef, type ReactNode } from 'react'
import type { Page } from '../types'

const NAV_ITEMS: { page: Page; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { page: 'history',   label: 'History',   icon: 'history'   },
  { page: 'settings',  label: 'Settings',  icon: 'settings'  },
]

function useScrollHidden() {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 10) {
        setHidden(false)
      } else if (y > lastY.current + 4) {
        setHidden(true)
      } else if (y < lastY.current - 4) {
        setHidden(false)
      }
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return hidden
}

interface LayoutProps {
  current: Page
  onNavigate: (page: Page) => void
  children: ReactNode
}

export default function Layout({ current, onNavigate, children }: LayoutProps) {
  const headerHidden = useScrollHidden()

  return (
    <div className="min-h-screen lg:flex font-body-md">

      {/* ── Desktop sidebar (lg+) ─────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-paper-warm border-r border-surface-container z-40">
        <div className="px-6 py-5 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-terracotta">sync</span>
            <span className="font-headline-md text-[15px] font-medium text-ink-primary leading-snug">
              Claude Token Tracker
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Main navigation">
          {NAV_ITEMS.map(({ page, label, icon }) => {
            const active = current === page
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  active
                    ? 'bg-secondary-container text-primary'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-container'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span className="font-label-md text-sm">{label}</span>
              </button>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-surface-container">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container transition-colors text-ink-secondary hover:text-ink-primary">
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
            <span className="font-label-md text-sm">Account</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile / tablet header — single row, auto-hide ── */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-paper-warm/90 backdrop-blur-md border-b border-surface-container transition-transform duration-300 ease-in-out ${
          headerHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center justify-between px-margin-mobile py-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-accent-terracotta text-[22px]">sync</span>
            <span className="font-headline-md text-[15px] font-medium text-ink-primary">
              Claude Token Tracker
            </span>
          </div>

          {/* Nav icons */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map(({ page, label, icon }) => {
              const active = current === page
              return (
                <button
                  key={page}
                  onClick={() => onNavigate(page)}
                  aria-label={label}
                  aria-current={active ? 'page' : undefined}
                  className={`p-2 rounded-lg transition-colors ${
                    active ? 'text-accent-terracotta' : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* ── Content area ──────────────────────────────────── */}
      <div className="flex-1 lg:ml-60">
        {/* pt offsets the single-row mobile header (~47px) + breathing room */}
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </div>

    </div>
  )
}
