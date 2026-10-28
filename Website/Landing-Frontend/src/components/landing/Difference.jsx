import { useState } from 'react'
import DifferenceArt from './DifferenceArt'

// ---- Content ------------------------------------------------------------------
// Every line below describes something the product actually does today.
const Icon = ({ d, extra }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d && <path d={d} />}
    {extra}
  </svg>
)

const PRINCIPLES = [
  {
    key: 'listings',
    title: 'Beyond listings.',
    caption: 'Relevance, brought into focus.',
    icon: <Icon extra={<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".6" fill="currentColor" /></>} />,
    body: 'Every role is reviewed by Mzobs before it goes live, and recommended jobs are matched to your profile — so your time goes to openings that fit, not to scrolling endless listings.',
  },
  {
    key: 'trust',
    title: 'Built on trust.',
    caption: 'A structure you can rely on.',
    icon: <Icon d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z M9 12l2.2 2.2L15.5 10" />,
    body: 'Mzobs reviews every candidate resume, and verified companies carry a Verified mark on each listing. Candidate contact details stay hidden from employers until a profile is unlocked.',
  },
  {
    key: 'clarity',
    title: 'Clarity at every step.',
    caption: 'A clear path, start to finish.',
    icon: <Icon d="M4 19h5v-6h6V7h5" extra={<circle cx="20" cy="7" r="1.2" fill="currentColor" />} />,
    body: 'Track every application in one place. When feedback is shared on a decision, Mzobs reviews it first — and you can ask a question or report a problem about it.',
  },
]

function Title({ text, on }) {
  const i = text.lastIndexOf(' ')
  return (
    <span>
      {text.slice(0, i + 1)}
      <span className={on ? 'df-em' : undefined}>{text.slice(i + 1)}</span>
    </span>
  )
}

export default function Difference() {
  const [active, setActive] = useState(0)
  const current = PRINCIPLES[active]

  return (
    <section className="df" aria-labelledby="df-title">
      <div className="df-wrap">
        <div className="df-copy" data-r="">
          <p className="eyebrow df-eyebrow">Why Mzobs</p>
          <h2 id="df-title" className="df-h2">The Mzobs<br />Difference.</h2>
          <p className="df-lede">Mzobs is built around relevance rather than volume: roles and resumes are reviewed by our team, and every application can be tracked in one place.</p>

          <div className="df-list">
            {PRINCIPLES.map((p, i) => {
              const on = i === active
              return (
                <div key={p.key} className={`df-item${on ? ' on' : ''}`}>
                  <h3>
                    <button
                      type="button"
                      id={`df-h-${i}`}
                      aria-expanded={on}
                      aria-controls={`df-p-${i}`}
                      className="df-btn"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                    >
                      <span className="df-ico">{p.icon}</span>
                      <Title text={p.title} on={on} />
                      <svg className="df-arr" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </button>
                  </h3>
                  <div id={`df-p-${i}`} role="region" aria-labelledby={`df-h-${i}`} className="df-panel">
                    <p>{p.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="df-visual" data-r="">
          <DifferenceArt state={current.key} />
          <p key={current.key} className="df-caption" aria-hidden="true">{current.caption}</p>
        </div>
      </div>
    </section>
  )
}
