import { useCallback, useEffect, useRef, useState } from 'react'
import { cases, type CaseStudy } from '../data/profile'
import { getLenis } from '../hooks/useLenis'
import { isFinePointer, prefersReducedMotion, useReveal } from '../hooks/useReveal'
import { openContact } from '../lib/contact'
import Signature from './Signature'
import s from './Work.module.css'

/**
 * Desktop: the section pins and the gallery scrolls sideways as you scroll
 * down. Phones: a vertical stack. Each card opens a detail dialog.
 */
export default function Work() {
  const head = useReveal<HTMLDivElement>(0.2)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState<CaseStudy | null>(null)
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(mq.matches && !prefersReducedMotion())
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Horizontal drive
  useEffect(() => {
    if (!wide) return
    const section = pin.current?.parentElement
    const t = track.current
    if (!section || !t) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = section.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / total))
      const dist = t.scrollWidth - window.innerWidth
      t.style.transform = `translate3d(${(-dist * p).toFixed(1)}px, 0, 0)`
      section.style.setProperty('--p', p.toFixed(4))
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
      t.style.transform = ''
    }
  }, [wide])

  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="work" className={`${s.wrap} ${wide ? s.pinned : ''}`} aria-labelledby="work-title">
      <div ref={pin} className={s.sticky}>
        <div ref={head} className={`container ${s.head}`}>
          <p className={`mono ${s.label} fu`} style={{ '--d': 0 } as React.CSSProperties}>
            Selected work
          </p>
          <h2 id="work-title" className="h2">
            <span className="ln"><span className="rv" style={{ '--d': 1 } as React.CSSProperties}>Seven systems</span></span>
            <span className="ln"><span className="rv" style={{ '--d': 2 } as React.CSSProperties}>that shipped.</span></span>
          </h2>
          <p className={`${s.hint} mono muted fu`} style={{ '--d': 3 } as React.CSSProperties}>
            {wide ? 'Scroll to move sideways' : 'Tap a card for details'}
          </p>
        </div>

        <ul ref={track} className={s.track}>
          {cases.map((c, i) => (
            <li key={c.id} className={s.item}>
              <Card c={c} i={i} onOpen={() => setOpen(c)} />
            </li>
          ))}
          {wide && (
            <li className={`${s.item} ${s.end}`} aria-hidden="true">
              <button type="button" className="btn" tabIndex={-1} onClick={() => openContact('Project enquiry')}>
                <span>Yours next?</span>
              </button>
            </li>
          )}
        </ul>
        {wide && (
          <div className={s.bar} aria-hidden="true">
            <i />
          </div>
        )}
      </div>

      <Dialog c={open} onClose={close} />
    </section>
  )
}

function Card({ c, i, onOpen }: { c: CaseStudy; i: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const reveal = useReveal<HTMLDivElement>(0.1)

  // Pointer tilt on fine pointers
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
      el.style.setProperty('--mx', `${(x * 100 + 50).toFixed(1)}%`)
      el.style.setProperty('--my', `${(y * 100 + 50).toFixed(1)}%`)
    }
    const onLeave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={reveal} className={s.cardWrap}>
      <button
        ref={ref}
        type="button"
        className={`${s.card} sc`}
        style={{ '--d': i % 3 } as React.CSSProperties}
        onClick={onOpen}
        aria-haspopup="dialog"
      >
        <span className={s.glare} aria-hidden="true" />
        <span className={s.cardTop}>
          <span className="mono">{c.index}</span>
          <span className="tag">{c.tag}</span>
        </span>
        <Signature seed={c.id} className={s.sig} />
        <span className={s.cardBottom}>
          <span className={`h3 ${s.title}`}>{c.title}</span>
          <span className={s.more}>
            Details
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  )
}

function Dialog({ c, onClose }: { c: CaseStudy | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [shown, setShown] = useState<CaseStudy | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (c) {
      setShown(c)
      if (!d.open) d.showModal()
      getLenis()?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else if (d.open) {
      d.close()
      getLenis()?.start()
      document.documentElement.style.overflow = ''
    }
  }, [c])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }
    const onClick = (e: MouseEvent) => {
      if (e.target === d) onClose()
    }
    d.addEventListener('cancel', onCancel)
    d.addEventListener('click', onClick)
    return () => {
      d.removeEventListener('cancel', onCancel)
      d.removeEventListener('click', onClick)
    }
  }, [onClose])

  const v = c ?? shown
  return (
    <dialog ref={ref} className={`${s.dialog} ${c ? s.dialogOpen : ''}`} aria-labelledby="dlg-title">
      {v && (
        <div className={s.dialogInner}>
          <div className={s.dialogHead}>
            <span className="tag">{v.tag}</span>
            <button type="button" className={s.close} onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className={s.dialogBody}>
            <Signature seed={v.id} className={s.dialogSig} />
            <div>
              <span className="mono muted">{v.index} / 07</span>
              <h3 id="dlg-title" className={`h2 ${s.dialogTitle}`}>
                {v.title}
              </h3>
              <p className={`lede ${s.dialogSum}`}>{v.summary}</p>
              <dl className={s.meta}>
                {v.meta.map(([k, val]) => (
                  <div key={k}>
                    <dt className="mono muted">{k}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
              <div className={s.dialogActions}>
                {v.href && (
                  <a className="btn" href={v.href} target="_blank" rel="noopener">
                    <span>{v.href.includes('github') ? 'View repository' : 'Visit site'}</span>
                    <span className="ico" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                        <path d="M3 13 13 3M6 3h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                )}
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    onClose()
                    setTimeout(() => openContact(`About ${v.title}`), 80)
                  }}
                >
                  <span>Ask about this</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
