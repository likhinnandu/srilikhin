import { useCallback, useEffect, useState } from 'react'
import { useLenis } from './hooks/useLenis'
import { prefersReducedMotion } from './hooks/useReveal'
import Contact from './components/Contact'
import ContactSheet from './components/ContactSheet'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Loader from './components/Loader'
import Marquee from './components/Marquee'
import Nav from './components/Nav'
import Process from './components/Process'
import Services from './components/Services'
import Statement from './components/Statement'
import Work from './components/Work'

export default function App() {
  const [loaded, setLoaded] = useState(() => prefersReducedMotion() || sessionStorage.getItem('seen') === '1')
  const [ready, setReady] = useState(loaded)
  const done = useCallback(() => {
    sessionStorage.setItem('seen', '1')
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const id = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(id)
  }, [loaded])

  // Page scroll progress line
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.progress')
    if (!el) return
    let raf = 0
    const on = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = document.documentElement.scrollHeight - window.innerHeight
        el.style.setProperty('--p', (max > 0 ? window.scrollY / max : 0).toFixed(4))
      })
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useLenis(loaded)

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="progress" aria-hidden="true" />
      {!loaded && <Loader onDone={done} />}
      <Nav ready={ready} />
      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <Statement />
        <Work />
        <Services />
        <Process />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ContactSheet />
    </>
  )
}
