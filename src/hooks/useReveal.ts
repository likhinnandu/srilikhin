import { useEffect, useRef } from 'react'

/**
 * Adds the `in` class to the element once it enters the viewport.
 * Children using .rv / .fu / .hl pick it up via CSS.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.18, once = true) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('in')
            if (once) io.unobserve(el)
          } else if (!once) {
            el.classList.remove('in')
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])
  return ref
}

export function useMedia(query: string, initial = false) {
  const ref = useRef(initial)
  if (typeof window !== 'undefined') ref.current = window.matchMedia(query).matches
  return ref.current
}

/**
 * True when the OS asks for reduced motion. Setting localStorage.motion = 'full'
 * opts back in to the complete experience on that device.
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  try {
    if (localStorage.getItem('motion') === 'full') {
      document.documentElement.setAttribute('data-motion', 'full')
      return false
    }
  } catch {
    /* noop */
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
