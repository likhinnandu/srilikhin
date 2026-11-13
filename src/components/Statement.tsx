import { useScrollProgress } from '../hooks/useScrollProgress'
import s from './Statement.module.css'

const text =
  'Two jobs, one habit. At Krudex I co-run a studio that ships websites and the services behind them for clients. At Trundl I work between architecture and what people actually see. Both come down to the same thing: make the system clear, then make it work.'

export default function Statement() {
  const ref = useScrollProgress<HTMLElement>(0.85, 0.55)
  const words = text.split(' ')
  return (
    <section ref={ref} className={`section ${s.wrap}`} aria-label="About">
      <div className="container">
        <p className={s.text} style={{ '--n': words.length } as React.CSSProperties}>
          {words.map((w, i) => (
            <span key={i} className={s.word} style={{ '--i': i } as React.CSSProperties}>
              {w}{' '}
            </span>
          ))}
        </p>
        <div className={s.facts}>
          <div>
            <span className={`${s.big} display`}>02</span>
            <span className="mono muted">Roles, one discipline</span>
          </div>
          <div>
            <span className={`${s.big} display`}>07</span>
            <span className="mono muted">Systems shipped</span>
          </div>
          <div>
            <span className={`${s.big} display`}>HYD</span>
            <span className="mono muted">Based in Hyderabad</span>
          </div>
        </div>
      </div>
    </section>
  )
}
