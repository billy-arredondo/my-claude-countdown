import { useState, useEffect, useRef, type ReactNode } from 'react'
import type { Page } from '../types'

const NAV_ITEMS: { page: Page; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen lg:flex font-body-md">

      {/* ── Desktop sidebar (lg+) ─────────────────────────── */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-paper-warm border-r border-surface-container z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:w-16' : 'lg:w-60'
        }`}
      >
        {/* Brand */}
        <div
          className={`flex items-center border-b border-surface-container h-[68px] flex-shrink-0 transition-all duration-300 ${
            collapsed ? 'justify-center px-2' : 'gap-3 px-6'
          }`}
        >
          <span className="material-symbols-outlined text-accent-terracotta flex-shrink-0">sync</span>
          <span
            className={`font-headline-md text-[15px] font-medium text-ink-primary leading-snug whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
            }`}
          >
            Claude Token Tracker
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Main navigation">
          {NAV_ITEMS.map(({ page, label, icon }) => {
            const active = current === page
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                title={label}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${
                  collapsed ? 'justify-center px-2' : 'gap-3 px-4'
                } ${
                  active
                    ? 'bg-secondary-container text-primary'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-container'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px] flex-shrink-0"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span
                  className={`font-label-md text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Account + collapse toggle */}
        <div className="px-2 py-4 border-t border-surface-container space-y-0.5">
          <button
            title="Account"
            aria-label="Account"
            className={`w-full flex items-center py-3 rounded-xl hover:bg-surface-container transition-colors text-ink-secondary hover:text-ink-primary ${
              collapsed ? 'justify-center px-2' : 'gap-3 px-4'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] flex-shrink-0">account_circle</span>
            <span
              className={`font-label-md text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
                collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
              }`}
            >
              Account
            </span>
          </button>

          <button
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full flex items-center justify-center py-3 rounded-xl hover:bg-surface-container transition-colors text-ink-secondary hover:text-ink-primary"
          >
            <span
              className={`material-symbols-outlined text-[22px] flex-shrink-0 transition-transform duration-300 ${
                collapsed ? '-rotate-180' : 'rotate-0'
              }`}
            >
              chevron_left
            </span>
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
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-accent-terracotta text-[22px]">sync</span>
            <span className="font-headline-md text-[15px] font-medium text-ink-primary">
              Claude Token Tracker
            </span>
          </div>

          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map(({ page, label, icon }) => {
              const active = current === page
              return (
                <button
                  key={page}
                  onClick={() => onNavigate(page)}
                  title={label}
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
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}
      >
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </div>

    </div>
  )
}
