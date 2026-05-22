import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export function useApplyTheme() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement

    const apply = (isDark: boolean) => root.classList.toggle('dark', isDark)

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const handler = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      apply(theme === 'dark')
    }
  }, [theme])
}
