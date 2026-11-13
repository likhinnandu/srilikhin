import { useEffect, useRef } from 'react'
import { approach } from '../data/profile'
import { prefersReducedMotion, useReveal } from '../hooks/useReveal'
import s from './Process.module.css'

/**
 * Stacking cards: each step sticks near the top and the earlier ones
 * shrink and fade as the next one slides over them.
 */
export default function Process() {
  const head = useReveal<HTMLDivElement>(0.2)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = list.current
    if (!el || prefersReducedMotion()) return
    const cards = Array.from(el.children) as HTMLElement[]
    let raf = 0
    const update = () => {
      raf = 0
      const top = parseFloat(getComputedStyle(cards[0]).top) || 0
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) {
          card.style.setProperty('--k', '0')
          return
        }
        const r = next.getBoundingClientRect()
        const h = card.getBoundingClientRect().height
        // 0 when the next card is fully below, 1 when it has covered this one
        const k = Math.min(1, Math.max(0, (top + h - r.top) / h))
        card.style.setProperty('--k', k.toFixed(3))
      })
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
  }, [])

  return (
    <section id="process" className={`section ${s.wrap}`} aria-labelledby="process-title">
      <div className="container">
        <div ref={head} className={`head ${s.head}`}>
          <p className="mono label fu">How I work</p>
          <h2 id="process-title" className="h2">
            <span className="ln"><span className="rv" style={{ '--d': 1 } as React.CSSProperties}>Four steps.</span></span>
            <span className="ln"><span className="rv" style={{ '--d': 2 } as React.CSSProperties}>No surprises.</span></span>
          </h2>
          <p className={`lede ${s.intro} fu`} style={{ '--d': 3 } as React.CSSProperties}>
            Clients see the plan before the code, and progress in slices they can use. That is how a two-person studio ships like a bigger
            one.
          </p>
        </div>

        <ol ref={list} className={s.stack}>
          {approach.map((a, i) => (
            <li key={a.index} className={s.card} style={{ '--i': i } as React.CSSProperties}>
              <div className={s.cardInner}>
                <span className={`${s.num} display`}>{a.index}</span>
                <div className={s.body}>
                  <h3 className={`${s.title} display`}>{a.title}</h3>
                  <p className={`lede ${s.text}`}>{a.text}</p>
                </div>
                <span className={`${s.count} mono`}>
                  {i + 1} / {approach.length}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
