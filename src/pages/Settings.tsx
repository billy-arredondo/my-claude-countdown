import { useState } from 'react'
import { useThemeStore, type Theme } from '../stores/themeStore'

const THEMES: Theme[] = ['light', 'dark', 'system']

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={enabled}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0 ml-4 focus:outline-none ${
        enabled ? 'bg-primary-container' : 'bg-surface-variant'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
          enabled ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const [notif5min, setNotif5min] = useState(true)
  const [notifReset, setNotifReset] = useState(false)

  return (
    <main className="py-6 lg:py-8 px-margin-mobile">
      <div className="max-w-[720px] mx-auto space-y-8">

        {/* Account */}
        <section>
          <h2 className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest mb-4">Account</h2>
          <div className="bg-paper-warm border border-on-surface/5 rounded-xl p-6 editorial-shadow flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-surface-container-high shrink-0 flex items-center justify-center">
              <span className="font-headline-md text-xl text-primary font-semibold">JT</span>
            </div>
            <div>
              <h3 className="font-headline-md text-2xl text-ink-primary">Julian Thorne</h3>
              <p className="font-body-md text-sm text-ink-secondary">julian.thorne@editorial.ai</p>
              <p className="font-label-sm text-xs text-primary mt-1">Pro Member • Renewing June 12</p>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h2 className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest mb-4">Appearance</h2>
          <div className="bg-paper-warm border border-on-surface/5 rounded-xl p-6 editorial-shadow">
            <div className="flex flex-col gap-4">
              <label className="font-body-md text-base text-ink-primary">Display Theme</label>
              <div className="flex p-1 bg-surface-secondary rounded-lg w-full">
                {THEMES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-2 px-4 rounded-md font-label-md text-sm transition-all capitalize ${
                      theme === t
                        ? 'bg-background text-primary shadow-sm'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest mb-4">Notifications</h2>
          <div className="bg-paper-warm border border-on-surface/5 rounded-xl editorial-shadow overflow-hidden">
            <div className="divide-y divide-on-surface/5">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-body-md text-lg text-ink-primary">5m before reset</h3>
                  <p className="font-body-md text-sm text-ink-secondary">
                    Get a nudge when your token window is about to refresh.
                  </p>
                </div>
                <Toggle enabled={notif5min} onToggle={() => setNotif5min(v => !v)} />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-body-md text-lg text-ink-primary">Reset complete</h3>
                  <p className="font-body-md text-sm text-ink-secondary">
                    Notification when your limits are fully replenished.
                  </p>
                </div>
                <Toggle enabled={notifReset} onToggle={() => setNotifReset(v => !v)} />
              </div>
            </div>
          </div>
        </section>

        {/* Support & Legal */}
        <section>
          <h2 className="font-label-sm text-xs text-ink-secondary uppercase tracking-widest mb-4">
            Support &amp; Legal
          </h2>
          <div className="bg-paper-warm border border-on-surface/5 rounded-xl editorial-shadow overflow-hidden">
            <div className="divide-y divide-on-surface/5">
              <a href="#" className="p-6 flex items-center justify-between hover:bg-surface-secondary transition-colors group">
                <span className="font-body-md text-base text-ink-primary">Privacy Policy</span>
                <span className="material-symbols-outlined text-ink-secondary group-hover:translate-x-1 transition-transform">chevron_right</span>
              </a>
              <a href="#" className="p-6 flex items-center justify-between hover:bg-surface-secondary transition-colors group">
                <span className="font-body-md text-base text-ink-primary">Terms of Service</span>
                <span className="material-symbols-outlined text-ink-secondary group-hover:translate-x-1 transition-transform">chevron_right</span>
              </a>
              <a href="#" className="p-6 flex items-center justify-between hover:bg-surface-secondary transition-colors group">
                <span className="font-body-md text-base text-ink-primary">Help Center</span>
                <span className="material-symbols-outlined text-ink-secondary group-hover:translate-x-1 transition-transform">open_in_new</span>
              </a>
            </div>
          </div>
        </section>

        {/* Version footer */}
        <footer className="text-center py-8">
          <p className="font-label-sm text-xs text-ink-secondary opacity-60">App version 1.0.0</p>
          <p className="font-label-sm text-xs text-ink-secondary opacity-40 mt-1">Refined for the focused mind.</p>
        </footer>

      </div>
    </main>
  )
}
