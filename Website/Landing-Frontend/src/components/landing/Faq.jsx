import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES as R } from '../../lib/routes'
import './faq.css'

// Every answer restates something the site already says about the product.
const QA = [
  { q: 'Is Mzobs free for candidates?', a: 'Creating your profile is free. Premium adds extra features for candidates who want more, and you can see exactly how Free and Premium compare.', link: { to: R.employeeSubscription, label: 'Compare Free and Premium' } },
  { q: 'Are the jobs on Mzobs checked?', a: 'Every role is reviewed by Mzobs before it goes live, and verified companies carry a Verified mark on each listing.' },
  { q: 'Who can see my contact details?', a: 'Candidate contact details stay hidden from employers until a profile is unlocked.' },
  { q: 'What if I am not selected?', a: 'Employers are encouraged to share feedback so you know where to improve. Mzobs reviews that feedback first, and you can ask a question or report a problem about it.' },
  { q: 'Where can I track my applications?', a: 'In one place. Every application you make on Mzobs shows up on your applications page.', link: { to: R.employeeApplications, label: 'Open my applications' } },
  { q: 'I am a student or a fresher. Is Mzobs for me?', a: 'Yes. Build your profile before you graduate and discover fresher-friendly roles and internships.' },
  { q: 'Who do I contact for help?', a: 'Write to the Mzobs team from the contact page and we will get back to you.', link: { to: '/contact', label: 'Contact Mzobs' } },
]

export default function Faq() {
  const [active, setActive] = useState(0)
  const [typing, setTyping] = useState(false)
  const timer = useRef(0)
  const current = QA[active]

  useEffect(() => () => clearTimeout(timer.current), [])

  // A short "typing" beat before each reply; skipped when reduced motion is on.
  const choose = (i) => {
    if (i === active) return
    setActive(i)
    clearTimeout(timer.current)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    setTyping(true)
    timer.current = setTimeout(() => setTyping(false), 700)
  }

  // Up / Down (and Home / End) move focus between the questions.
  const onListKey = (e) => {
    const btns = Array.from(e.currentTarget.querySelectorAll('button'))
    const at = btns.indexOf(document.activeElement)
    const next = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: btns.length - 1 }[e.key]
    if (at < 0 || next === undefined) return
    e.preventDefault()
    btns[(next + btns.length) % btns.length].focus()
  }

  return (
    <section id="faq" className="fq" aria-labelledby="fq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />
      <div className="fq-wrap">
        <div className="fq-left" data-r="">
          <p className="fq-eyebrow">Questions, answered</p>
          <h2 id="fq-title" className="fq-h2">Ask away. <em>We&rsquo;ll keep it plain.</em></h2>
          <p className="fq-sub">Pick a question and get a straight answer, no fine print.</p>

          <ul className="fq-list" aria-label="Frequently asked questions" onKeyDown={onListKey}>
            {QA.map((item, i) => (
              <li key={item.q} className={`fq-item${i === active ? ' on' : ''}`}>
                <button type="button" className="fq-q" aria-pressed={i === active} onClick={() => choose(i)}>
                  <span className="fq-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item.q}</span>
                  <svg className="fq-arr" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="fq-chat" role="group" aria-label="Answer from Mzobs" data-r="">
          <div className="fq-chat-head">
            <span className="fq-avatar" aria-hidden="true">M</span>
            <div>
              <p className="fq-chat-name">Mzobs</p>
              <p className="fq-chat-note">Straight answers</p>
            </div>
          </div>
          <div key={current.q} className="fq-bubble you">{current.q}</div>
          <div aria-live="polite">
            {typing ? (
              <div className="fq-reply" key="typing">
                <span className="fq-avatar" aria-hidden="true">M</span>
                <div className="fq-bubble bot fq-typing" aria-hidden="true"><i /><i /><i /></div>
              </div>
            ) : (
              <div className="fq-reply" key={current.q}>
                <span className="fq-avatar" aria-hidden="true">M</span>
                <div className="fq-bubble bot">
                  <p>{current.a}</p>
                  {current.link && <Link to={current.link.to} className="fq-link">{current.link.label} <span aria-hidden="true">→</span></Link>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
