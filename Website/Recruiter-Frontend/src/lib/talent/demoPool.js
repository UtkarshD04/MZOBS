// DEMO DATA — a deterministic, generated sample pool so the recruiter UI can
// be exercised end to end. Every record here is fictional. It is only used
// when VITE_TALENT_SOURCE=demo, and the UI labels it as demo wherever it
// appears. Real data arrives through services/talentService.js (live mode).
//
// Candidate shape (the contract every adapter must produce):
//  { id, name, initials, designation, currentCompany, experienceYears,
//    currentSalaryLPA, expectedSalaryLPA, location, preferredLocations[],
//    noticePeriodDays, skills[], industry, companyType, workMode,
//    employmentType, education[{degree,institute,year}],
//    workHistory[{role,company,startYear,endYear,skills[],location}],
//    projects[{name,description}], certifications[], languages[],
//    summary, lastActiveDaysAgo, resumeUpdatedDaysAgo, profileCompleteness,
//    verification{ identity, phone, email, education, employment,
//                  resumeConsistency }  // each 'verified'|'pending'|'none'
//  }

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST = ['Rahul', 'Aman', 'Priya', 'Arjun', 'Sneha', 'Kavya', 'Rohan', 'Ananya', 'Vikram', 'Neha', 'Karthik', 'Divya', 'Siddharth', 'Meera', 'Aditya', 'Ishita', 'Manish', 'Pooja', 'Nikhil', 'Shreya', 'Varun', 'Tanvi', 'Harsh', 'Nandini', 'Sahil', 'Riya', 'Abhishek', 'Lakshmi', 'Deepak', 'Aarti']
const LAST = ['Sharma', 'Verma', 'Singh', 'Mehta', 'Kulkarni', 'Iyer', 'Reddy', 'Nair', 'Gupta', 'Patel', 'Rao', 'Joshi', 'Bose', 'Menon', 'Chopra', 'Desai', 'Kapoor', 'Pillai', 'Shetty', 'Agarwal']
const CITIES = ['Bengaluru', 'Hyderabad', 'Pune', 'Delhi NCR', 'Mumbai', 'Chennai', 'Kolkata', 'Ahmedabad']
const COMPANIES = {
  Product: ['Lumora', 'Northwind Labs', 'Kavia Systems', 'Orbital Cloud', 'Stackly'],
  Startup: ['Finzo', 'Nudge AI', 'Craftly', 'Zenith Pay', 'Bloom Health'],
  MNC: ['Atlas Global', 'Meridian Tech', 'Corvid Systems', 'Helix Corp'],
  Services: ['Infinia Services', 'BrightPath Consulting', 'Vantage IT'],
}
const INDUSTRIES = ['Fintech', 'Healthcare', 'E-commerce', 'SaaS', 'EdTech', 'Logistics']
const INSTITUTES = ['RV College of Engineering', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'IIIT Hyderabad', 'PES University', 'COEP Pune', 'Delhi Technological University']
const DEGREES = ['B.Tech, Computer Science', 'B.E, Information Science', 'M.Tech, Software Engineering', 'BCA', 'MCA', 'B.Sc, Computer Science']

const FAMILIES = [
  { dept: 'Engineering', role: 'Python Developer', ladder: ['Junior Developer', 'Python Developer', 'Senior Python Developer', 'Lead Engineer'], core: ['Python', 'Django', 'FastAPI', 'PostgreSQL'], extra: ['AWS', 'Docker', 'Redis', 'Celery', 'Kubernetes', 'MongoDB', 'CI/CD'] },
  { dept: 'Engineering', role: 'Backend Engineer', ladder: ['Software Engineer', 'Backend Engineer', 'Senior Backend Engineer', 'Staff Engineer'], core: ['Node.js', 'PostgreSQL', 'REST APIs'], extra: ['AWS', 'Docker', 'Kafka', 'Redis', 'Kubernetes', 'GraphQL', 'TypeScript'] },
  { dept: 'Engineering', role: 'React Developer', ladder: ['Frontend Developer', 'React Developer', 'Senior React Developer', 'Frontend Lead'], core: ['React', 'JavaScript', 'HTML/CSS'], extra: ['TypeScript', 'Redux', 'Next.js', 'Tailwind CSS', 'Jest', 'GraphQL', 'Webpack'] },
  { dept: 'IT & Infrastructure', role: 'DevOps Engineer', ladder: ['Systems Engineer', 'DevOps Engineer', 'Senior DevOps Engineer', 'Platform Lead'], core: ['AWS', 'Docker', 'CI/CD'], extra: ['Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Prometheus', 'Ansible', 'Python'] },
  { dept: 'Data & Analytics', role: 'Data Analyst', ladder: ['Junior Analyst', 'Data Analyst', 'Senior Data Analyst', 'Analytics Lead'], core: ['SQL', 'Excel', 'Python'], extra: ['Power BI', 'Tableau', 'Pandas', 'Statistics', 'BigQuery', 'Looker'] },
  { dept: 'Engineering', role: 'Full Stack Developer', ladder: ['Associate Engineer', 'Full Stack Developer', 'Senior Full Stack Developer', 'Tech Lead'], core: ['React', 'Node.js', 'MongoDB'], extra: ['TypeScript', 'AWS', 'Docker', 'PostgreSQL', 'Next.js', 'Redis'] },
  { dept: 'Design', role: 'Product Designer', ladder: ['Visual Designer', 'Product Designer', 'Senior Product Designer', 'Design Lead'], core: ['Figma', 'UX Research', 'Prototyping'], extra: ['Design Systems', 'User Testing', 'Illustration', 'Framer', 'Accessibility'] },
]

const LANGS = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi']
const CERTS = ['AWS Certified Solutions Architect', 'Certified Kubernetes Administrator', 'Google Data Analytics', 'Scrum Master (PSM I)', 'Azure Fundamentals', 'Meta Front-End Developer']

function pick(r, arr) {
  return arr[Math.floor(r() * arr.length)]
}
function sample(r, arr, n) {
  const pool = [...arr]
  const out = []
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0])
  return out
}
function state(r, pVerified, pPending) {
  const x = r()
  return x < pVerified ? 'verified' : x < pVerified + pPending ? 'pending' : 'none'
}

function make(i) {
  const r = rng(1000 + i * 7919)
  const fam = FAMILIES[i % FAMILIES.length]
  const first = FIRST[(i * 7) % FIRST.length]
  const last = LAST[(i * 3 + Math.floor(r() * 5)) % LAST.length]
  const name = `${first} ${last}`
  const exp = Math.round((0.5 + r() * 11) * 2) / 2
  const level = exp < 2 ? 0 : exp < 5 ? 1 : exp < 9 ? 2 : 3
  const companyType = pick(r, Object.keys(COMPANIES))
  const currentCompany = pick(r, COMPANIES[companyType])
  const location = r() < 0.34 ? 'Bengaluru' : pick(r, CITIES)
  const skills = [...fam.core, ...sample(r, fam.extra, 2 + Math.floor(r() * 3))]
  const currentSalary = Math.round((3.5 + exp * 1.7 + r() * 4) * 2) / 2
  const expectedSalary = Math.round(currentSalary * (1.15 + r() * 0.3) * 2) / 2
  const now = new Date().getFullYear()

  // Work history walks the ladder backwards from the current role.
  const history = []
  let end = null
  let start = Math.max(now - Math.max(1, Math.round(exp * 0.4)), now - Math.floor(exp))
  for (let step = level; step >= 0 && history.length < 3; step--) {
    history.push({
      role: fam.ladder[step],
      company: step === level ? currentCompany : pick(r, COMPANIES[pick(r, Object.keys(COMPANIES))]),
      startYear: start,
      endYear: end,
      skills: sample(r, skills, Math.min(4, skills.length)),
      location: step === level ? location : pick(r, CITIES),
    })
    end = start
    start = Math.max(now - Math.floor(exp) - 1, start - 1 - Math.floor(r() * 2))
  }

  const prefs = [location, ...sample(r, CITIES.filter((c) => c !== location), Math.floor(r() * 3))]
  const notice = pick(r, [0, 15, 15, 15, 30, 30, 30, 30, 45, 60, 60, 90])
  const verification = {
    identity: state(r, 0.7, 0.15),
    phone: state(r, 0.85, 0.1),
    email: state(r, 0.9, 0.06),
    education: state(r, 0.5, 0.2),
    employment: state(r, 0.45, 0.25),
    resumeConsistency: state(r, 0.55, 0.2),
  }
  const industry = pick(r, INDUSTRIES)

  return {
    id: `demo-${i + 1}`,
    name,
    initials: `${first[0]}${last[0]}`,
    designation: fam.ladder[level],
    currentCompany,
    experienceYears: exp,
    currentSalaryLPA: currentSalary,
    expectedSalaryLPA: expectedSalary,
    location,
    preferredLocations: prefs,
    noticePeriodDays: notice,
    skills,
    industry,
    companyType,
    workMode: pick(r, ['Remote', 'Hybrid', 'On-site']),
    employmentType: exp < 1.5 && r() < 0.5 ? pick(r, ['Internship', 'Contract']) : r() < 0.06 ? 'Contract' : 'Full-time',
    department: fam.dept,
    // Fictional, self-declared demo values — only used by the optional Diversity hiring filter.
    gender: pick(r, ['Female', 'Male', 'Male', 'Female', 'Non-binary']),
    relocationOk: r() < 0.45,
    education: [{ degree: pick(r, DEGREES), institute: pick(r, INSTITUTES), year: now - Math.ceil(exp) - 1 }],
    workHistory: history,
    projects: [
      { name: `${industry} ${skills[0]} platform`, description: `Owned the ${skills[0]} services behind a ${industry.toLowerCase()} product used by paying customers; improved p95 latency and on-call load.` },
      { name: `${skills[1] ?? skills[0]} migration`, description: 'Led a staged migration with zero customer downtime, documenting runbooks for the wider team.' },
    ],
    certifications: r() > 0.55 ? [pick(r, CERTS)] : [],
    languages: ['English', ...sample(r, LANGS.slice(1), 1 + Math.floor(r() * 2))],
    summary: `${fam.ladder[level]} with ${exp} years building ${skills.slice(0, 3).join(', ')} systems in ${industry.toLowerCase()}. Comfortable owning features end to end, from design review to production support.`,
    lastActiveDaysAgo: Math.floor(r() * r() * 60),
    resumeUpdatedDaysAgo: Math.floor(r() * 120),
    profileCompleteness: Math.round(55 + r() * 45),
    verification,
    source: 'Mzobs demo pool',
  }
}

export const DEMO_POOL = Array.from({ length: 480 }, (_, i) => make(i))
export const KNOWN_SKILLS = [...new Set(FAMILIES.flatMap((f) => [...f.core, ...f.extra]))]
export const KNOWN_ROLES = [...new Set(FAMILIES.flatMap((f) => [f.role, ...f.ladder]))]
export const KNOWN_CITIES = CITIES
export const KNOWN_INDUSTRIES = INDUSTRIES
export const KNOWN_COMPANY_TYPES = Object.keys(COMPANIES)
export const KNOWN_DEPARTMENTS = [...new Set(FAMILIES.map((f) => f.dept))]
export const KNOWN_DEGREES = DEGREES
export const KNOWN_INSTITUTES = INSTITUTES
export const KNOWN_LANGUAGES = LANGS
export const EMPLOYMENT_TYPE_LIST = ['Full-time', 'Part-time', 'Contract', 'Internship']
