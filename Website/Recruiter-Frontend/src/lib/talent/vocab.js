// The vocabulary the query parser and filter suggestions match against.
// Demo mode uses the demo pool's lists; live mode replaces them with what
// actually appears in the loaded candidates (see services/talentService.js),
// so "React developers in Pune" only recognises skills, roles and cities that
// exist in the data being searched.

import { IS_DEMO } from '../config'
import { KNOWN_SKILLS, KNOWN_ROLES, KNOWN_CITIES, KNOWN_INDUSTRIES, KNOWN_COMPANY_TYPES, KNOWN_DEPARTMENTS, KNOWN_DEGREES, KNOWN_INSTITUTES, KNOWN_LANGUAGES } from './demoPool'

export const vocab = {
  skills: KNOWN_SKILLS,
  roles: KNOWN_ROLES,
  cities: KNOWN_CITIES,
  industries: KNOWN_INDUSTRIES,
  companyTypes: KNOWN_COMPANY_TYPES,
  departments: KNOWN_DEPARTMENTS,
  degrees: KNOWN_DEGREES,
  institutes: KNOWN_INSTITUTES,
  languages: KNOWN_LANGUAGES,
  companies: [],
}

const uniq = (list) => [...new Map(list.filter(Boolean).map((v) => [v.trim().toLowerCase(), v.trim()])).values()]

/** Rebuilds the vocabulary from a candidate pool. Empty categories keep nothing (no demo leakage). */
export function setVocabularyFrom(pool) {
  vocab.skills = uniq(pool.flatMap((c) => c.skills))
  vocab.roles = uniq(pool.flatMap((c) => [c.designation, ...c.workHistory.map((w) => w.role)]))
  vocab.cities = uniq(pool.flatMap((c) => [c.location, ...c.preferredLocations]))
  vocab.industries = uniq(pool.map((c) => c.industry))
  vocab.companyTypes = uniq(pool.map((c) => c.companyType))
  vocab.departments = uniq(pool.map((c) => c.department))
  vocab.degrees = uniq(pool.flatMap((c) => c.education.map((e) => e.degree)))
  vocab.institutes = uniq(pool.flatMap((c) => c.education.map((e) => e.institute)))
  vocab.languages = uniq(pool.flatMap((c) => c.languages ?? []))
  vocab.companies = uniq(pool.flatMap((c) => [c.currentCompany, ...c.workHistory.map((w) => w.company)]))
}

const CITY_ALIASES = {
  bangalore: 'Bengaluru',
  bengaluru: 'Bengaluru',
  bombay: 'Mumbai',
  gurgaon: 'Delhi NCR',
  gurugram: 'Delhi NCR',
  noida: 'Delhi NCR',
  delhi: 'Delhi NCR',
  ncr: 'Delhi NCR',
  'new delhi': 'Delhi NCR',
  madras: 'Chennai',
  calcutta: 'Kolkata',
  poona: 'Pune',
}
export { CITY_ALIASES }

/** Normalises a city for comparison: "Bangalore " and "bengaluru" are the same place. */
export function canonCity(s) {
  const k = (s ?? '').toString().trim().toLowerCase().replace(/[.,]$/, '')
  return (CITY_ALIASES[k] ?? k).toLowerCase()
}

/** Example queries for the composer, built from the data actually loaded. */
export function exampleQueries() {
  if (IS_DEMO) {
    return [
      'Python developers in Bangalore with 3–5 years experience, AWS, available within 30 days',
      'React developer 2-5 years Hyderabad remote under 20 LPA',
      'DevOps engineer with Kubernetes and Terraform, immediate joiner, Pune',
    ]
  }
  const [s1, s2] = vocab.skills
  const city = vocab.cities[0]
  const role = vocab.roles[0]
  const out = []
  if (role && city) out.push(`${role} in ${city} with 2–6 years experience${s1 ? `, ${s1}` : ''}`)
  if (s1 && s2) out.push(`${s1} and ${s2}, available within 30 days`)
  if (s1) out.push(`${s1} developers, verified profiles only`)
  return out
}
