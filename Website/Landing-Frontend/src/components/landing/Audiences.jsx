import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'
import { GST_RATE_PERCENT, PLANS, fmtINR } from '../../lib/employerPricingPlan'
import './audiences.css'

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

function Candidate() {
  return (
    <section id="candidates" className="aud aud-cand">
      <div className="aud-inner">
        <Intro
          label="For candidates"
          title="Find a job that fits."
          lead="Mzobs lists openings from companies that are hiring right now. Make one profile, apply from it, and see what happened to each application."
          note={<><b>Free to join.</b> Whether you are a fresher or changing jobs.</>}
        >
          <Link to={CLIENT_ONLY_ROUTES.candidates} className="aud-btn solid">Browse jobs</Link>
          <Link to={CLIENT_ONLY_ROUTES.employeeSignup} className="aud-btn ghost">Create your profile</Link>
        </Intro>
        <List
          items={[
            ['Verified openings', 'Jobs from hiring companies, across cities and categories.'],
            ['One profile', 'Fill in your details and resume once, then apply in a few clicks.'],
            ['Recommended jobs', 'Roles matched to your profile and skills.'],
            ['Application tracking', 'See where each application stands.'],
          ]}
        />
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
          lead="A Mzobs Ally is a student who connects their campus with career opportunities, hiring initiatives and events."
          note={<><b>Who can apply:</b> 3rd and 4th year students with at least 4 semesters completed.</>}
        >
          <Link to={CLIENT_ONLY_ROUTES.ally} className="aud-btn light">Become an Ally</Link>
        </Intro>
        <List
          items={[
            ['Represent', 'Bring the Mzobs experience to your community.'],
            ['Connect', 'Connect students with relevant opportunities and initiatives.'],
            ['Create impact', 'Help more people discover opportunities that matter.'],
          ]}
        />
      </div>
    </section>
  )
}

function Associate() {
  return (
    <section id="associate" className="aud aud-assoc">
      <div className="aud-inner">
        <List
          items={[
            ['Verified openings', 'Access openings from employers across industries and cities.'],
            ['Beyond your local network', 'Connect your candidates with jobs outside your own city.'],
            ['Work with our team', 'Every application is reviewed by the Mzobs team before onboarding.'],
          ]}
        />
        <Intro
          label="Associate with Mzobs"
          title="Join the hiring network."
          lead="Connect your candidates with verified opportunities from employers across industries and cities."
          note={<><b>Who can apply:</b> placement consultants, recruitment agencies, local hiring partners and career organisations.</>}
        >
          <Link to={CLIENT_ONLY_ROUTES.associateApply} className="aud-btn solid">Apply as Associate</Link>
          <Link to={CLIENT_ONLY_ROUTES.associate} className="aud-btn ghost">How it works</Link>
        </Intro>
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
      <Ally />
      <Associate />
      <AddCampus />
    </>
  )
}
