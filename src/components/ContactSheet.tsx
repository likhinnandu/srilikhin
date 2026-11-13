import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { getLenis } from '../hooks/useLenis'
import { EVENT, gmailUrl, mailtoUrl, outlookUrl } from '../lib/contact'
import s from './ContactSheet.module.css'

/**
 * One sheet behind every "contact" button. It never relies on a mail app
 * being installed: Gmail and Outlook open in the browser, the address can
 * be copied, and the mail-app route is there for people who have one.
 */
export default function ContactSheet() {
  const ref = useRef<HTMLDialogElement>(null)
  const [subject, setSubject] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const close = useCallback(() => setSubject(null), [])

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<{ subject: string }>).detail
      setCopied(false)
      setSubject(d?.subject || 'Project enquiry')
    }
    window.addEventListener(EVENT, onOpen)
    return () => window.removeEventListener(EVENT, onOpen)
  }, [])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (subject) {
      if (!d.open) d.showModal()
      getLenis()?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else if (d.open) {
      d.close()
      getLenis()?.start()
      document.documentElement.style.overflow = ''
    }
  }, [subject])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      close()
    }
    const onClick = (e: MouseEvent) => {
      if (e.target === d) close()
    }
    d.addEventListener('cancel', onCancel)
    d.addEventListener('click', onClick)
    return () => {
      d.removeEventListener('cancel', onCancel)
      d.removeEventListener('click', onClick)
    }
  }, [close])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the address is visible to select */
    }
  }

  const subj = subject ?? 'Project enquiry'

  return (
    <dialog ref={ref} className={`${s.sheet} ${subject ? s.open : ''}`} aria-labelledby="cs-title">
      <div className={s.inner}>
        <div className={s.head}>
          <p className="mono muted">Get in touch</p>
          <button type="button" className={s.close} onClick={close} aria-label="Close">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <h2 id="cs-title" className={`${s.title} display`}>
          {subj}
        </h2>
        <p className={s.sub}>
          Write to <strong>{profile.email}</strong>. Pick whichever is easiest:
        </p>

        <div className={s.options}>
          <a className={s.option} href={gmailUrl(subj)} target="_blank" rel="noopener" onClick={close}>
            <span className={s.optIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M3 6.5 12 13l9-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <span>
              <span className={s.optTitle}>Open in Gmail</span>
              <span className={s.optSub}>Compose in a new tab</span>
            </span>
            <Arrow />
          </a>
          <a className={s.option} href={outlookUrl(subj)} target="_blank" rel="noopener" onClick={close}>
            <span className={s.optIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7 9h10M7 12h10M7 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <span className={s.optTitle}>Open in Outlook</span>
              <span className={s.optSub}>Compose on the web</span>
            </span>
            <Arrow />
          </a>
          <a className={s.option} href={mailtoUrl(subj)} onClick={close}>
            <span className={s.optIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M4 20 12 4l8 16H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <span className={s.optTitle}>Use my mail app</span>
              <span className={s.optSub}>Opens your default client</span>
            </span>
            <Arrow />
          </a>
          <button type="button" className={s.option} onClick={copy}>
            <span className={s.optIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <span>
              <span className={s.optTitle} aria-live="polite">
                {copied ? 'Copied to clipboard' : 'Copy the address'}
              </span>
              <span className={s.optSub}>{profile.email}</span>
            </span>
            <Arrow />
          </button>
        </div>

        <p className={`${s.foot} mono muted`}>
          Or on{' '}
          <a href={profile.links.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </p>
      </div>
    </dialog>
  )
}

const Arrow = () => (
  <svg className={s.arrow} viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
