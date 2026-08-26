import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, Lock, Link as LinkIcon, BadgeCheck, GraduationCap, Loader2, ArrowRight } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa6'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Chip from '../components/ui/Chip'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { useProfileQuery, useUpdateProfileMutation } from '../hooks/useProfile'

// Payment is no longer part of onboarding — an account is created (and its
// resume queued) as soon as the profile steps are done. The one-time fee is
// collected separately from the Subscription page inside the dashboard.
const TOTAL = 16
const PROGRAM_FEE = 299

const INTERESTS = ['Software Development', 'Data & Analytics', 'Product Management', 'Design', 'Marketing', 'Sales', 'Finance', 'Operations', 'Customer Success', 'Human Resources']
const ROLE_SUGGESTIONS = ['Business Analyst', 'Data Analyst', 'Product Analyst', 'Operations Analyst']
const LOCATIONS = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Remote']
const SKILLS = ['MS Excel', 'SQL', 'Data Analysis', 'Communication', 'Product Sense', 'Python']
const YEARS = Array.from({ length: 21 }, (_, i) => i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i)

function ChipRow({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-[9px]">
      {options.map((o) => (
        <Chip key={o} selected={selected.includes(o)} onClick={() => onToggle(o)}>
          {o}
        </Chip>
      ))}
    </div>
  )
}

function SingleChoiceGrid({ options, value, onChange, cols = 2 }) {
  return (
    <div className={`grid gap-2.5 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((x) => (
        <div
          key={x}
          onClick={() => onChange(x)}
          className={`text-center px-3.5 py-3.5 rounded-[10px] border cursor-pointer text-[13px] font-medium transition-all ${
            value === x ? 'bg-navy border-navy text-white' : 'bg-surface border-border-strong text-ink-secondary hover:border-navy'
          }`}
        >
          {x}
        </div>
      ))}
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitError, setSubmitError] = useState('')

  const { data: profile } = useProfileQuery()
  const updateProfile = useUpdateProfileMutation()
  const [profileSaved, setProfileSaved] = useState(false)
  const submitting = updateProfile.isPending

  const [employmentStatus, setEmploymentStatus] = useState('Fresher / Student')
  const [interests, setInterests] = useState(INTERESTS.slice(0, 2))
  const [locations, setLocations] = useState(LOCATIONS.slice(0, 1))
  const [skills, setSkills] = useState(SKILLS.slice(0, 3))
  const [salary, setSalary] = useState(8)
  const [willingToRelocate, setWillingToRelocate] = useState('Yes, open to relocating')

  const [currentCompany, setCurrentCompany] = useState('')
  const [designation, setDesignation] = useState('')
  const [expYears, setExpYears] = useState(2)
  const [expMonths, setExpMonths] = useState(0)
  const [currentCtc, setCurrentCtc] = useState('')
  const [noticePeriod, setNoticePeriod] = useState('30 days')
  const [preferredRole, setPreferredRole] = useState('Product Analyst')
  const [educationLevel, setEducationLevel] = useState('Graduate')
  const [degree, setDegree] = useState('B.Tech, Computer Science')
  const [institution, setInstitution] = useState('RV College of Engineering')
  const [gradYear, setGradYear] = useState('2025')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('Female')
  const [maritalStatus, setMaritalStatus] = useState('Single')
  const [currentCity, setCurrentCity] = useState('Bengaluru')
  const [resumeHeadline, setResumeHeadline] = useState('')
  const [portfolioLink, setPortfolioLink] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')

  const isExperienced = employmentStatus === 'Experienced Professional'

  function toggle(list, setList, item) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  }

  async function saveProfileAndResume() {
    await updateProfile.mutateAsync({
      experience: isExperienced ? 'experienced' : 'fresher',
      currentCompany,
      designation,
      experienceYears: isExperienced ? expYears + expMonths / 12 : 0,
      currentCtc,
      noticePeriod,
      interests,
      preferredRole,
      expectedSalaryMin: salary * 100000,
      expectedSalaryMax: (salary + 2) * 100000,
      preferredLocations: locations,
      skills,
      education: [{ degree, institute: institution, year: gradYear }],
      dob,
      gender,
      maritalStatus,
      currentCity,
      relocationOk: willingToRelocate === 'Yes, open to relocating',
      resumeHeadline,
      portfolioLink,
      linkedin,
      github,
    })
  }

  async function finishProfile() {
    setSubmitError('')
    try {
      if (!profileSaved) {
        await saveProfileAndResume()
        setProfileSaved(true)
      }
      return true
    } catch (err) {
      setSubmitError(err.response?.data?.message ?? err.message ?? 'Something went wrong. Please try again.')
      return false
    }
  }

  async function next() {
    if (step === TOTAL - 2) {
      const ok = await finishProfile()
      if (!ok) return
      setStep((s) => s + 1)
      return
    }
    if (step === TOTAL - 1) {
      navigate('/app/jobs')
      return
    }
    setStep((s) => Math.min(s + 1, TOTAL - 1))
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary">
      <div className="h-16 flex items-center px-7 gap-4.5 border-b border-border bg-surface flex-shrink-0">
        <div className="w-[26px] h-[26px] rounded-lg bg-gradient-to-br from-navy-700 to-navy text-white flex items-center justify-center text-xs font-extrabold">M</div>
        <div className="flex-1 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
          <motion.div className="h-full bg-navy rounded-full" animate={{ width: `${((step + 1) / TOTAL) * 100}%` }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <span className="text-xs text-ink-tertiary flex-shrink-0">{step === TOTAL - 1 ? 'Complete' : `Step ${step + 1} of ${TOTAL}`}</span>
        <span className="text-sm text-navy font-semibold cursor-pointer hover:underline" onClick={() => navigate('/app/jobs')}>
          Skip for now
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-[560px] relative">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              {step === 0 && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-[20px] bg-navy-tint text-navy flex items-center justify-center mx-auto mb-5">
                    <Sparkles size={28} />
                  </div>
                  <h1 className="text-[30px] font-bold tracking-tight text-balance">Let's build your career success profile</h1>
                  <p className="text-sm text-ink-secondary mt-3 max-w-[420px] mx-auto">A few quick questions so our recruitment team and career experts can match you with the right opportunities.</p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold">Are you currently working?</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">This helps us tailor your assessments and job matches.</p>
                  <SingleChoiceGrid options={['Fresher / Student', 'Experienced Professional']} value={employmentStatus} onChange={setEmploymentStatus} />
                </div>
              )}

              {step === 2 &&
                (isExperienced ? (
                  <div>
                    <h2 className="text-xl font-bold">Your current work details</h2>
                    <p className="text-sm text-ink-secondary mt-2 mb-4">Tell us about your latest role.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Current / latest company">
                        <Input placeholder="e.g. TCS" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} />
                      </Field>
                      <Field label="Designation">
                        <Input placeholder="e.g. Business Analyst" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Total experience">
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={expYears} onChange={(e) => setExpYears(Number(e.target.value))}>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y} {y === 1 ? 'year' : 'years'}
                            </option>
                          ))}
                        </Select>
                        <Select value={expMonths} onChange={(e) => setExpMonths(Number(e.target.value))}>
                          {MONTHS.map((m) => (
                            <option key={m} value={m}>
                              {m} {m === 1 ? 'month' : 'months'}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Current annual CTC (₹)">
                        <Input placeholder="e.g. 6,00,000" value={currentCtc} onChange={(e) => setCurrentCtc(e.target.value)} />
                      </Field>
                      <Field label="Notice period">
                        <Select value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)}>
                          <option>Immediate</option>
                          <option>15 days</option>
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                        </Select>
                      </Field>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-navy-tint text-navy flex items-center justify-center mx-auto mb-4">
                      <GraduationCap size={24} />
                    </div>
                    <h2 className="text-xl font-bold">No work experience yet? No problem.</h2>
                    <p className="text-sm text-ink-secondary mt-2 max-w-[420px] mx-auto">We'll focus on your education, skills and potential instead. Add internships below if you've done any.</p>
                    <Field label="Internship / training experience" optional className="mt-5 text-left">
                      <Textarea placeholder="e.g. 2-month Data Analytics internship at XYZ Pvt Ltd (optional)" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} />
                    </Field>
                  </div>
                ))}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold">What are you interested in?</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Select all that apply — this shapes your recommendations.</p>
                  <ChipRow options={INTERESTS} selected={interests} onToggle={(o) => toggle(interests, setInterests, o)} />
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold">What's your preferred role?</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Tell us the role you're targeting.</p>
                  <Input value={preferredRole} onChange={(e) => setPreferredRole(e.target.value)} placeholder="e.g. Business Analyst" />
                  <p className="text-xs text-ink-tertiary mt-3 mb-2">Suggested for you:</p>
                  <ChipRow options={ROLE_SUGGESTIONS} selected={[]} onToggle={(o) => setPreferredRole(o)} />
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-xl font-bold">Expected annual salary</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-5">Give us a realistic range — we'll match accordingly.</p>
                  <input type="range" min={3} max={25} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full accent-navy h-1.5" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-ink-secondary">₹3L</span>
                    <span className="text-xl font-bold text-navy">
                      ₹{salary}L – ₹{salary + 2}L
                    </span>
                    <span className="text-sm text-ink-secondary">₹25L+</span>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <h2 className="text-xl font-bold">Preferred locations</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Choose up to 3 cities — or Remote.</p>
                  <ChipRow options={LOCATIONS} selected={locations} onToggle={(o) => toggle(locations, setLocations, o)} />
                </div>
              )}

              {step === 7 && (
                <div>
                  <h2 className="text-xl font-bold">Your key skills</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Add skills — we'll suggest relevant assessments.</p>
                  <Input
                    placeholder="Type a skill and press enter"
                    className="mb-3"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        toggle(skills, setSkills, e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <ChipRow options={skills} selected={skills} onToggle={(o) => toggle(skills, setSkills, o)} />
                  <p className="text-xs text-ink-tertiary mt-3 mb-2">Suggested:</p>
                  <ChipRow options={SKILLS} selected={skills} onToggle={(o) => toggle(skills, setSkills, o)} />
                </div>
              )}

              {step === 8 && (
                <div>
                  <h2 className="text-xl font-bold">Education details</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Your highest qualification.</p>
                  <Field label="Highest education level">
                    <Select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}>
                      <option>10th</option>
                      <option>12th</option>
                      <option>Diploma</option>
                      <option>Graduate</option>
                      <option>Postgraduate</option>
                      <option>Doctorate</option>
                    </Select>
                  </Field>
                  <Field label="Degree / Course">
                    <Input value={degree} onChange={(e) => setDegree(e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Institution">
                      <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
                    </Field>
                    <Field label="Year of passing">
                      <Input value={gradYear} onChange={(e) => setGradYear(e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {step === 9 && (
                <div>
                  <h2 className="text-xl font-bold">Personal details</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Kept private from recruiters unless you choose to share.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date of birth">
                      <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </Field>
                    <Field label="Gender">
                      <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </Select>
                    </Field>
                  </div>
                  <Field label="Marital status" optional>
                    <Select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Prefer not to say</option>
                    </Select>
                  </Field>
                </div>
              )}

              {step === 10 && (
                <div>
                  <h2 className="text-xl font-bold">Where are you based?</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Helps us match you with the right on-site and hybrid roles.</p>
                  <Field label="Current city">
                    <Input placeholder="e.g. Bengaluru" value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} />
                  </Field>
                  <label className="text-[13px] font-semibold">Willing to relocate?</label>
                  <div className="mt-2">
                    <SingleChoiceGrid options={['Yes, open to relocating', 'No, only my current city']} value={willingToRelocate} onChange={setWillingToRelocate} />
                  </div>
                </div>
              )}

              {step === 11 && (
                <div>
                  <h2 className="text-xl font-bold">Your resume</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">A short headline helps recruiters instantly understand your profile.</p>
                  <Field label="Resume headline">
                    <Input
                      placeholder="e.g. Aspiring Product Analyst | SQL, Excel, Data Analysis"
                      value={resumeHeadline}
                      onChange={(e) => setResumeHeadline(e.target.value)}
                    />
                  </Field>
                  <div className="flex items-start gap-2.5 p-[14px] rounded-xl bg-navy-tint">
                    <Lock size={15} className="text-navy mt-0.5 flex-shrink-0" />
                    <p className="text-[12.5px] text-ink-secondary">
                      Resume upload unlocks after you activate placement support (₹299, one-time) from the Subscription page — that's also when
                      it enters the Mzobs verification queue.
                    </p>
                  </div>
                </div>
              )}

              {step === 12 && (
                <div>
                  <h2 className="text-xl font-bold">Portfolio link</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Optional — add a personal website or work samples.</p>
                  <Field label="Portfolio URL" optional>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                      <Input placeholder="https://yourportfolio.com" className="pl-[38px]" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} />
                    </div>
                  </Field>
                </div>
              )}

              {step === 13 && (
                <div>
                  <h2 className="text-xl font-bold">Connect your profiles</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Helps recruiters verify your work and code.</p>
                  <Field label="LinkedIn">
                    <div className="relative">
                      <FaLinkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                      <Input placeholder="linkedin.com/in/username" className="pl-[38px]" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                    </div>
                  </Field>
                  <Field label="GitHub" optional>
                    <div className="relative">
                      <FaGithub size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                      <Input placeholder="github.com/username" className="pl-[38px]" value={github} onChange={(e) => setGithub(e.target.value)} />
                    </div>
                  </Field>
                </div>
              )}

              {step === 14 && (
                <div>
                  <h2 className="text-xl font-bold">Certificates</h2>
                  <p className="text-sm text-ink-secondary mt-2 mb-4">Add any certifications that strengthen your profile.</p>
                  <div className="border-[1.5px] border-dashed border-border-strong rounded-2xl p-6 text-center cursor-pointer bg-surface-sunken hover:border-navy hover:bg-navy-tint transition-all">
                    <BadgeCheck size={26} className="mx-auto text-ink-secondary" />
                    <p className="text-sm mt-2">Upload certificate files (optional)</p>
                  </div>
                </div>
              )}

              {step === 15 && <CompleteStep name={profile?.name} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {submitError && <p className="text-sm text-red text-center px-7 pt-3 flex-shrink-0">{submitError}</p>}

      <div className="px-7 py-5 border-t border-border bg-surface flex justify-between items-center flex-shrink-0">
        <Button variant="ghost" onClick={back} className={step === 0 || submitting ? 'invisible' : ''}>
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={next} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : step === TOTAL - 1 ? (
            'Browse job openings'
          ) : step === TOTAL - 2 ? (
            'Finish profile'
          ) : step === 0 ? (
            'Get started'
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  )
}

function CompleteStep({ name }) {
  const navigate = useNavigate()
  const [pieces, setPieces] = useState([])
  useEffect(() => {
    const colors = ['var(--color-navy)', 'var(--color-gold-dot)', 'var(--color-green-dot)']
    const arr = Array.from({ length: 20 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = 64 + Math.random() * 100
      return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, color: colors[i % 3], delay: Math.random() * 120 }
    })
    setPieces(arr)
  }, [])

  return (
    <div className="text-center relative">
      {pieces.map((p, i) => (
        <span key={i} className="confetti-piece" style={{ '--dx': p.dx + 'px', '--dy': p.dy + 'px', background: p.color, animationDelay: p.delay + 'ms' }} />
      ))}
      <div className="w-16 h-16 rounded-[20px] bg-green-tint text-green flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={30} />
      </div>
      <h1 className="text-[30px] font-bold tracking-tight text-balance">You're all set{name ? `, ${name.split(' ')[0]}` : ''}</h1>
      <p className="text-sm text-ink-secondary mt-3 max-w-[420px] mx-auto">
        Your profile is saved. Activate placement support with a one-time ₹{PROGRAM_FEE} payment to upload your resume, apply to jobs and unlock your
        verification interview.
      </p>

      <Button variant="gold" size="lg" className="mt-5" onClick={() => navigate('/app/subscription')}>
        Pay ₹{PROGRAM_FEE} & activate <ArrowRight size={16} />
      </Button>

      <div className="bg-surface border border-border rounded-2xl mt-6 max-w-[420px] mx-auto text-left p-[22px]">
        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">What happens next</div>
        <div className="relative pl-6">
          <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
          {[
            ['Pay the one-time ₹299 fee', 'From the Subscription page in your dashboard', 'gold'],
            ['Upload your resume', 'From the Resume Center, right after payment', 'gray'],
            ['Resume verification by our team', 'Within 24–48 hours of upload', 'gray'],
            ['Mock interview with a Mzobs panel', 'Scheduled after verification', 'gray'],
            ['Skill track assigned', 'Based on your panel score', 'gray'],
            ['Apply to live employer requirements', 'We shortlist and share your resume', 'gray'],
          ].map(([title, sub, tone], i, arr) => (
            <div key={title} className={`relative ${i < arr.length - 1 ? 'pb-5' : ''}`}>
              <div className={`absolute -left-6 top-0.5 w-[11px] h-[11px] rounded-full bg-surface border-2 ${tone === 'gold' ? 'border-gold-dot' : 'border-border-strong'}`} />
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-ink-tertiary">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
