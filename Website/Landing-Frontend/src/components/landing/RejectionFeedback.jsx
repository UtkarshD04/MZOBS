import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES as R } from '../../lib/routes'
import './rejectionFeedback.css'

// Everything inside the sample card is illustrative — it is not real employer
// feedback and not a statistic about Mzobs.
const STAGES = [
  { key: 'submitted', label: 'Applied', title: 'Application submitted', body: 'You apply, and the employer receives your application.' },
  { key: 'review', label: 'Reviewed', title: 'Employer reviews it', body: 'The hiring team weighs your profile against the role and decides.' },
  { key: 'feedback', label: 'Feedback', title: 'Feedback is shared', body: 'If it is a no, the employer is encouraged to say why, not stay silent.' },
  { key: 'growth', label: 'Guidance', title: 'You get a next step', body: 'You see what to improve, so your next application starts stronger.' },
]

export default function RejectionFeedback() {
  // Starts on the last stage so the prerendered / reduced-motion page shows the complete picture.
  const [stage, setStage] = useState(STAGES.length - 1)
  const rootRef = useRef(null)
  const manual = useRef(false)

  // Plays the four stages once when the section first scrolls into view; any
  // hover, focus or click takes over and stops it.
  useEffect(() => {
    const el = rootRef.current
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined
    let timer = 0
    let i = 0
    setStage(0)
    const tick = () => {
      if (manual.current) return
      i += 1
      setStage(i)
      if (i < STAGES.length - 1) timer = setTimeout(tick, 1600)
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      timer = setTimeout(tick, 1200)
    }, { threshold: 0.35 })
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [])

  const pick = (i) => {
    manual.current = true
    setStage(i)
  }
  const current = STAGES[stage]
  const decided = stage >= 1
  const shared = stage >= 2

  return (
    <section ref={rootRef} className="rf" aria-labelledby="rf-title">
      <div className="rf-panel">
        <div className="rf-wrap">
          <div className="rf-story" data-r="">
            <p className="rf-eyebrow">A more transparent hiring experience</p>
            <h2 id="rf-title" className="rf-h2">Rejection shouldn&rsquo;t leave you <em>wondering why.</em></h2>
            <p className="rf-lede">At Mzobs, we believe every candidate deserves clarity. When an employer decides not to move forward, meaningful feedback helps candidates understand their improvement areas and prepare for better opportunities.</p>
            <p className="rf-pull">Because knowing where you stand is the first step towards moving forward.</p>
            <div className="rf-actions">
              <Link to={R.candidates} className="rf-btn solid">Explore Opportunities <span aria-hidden="true">→</span></Link>
              <a href="#move" className="rf-btn ghost">Discover How Mzobs Works</a>
            </div>
          </div>

          <div className="rf-stage" data-r="">
            <div className="rf-card">
              <ol className="rf-steps">
                {STAGES.map((s, i) => (
                  <li key={s.key} className={i < stage ? 'past' : i === stage ? 'on' : ''}>
                    <button
                      type="button"
                      aria-pressed={i === stage}
                      onMouseEnter={() => pick(i)}
                      onFocus={() => pick(i)}
                      onClick={() => pick(i)}
                    >
                      <span className="rf-dot" aria-hidden="true">{i + 1}</span>
                      <span className="rf-step-label">{s.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <p key={current.key} className="rf-caption"><b>{current.title}.</b> {current.body}</p>

              <div className="rf-role">
                <p className="rf-role-name">Junior Frontend Developer</p>
                <div className="rf-status" aria-live="polite">
                  <span className={`rf-pill${decided ? ' is-done' : ''}`}>
                    <i aria-hidden="true" />
                    {!decided ? 'Application Submitted' : shared ? 'Not Selected' : 'Application Reviewed'}
                  </span>
                  <span className={`rf-pill rf-pill-fb${shared ? ' is-on' : ''}`}>Feedback Received</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
