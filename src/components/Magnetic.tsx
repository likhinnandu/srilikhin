import { useEffect, useRef, type ReactNode } from 'react'
import { isFinePointer, prefersReducedMotion } from '../hooks/useReveal'

/** Pulls its child gently toward the pointer. No-op on touch / reduced motion. */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return
    const child = el.firstElementChild as HTMLElement | null
    if (!child) return
    child.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)'
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      child.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
    const onLeave = () => {
      child.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])
  return (
    <span ref={ref} style={{ display: 'inline-block', padding: 10, margin: -10 }}>
      {children}
    </span>
  )
}
