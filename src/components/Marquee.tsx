import s from './Marquee.module.css'

const items = [
  'Web platforms',
  'Applied AI',
  'Solutions engineering',
  'Next.js',
  'NestJS',
  'FastAPI',
  'PostgreSQL',
  'RAG',
  'LangChain',
  'Krudex studio',
]

export default function Marquee() {
  const row = [...items, ...items]
  return (
    <div className={s.wrap} aria-hidden="true">
      <div className={s.track}>
        {row.map((t, i) => (
          <span key={i} className={s.item}>
            {t}
            <i />
          </span>
        ))}
      </div>
    </div>
  )
}
