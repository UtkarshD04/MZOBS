import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'
import { clearEmployeeSession } from '../../lib/employeeSession'
import { useEmployeeSession } from '../../lib/useEmployeeSession'
import { unsubscribeFromWebPush } from '../../lib/webPush'
import EmployeeAuthModal from '../forms/EmployeeAuthModal'

const LINKS = [
  { label: 'Find Jobs', href: '#latest-jobs' },
  { label: 'Categories', href: '#categories' },
  { label: 'Cities', href: '#cities' },
  { label: 'Campus', href: '#campus' },
  { label: 'Companies', href: '#companies' },
]
const MORE = [
  { label: 'Premium', to: '/employees/subscription' },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Mzobs Ally', to: '/ally' },
]

const pill = { display: 'inline-flex', alignItems: 'center', minHeight: 32, padding: '0 14px', borderRadius: 999, textDecoration: 'none', border: 0, font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

export default function LandingNav() {
  const navigate = useNavigate()
  const { session } = useEmployeeSession()
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const firstName = session?.employee?.name?.split(' ')[0] ?? 'there'

  async function signOut() {
    await unsubscribeFromWebPush(session?.token)
    clearEmployeeSession()
    setOpen(false)
    navigate('/')
  }

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.78)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid rgba(230,232,240,0.8)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, fontSize: 13 }}>
          <a href="#top" aria-label="Mzobs home" style={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo-mark.png" alt="Mzobs" width={1770} height={564} style={{ height: 24, width: "auto" }} />
          </a>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="lnk">{l.label}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {session ? (
              <>
                <Link to="/employees/applications" className="lnk nav-links" style={{ color: '#344054' }}>My applications</Link>
                <Link to={CLIENT_ONLY_ROUTES.employeeProfile} className="btn" style={{ ...pill, background: '#0b7a6d', color: '#fff' }}>Hi, {firstName}</Link>
                <button type="button" onClick={signOut} className="lnk nav-links" style={{ background: 'none', border: 0, font: 'inherit', cursor: 'pointer', color: '#344054' }}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/employers" className="lnk" style={{ color: '#344054' }}>For Employers</Link>
                <button type="button" onClick={() => setAuthOpen(true)} className="btn" style={{ ...pill, background: '#0b7a6d', color: '#fff' }}>Sign in</button>
              </>
            )}
            <button type="button" className="nav-burger" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((v) => !v)} style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: '1px solid #e6e8f0', borderRadius: 8, background: '#fff', color: '#111827', cursor: 'pointer' }}>
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {open && (
          <div style={{ borderTop: '1px solid #e6e8f0', background: '#fff', padding: '8px 24px 16px', display: 'flex', flexDirection: 'column' }}>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="lnk" style={{ padding: '12px 0', borderBottom: '1px solid #e6e8f0', fontWeight: 600, color: '#111827' }}>{l.label}</a>
            ))}
            {MORE.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="lnk" style={{ padding: '12px 0', borderBottom: '1px solid #e6e8f0', fontWeight: 600, color: '#111827' }}>{l.label}</Link>
            ))}
            {session && (
              <>
                <Link to="/employees/applications" onClick={() => setOpen(false)} className="lnk" style={{ padding: '12px 0', borderBottom: '1px solid #e6e8f0', fontWeight: 600, color: '#111827' }}>My applications</Link>
                <button type="button" onClick={signOut} className="lnk" style={{ padding: '12px 0', textAlign: 'left', background: 'none', border: 0, font: 'inherit', fontWeight: 600, color: '#111827', cursor: 'pointer' }}>Sign out</button>
              </>
            )}
          </div>
        )}
      </header>
      <EmployeeAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
