import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const END = 100

// Counts up once, the first time it scrolls into view. Starts at the final
// value so the prerendered/no-JS page already reads "100".
function Count() {
  const ref = useRef(null)
  const [n, setN] = useState(END)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined
    let raf = 0
    setN(0)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1800)
        setN(Math.round(END * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])
  return <span ref={ref}>{n}</span>
}

const card = { padding: 34, borderRadius: 26, background: '#fff' }
const h3 = { margin: '0 0 10px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: '#111827' }
const body = { margin: '0 0 22px', fontSize: 16, lineHeight: 1.6, color: '#667085' }
const cta = { fontWeight: 700, color: '#0b7a6d', textDecoration: 'none' }

export default function Campus() {
  return (
    <section id="campus" style={{ background: '#e7f5f1', scrollMarginTop: 52 }}>
      <div className="sec">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div data-r="" style={{ flex: '1 1 480px' }}><p className="eyebrow">From campus to career</p><h2 className="h2">A direct route from the classroom to the first job.</h2></div>
          <p data-r="" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(110px, 15vw, 220px)', lineHeight: 0.8, letterSpacing: '-0.07em', color: '#111827' }}>
            <Count /><span style={{ color: '#0b7a6d' }}>+</span>
            <span style={{ display: 'block', marginTop: 12, fontSize: 16, fontWeight: 600, letterSpacing: 0, color: '#344054' }}>Campuses on Mzobs</span>
          </p>
        </div>
        <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 14 }}>
          <div data-r="" style={card}>
            <h3 style={h3}>Placement cells</h3>
            <p style={body}>Bring your whole batch onto Mzobs and give students one place to discover employers hiring freshers.</p>
            <Link to="/add-your-campus" style={cta}>Partner with us →</Link>
          </div>
          <div data-r="" style={card}>
            <h3 style={h3}>Students &amp; freshers</h3>
            <p style={body}>Build your profile before you graduate and discover fresher-friendly roles and internships.</p>
            <Link to="/employees/signup" style={cta}>Create your profile →</Link>
          </div>
          <div data-r="" style={{ ...card, background: '#0b7a6d', color: '#fff' }}>
            <h3 style={{ ...h3, color: '#fff' }}>Mzobs Ally</h3>
            <p style={{ ...body, color: '#d4ede6' }}>Represent Mzobs on your campus, help classmates get hired and build real-world experience of your own.</p>
            <Link to="/ally" style={{ ...cta, color: '#fff' }}>Become an Ally →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
