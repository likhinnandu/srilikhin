import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { isFinePointer, prefersReducedMotion } from '../hooks/useReveal'
import type { Theme } from '../hooks/useTheme'

/* ----------------------------------------------------------------
   A holographic HUD core: wireframe sphere with a scanning glow,
   gyroscope rings, dashed arcs, tick dials, a radar sweep and a
   particle halo. Sits behind the hero type and follows the pointer.
---------------------------------------------------------------- */

const palettes = {
  light: { line: '#0e2a44', accent: '#0a86b3', glow: '#22c6f2', lineOpacity: 0.34, accentOpacity: 0.9, glowOpacity: 0.26, additive: false },
  dark: { line: '#bfe9ff', accent: '#3fd8ff', glow: '#3fd8ff', lineOpacity: 0.42, accentOpacity: 1, glowOpacity: 0.65, additive: true },
}

const circle = (r: number, n = 160) => new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2, false, 0).getPoints(n))
const arc = (r: number, a0: number, a1: number, n = 72) => new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, r, r, a0, a1, false, 0).getPoints(n))

function ticks(r: number, count: number, longEvery: number, len = 0.1, longLen = 0.22) {
  const pos: number[] = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const l = i % longEvery === 0 ? longLen : len
    pos.push(Math.cos(a) * r, Math.sin(a) * r, 0, Math.cos(a) * (r - l), Math.sin(a) * (r - l), 0)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  return g
}

function wedge(r0: number, r1: number, span: number, n = 40) {
  const pos: number[] = []
  const alpha: number[] = []
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * span
    const a1 = ((i + 1) / n) * span
    const f0 = i / n
    const f1 = (i + 1) / n
    const p = (a: number, r: number) => [Math.cos(a) * r, Math.sin(a) * r, 0]
    pos.push(...p(a0, r0), ...p(a0, r1), ...p(a1, r1), ...p(a0, r0), ...p(a1, r1), ...p(a1, r0))
    alpha.push(f0, f0, f1, f0, f1, f1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('alpha', new THREE.Float32BufferAttribute(alpha, 1))
  return g
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255,255,255,0.9)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.28)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const sphereVert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position;
    gl_Position = projectionMatrix * mv;
  }
`
const sphereFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uColor; uniform float uTime; uniform float uOpacity;
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main(){
    float fres = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.6);
    float scan = smoothstep(0.92, 1.0, sin(vP.y * 26.0 - uTime * 2.2)) * 0.5;
    float band = smoothstep(0.02, 0.0, abs(vP.y - sin(uTime * 0.7) * 0.7)) * 0.9;
    float a = (fres * 0.9 + scan * 0.25 + band) * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`
const wedgeVert = /* glsl */ `
  attribute float alpha; varying float vA;
  void main(){ vA = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const wedgeFrag = /* glsl */ `
  precision highp float; uniform vec3 uColor; uniform float uOpacity; varying float vA;
  void main(){ gl_FragColor = vec4(uColor, vA * vA * uOpacity); }
`

function Hud({ theme, reduced }: { theme: Theme; reduced: boolean }) {
  const root = useRef<THREE.Group>(null)
  const r1 = useRef<THREE.Group>(null)
  const r2 = useRef<THREE.Group>(null)
  const r3 = useRef<THREE.Group>(null)
  const gyroA = useRef<THREE.Group>(null)
  const gyroB = useRef<THREE.Group>(null)
  const core = useRef<THREE.Group>(null)
  const sweep = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Points>(null)
  const { size, camera } = useThree()
  const target = useRef({ x: 0, y: 0 })
  const cur = useRef({ x: 0, y: 0 })
  const fine = useMemo(() => isFinePointer(), [])

  const geo = useMemo(() => {
    const haloPos: number[] = []
    for (let i = 0; i < 220; i++) {
      const r = 2.9 + Math.random() * 0.9
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      haloPos.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph) * 0.5)
    }
    const halo = new THREE.BufferGeometry()
    halo.setAttribute('position', new THREE.Float32BufferAttribute(haloPos, 3))
    return {
      c1: circle(1.55),
      c1b: circle(1.62),
      arcs1: [arc(1.78, 0.1, 1.3), arc(1.78, 2.2, 3.1), arc(1.78, 4.0, 5.6)],
      c2: circle(2.1),
      ticks2: ticks(2.06, 120, 10),
      c3: circle(2.62, 200),
      c3b: circle(2.72, 200),
      arcs3: [arc(2.68, 0.3, 1.2), arc(2.68, 3.4, 5.3)],
      ticks3: ticks(2.62, 36, 6, 0.06, 0.14),
      gyro: circle(1.25),
      gyro2: circle(1.32),
      wire: new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.92, 1)),
      verts: new THREE.IcosahedronGeometry(0.92, 2),
      sphere: new THREE.SphereGeometry(0.86, 48, 48),
      wedge: wedge(0.2, 1.5, 1.25),
      halo,
    }
  }, [])

  const mats = useMemo(() => {
    const line = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
    const accent = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
    const dash = new THREE.LineDashedMaterial({ transparent: true, depthWrite: false, dashSize: 0.16, gapSize: 0.1 })
    const points = new THREE.PointsMaterial({ size: 0.05, transparent: true, depthWrite: false, sizeAttenuation: true })
    const haloPts = new THREE.PointsMaterial({ size: 0.03, transparent: true, depthWrite: false, sizeAttenuation: true })
    const sphere = new THREE.ShaderMaterial({
      vertexShader: sphereVert,
      fragmentShader: sphereFrag,
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color() }, uTime: { value: 0 }, uOpacity: { value: 1 } },
    })
    const wedgeM = new THREE.ShaderMaterial({
      vertexShader: wedgeVert,
      fragmentShader: wedgeFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color() }, uOpacity: { value: 1 } },
    })
    const glow = new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false })
    return { line, accent, dash, points, haloPts, sphere, wedge: wedgeM, glow }
  }, [])

  const arcLines = useMemo(
    () => ({
      a1: geo.arcs1.map((g) => new THREE.Line(g, mats.accent)),
      a3: geo.arcs3.map((g) => new THREE.Line(g, mats.accent)),
    }),
    [geo, mats],
  )

  // Theme palette
  useEffect(() => {
    const p = palettes[theme]
    const blend = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    mats.line.color.set(p.line)
    mats.line.opacity = p.lineOpacity
    mats.dash.color.set(p.line)
    mats.dash.opacity = p.lineOpacity + 0.15
    mats.accent.color.set(p.accent)
    mats.accent.opacity = p.accentOpacity
    mats.points.color.set(p.accent)
    mats.points.opacity = p.accentOpacity
    mats.haloPts.color.set(p.line)
    mats.haloPts.opacity = p.lineOpacity + 0.2
    mats.sphere.uniforms.uColor.value.set(p.glow)
    mats.sphere.uniforms.uOpacity.value = p.additive ? 0.9 : 0.55
    mats.wedge.uniforms.uColor.value.set(p.glow)
    mats.wedge.uniforms.uOpacity.value = p.additive ? 0.55 : 0.35
    mats.glow.color.set(p.glow)
    mats.glow.opacity = p.glowOpacity
    for (const m of [mats.sphere, mats.wedge, mats.glow, mats.points, mats.accent]) {
      m.blending = blend
      m.needsUpdate = true
    }
  }, [theme, mats])

  useEffect(() => {
    if (!fine) return
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine])

  useEffect(() => {
    const aspect = size.width / size.height
    const cam = camera as THREE.PerspectiveCamera
    cam.fov = 34
    cam.position.set(0, 0, aspect < 0.8 ? 13.5 : aspect < 1.2 ? 11 : 9.6)
    cam.lookAt(0, 0, 0)
    cam.updateProjectionMatrix()
  }, [size, camera])

  useFrame((state, dt) => {
    const g = root.current
    if (!g) return
    // Reduced motion slows the HUD and drops the scroll parallax; it never freezes it.
    const t = reduced ? 1.3 + state.clock.elapsedTime * 0.45 : state.clock.elapsedTime
    const k = Math.min(1, dt * 2.5)
    cur.current.x += (target.current.x - cur.current.x) * k
    cur.current.y += (target.current.y - cur.current.y) * k
    const scroll = reduced ? 0 : Math.min(1.5, window.scrollY / window.innerHeight)

    g.rotation.x = -0.18 + cur.current.y * 0.16 + scroll * 0.5
    g.rotation.y = cur.current.x * 0.22
    g.position.y = -scroll * 1.4
    const sc = 1 + scroll * 0.25
    g.scale.setScalar(sc)

    if (r1.current) r1.current.rotation.z = t * 0.32
    if (r2.current) r2.current.rotation.z = -t * 0.12
    if (r3.current) r3.current.rotation.z = t * 0.07
    if (gyroA.current) {
      gyroA.current.rotation.y = t * 0.55
      gyroA.current.rotation.x = 1.1
    }
    if (gyroB.current) {
      gyroB.current.rotation.x = t * 0.4
      gyroB.current.rotation.z = 0.6
    }
    if (core.current) {
      core.current.rotation.y = t * 0.25
      core.current.rotation.x = t * 0.11
    }
    if (sweep.current) sweep.current.rotation.z = -t * 1.1
    if (halo.current) {
      halo.current.rotation.y = t * 0.06
      halo.current.rotation.z = t * 0.02
    }
    mats.sphere.uniforms.uTime.value = t
  })

  return (
    <group ref={root}>
      <sprite material={mats.glow} scale={[6.5, 6.5, 1]} />

      <group ref={core}>
        <lineSegments geometry={geo.wire} material={mats.line} />
        <points geometry={geo.verts} material={mats.points} />
      </group>
      <mesh geometry={geo.sphere} material={mats.sphere} />

      <mesh ref={sweep} geometry={geo.wedge} material={mats.wedge} />

      <group ref={r1}>
        <lineLoop geometry={geo.c1} material={mats.line} />
        <lineLoop geometry={geo.c1b} material={mats.line} />
        {arcLines.a1.map((l, i) => (
          <primitive key={i} object={l} />
        ))}
      </group>

      <group ref={r2}>
        <lineLoop geometry={geo.c2} material={mats.line} />
        <lineSegments geometry={geo.ticks2} material={mats.line} />
      </group>

      <group ref={r3}>
        <lineLoop geometry={geo.c3} material={mats.line} />
        <lineLoop geometry={geo.c3b} material={mats.line} />
        <lineSegments geometry={geo.ticks3} material={mats.line} />
        {arcLines.a3.map((l, i) => (
          <primitive key={i} object={l} />
        ))}
      </group>

      <group ref={gyroA}>
        <lineLoop geometry={geo.gyro} material={mats.accent} />
      </group>
      <group ref={gyroB}>
        <lineLoop geometry={geo.gyro2} material={mats.line} />
      </group>

      <points ref={halo} geometry={geo.halo} material={mats.haloPts} />
    </group>
  )
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Sculpture({ theme, className }: { theme: Theme; className?: string }) {
  const [ok, setOk] = useState<boolean | null>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])
  useEffect(() => setOk(supportsWebGL()), [])
  if (!ok) return <div className={className} data-fallback aria-hidden="true" />
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 34, near: 0.1, far: 60, position: [0, 0, 9.6] }}
        frameloop="always"
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Hud theme={theme} reduced={reduced} />
      </Canvas>
    </div>
  )
}
