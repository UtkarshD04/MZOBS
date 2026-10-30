import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

function Check({ bg, fg }) {
  return (
    <span style={{ flex: 'none', width: 26, height: 26, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </span>
  )
}

// In-page anchors scroll natively; everything else is a router link.
function CtaLink({ to, ...props }) {
  return to.startsWith("#") ? <a href={to} {...props} /> : <Link to={to} {...props} />
}

function Panel({ dark, eyebrow, title, points, cta, to, ghost }) {
  const ink = dark ? '#fff' : '#111827'
  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(24px, 3.4vw, 38px)', background: dark ? '#111827' : '#e4f4ef', color: dark ? '#e6e8f0' : '#344054', display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2vw, 22px)', minHeight: 0 }}>
      <span aria-hidden="true" style={{ position: 'absolute', right: -10, bottom: '-0.1em', fontSize: 'clamp(120px, 17vw, 240px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.8, color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(11,122,109,0.1)', pointerEvents: 'none', userSelect: 'none' }}>{ghost}</span>
      <p style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: dark ? '#20c997' : '#0b7a6d' }}>{eyebrow}</p>
      <h2 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1, letterSpacing: '-0.05em', color: ink }}>{title}</h2>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 16 }}>
        {points.map((p) => (
          <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Check bg={dark ? '#20c997' : '#0b7a6d'} fg={dark ? '#111827' : '#fff'} />
            {p}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: 8, position: 'relative' }}>
        <CtaLink to={to} className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 58, padding: '0 28px', borderRadius: 999, background: dark ? '#20c997' : '#0b7a6d', color: dark ? '#111827' : '#fff', fontWeight: 700, fontSize: 17, textDecoration: 'none' }}>
          {cta} <span aria-hidden="true">→</span>
        </CtaLink>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="pin-hero" style={{ background: '#fff' }}>
      <div className="pin-sticky">
        <div className="hero-inner">
          <div className="hero-layer">
            <p className="tw" data-hw="0" style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 600, color: '#0b7a6d' }}>Talent × Opportunity × Smart Hiring</p>
            <h1 className="hero-word" style={{ margin: 0, lineHeight: 0 }}>
              <img src="/images/logo-mark.png" alt="Mzobs" width={1770} height={564} fetchPriority="high" style={{ display: 'block', width: 'clamp(300px, 64vw, 1000px)', height: 'auto' }} />
            </h1>
            <p style={{ margin: '34px 0 0', fontWeight: 700, fontSize: 'clamp(30px, 4.4vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.04em', color: '#111827' }}>
              <span className="tw" data-hw="1">Unstoppable,</span> <span className="tw" data-hw="2">yet</span>{' '}
              <span className="tw" data-hw="3" style={{ color: '#0b7a6d' }}>untroubled.</span>
            </p>
          </div>
          <p data-hint="" style={{ position: 'absolute', left: 0, right: 0, bottom: 28, margin: 0, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#667085', opacity: 0 }}>Scroll ↓</p>

          <div className="hero-device">
            <div style={{ height: '100%', borderRadius: '22px 22px 0 0', background: '#111827', padding: '12px 12px 0', boxShadow: '0 -12px 32px -20px rgba(17,24,39,0.35)' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px 12px 0 0', overflow: 'hidden', background: '#111827' }}>
              <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 24px', background: '#fff', borderBottom: '1px solid #e6e8f0' }}>
                <img src="/images/logo-mark.png" alt="" style={{ height: 22, width: 'auto' }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: '#667085', textAlign: 'right' }}>Choose how you want to use Mzobs</span>
              </div>
              <div className="hero-split">
                <Panel
                  eyebrow="I’m looking for a job"
                  title={<>Make your<br />next move.</>}
                  points={['Verified companies on every listing', 'Jobs matched to your skills', 'Track every application']}
                  cta="Find jobs"
                  to={CLIENT_ONLY_ROUTES.candidates}
                  ghost="job"
                />
                <Panel
                  dark
                  eyebrow="I’m hiring"
                  title={<>Hire the<br />right talent.</>}
                  points={['Post a requirement in minutes', 'Quality, pre-screened candidates', 'Hire in one pipeline']}
                  cta="Post a job"
                  to={CLIENT_ONLY_ROUTES.employerSignup}
                  ghost="hire"
                />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
