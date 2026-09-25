import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Briefcase, Network, Compass, Award, ScrollText, CalendarDays, BookOpen, Gift, Check } from 'lucide-react'
import { submitCampusMantriApplication } from '../lib/campusMantri'
import './campusMantri.css'

/* ------------------------------------------------------------------ content */

// The benefits below are the ones the Mzobs Doot brief lists. Each is shown
// as offered "where applicable" — confirm the final list with the Mzobs team
// before launch; nothing is added beyond it.
const BENEFITS = [
  [Users, 'Exclusive Mzobs community'],
  [Briefcase, 'Career opportunities'],
  [Network, 'Networking'],
  [Compass, 'Leadership experience'],
  [Award, 'Recognition'],
  [ScrollText, 'Certificates, where applicable'],
  [CalendarDays, 'Events'],
  [BookOpen, 'Learning resources'],
  [Gift, 'Rewards, where applicable'],
]

const CONCEPTS = [
  ['01', 'Represent', 'Bring the Mzobs experience to your community.'],
  ['02', 'Connect', 'Connect students with relevant opportunities and initiatives.'],
  ['03', 'Create impact', 'Help more people discover opportunities that matter.'],
]

const IDENTITIES = [
  ['The Connector', 'brings people together'],
  ['The Voice', 'speaks for the campus'],
  ['The Explorer', 'finds what’s next'],
  ['The Community Builder', 'grows the circle'],
  ['The Opportunity Scout', 'spots what’s worth sharing'],
]

const IMPACT = [
  ['01', 'Discover', 'Find opportunities worth sharing.'],
  ['02', 'Connect', 'Bring students into the Mzobs ecosystem.'],
  ['03', 'Activate', 'Create campus conversations and activities.'],
  ['04', 'Amplify', 'Spread opportunities across your campus.'],
]

const JOURNEY = ['Apply', 'Get selected', 'Get your Doot ID', 'Build your campus community', 'Connect students', 'Create impact']

const FAQ = [
  ['What is a Mzobs Doot?', 'A Mzobs Doot is a student representative who helps connect their community with meaningful career opportunities, hiring initiatives, events and the Mzobs ecosystem.'],
  ['What will I actually do?', 'You’ll discover opportunities worth sharing, bring students into the Mzobs ecosystem, create campus conversations and activities, and spread opportunities across your campus.'],
  ['How do I apply?', 'Fill in the application below — about you, your campus, your experience and why Mzobs. It takes a few minutes and you can move back and forth between steps.'],
  ['What do I get as a Doot?', 'Early access to opportunities and events, a network of students, recruiters and professionals, recognition for your contribution, and room to build communication and leadership skills.'],
]

const STEPS = ['About you', 'Your campus', 'Your experience', 'Why Mzobs', 'Finish']

const jaali = (c) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><path d='M13 1 25 13 13 25 1 13Z' fill='none' stroke='${c}' stroke-width='1'/><circle cx='13' cy='13' r='1.4' fill='${c}'/></svg>`)}")`
const NAV = [['why', 'Why join'], ['how', 'How it works'], ['benefits', 'Benefits'], ['faq', 'FAQ'], ['apply', 'Apply']]


/* ------------------------------------------------------------------- hooks */

// Adds `cm-in` to the element the first time it scrolls into view — CSS does the rest.
function useIn(threshold = 0.18) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') return el.classList.add('cm-in')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('cm-in')
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

function Rv({ as: Tag = 'div', d = 0, className = '', children, ...rest }) {
  const ref = useIn()
  return <Tag ref={ref} className={`cm-rv ${className}`} style={{ '--d': `${d}s` }} {...rest}>{children}</Tag>
}

const go = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* -------------------------------------------------------------- the MZOBS pass */

function Pass({ name, college, city, hoverFlip = true }) {
  const [flip, setFlip] = useState(false)
  const id = 'MZ-DT-2026-••••'
  return (
    <button
      type="button"
      className={`cm-pass ${hoverFlip ? 'cm-hoverflip' : ''}`}
      data-flip={flip}
      onClick={() => setFlip((f) => !f)}
      aria-pressed={flip}
      aria-label="Mzobs Doot ID preview — tap to flip"
      style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', color: 'inherit' }}
    >
      <div className="cm-pass-inner">
        <div className="cm-face">
          <div className="brand"><span>MZOBS</span><i>2026</i></div>
          <div>
            <div className="role">Mzobs<br /><b>Doot</b></div>
          </div>
          <div className="row">
            <div>
              <div className="who">{name || 'Your name'}</div>
              <div className="sub">{college || 'Your college'}</div>
            </div>
            <div className="tag">Your campus.<br />Your voice.</div>
          </div>
        </div>
        <div className="cm-face cm-back">
          <div className="brand"><span>DOOT ID</span><i>PREVIEW</i></div>
          <dl>
            <div><dt>Campus</dt><dd>{college || '—'}</dd></div>
            <div><dt>City</dt><dd>{city || '—'}</dd></div>
            <div><dt>Doot ID</dt><dd>{id}</dd></div>
            <div><dt>Joined</dt><dd>2026</dd></div>
          </dl>
          <div className="tag" style={{ textAlign: 'left' }}>Illustrative preview · not an issued ID</div>
        </div>
      </div>
    </button>
  )
}

/* ---------------------------------------------------------------- application */

const EMPTY = { name: '', email: '', phone: '', college: '', city: '', course: '', experience: '', involvement: '', why: '' }

function validate(step, f) {
  const e = {}
  if (step === 0) {
    if (!f.name.trim()) e.name = 'Tell us your name'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email'
    if (f.phone.trim() && f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit number'
  }
  if (step === 1) {
    if (!f.college.trim()) e.college = 'Add your college'
    if (!f.city.trim()) e.city = 'Add your city'
    if (!f.course.trim()) e.course = 'Add your course and year'
  }
  if (step === 2 && f.experience.trim().length < 10) e.experience = 'Share a line or two — even small things count'
  if (step === 3 && f.why.trim().length < 20) e.why = 'Tell us a little more (a couple of sentences)'
  return e
}

function Field({ label, error, name, f, set, textarea, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className={`cm-field ${error ? 'err' : ''} ${textarea ? 'full' : ''}`}>
      <span>{label}</span>
      <Tag value={f[name]} onChange={(e) => set(name, e.target.value)} aria-invalid={!!error} {...rest} />
      {error && <div className="cm-err" role="alert">{error}</div>}
    </label>
  )
}

function ApplicationForm({ f, set }) {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const [done, setDone] = useState(false)
  const top = useRef(null)

  const scrollTop = () => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const next = () => {
    const e = validate(step, f)
    setErrors(e)
    if (Object.keys(e).length) return
    setStep((s) => s + 1)
    scrollTop()
  }
  const back = () => {
    setErrors({})
    setStep((s) => s - 1)
    scrollTop()
  }

  const submit = async () => {
    setBusy(true)
    setFail('')
    try {
      await submitCampusMantriApplication({
        name: f.name.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
        college: f.college.trim(),
        city: f.city.trim(),
        course: f.course.trim(),
        experience: f.experience.trim(),
        involvement: f.involvement.trim(),
        why: f.why.trim(),
      })
      setDone(true)
      scrollTop()
    } catch (err) {
      setFail(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="cm-panel cm-ok" ref={top}>
        <div className="tick"><Check size={30} strokeWidth={2.4} /></div>
        <h3>Application received</h3>
        <p className="s" style={{ margin: '8px auto 0', maxWidth: '26rem' }}>Thank you, {f.name.split(' ')[0]}. The Mzobs team will be in touch on {f.email}.</p>
      </div>
    )
  }

  return (
    <div className="cm-form-wrap" ref={top}>
      <ol className="cm-steps" aria-label="Application steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
            <b>{i < step ? <Check size={14} strokeWidth={3} /> : `0${i + 1}`}</b> {s}
          </li>
        ))}
      </ol>

      <form className="cm-panel" onSubmit={(e) => { e.preventDefault(); if (step === 4) submit(); else next() }} noValidate>
        <div className="cm-step-pane" key={step}>
          {step === 0 && (
            <>
              <h3>About you</h3><p className="s">Let’s start with the basics.</p>
              <div className="cm-fgrid">
                <div className="full"><Field label="Full name" name="name" f={f} set={set} error={errors.name} placeholder="Your name" autoComplete="name" /></div>
                <Field label="Email" name="email" f={f} set={set} error={errors.email} placeholder="you@college.edu" type="email" autoComplete="email" />
                <Field label="Phone (optional)" name="phone" f={f} set={set} error={errors.phone} placeholder="10-digit number" inputMode="tel" autoComplete="tel" />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h3>Your campus</h3><p className="s">Where will you be representing Mzobs?</p>
              <div className="cm-fgrid">
                <div className="full"><Field label="College / university" name="college" f={f} set={set} error={errors.college} placeholder="Your college" autoFocus /></div>
                <Field label="City" name="city" f={f} set={set} error={errors.city} placeholder="City" />
                <Field label="Course & year" name="course" f={f} set={set} error={errors.course} placeholder="e.g. B.Tech, 2nd year" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h3>Your experience</h3><p className="s">Clubs, events, communities, projects — anything where you led or organised.</p>
              <div className="cm-fgrid">
                <div className="full"><Field textarea label="What have you led or organised?" name="experience" f={f} set={set} error={errors.experience} placeholder="A club, a fest, a group, a project…" autoFocus /></div>
                <div className="full"><Field textarea label="Campus communities you’re part of (optional)" name="involvement" f={f} set={set} placeholder="Clubs, societies, teams…" /></div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3>Why Mzobs</h3><p className="s">What draws you to being a Mzobs Doot?</p>
              <div className="cm-fgrid">
                <div className="full"><Field textarea label="In your own words" name="why" f={f} set={set} error={errors.why} placeholder="What would you want to build on your campus?" autoFocus /></div>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h3>Finish</h3><p className="s">Check everything, then send it in.</p>
              <dl className="cm-review">
                {[['Name', f.name], ['Email', f.email], ['Phone', f.phone], ['Campus', `${f.college}, ${f.city}`], ['Course', f.course], ['Experience', f.experience], ['Involvement', f.involvement], ['Why Mzobs', f.why]].map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>
                ))}
              </dl>
              {fail && <p className="cm-err" role="alert" style={{ marginTop: 18 }}>{fail}</p>}
            </>
          )}
        </div>

        <div className="cm-actions">
          {step > 0 ? <button type="button" className="cm-btn cm-btn-ghost" onClick={back} disabled={busy}>Back</button> : <span />}
          <button type="submit" className="cm-btn cm-btn-primary" disabled={busy}>
            {busy ? 'Sending…' : step === 4 ? 'Send application' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}

/* --------------------------------------------------------------------- page */

export default function CampusMantri() {
  const [scrolled, setScrolled] = useState(false)
  const [f, setF] = useState(EMPTY)
  const set = useCallback((k, v) => setF((x) => ({ ...x, [k]: v })), [])
  const stage = useRef(null)
  const vt = useRef(null)
  const words = useRef(null)
  const hero = useIn(0.05)

  useEffect(() => {
    const prev = document.title
    document.title = 'Mzobs Doot — Carry Opportunities. Connect Talent.'
    return () => { document.title = prev }
  }, [])

  // scroll-linked bits: nav state, identity-word drift, impact line drawing
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      raf = 0
      setScrolled(window.scrollY > 24)
      if (reduced) return
      const vh = window.innerHeight
      words.current?.querySelectorAll('.cm-word').forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const p = (r.top + r.height / 2) / vh - 0.5 // -0.5 … 0.5 across the viewport
        el.style.setProperty('--sx', `${p * (i % 2 ? -46 : 46)}px`)
      })
      const t = vt.current
      if (t) {
        const r = t.getBoundingClientRect()
        t.style.setProperty('--p', String(Math.max(0, Math.min(1, (vh * 0.62 - r.top) / r.height))))
        t.querySelectorAll('.cm-vstep').forEach((s) => s.classList.toggle('on', s.getBoundingClientRect().top < vh * 0.62))
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const onMove = (e) => {
    const el = stage.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--ry', `${x * 9}deg`)
    el.style.setProperty('--rx', `${-y * 9}deg`)
  }
  const onLeave = () => { stage.current?.style.setProperty('--rx', '0deg'); stage.current?.style.setProperty('--ry', '0deg') }

  const identRef = useIn(0.12)
  const flowRef = useIn(0.3)
  const pathRef = useIn(0.3)

  return (
    <div className="cm" style={{ '--cm-jaali-dark': jaali('rgba(120,220,205,0.45)') }}>
      {/* navigation */}
      <header className={`cm-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="cm-wrap cm-nav-in">
          <Link to="/" className="cm-logo" aria-label="Mzobs home"><img src="/images/logo.png" alt="Mzobs" draggable="false" /></Link>
          <nav className="cm-links" aria-label="Mzobs Doot">
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={go(id)}>{label}</a>)}
          </nav>
          <a href="#apply" onClick={go('apply')} className="cm-btn cm-btn-primary">Become a Doot <ArrowRight size={14} /></a>
        </div>
      </header>

      {/* hero */}
      <section className="cm-hero" id="top" ref={hero}>
        <div className="cm-bg" aria-hidden="true">
          <video className="cm-hero-video" src="/herovideo.mp4?v=4" autoPlay muted loop playsInline preload="auto" />
          <div className="cm-hero-scrim" />
        </div>

        <div className="cm-wrap cm-hero-grid">
          <div>
            <p className="cm-eyebrow cm-rv" style={{ '--d': '0s' }}>Mzobs Community <span className="cm-deva">· दूत</span></p>
            <h1 className="cm-h1">
              <span className="cm-line"><span>Meet the</span></span>
              <span className="cm-line"><span>Mzobs</span></span>
              <span className="cm-line"><span><span className="cm-accent" style={{ display: 'inline' }}>Doot.</span></span></span>
            </h1>
            <p className="cm-lead cm-rv" style={{ '--d': '0.3s', marginTop: 30 }}>Carry opportunities. Connect talent. Become the connection between Mzobs and your student community — discover opportunities, spread awareness, build your network and create real impact.</p>
            <div className="cm-hero-cta cm-rv" style={{ '--d': '0.42s' }}>
              <a href="#apply" onClick={go('apply')} className="cm-btn cm-btn-primary">Become a Mzobs Doot <ArrowRight size={16} /></a>
              <a href="#why" onClick={go('why')} className="cm-btn cm-btn-ghost">Explore the Doot network</a>
            </div>
          </div>

        </div>
      </section>

      {/* more than an ambassador */}
      <section className="cm-sec" id="why">
        <div className="cm-wrap cm-more">
          <div>
            <Rv as="p" className="cm-eyebrow">What is a Mzobs Doot?</Rv>
            <IntroHeading />
            <Rv as="p" d={0.15} className="cm-statement">A Mzobs Doot is a student representative who helps connect their community with meaningful career opportunities, hiring initiatives, events and the Mzobs ecosystem.</Rv>
          </div>
          <div>
            {CONCEPTS.map(([n, t, p], i) => (
              <Rv key={t} d={i * 0.1} className="cm-concept">
                <span className="n">{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      {/* identity */}
      <section className="cm-sec cm-dark" ref={identRef}>
        <div className="cm-wrap">
          <div className="cm-ident-top">
            <div className="cm-ident-head">
              <p className="cm-eyebrow cm-rv">Your role</p>
              <h2 className="cm-h2 cm-rv" style={{ '--d': '0.08s' }}>You are not just a representative.</h2>
              <p className="cm-lead cm-rv" style={{ '--d': '0.16s', marginTop: 22 }}>You are:</p>
            </div>
          <div className="cm-stage cm-rv" style={{ '--d': '0.2s' }} onPointerMove={onMove} onPointerLeave={onLeave}>
            {[['Opportunity', '4%', '9%', 0, true], ['Community', '62%', '3%', 1.2], ['Leadership', '2%', '87%', 2.4], ['Events', '70%', '85%', 0.7, true], ['Connections', '36%', '95%', 1.8]].map(([label, l, t, d, v]) => (
              <span key={label} className={`cm-chip ${v ? 'v' : ''}`} style={{ left: l, top: t, '--fd': `${d}s` }} aria-hidden="true">{label}</span>
            ))}
            <div className="cm-tilt" ref={stage}>
              <Pass name="" college="" city="" hoverFlip />
            </div>
          </div>
          </div>
          <div className="cm-words" ref={words}>
            {IDENTITIES.map(([w, m], i) => (
              <div key={w} className="cm-word cm-rv" style={{ '--d': `${i * 0.07}s` }}>
                <span className="t">{w}</span>
                <span className="m">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* impact */}
      <section className="cm-sec" id="impact">
        <div className="cm-wrap cm-impact">
          <div className="cm-impact-head">
            <Rv as="p" className="cm-eyebrow">The impact</Rv>
            <Rv as="h2" d={0.06} className="cm-h2">Your campus, your impact.</Rv>
          </div>
          <div className="cm-vt" ref={vt}>
            {IMPACT.map(([n, t, p]) => (
              <div key={t} className="cm-vstep">
                <div className="num">{n}</div>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* role in the network */}
      <section className="cm-sec" style={{ paddingTop: 0 }}>
        <div className="cm-wrap">
          <Rv as="p" className="cm-eyebrow">Where you fit</Rv>
          <Rv as="h2" d={0.06} className="cm-h2">The bridge.</Rv>
          <div className="cm-flow" ref={flowRef} aria-label="Student to Mzobs Doot to Mzobs to opportunity to student community">
            {[['Student', 'Starts here'], ['Mzobs Doot', 'You', true], ['Mzobs', 'The platform'], ['Opportunity', 'Jobs & careers'], ['Student community', 'Everyone benefits']].map(([v, k, hero], i, arr) => (
              <div key={v} style={{ display: 'contents' }}>
                <div className={`cm-node cm-rv ${hero ? 'hero' : ''}`} style={{ '--d': `${i * 0.12}s` }}><div className="k">{k}</div><div className="v">{v}</div></div>
                {i < arr.length - 1 && <div className="cm-link" style={{ '--td': `${i * 0.5}s` }} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* journey */}
      <section className="cm-sec" id="how" style={{ background: '#fff', borderBlock: '1px solid var(--cm-line)' }}>
        <div className="cm-wrap">
          <Rv as="p" className="cm-eyebrow">How it works</Rv>
          <Rv as="h2" d={0.06} className="cm-h2">The Doot journey.</Rv>
          <div className="cm-path" ref={pathRef}>
            {JOURNEY.map((s, i) => (
              <div key={s} className="cm-pstep">
                <i style={{ '--pd': `${i * 0.45}s` }} />
                <div><div className="no">0{i + 1}</div><h3>{s}</h3></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* benefits */}
      <section className="cm-sec" id="benefits">
        <div className="cm-wrap">
          <Rv as="p" className="cm-eyebrow">What you get</Rv>
          <Rv as="h2" d={0.06} className="cm-h2">As a Mzobs Doot,<br />you get access to.</Rv>
          <div className="cm-ben">
            {BENEFITS.map(([Icon, label], i) => (
              <Rv key={label} d={(i % 3) * 0.07} className="cm-b"><Icon size={22} strokeWidth={1.6} /><span>{label}</span></Rv>
            ))}
          </div>
        </div>
      </section>

      {/* digital pass */}
      <section className="cm-sec" id="pass" style={{ paddingTop: 0 }}>
        <div className="cm-wrap cm-passgrid">
          <div>
            <Rv as="p" className="cm-eyebrow">Your pass</Rv>
            <Rv as="h2" d={0.06} className="cm-h2">Your Doot ID.</Rv>
            <Rv as="p" d={0.12} className="cm-lead" style={{ marginTop: 22 }}>Preview how your pass could look. Hover — or tap — to flip it. This is a visual preview only, not an issued ID.</Rv>
            <div className="cm-fields">
              <label className="cm-field"><span>Your name</span><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></label>
              <label className="cm-field"><span>Your college</span><input value={f.college} onChange={(e) => set('college', e.target.value)} placeholder="Your college" /></label>
              <label className="cm-field"><span>City</span><input value={f.city} onChange={(e) => set('city', e.target.value)} placeholder="City" /></label>
            </div>
          </div>
          <Rv className="cm-stage" style={{ minHeight: 360 }}><Pass name={f.name} college={f.college} city={f.city} /></Rv>
        </div>
      </section>

      {/* faq */}
      <section className="cm-sec" id="faq" style={{ paddingTop: 0 }}>
        <div className="cm-wrap">
          <Rv as="p" className="cm-eyebrow">Questions</Rv>
          <Rv as="h2" d={0.06} className="cm-h2">Good to know.</Rv>
          <Rv className="cm-faq" d={0.1}>
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}<i /></summary><p>{a}</p></details>)}
          </Rv>
        </div>
      </section>

      {/* apply */}
      <section className="cm-sec cm-dark cm-cta" id="apply" style={{ paddingBottom: 'clamp(70px, 9vw, 120px)' }}>
        <div className="cm-wrap">
          <Rv as="p" className="cm-eyebrow">Apply</Rv>
          <Rv as="h2" d={0.06} className="cm-h2">Ready to become a Mzobs Doot?</Rv>
          <Rv as="p" d={0.14} className="cm-lead" style={{ marginTop: 26 }}>Your campus already has potential. Now give it a connection to opportunity.</Rv>
          <Rv d={0.22} style={{ marginTop: 34 }}>
            <a href="#apply-form" onClick={go('apply-form')} className="cm-btn cm-btn-light">Become a Mzobs Doot <ArrowRight size={16} /></a>
          </Rv>
        </div>
      </section>

      <section className="cm-sec" id="apply-form" style={{ paddingTop: 'clamp(56px, 8vw, 100px)' }}>
        <div className="cm-wrap"><ApplicationForm f={f} set={set} /></div>
      </section>

      {/* final */}
      <section className="cm-sec cm-dark cm-final" style={{ paddingBottom: 60 }}>
        <div className="cm-wrap">
          <Rv as="h2" className="cm-h2">Your campus is waiting.<br /><span className="cm-accent" style={{ color: '#5fb8ac' }}>Are you ready to lead it?</span></Rv>
          <Rv d={0.12}><a href="#apply-form" onClick={go('apply-form')} className="cm-btn cm-btn-light">Become a Mzobs Doot <ArrowRight size={16} /></a></Rv>
          <div className="cm-foot">
            <Link to="/" className="cm-logo" aria-label="Mzobs home"><img src="/images/logo.png" alt="Mzobs" draggable="false" /></Link>
            <span>Mzobs Doot · 2026</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function IntroHeading() {
  const ref = useIn()
  return (
    <h2 className="cm-h2" ref={ref}>
      <span className="cm-line"><span>Not just an</span></span>
      <span className="cm-line"><span>ambassador. A <span className="cm-accent" style={{ display: 'inline' }}>Doot.</span></span></span>
    </h2>
  )
}
