/**
 * A generative mark for each case study: seeded rings, ticks and arcs so
 * every project has its own visual signature without faking screenshots.
 */
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
}

export default function Signature({ seed, className }: { seed: string; className?: string }) {
  const rnd = hash(seed)
  const rings = 5 + Math.floor(rnd() * 3)
  const arcs = Array.from({ length: rings }, (_, i) => {
    const r = 34 + i * (62 / rings) + rnd() * 6
    const start = rnd() * 360
    const len = 60 + rnd() * 220
    const w = 1 + rnd() * 2.2
    const accent = rnd() > 0.72
    return { r, start, len, w, accent }
  })
  const ticks = Array.from({ length: 28 }, (_, i) => ({ a: (i / 28) * 360, l: 3 + rnd() * 9, on: rnd() > 0.35 }))
  const arc = (r: number, start: number, len: number) => {
    const s = (start * Math.PI) / 180
    const e = ((start + len) * Math.PI) / 180
    const x1 = 100 + r * Math.cos(s)
    const y1 = 100 + r * Math.sin(s)
    const x2 = 100 + r * Math.cos(e)
    const y2 = 100 + r * Math.sin(e)
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${len > 180 ? 1 : 0} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`
  }
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        {ticks.map((t, i) => {
          const a = (t.a * Math.PI) / 180
          const r1 = 96
          const r2 = 96 - t.l
          return (
            <line
              key={i}
              x1={100 + r1 * Math.cos(a)}
              y1={100 + r1 * Math.sin(a)}
              x2={100 + r2 * Math.cos(a)}
              y2={100 + r2 * Math.sin(a)}
              stroke="currentColor"
              strokeOpacity={t.on ? 0.5 : 0.18}
              strokeWidth="1.2"
            />
          )
        })}
        {arcs.map((a, i) => (
          <path
            key={i}
            d={arc(a.r, a.start, a.len)}
            stroke={a.accent ? 'var(--accent)' : 'currentColor'}
            strokeOpacity={a.accent ? 1 : 0.75}
            strokeWidth={a.w}
            style={{ transformOrigin: '100px 100px', animationDelay: `${i * -1.7}s` }}
            data-ring
          />
        ))}
        <circle cx="100" cy="100" r="7" fill="var(--accent)" />
      </g>
    </svg>
  )
}
