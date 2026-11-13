import { certifications, experience, skills } from '../data/profile'
import { useReveal } from '../hooks/useReveal'
import { useScrollProgress } from '../hooks/useScrollProgress'
import s from './Experience.module.css'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmt = (d: string) => {
  if (d === 'now') return 'Now'
  const [y, m] = d.split('-')
  return `${months[Number(m) - 1]} ${y}`
}

export default function Experience() {
  const head = useReveal<HTMLDivElement>(0.2)
  const line = useScrollProgress<HTMLOListElement>(0.8, 0.45)
  const lower = useReveal<HTMLDivElement>(0.15)
  return (
    <section id="experience" className={`section ${s.wrap}`} aria-labelledby="exp-title">
      <div className="container">
        <div ref={head} className="head">
          <p className="mono label fu">Experience</p>
          <h2 id="exp-title" className="h2">
            <span className="ln"><span className="rv" style={{ '--d': 1 } as React.CSSProperties}>Where the work</span></span>
            <span className="ln"><span className="rv" style={{ '--d': 2 } as React.CSSProperties}>has happened.</span></span>
          </h2>
        </div>

        <ol ref={line} className={s.timeline}>
          {experience.map((e, i) => (
            <Item key={e.role + e.org} e={e} i={i} />
          ))}
        </ol>

        <div ref={lower} className={s.lower}>
          <div className={`${s.panel} fu`}>
            <p className="mono label">Toolkit</p>
            <dl className={s.skills}>
              {skills.map((g) => (
                <div key={g.group}>
                  <dt className="mono muted">{g.group}</dt>
                  <dd>
                    {g.items.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={`${s.panel} fu`} style={{ '--d': 1 } as React.CSSProperties}>
            <p className="mono label">Certifications</p>
            <ul className={s.certs}>
              {certifications.map((c) => (
                <li key={c.title}>
                  <span className={s.certTitle}>{c.title}</span>
                  <span className="mono muted">
                    {c.org} · {fmt(c.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Item({ e, i }: { e: (typeof experience)[number]; i: number }) {
  const ref = useReveal<HTMLLIElement>(0.3)
  return (
    <li ref={ref} className={`${s.item} ${e.current ? s.current : ''}`} style={{ '--i': i } as React.CSSProperties}>
      <span className={s.dot} aria-hidden="true" />
      <span className={`${s.when} mono fu`}>
        {fmt(e.from)} <span aria-hidden="true">→</span> {fmt(e.to)}
      </span>
      <div className={s.what}>
        <h3 className={`${s.role} display fu`} style={{ '--d': 1 } as React.CSSProperties}>
          {e.role}
        </h3>
        <p className={`muted fu`} style={{ '--d': 2 } as React.CSSProperties}>
          {e.org} · {e.place}
        </p>
      </div>
      {e.current && <span className={`tag fill ${s.now} fu`} style={{ '--d': 3 } as React.CSSProperties}>Current</span>}
    </li>
  )
}
