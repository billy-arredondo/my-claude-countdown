import { useEffect } from 'react'
import { useQuotesStore } from '../../stores/quotesStore'
import { fetchRandomQuote } from '../../utils/quotes'

export default function QuoteBlock() {
  const quote       = useQuotesStore(s => s.quote)
  const author      = useQuotesStore(s => s.author)
  const intervalMs  = useQuotesStore(s => s.intervalMs)
  const setQuote    = useQuotesStore(s => s.setQuote)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    let cancelled = false
    const ctrl = new AbortController()

    const doFetch = async () => {
      try {
        const result = await fetchRandomQuote(ctrl.signal)
        setQuote(result.quote, result.author, Date.now())
      } catch {
        // keep cached quote on error or abort
      }
    }

    const schedule = () => {
      const elapsed = Date.now() - useQuotesStore.getState().fetchedAt
      const wait = Math.max(0, intervalMs - elapsed)
      timer = setTimeout(async () => {
        if (cancelled) return
        await doFetch()
        if (!cancelled) schedule()
      }, wait)
    }

    schedule()
    return () => {
      cancelled = true
      ctrl.abort()
      clearTimeout(timer)
    }
  }, [intervalMs])

  return (
    <div className="relative w-full py-12 px-gutter bg-surface-secondary/30 rounded-xl border border-surface-container-high overflow-hidden">
      <div className="relative z-10 text-center max-w-sm mx-auto">
        <p className="font-display-lg text-xl text-ink-primary italic leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        {author && (
          <p className="mt-3 font-label-sm text-sm text-ink-secondary">— {author}</p>
        )}
      </div>
    </div>
  )
}
