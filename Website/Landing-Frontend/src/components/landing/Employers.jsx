import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

export default function Employers() {
  return (
    <section id="employers" style={{ background: '#fff', padding: '0 24px 130px' }}>
      <div data-r="" style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 36, background: '#111827', color: '#fff', padding: 'clamp(40px, 6vw, 88px)', display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: '1 1 520px', position: 'relative' }}>
          <p className="eyebrow" style={{ color: '#20c997' }}>For employers</p>
          <h2 style={{ margin: '12px 0 0', fontWeight: 800, fontSize: 'clamp(48px, 6.6vw, 104px)', lineHeight: 0.92, letterSpacing: '-0.06em' }}>Hiring for<br />your team?</h2>
          <p style={{ margin: '22px 0 0', fontSize: 19, color: '#a4abb9' }}>Post a requirement with Mzobs. Find quality talent and hire in one pipeline.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, position: 'relative' }}>
          <Link to={CLIENT_ONLY_ROUTES.employerSignup} className="btn" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 56, padding: '0 28px', borderRadius: 999, background: '#0b7a6d', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Post a job</Link>
          <Link to="/employers/pricing" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 56, padding: '0 28px', borderRadius: 999, border: '1px solid #344054', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Pricing</Link>
        </div>
      </div>
    </section>
  )
}
