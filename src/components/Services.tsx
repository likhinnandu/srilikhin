import { useState } from 'react'
import { capabilities } from '../data/profile'
import { useReveal } from '../hooks/useReveal'
import s from './Services.module.css'

export default function Services() {
  const ref = useReveal<HTMLElement>(0.15)
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section ref={ref} id="services" className={`section ${s.wrap}`} aria-labelledby="services-title">
      <div className="container">
        <div className="head">
          <p className="mono label fu">What I do</p>
          <h2 id="services-title" className="h2">
            <span className="ln"><span className="rv" style={{ '--d': 1 } as React.CSSProperties}>Three ways</span></span>
            <span className="ln"><span className="rv" style={{ '--d': 2 } as React.CSSProperties}>I can help.</span></span>
          </h2>
        </div>

        <ul className={s.list}>
          {capabilities.map((c, i) => {
            const open = openIdx === i
            return (
              <li key={c.index} className={`${s.row} ${open ? s.open : ''} fu`} style={{ '--d': 3 + i } as React.CSSProperties}>
                <button
                  type="button"
                  className={s.trigger}
                  aria-expanded={open}
                  aria-controls={`svc-${i}`}
                  onClick={() => setOpenIdx(open ? -1 : i)}
                >
                  <span className={`${s.num} mono`}>{c.index}</span>
                  <span className={`${s.title} display`}>{c.title}</span>
                  <span className={s.plus} aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </button>
                <div id={`svc-${i}`} className={s.panel} role="region" aria-label={c.title}>
                  <div className={s.panelInner}>
                    <p className={`lede ${s.text}`}>{c.text}</p>
                    <ul className={s.tools} aria-label="Tools">
                      {c.tools.map((t) => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
