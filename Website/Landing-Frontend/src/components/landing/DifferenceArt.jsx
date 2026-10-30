import { useEffect, useRef } from 'react'

// The artwork for "The Mzobs Difference": a calm field of drifting points on a
// canvas. Everything is drawn imperatively in one requestAnimationFrame loop —
// React renders this component once and never again per frame. The loop only
// runs while the artwork is on screen, and with reduced motion it draws one
// still composition instead.
//
// A visual metaphor only. It is not data, and says nothing about how matching
// or verification actually work.

const W = 640
const H = 640
const KY = H / 520 // node layouts below were drawn on a 640 × 520 sheet

// The seven teal nodes: [listings, trust, clarity] positions for each.
//   listings → a tight cluster · trust → a joined hexagon with a core · clarity → one path
const RAW = [
  [[400, 250], [360, 260], [80, 390]],
  [[366, 214], [360, 130], [180, 390]],
  [[440, 226], [472, 195], [180, 300]],
  [[414, 298], [472, 325], [300, 300]],
  [[350, 272], [360, 390], [300, 210]],
  [[448, 280], [248, 325], [430, 210]],
  [[392, 182], [248, 195], [560, 130]],
]
const TARGETS = RAW.map((s) => s.map(([x, y]) => [x, y * KY]))
const FOCAL = [400, 250 * KY]
const STATE_INDEX = { listings: 0, trust: 1, clarity: 2 }

const TEAL = '32,201,151'
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function seeded(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Background points: a loose 13 × 13 grid, kept clear of every node position.
const BG = (() => {
  const rnd = seeded(11)
  const n = 13
  const out = []
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const hx = 34 + (c * (W - 68)) / (n - 1) + (rnd() - 0.5) * 12
      const hy = 34 + (r * (H - 68)) / (n - 1) + (rnd() - 0.5) * 12
      const jx = rnd()
      const jy = rnd()
      const jz = rnd()
      const jw = rnd()
      const near = TARGETS.some((s) => s.some(([x, y]) => Math.hypot(hx - x, hy - y) < 30))
      if (near) continue
      out.push({
        hx, hy,
        ph: jx * Math.PI * 2,
        amp: 4 + jy * 6,
        s1: 0.22 + jz * 0.2,
        s2: 0.18 + jw * 0.22,
        r: 2.5 + jz * 1.1,
        navy: jx > 0.72, // a few deep-navy points with a fine edge, the rest blue-grey
      })
    }
  }
  return out
})()

export default function DifferenceArt({ state }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const target = useRef(STATE_INDEX[state] ?? 0)
  const redraw = useRef(null)

  // The open principle is read from a ref inside the loop; changing it never re-renders.
  useEffect(() => {
    target.current = STATE_INDEX[state] ?? 0
    if (redraw.current) redraw.current()
  }, [state])

  useEffect(() => {
    const el = canvas.current
    const box = wrap.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return undefined

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const nodes = TARGETS.map((s, i) => ({ x: s[target.current][0], y: s[target.current][1], delay: 0, pulse: 0, i }))
    const weights = [0, 0, 0]
    weights[target.current] = 1
    const N = BG.length
    const px = new Float32Array(N + nodes.length)
    const py = new Float32Array(N + nodes.length)

    let scale = 1
    let t = 0
    let last = 0
    let raf = 0
    let prevState = target.current
    let nextPulse = 1.6
    let running = false

    const fit = () => {
      const cssW = box.clientWidth || 1
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      el.width = Math.round(cssW * dpr)
      el.height = Math.round((cssW * dpr * H) / W)
      scale = el.width / W
      draw()
    }

    function step(dt) {
      const st = target.current
      if (st !== prevState) {
        prevState = st
        nodes.forEach((n) => { n.delay = t + n.i * 0.07 })
      }
      const wk = reduce ? 1 : 1 - Math.exp(-dt * 2.2)
      for (let k = 0; k < 3; k++) weights[k] += ((k === st ? 1 : 0) - weights[k]) * wk
      const nk = reduce ? 1 : 1 - Math.exp(-dt * 3)
      for (const n of nodes) {
        const home = TARGETS[n.i][st]
        const dx = reduce ? 0 : Math.cos(t * 0.5 + n.i * 1.7) * 3.5
        const dy = reduce ? 0 : Math.sin(t * 0.42 + n.i * 2.3) * 3.5
        if (reduce || t >= n.delay) {
          n.x += (home[0] + dx - n.x) * nk
          n.y += (home[1] + dy - n.y) * nk
        }
        n.pulse *= reduce ? 0 : Math.exp(-dt * 1.4)
      }
      if (!reduce && t > nextPulse) {
        nodes[Math.floor(Math.random() * nodes.length)].pulse = 1
        nextPulse = t + 2.4 + Math.random() * 1.8
      }
    }

    function draw() {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, el.width, el.height)
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const wave = reduce ? 0 : t
      // Background points drift on slow ellipses plus one travelling wave, and
      // the points near the focal point lean into it while "listings" is open.
      for (let i = 0; i < N; i++) {
        const d = BG[i]
        let x = d.hx + Math.cos(wave * d.s1 + d.ph) * d.amp
        let y = d.hy + Math.sin(wave * d.s2 + d.ph * 1.3) * d.amp + Math.sin(d.hx * 0.014 - wave * 0.7) * 4
        const fd = Math.hypot(FOCAL[0] - x, FOCAL[1] - y)
        if (fd < 230) {
          const pull = weights[0] * 0.34 * (1 - fd / 230)
          x += (FOCAL[0] - x) * pull
          y += (FOCAL[1] - y) * pull
        }
        px[i] = x
        py[i] = y
      }
      for (let k = 0; k < nodes.length; k++) {
        px[N + k] = nodes[k].x
        py[N + k] = nodes[k].y
      }

      // Soft connections between neighbours; they come and go as the points drift.
      const BUCKETS = 4
      const paths = Array.from({ length: BUCKETS + 1 }, () => new Path2D())
      const total = N + nodes.length
      for (let i = 0; i < total; i++) {
        for (let j = i + 1; j < total; j++) {
          const dx = px[i] - px[j]
          if (dx > 84 || dx < -84) continue
          const dy = py[i] - py[j]
          const d = Math.hypot(dx, dy)
          const nodeLink = i >= N || j >= N
          const th = nodeLink ? 84 : 60
          if (d > th) continue
          const a = 1 - d / th
          const p = nodeLink ? paths[BUCKETS] : paths[Math.min(BUCKETS - 1, Math.floor(a * BUCKETS))]
          p.moveTo(px[i], py[i])
          p.lineTo(px[j], py[j])
        }
      }
      ctx.lineWidth = 1.1
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(132,154,196,${0.06 + b * 0.045})`
        ctx.stroke(paths[b])
      }
      ctx.strokeStyle = `rgba(${TEAL},0.2)`
      ctx.stroke(paths[BUCKETS])

      // listings — a focal ring around the cluster
      if (weights[0] > 0.01) {
        ctx.lineWidth = 1.4
        ctx.strokeStyle = `rgba(${TEAL},${0.5 * weights[0]})`
        ctx.beginPath()
        ctx.arc(FOCAL[0], FOCAL[1], 138, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([3, 7])
        ctx.strokeStyle = `rgba(${TEAL},${0.65 * weights[0]})`
        ctx.beginPath()
        ctx.arc(FOCAL[0], FOCAL[1], 92, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }
      // trust — a joined, stable structure
      if (weights[1] > 0.01) {
        ctx.lineWidth = 1.8
        ctx.strokeStyle = `rgba(${TEAL},${0.62 * weights[1]})`
        ctx.beginPath()
        ctx.moveTo(nodes[1].x, nodes[1].y)
        for (let k = 2; k <= 6; k++) ctx.lineTo(nodes[k].x, nodes[k].y)
        ctx.closePath()
        for (let k = 1; k <= 6; k++) {
          ctx.moveTo(nodes[0].x, nodes[0].y)
          ctx.lineTo(nodes[k].x, nodes[k].y)
        }
        ctx.stroke()
      }
      // clarity — one readable path, drawn in as the state settles
      if (weights[2] > 0.01) {
        const segs = nodes.length - 1
        const reach = clamp(weights[2], 0, 1) * segs
        ctx.lineWidth = 2.4
        ctx.strokeStyle = `rgba(${TEAL},${0.85 * Math.min(1, weights[2] * 1.4)})`
        ctx.beginPath()
        ctx.moveTo(nodes[0].x, nodes[0].y)
        for (let k = 1; k <= segs; k++) {
          const f = clamp(reach - (k - 1), 0, 1)
          if (f <= 0) break
          const a = nodes[k - 1]
          const b = nodes[k]
          ctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f)
        }
        ctx.stroke()
      }

      // background points
      for (let i = 0; i < N; i++) {
        const d = BG[i]
        const w = 0.5 + 0.5 * Math.sin(d.hx * 0.012 + d.hy * 0.007 - wave * 0.8)
        const r = d.r * (1 + 0.16 * w)
        ctx.beginPath()
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2)
        if (d.navy) {
          ctx.fillStyle = '#0d1424'
          ctx.fill()
          ctx.lineWidth = 1.2
          ctx.strokeStyle = `rgba(110,132,178,${0.45 + 0.25 * w})`
          ctx.stroke()
        } else {
          ctx.fillStyle = `rgba(112,134,178,${0.5 + 0.3 * w})`
          ctx.fill()
        }
      }

      // teal nodes (the first and last are the larger focal ones)
      for (let k = 0; k < nodes.length; k++) {
        const n = nodes[k]
        const focal = k === 0 || k === nodes.length - 1
        const r = focal ? 11.5 : 8.5
        const ringW = k === 0 ? weights[1] : k === nodes.length - 1 ? weights[2] : 0
        if (ringW > 0.02) {
          ctx.lineWidth = 1.6
          ctx.strokeStyle = `rgba(${TEAL},${0.85 * ringW})`
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 9, 0, Math.PI * 2)
          ctx.stroke()
        }
        if (n.pulse > 0.02) {
          ctx.lineWidth = 1.4
          ctx.strokeStyle = `rgba(${TEAL},${0.55 * n.pulse})`
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 4 + (1 - n.pulse) * 14, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.arc(n.x, n.y, r + n.pulse * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = n.pulse > 0.02 ? `rgb(${Math.round(32 + 70 * n.pulse)},${Math.round(201 + 40 * n.pulse)},${Math.round(151 + 60 * n.pulse)})` : `rgb(${TEAL})`
        ctx.fill()
      }
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      t += dt
      step(dt)
      draw()
    }
    const start = () => {
      if (running || reduce) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Reduced motion: no loop — settle straight onto the open principle and draw once.
    redraw.current = () => {
      if (reduce) {
        step(0.016)
        draw()
      }
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    let onScreen = false
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      if (onScreen && !document.hidden) start()
      else stop()
    }, { rootMargin: '80px' })
    io.observe(box)
    const onVis = () => (document.hidden ? stop() : onScreen && start())
    document.addEventListener('visibilitychange', onVis)
    if (reduce) redraw.current()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      redraw.current = null
    }
  }, [])

  return (
    <div ref={wrap} className="df-art" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  )
}
