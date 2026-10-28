import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES as R } from '../../lib/routes'

// ---- Previews ---------------------------------------------------------------
// Flat, illustrative sketches drawn straight onto the page surface (no real
// data, no live product state). Each replays a short CSS animation on mount.

const Tick = ({ on = true }) => (
  <span className={`nm-tick${on ? ' on' : ''}`} aria-hidden="true">
    {on && (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    )}
  </span>
)

function ProfilePreview() {
  return (
    <div className="nm-viz">
      <div className="nm-meter"><span>Profile</span><span>3 of 4 sections</span></div>
      <div className="nm-bar" aria-hidden="true"><span style={{ '--to': '75%' }} /></div>
      <dl className="nm-rows">
        <div><dt>Basic details</dt><dd><Tick /></dd></div>
        <div><dt>Education &amp; experience</dt><dd><Tick /></dd></div>
        <div><dt>Skills</dt><dd className="nm-chips"><i>Communication</i><i>MS Excel</i></dd></div>
        <div className="nm-todo"><dt>Short summary</dt><dd>Add</dd></div>
      </dl>
    </div>
  )
}

function ResumePreview() {
  return (
    <div className="nm-viz">
      <div className="nm-doc" aria-hidden="true">
        <b className="nm-line w55 ink" /><b className="nm-line w35" />
        <span className="nm-h">Experience</span><b className="nm-line w90" /><b className="nm-line w70" />
        <span className="nm-h">Skills</span><b className="nm-line w45" />
        <span className="nm-h">Education</span><b className="nm-line w60" />
      </div>
      <p className="nm-status"><Tick /> Resume uploaded</p>
    </div>
  )
}

const MATCH_JOBS = [
  { t: 'Digital Marketing Intern', skills: [['SEO', true], ['Social Media', true], ['Canva', false]] },
  { t: 'HR Intern', skills: [['Communication', true], ['MS Excel', true]] },
]

function MatchPreview() {
  return (
    <div className="nm-viz">
      <ul className="nm-jobs">
        {MATCH_JOBS.map((j, i) => (
          <li key={j.t} style={{ '--i': i }}>
            <strong>{j.t}</strong>
            <span className="nm-chips">{j.skills.map(([s, hit]) => <i key={s} className={hit ? 'hit' : ''}>{s}</i>)}</span>
          </li>
        ))}
      </ul>
      <p className="nm-hint">Highlighted skills match your profile.</p>
    </div>
  )
}

const STAGES = ['Applied', 'Reviewing', 'Interview', 'Decision']

function TrackPreview() {
  return (
    <div className="nm-viz">
      <ol className="nm-stages">
        {STAGES.map((s, i) => (
          <li key={s} className={i < 2 ? 'done' : ''} style={{ '--i': i }}>
            <span className="nm-dot" aria-hidden="true" />
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="nm-hint">Every role you apply to, and where it stands.</p>
    </div>
  )
}

function ImprovePreview() {
  return (
    <div className="nm-viz">
      <div className="nm-meter"><span>Role asks for</span></div>
      <span className="nm-chips"><i className="hit">Communication</i><i className="hit">SEO</i><i className="gap">+ MS Excel</i></span>
      <dl className="nm-rows">
        <div><dt>Skills section present</dt><dd><Tick /></dd></div>
        <div className="nm-todo"><dt>Add the missing skill</dt><dd><Tick on={false} /></dd></div>
        <div className="nm-todo"><dt>Mention one project or result</dt><dd><Tick on={false} /></dd></div>
      </dl>
    </div>
  )
}

const STEPS = [
  { label: 'Complete your profile', to: R.employeeProfile, cta: 'Open your profile', body: 'Add your details, skills and experience so employers see the full picture.', View: ProfilePreview },
  { label: 'Upload or update resume', to: R.employeeProfile, cta: 'Upload a resume', body: 'Keep one clear, up-to-date resume ready for every application.', View: ResumePreview },
  { label: 'Jobs matching your profile', to: R.employeeRecommended, cta: 'See matching jobs', body: 'Roles are lined up against your skills, so you start with the best fits.', View: MatchPreview },
  { label: 'Track applications', to: R.employeeApplications, cta: 'Open my applications', body: 'See every application in one place and where it currently stands.', View: TrackPreview },
  { label: 'Improve your application', to: R.employeeApplications, cta: 'Review my applications', body: 'Spot the skills and details a role asks for that your resume is missing.', View: ImprovePreview },
]

// Phones expand the preview inside the selected step instead of beside the list.
// Read after mount so the prerendered markup matches the first client paint.
function useIsNarrow(query = '(max-width: 700px)') {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [query])
  return narrow
}

function Preview({ step, index, id, labelledBy }) {
  const View = step.View
  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className="nm-preview">
      <div key={index} className="nm-preview-in">
        <p className="nm-kicker">Step {String(index + 1).padStart(2, '0')} · Preview</p>
        <p className="nm-body">{step.body}</p>
        <View />
        <Link to={step.to} className="nm-go">{step.cta} <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  )
}

const AUTO_MS = 5500

export default function NextMove() {
  const [active, setActive] = useState(0)
  const narrow = useIsNarrow()
  const tabs = useRef([])
  const root = useRef(null)
  const holdUntil = useRef(0) // auto-advance waits while the visitor is hovering, focused or has just tapped
  const [visible, setVisible] = useState(false)
  const hold = (ms) => { holdUntil.current = ms === Infinity ? Infinity : Date.now() + ms }

  useEffect(() => {
    const el = root.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Steps move on by themselves every few seconds while the section is on screen.
  // Not on phones (the open preview would keep resizing the page), not with reduced
  // motion, and never while the visitor is interacting with it.
  useEffect(() => {
    if (narrow || !visible || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    let id
    const wait = (ms) => {
      id = setTimeout(() => {
        if (document.hidden || Date.now() < holdUntil.current) wait(800)
        else setActive((a) => (a + 1) % STEPS.length)
      }, ms)
    }
    wait(AUTO_MS)
    return () => clearTimeout(id)
  }, [active, narrow, visible])

  function onKeyDown(e) {
    const k = e.key
    const next = k === 'ArrowDown' || k === 'ArrowRight' ? (active + 1) % STEPS.length
      : k === 'ArrowUp' || k === 'ArrowLeft' ? (active + STEPS.length - 1) % STEPS.length
        : k === 'Home' ? 0 : k === 'End' ? STEPS.length - 1 : null
    if (next == null) return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section id="move" ref={root} style={{ background: '#fff' }}>
      <div className="sec nm-grid">
        <div data-r="" className="nm-left">
          <p className="eyebrow">Mzobs / your career</p>
          <h2 className="nm-h2">Make your<br />next <span style={{ color: '#0b7a6d' }}>move.</span></h2>
          <p className="nm-sub">Get ready for the right opportunity.</p>
          <div className="nm-ctas">
            <Link to={R.employeeSignup} className="btn nm-cta">Create free account</Link>
            <Link to={R.employeeSignin} className="nm-cta ghost">Sign in</Link>
          </div>
        </div>

        <div className="nm-steps" role={narrow ? undefined : 'tablist'} aria-label="Your Mzobs career journey" aria-orientation="vertical" data-r="" onKeyDown={narrow ? undefined : onKeyDown} onMouseEnter={() => hold(Infinity)} onMouseLeave={() => hold(3000)} onFocus={() => hold(Infinity)} onBlur={() => hold(3000)} style={{ '--p': active / (STEPS.length - 1) }}>
          <span className="nm-track" aria-hidden="true"><span className="nm-fill" /></span>
          {STEPS.map((s, i) => {
            const on = i === active
            return (
              <div key={s.label} className={`nm-item${on ? ' on' : ''}${i < active ? ' past' : ''}`} style={{ '--d': `${i * 90}ms` }}>
                <button
                  ref={(el) => { tabs.current[i] = el }}
                  type="button"
                  role={narrow ? undefined : 'tab'}
                  id={`nm-tab-${i}`}
                  aria-selected={narrow ? undefined : on}
                  aria-expanded={narrow ? on : undefined}
                  aria-controls={narrow ? (on ? 'nm-panel' : undefined) : 'nm-panel'}
                  tabIndex={narrow || on ? 0 : -1}
                  className="nm-step"
                  onMouseEnter={narrow ? undefined : () => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => { hold(9000); setActive(i) }}
                >
                  <span className="nm-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="nm-label">{s.label}</span>
                  <span className="nm-arrow" aria-hidden="true">→</span>
                </button>
                {narrow && on && <Preview step={s} index={i} id="nm-panel" labelledBy={`nm-tab-${i}`} />}
              </div>
            )
          })}
        </div>

        {!narrow && (
          <div className="nm-aside" data-r="" onMouseEnter={() => hold(Infinity)} onMouseLeave={() => hold(3000)}>
            <Preview step={STEPS[active]} index={active} id="nm-panel" labelledBy={`nm-tab-${active}`} />
          </div>
        )}
      </div>
    </section>
  )
}
