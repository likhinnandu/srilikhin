import { useEffect, useState } from 'react'
import s from './Loader.module.css'

/** Brief curtain: the mark pulses while fonts settle, then an iris opens. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [leave, setLeave] = useState(false)
  useEffect(() => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
    const min = new Promise((r) => setTimeout(r, 700))
    const cap = new Promise((r) => setTimeout(r, 2200))
    Promise.race([Promise.all([fonts, min]), cap]).then(() => {
      setLeave(true)
      setTimeout(onDone, 900)
    })
  }, [onDone])
  return (
    <div className={`${s.wrap} ${leave ? s.leave : ''}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={s.mark}>
        <path d="M4 20 12 4l8 16H4z" fill="currentColor" />
        <circle cx="12" cy="15" r="2.4" fill="var(--accent)" />
      </svg>
    </div>
  )
}
