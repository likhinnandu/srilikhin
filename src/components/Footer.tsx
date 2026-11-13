import { scrollToHash } from '../hooks/useLenis'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.foot}>
      <div className={`container ${s.inner}`}>
        <span className="mono muted">© {new Date().getFullYear()} Sri Likhin</span>
        <span className="mono muted">Designed and built by hand</span>
        <button
          type="button"
          className={`mono ${s.top}`}
          onClick={() => {
            history.replaceState(null, '', ' ')
            scrollToHash('#top')
          }}
        >
          Top
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </footer>
  )
}
