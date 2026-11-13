import { useEffect, useState } from 'react'
import { scrollToHash } from '../hooks/useLenis'
import { useTheme } from '../hooks/useTheme'
import { openContact } from '../lib/contact'
import s from './Nav.module.css'

const links = [
  ['Work', '#work'],
  ['Services', '#services'],
  ['Process', '#process'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
] as const

export default function Nav({ ready }: { ready: boolean }) {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [compact, setCompact] = useState(false)

  // Which section is on screen
  useEffect(() => {
    const ids = links.map(([, h]) => h.slice(1))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive('#' + e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const onScroll = () => setCompact(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    history.replaceState(null, '', hash)
    setTimeout(() => scrollToHash(hash), open ? 60 : 0)
  }

  return (
    <header className={`${s.wrap} ${ready ? s.ready : ''} ${compact ? s.compact : ''}`}>
      <div className={`${s.pill} ${open ? s.open : ''}`}>
        <a className={s.brand} href="#top" onClick={go('#top')} aria-label="Sri Likhin, back to top">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={s.mark}>
            <path d="M4 20 12 4l8 16H4z" fill="currentColor" />
            <circle cx="12" cy="15" r="2.4" fill="var(--accent)" />
          </svg>
          <span className={s.name}>Sri Likhin</span>
        </a>

        <nav className={s.links} aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={go(href)} className={s.link} aria-current={active === href ? 'true' : undefined}>
              {label}
            </a>
          ))}
        </nav>

        <div className={s.right}>
          <button
            type="button"
            className={s.theme}
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            <span className={s.themeTrack} data-theme={theme}>
              <span className={s.themeKnob}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.sun}>
                  <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
                  </g>
                </svg>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.moon}>
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor" />
                </svg>
              </span>
            </span>
          </button>
          <button type="button" className={s.cta} onClick={() => openContact('Project enquiry')}>
            Let's talk
          </button>
          <button
            type="button"
            className={s.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`${s.sheet} ${open ? s.sheetOpen : ''}`} aria-hidden={!open}>
        {links.map(([label, href], i) => (
          <a key={href} href={href} onClick={go(href)} className={s.sheetLink} tabIndex={open ? 0 : -1} style={{ '--i': i } as React.CSSProperties}>
            <span className="mono muted">0{i + 1}</span>
            {label}
          </a>
        ))}
        <button
          type="button"
          className={`btn ${s.sheetCta}`}
          tabIndex={open ? 0 : -1}
          onClick={() => {
            setOpen(false)
            openContact('Project enquiry')
          }}
        >
          <span>Start a project</span>
        </button>
      </div>
    </header>
  )
}
