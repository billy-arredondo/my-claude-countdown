import { useState, useEffect, useRef } from 'react'

export function useToast(): { message: string | null; show: (msg: string) => void } {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  function show(msg: string) {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    setMessage(msg)
    timerRef.current = setTimeout(() => {
      setMessage(null)
      timerRef.current = null
    }, 2200)
  }

  return { message, show }
}
