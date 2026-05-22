import { useState, useEffect, useRef } from 'react'

export function useNowTick(onTick: (now: number) => void): number {
  const [nowMs, setNowMs] = useState(() => Date.now())
  const onTickRef = useRef(onTick)
  onTickRef.current = onTick

  useEffect(() => {
    const now = Date.now()
    onTickRef.current(now)
    setNowMs(now)
    const id = setInterval(() => {
      const t = Date.now()
      onTickRef.current(t)
      setNowMs(t)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return nowMs
}
