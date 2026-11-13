import { lazy, Suspense } from 'react'
import { scrollToHash } from '../hooks/useLenis'
import { useTheme } from '../hooks/useTheme'
import { openContact } from '../lib/contact'
import s from './Hero.module.css'

const Sculpture = lazy(() => import('../three/Sculpture'))

export default function Hero({ ready }: { ready: boolean }) {
  const { theme } = useTheme()
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToHash(hash)
  }
  return (
    <section id="top" className={`${s.hero} ${ready ? 'in' : ''}`} aria-labelledby="hero-title">
      <div className={s.stage}>
        <h1 id="hero-title" className={`display ${s.name}`}>
          <span className={s.first}>
            <span className="ln"><span className="rv" style={{ '--d': 1 } as React.CSSProperties}>Sri</span></span>
          </span>
          <span className={s.last}>
            <span className="ln"><span className="rv" style={{ '--d': 2 } as React.CSSProperties}>Likhin</span></span>
          </span>
        </h1>
        <Suspense fallback={null}>
          <Sculpture theme={theme} className={s.canvas} />
        </Suspense>
      </div>

      <div className={`container ${s.bottom}`}>
        <ul className={`${s.roles} fu`} style={{ '--d': 4 } as React.CSSProperties} aria-label="Roles">
          <li>
            <span className="tag fill">Co-founder · Krudex</span>
          </li>
          <li>
            <span className="tag">Solutions Engineer · Trundl</span>
          </li>
        </ul>
        <p className={`lede ${s.lede} fu`} style={{ '--d': 5 } as React.CSSProperties}>
          I design and build web platforms and the AI features inside them, for clients who need the whole system to work, not just the
          screens.
        </p>
        <div className={`${s.actions} fu`} style={{ '--d': 6 } as React.CSSProperties}>
          <a className="btn" href="#work" onClick={go('#work')}>
            <span>See the work</span>
            <span className="ico" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>
          <button type="button" className="btn ghost" onClick={() => openContact('Project enquiry')}>
            <span>Start a project</span>
          </button>
        </div>
      </div>

      <div className={`${s.meta} mono muted fu`} style={{ '--d': 7 } as React.CSSProperties} aria-hidden="true">
        <span>Hyderabad, IN</span>
        <span>Portfolio 2026</span>
      </div>
    </section>
  )
}
