import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const QUOTE_INTERVALS = [1, 5, 15, 60] as const
export type QuoteIntervalMinutes = typeof QUOTE_INTERVALS[number]

const DEFAULT_QUOTE = 'Your concentration is the true resource. We just track the tokens.'
const DEFAULT_INTERVAL_MS = 5 * 60 * 1000

interface QuotesStore {
  quote: string
  author: string
  fetchedAt: number
  intervalMs: number
  setQuote: (q: string, a: string, fetchedAt: number) => void
  setIntervalMinutes: (min: QuoteIntervalMinutes) => void
}

export const useQuotesStore = create<QuotesStore>()(
  persist(
    (set) => ({
      quote: DEFAULT_QUOTE,
      author: '',
      fetchedAt: 0,
      intervalMs: DEFAULT_INTERVAL_MS,
      setQuote: (quote, author, fetchedAt) => set({ quote, author, fetchedAt }),
      setIntervalMinutes: (min) => set({ intervalMs: min * 60 * 1000 }),
    }),
    {
      name: 'quotes',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        quote: s.quote,
        author: s.author,
        fetchedAt: s.fetchedAt,
        intervalMs: s.intervalMs,
      }),
    }
  )
)
