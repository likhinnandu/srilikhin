import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useReveal } from '../hooks/useReveal'
import { openContact } from '../lib/contact'
import s from './Contact.module.css'

function useClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timezone })
    const tick = () => setT(f.format(new Date()))
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Contact() {
  const ref = useReveal<HTMLElement>(0.2)
  const [copied, setCopied] = useState(false)
  const time = useClock()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      openContact('Project enquiry')
    }
  }

  return (
    <section ref={ref} id="contact" className={`section ${s.wrap}`} aria-labelledby="contact-title">
      <div className="container">
        <div className={s.card}>
          <p className="mono label fu">Contact</p>
          <h2 id="contact-title" className={`display ${s.title}`}>
            <span className="ln"><span className="rv" style={{ '--d': 1 } as React.CSSProperties}>Let's build</span></span>
            <span className="ln"><span className={`rv ${s.outline}`} style={{ '--d': 2 } as React.CSSProperties}>something</span></span>
            <span className="ln"><span className="rv" style={{ '--d': 3 } as React.CSSProperties}>that works.</span></span>
          </h2>

          <div className={s.grid}>
            <div className={`fu ${s.mailBlock}`} style={{ '--d': 4 } as React.CSSProperties}>
              <a className={s.mail} href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <p className={`lede ${s.note}`}>
                Client work goes through Krudex. Roles and collaborations reach me directly. One email is enough either way.
              </p>
              <div className={s.actions}>
                <button type="button" className="btn" onClick={() => openContact('Project enquiry')}>
                  <span>Start a project</span>
                </button>
                <button className="btn ghost" type="button" onClick={copy}>
                  <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
                </button>
              </div>
            </div>

            <ul className={`${s.links} fu`} style={{ '--d': 5 } as React.CSSProperties}>
              <li>
                <span className="mono muted">LinkedIn</span>
                <a href={profile.links.linkedin} target="_blank" rel="noopener">
                  sri-likhin-prasad
                </a>
              </li>
              <li>
                <span className="mono muted">GitHub</span>
                <a href={profile.links.github} target="_blank" rel="noopener">
                  likhinnandu
                </a>
              </li>
              <li>
                <span className="mono muted">Studio</span>
                <a href={profile.links.krudex} target="_blank" rel="noopener">
                  krudex.in
                </a>
              </li>
              <li>
                <span className="mono muted">Local time</span>
                <span>
                  <time>{time}</time> IST
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
