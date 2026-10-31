import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'
import { GST_RATE_PERCENT, PLANS, fmtINR } from '../../lib/employerPricingPlan'
import './landing.css'
import './audiences.css'
import './candidate.css'
import './employer.css'
import './associate.css'

// One section per audience Mzobs serves. Copy mirrors what each
// destination page already says.

function Intro({ label, title, lead, note, children }) {
  return (
    <div data-r="" className="aud-intro">
      <p className="aud-label">{label}</p>
      <h2 className="h2">{title}</h2>
      <p className="aud-lead">{lead}</p>
      {note && <p className="aud-note">{note}</p>}
      <div className="aud-cta">{children}</div>
    </div>
  )
}

function List({ items }) {
  return (
    <ul data-r="" className="aud-list">
      {items.map(([t, p]) => (
        <li key={t}>
          <h3>{t}</h3>
          <p>{p}</p>
        </li>
      ))}
    </ul>
  )
}

const Ico = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

const CANDIDATE_PERKS = [
  { title: 'Verified openings', text: 'Jobs from hiring companies, across cities and categories.', icon: <Ico><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></Ico> },
  { title: 'One profile', text: 'Fill in your details and resume once, then apply in a few clicks.', icon: <Ico><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></Ico> },
  { title: 'Recommended jobs', text: 'Roles matched to your profile and skills.', icon: <Ico><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".7" fill="currentColor" /></Ico> },
  { title: 'Application tracking', text: 'See where each application stands.', icon: <Ico><path d="M4 19h5v-6h6V7h5" /><circle cx="20" cy="7" r="1.3" fill="currentColor" /></Ico> },
]

function CandidatePerks() {
  return (
    <ul data-r="" className="cd-grid">
      {CANDIDATE_PERKS.map((p, i) => (
        <li key={p.title} className="cd-tile">
          <span className="cd-ico">{p.icon}</span>
          <span className="cd-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </li>
      ))}
    </ul>
  )
}

function Candidate() {
  return (
    <section id="candidates" className="aud aud-cand">
      <div className="aud-inner">
        <Intro
          label="For candidates"
          title={<>Find a job that <span className="aud-em">fits.<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7 C 25 1, 50 11, 98 3" pathLength="1" /></svg></span></>}
          lead="Mzobs lists openings from companies that are hiring right now. Make one profile, apply from it, and see what happened to each application."
          note={<><b>Free to join.</b> Whether you are a fresher or changing jobs.</>}
        >
          <Link to={CLIENT_ONLY_ROUTES.candidates} className="aud-btn solid">Browse jobs</Link>
          <Link to={CLIENT_ONLY_ROUTES.employeeSignup} className="aud-btn ghost">Create your profile</Link>
        </Intro>
        <CandidatePerks />
      </div>
    </section>
  )
}

const STARTING_PRICE = Math.min(...PLANS.map((plan) => plan.baseAmount))

const HIRING_FLOW = [
  ['Post', 'Add the title, skills, location and salary. Mzobs reviews it, then it goes live.'],
  ['Find', 'Applications arrive with a reviewed resume, or search the talent pool yourself.'],
  ['Shortlist', 'Keep the people who fit and reject the rest with a reason.'],
  ['Interview', 'Schedule, reschedule and record feedback from the dashboard.'],
  ['Offer', 'Create the offer, track the response and mark the hire.'],
]

const EMPLOYER_FACTS = [
  ['Unlimited job posts', 'On every annual plan, so a new role costs nothing extra.'],
  ['Reviewed candidates', 'Mzobs checks every resume before a candidate can apply or show up in search.'],
  ['Private until you unlock', 'Contact details stay hidden. One credit unlocks one candidate.'],
  ['Straight to you', 'Applications go to your dashboard, with no staff queue in between.'],
]

function Employer() {
  return (
    <section id="employers-offer" className="aud-emp">
      <div className="aud-emp-panel">
        <div className="aud-inner">
          <Intro
            label="For employers"
            title="Hire in one place."
            lead={`Post a role, get reviewed candidates and take them from application to offer in one dashboard. Plans start at ${fmtINR(STARTING_PRICE)} a year + ${GST_RATE_PERCENT}% GST.`}
            note={<>Hiring for a bigger team? <Link to="/employers/pricing">Ask about a custom plan</Link>.</>}
          >
            <Link to={CLIENT_ONLY_ROUTES.employerSignup} className="aud-btn solid">Post a job</Link>
            <Link to="/employers/pricing" className="aud-btn ghost-light">See pricing</Link>
          </Intro>
          <ol data-r="" className="aud-flow" aria-label="How hiring works on Mzobs">
            {HIRING_FLOW.map(([t, p], i) => (
              <li key={t}>
                <span className="mk">{i + 1}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <ul data-r="" className="aud-facts">
          {EMPLOYER_FACTS.map(([t, p]) => (
            <li key={t}>
              <h3>{t}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ul>
        <p className="aud-built">Built for startups, small and medium businesses, growing teams and placement agencies.</p>
      </div>
    </section>
  )
}

const ALLY_ROLES = [
  ['01', 'Represent', 'Bring the Mzobs experience to your community.'],
  ['02', 'Connect', 'Connect students with relevant opportunities and initiatives.'],
  ['03', 'Create impact', 'Help more people discover opportunities that matter.'],
]

function Ally() {
  return (
    <section id="ally" className="aud aud-ally">
      <div className="aud-inner">
        <Intro
          label="Mzobs Ally"
          title="Represent Mzobs on your campus."
          lead="A Mzobs Ally is a student who connects their campus with career opportunities, hiring initiatives and events. You help classmates get hired and build real-world experience of your own."
        >
          <Link to={CLIENT_ONLY_ROUTES.ally} className="aud-btn dark">Become an Ally</Link>
        </Intro>
        <div data-r="" className="aud-who">
          <p className="k">Who can apply</p>
          <p className="big">3rd and 4th year students</p>
          <p>with at least 4 semesters completed for 8-semester courses, or the equivalent for your course length.</p>
        </div>
      </div>
      <ol className="aud-roles">
        {ALLY_ROLES.map(([n, t, p]) => (
          <li key={t} data-r="">
            <span className="n">{n}</span>
            <h3>{t}</h3>
            <p>{p}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Associate() {
  return (
    <section id="associate" className="aud aud-assoc">
      <div className="aud-inner">
        <Intro
          label="Associate with Mzobs"
          title={<>Join the hiring <span className="aud-em">network.<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7 C 25 1, 50 11, 98 3" pathLength="1" /></svg></span></>}
          lead="Connect your candidates with verified opportunities from employers across industries and cities."
          note={<><b>Who can apply</b><span className="as-chips"><span>Placement consultants</span><span>Recruitment agencies</span><span>Local hiring partners</span><span>Career organisations</span></span></>}
        >
          <Link to={CLIENT_ONLY_ROUTES.associateApply} className="aud-btn solid">Apply as Associate</Link>
          <Link to={CLIENT_ONLY_ROUTES.associate} className="aud-btn ghost">How it works</Link>
        </Intro>
        <List
          items={[
            ['Verified openings', 'Access openings from employers across industries and cities.'],
            ['Beyond your local network', 'Connect your candidates with jobs outside your own city.'],
            ['Work with our team', 'Every application is reviewed by the Mzobs team before onboarding.'],
          ]}
        />
      </div>
    </section>
  )
}

const STEPS = [
  ['Register your campus', 'Fill in a short form with your institution’s details.'],
  ['Connect with Mzobs', 'Our team reviews your request and gets in touch.'],
  ['Prepare your students', 'Once verified, students get access to career resources.'],
  ['Connect with employers', 'Students find openings from companies hiring emerging talent.'],
]

function AddCampus() {
  return (
    <section id="add-campus" className="aud aud-camp">
      <div className="aud-inner" style={{ paddingBottom: 'clamp(28px, 4vw, 48px)' }}>
        <Intro
          label="Add your campus"
          title="Bring your campus onto Mzobs."
          lead="For colleges, universities and other institutions. Your students find relevant jobs in one place, and you get a clearer link to employers who are hiring."
          note={<><b>Dedicated contact:</b> every partner campus gets a Mzobs point of contact.</>}
        >
          <Link to={CLIENT_ONLY_ROUTES.campusPartnerApply} className="aud-btn solid">Register your campus</Link>
          <Link to={CLIENT_ONLY_ROUTES.campusPartner} className="aud-btn ghost">Learn more</Link>
        </Intro>
      </div>
      <ol className="aud-steps">
        {STEPS.map(([t, p], i) => (
          <li key={t} data-r="">
            <span className="no">Step {i + 1}</span>
            <h3>{t}</h3>
            <p>{p}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Audiences() {
  return (
    <>
      <Candidate />
      <Employer />
      <Associate />
    </>
  )
}

// Campus and student sections, shown on the candidate home page. `.lp`
// scopes the landing styles to this block.
export function CampusAudiences() {
  return (
    <div className="lp">
      <Ally />
      <AddCampus />
    </div>
  )
}
