import { useState, useEffect, type CSSProperties } from 'react'

const IDLE_MS      = Number(import.meta.env.VITE_LOGO_IDLE_MS          ?? 3000)
const SPIN_MS      = Number(import.meta.env.VITE_LOGO_SPIN_DURATION_MS ?? 2000)
const ROTATIONS    = Number(import.meta.env.VITE_LOGO_SPIN_ROTATIONS   ?? 3)

export function useLogoSpin(): CSSProperties | undefined {
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>
    let spinTimer: ReturnType<typeof setTimeout>

    function cycle() {
      idleTimer = setTimeout(() => {
        setSpinning(true)
        spinTimer = setTimeout(() => {
          setSpinning(false)
          cycle()
        }, SPIN_MS * ROTATIONS)
      }, IDLE_MS)
    }

    cycle()
    return () => {
      clearTimeout(idleTimer)
      clearTimeout(spinTimer)
    }
  }, [])

  return spinning
    ? { animation: `logo-spin ${SPIN_MS}ms linear 0s ${ROTATIONS}` }
    : undefined
}
