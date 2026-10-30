import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'
import { clearEmployeeSession } from '../../lib/employeeSession'
import { useEmployeeSession } from '../../lib/useEmployeeSession'
import { unsubscribeFromWebPush } from '../../lib/webPush'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Mzobs Ally', to: CLIENT_ONLY_ROUTES.ally },
  { label: 'Associate with Mzobs', to: CLIENT_ONLY_ROUTES.associate },
  { label: 'Add your campus', to: CLIENT_ONLY_ROUTES.campusPartner },
]

function NavItem({ item, ...props }) {
  return item.href ? <a href={item.href} {...props}>{item.label}</a> : <Link to={item.to} {...props}>{item.label}</Link>
}

const pill = { display: 'inline-flex', alignItems: 'center', minHeight: 32, padding: '0 14px', borderRadius: 999, textDecoration: 'none', border: 0, font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

export default function LandingNav() {
  const navigate = useNavigate()
  const { session } = useEmployeeSession()
  const [open, setOpen] = useState(false)
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
          <Link to="/" aria-label="Mzobs home" style={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo-mark.png" alt="Mzobs" width={1770} height={564} style={{ height: 24, width: "auto" }} />
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavItem key={l.label} item={l} className="lnk" />
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
                <Link to={CLIENT_ONLY_ROUTES.candidates} className="btn nav-links" style={{ ...pill, background: '#0b7a6d', color: '#fff' }}>Candidate</Link>
                <Link to="/employers" className="btn nav-links" style={{ ...pill, background: '#fff', color: '#0b7a6d', boxShadow: 'inset 0 0 0 1.5px #0b7a6d' }}>Employer</Link>
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
            <NavItem key={l.label} item={l} onClick={() => setOpen(false)} className="lnk" style={{ padding: '12px 0', borderBottom: '1px solid #e6e8f0', fontWeight: 600, color: '#111827' }} />
            ))}
            {!session && (
              <>
                <Link to={CLIENT_ONLY_ROUTES.candidates} onClick={() => setOpen(false)} className="lnk" style={{ padding: '12px 0', borderBottom: '1px solid #e6e8f0', fontWeight: 600, color: '#111827' }}>Candidate</Link>
                <Link to="/employers" onClick={() => setOpen(false)} className="lnk" style={{ padding: '12px 0', borderBottom: '1px solid #e6e8f0', fontWeight: 600, color: '#111827' }}>Employer</Link>
              </>
            )}
            {session && (
              <>
                <Link to="/employees/applications" onClick={() => setOpen(false)} className="lnk" style={{ padding: '12px 0', borderBottom: '1px solid #e6e8f0', fontWeight: 600, color: '#111827' }}>My applications</Link>
                <button type="button" onClick={signOut} className="lnk" style={{ padding: '12px 0', textAlign: 'left', background: 'none', border: 0, font: 'inherit', fontWeight: 600, color: '#111827', cursor: 'pointer' }}>Sign out</button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}
