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

const AREAS = [
  { key: 'skills', name: 'Skills & Technical Knowledge', short: 'Skills', level: 3, text: 'A solid foundation. We wanted more depth in the tools this role uses day to day.' },
  { key: 'exp', name: 'Relevant Experience', short: 'Experience', level: 2, text: 'Your projects show promise, but we needed more hands-on work on larger production products.' },
  { key: 'comm', name: 'Communication & Interview Performance', short: 'Communication', level: 4, text: 'Clear, confident and easy to talk to. This was a real strength in your interview.' },
]

const Bulb = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
  </svg>
)

export default function RejectionFeedback() {
  // Starts on the last stage so the prerendered / reduced-motion page shows the complete picture.
  const [stage, setStage] = useState(STAGES.length - 1)
  const [area, setArea] = useState(1)
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
  const selected = AREAS[area]
  const decided = stage >= 1
  const shared = stage >= 2
  const guided = stage >= 3

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

              <p className="rf-else"><span>Elsewhere</span> &ldquo;We&rsquo;ve decided not to proceed.&rdquo; <em>That&rsquo;s all.</em></p>

              <div className={`rf-fb${shared ? ' is-on' : ''}`}>
                <div className="rf-chips" role="group" aria-label="Feedback categories">
                  {AREAS.map((a, i) => (
                    <button key={a.key} type="button" className={i === area ? 'on' : ''} aria-pressed={i === area} title={a.name} onClick={() => setArea(i)} onMouseEnter={() => setArea(i)}>
                      {a.short}
                    </button>
                  ))}
                </div>
                <div key={selected.key} className="rf-msg">
                  <div className="rf-msg-top">
                    <span className="rf-msg-name">{selected.name}</span>
                    <span className="rf-meter" role="img" aria-label={`${selected.level} out of 5`}>
                      {[1, 2, 3, 4, 5].map((n) => <b key={n} className={n <= selected.level ? 'on' : ''} />)}
                    </span>
                  </div>
                  <p>&ldquo;{selected.text}&rdquo;</p>
                </div>
              </div>

              <div className={`rf-tip${guided ? ' is-on' : ''}`}>
                <span className="rf-bulb"><Bulb /></span>
                <p><b>How to improve:</b> contribute to one larger project, then add what you learned to your resume.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="rf-statement" data-r="">Not every application leads to an offer. Every experience should <em>lead to growth.</em></p>
      </div>
    </section>
  )
}
