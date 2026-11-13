import { useEffect, useRef } from 'react'

/**
 * Writes a 0..1 CSS variable (--p) on the element describing how far it has
 * travelled through the viewport. `start`/`end` are viewport fractions:
 * progress is 0 when the element's top hits `start * vh`, 1 when its bottom
 * hits `end * vh`.
 */
export function useScrollProgress<T extends HTMLElement>(start = 0.9, end = 0.3, name = '--p') {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const from = vh * start
      const to = vh * end - r.height
      const p = Math.min(1, Math.max(0, (from - r.top) / (from - to)))
      el.style.setProperty(name, p.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [start, end, name])
  return ref
}
