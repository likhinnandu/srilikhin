# Sri Likhin — portfolio

Personal site for Sri Likhin: co-founder of Krudex, Associate Solutions Engineer at Trundl.

## Stack

- Vite 8 + React 19 + TypeScript
- Three.js via React Three Fiber for the hero sculpture, a twisted stack of plates lit by a studio environment (lazy-loaded, with a CSS fallback when WebGL is unavailable)
- Lenis for smooth scrolling
- Plain CSS with design tokens in `src/styles/global.css` and CSS Modules per component

## Run

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes a static bundle to `dist/`. Deploy to Vercel as a static Vite project; no server is needed.

## Theme

Dark (night HUD: navy and arc-reactor cyan) is the default. The toggle in the nav switches to light (daylight HUD: steel panels and deep navy ink), and the choice is saved in `localStorage.theme`. The hero HUD re-colours itself for each theme.

## Motion

The site honours the operating system's reduced-motion setting: fades still play, but parallax, the horizontal gallery, stacking cards, the marquee and the sculpture's drift are switched off. To see the full experience on a device with reduced motion enabled, run this once in the browser console and reload:

```js
localStorage.setItem('motion', 'full')
```

On Windows the system setting lives under Settings → Accessibility → Visual effects → Animation effects.

## Contact buttons

Every contact button opens a sheet (`src/components/ContactSheet.tsx`) with Gmail, Outlook on the web, the default mail app and a copy-address option, so it works even on machines with no mail client configured. Subjects are passed through `openContact()` in `src/lib/contact.ts`.

## Edit content

All copy, case studies, experience, skills and links live in `src/data/profile.ts`. Each case study gets a generated signature mark from its `id` (see `src/components/Signature.tsx`).

The Open Graph image is `public/og.png` (1200×630).
