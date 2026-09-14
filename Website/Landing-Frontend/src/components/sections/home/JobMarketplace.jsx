import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, MapPin, Check, ChevronDown, SlidersHorizontal, X, ArrowRight, ArrowUpRight, Users, Flame, Sparkles } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CompanyMark } from './jobCardPrimitives'

// ============================================================
// DEMO DATA — every job, company and count on this page is a placeholder
// standing in for a real listings feed. Field names mirror the shape the
// real job objects already use elsewhere on this page (see
// FeaturedJobCard.jsx / CompactJobRow.jsx / lib/publicJobs.js) — title,
// company, location, experience, salary display string, workMode — plus a
// few marketplace-only fields (salaryMin/Max for the range filter,
// experienceLevel for the radio filter, category for the nav, status for
// the live indicator) so swapping in a real fetch later only means mapping
// the API response onto this same shape, not rewriting the JSX below.
// Company names are intentionally fictional — this is a design mockup, not
// a claim that these employers hire through MZOBS.
// ============================================================
const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'tech', label: 'Technology' },
  { key: 'sales', label: 'Sales' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'design', label: 'Design' },
  { key: 'finance', label: 'Finance' },
  { key: 'hr', label: 'HR' },
  { key: 'ops', label: 'Operations' },
]

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']
const WORK_MODES = ['On-site', 'Hybrid', 'Remote']
const EXPERIENCE_LEVELS = [
  { key: 'entry', label: 'Entry level' },
  { key: 'mid', label: 'Mid level' },
  { key: 'senior', label: 'Senior level' },
]
const SORT_OPTIONS = [
  { key: 'latest', label: 'Latest' },
  { key: 'urgent', label: 'Urgently hiring' },
  { key: 'salary', label: 'Highest salary' },
]

// Soft, desaturated tones a card can land on — cycled by grid position (not
// random, not per-company hash) so the alternation reads as a deliberate
// system. Kept fixed/light regardless of OS theme, matching the rest of
// this redesigned home page's --explorer-* palette.
const CARD_TONES = [
  { bg: '#EAF2FE', border: '#D3E4FC' }, // soft blue
  { bg: '#E8F7F1', border: '#CBEADD' }, // soft mint
  { bg: '#FDF0E6', border: '#F6DDC3' }, // warm peach
  { bg: '#F1EEFC', border: '#DDD2F7' }, // muted lavender
  { bg: '#FBF7EF', border: '#EEE2C9' }, // soft cream
]

// The bottom transition's small location-pill row references five cities
// that already appear as real job locations in DEMO_JOBS above (Bengaluru,
// Mumbai, Delhi NCR, Hyderabad, Pune) — not invented placeholder names —
// so it reads as "these are the opportunities you just saw", bridging
// toward wherever a future city/location section picks up next.
const TRANSITION_NODES = [{ label: 'Bengaluru' }, { label: 'Mumbai' }, { label: 'Delhi NCR' }, { label: 'Hyderabad' }, { label: 'Pune' }]

const STATUS_STYLES = {
  posted: { label: 'Just posted', dot: 'bg-(--explorer-muted)', text: 'text-(--explorer-muted)' },
  newToday: { label: 'New today', dot: 'bg-(--explorer-blue)', text: 'text-(--explorer-blue)' },
  urgent: { label: 'Urgent hiring', dot: 'bg-(--explorer-gold)', text: 'text-(--explorer-gold-hover)' },
  applicants: { label: null, dot: 'bg-(--explorer-teal)', text: 'text-(--explorer-teal)' },
}

const DEMO_JOBS = [
  {
    id: 'demo-1',
    company: 'Solace Technologies',
    title: 'Senior Product Designer',
    location: 'Bengaluru, India',
    salaryMin: 12,
    salaryMax: 18,
    salaryLabel: '₹12 – 18 LPA',
    experience: '4–6 years',
    experienceLevel: 'senior',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    category: 'design',
    status: { kind: 'posted' },
    featured: true,
    description: 'Build meaningful digital experiences for enterprise teams across India.',
  },
  {
    id: 'demo-2',
    company: 'Nimbus Cloud Systems',
    title: 'Backend Engineer, Payments',
    location: 'Hyderabad, India',
    salaryMin: 14,
    salaryMax: 22,
    salaryLabel: '₹14 – 22 LPA',
    experience: '3–5 years',
    experienceLevel: 'mid',
    workMode: 'Remote',
    jobType: 'Full-time',
    category: 'tech',
    status: { kind: 'urgent' },
  },
  {
    id: 'demo-3',
    company: 'Crestline Retail',
    title: 'Regional Sales Manager',
    location: 'Mumbai, India',
    salaryMin: 9,
    salaryMax: 14,
    salaryLabel: '₹9 – 14 LPA',
    experience: '5–8 years',
    experienceLevel: 'senior',
    workMode: 'On-site',
    jobType: 'Full-time',
    category: 'sales',
    status: { kind: 'applicants', meta: '18 applicants' },
  },
  {
    id: 'demo-4',
    company: 'Everbright Media',
    title: 'Performance Marketing Lead',
    location: 'Delhi NCR, India',
    salaryMin: 10,
    salaryMax: 16,
    salaryLabel: '₹10 – 16 LPA',
    experience: '3–5 years',
    experienceLevel: 'mid',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    category: 'marketing',
    status: { kind: 'newToday' },
  },
  {
    id: 'demo-5',
    company: 'Northstar Fintech',
    title: 'Financial Analyst',
    location: 'Pune, India',
    salaryMin: 7,
    salaryMax: 11,
    salaryLabel: '₹7 – 11 LPA',
    experience: '1–3 years',
    experienceLevel: 'entry',
    workMode: 'On-site',
    jobType: 'Full-time',
    category: 'finance',
    status: { kind: 'posted' },
  },
  {
    id: 'demo-6',
    company: 'Pinnacle Logistics',
    title: 'Operations Manager',
    location: 'Chennai, India',
    salaryMin: 8,
    salaryMax: 13,
    salaryLabel: '₹8 – 13 LPA',
    experience: '4–7 years',
    experienceLevel: 'senior',
    workMode: 'On-site',
    jobType: 'Full-time',
    category: 'ops',
    status: { kind: 'applicants', meta: '9 applicants' },
  },
  {
    id: 'demo-7',
    company: 'Coral Bay Hospitality',
    title: 'Talent Acquisition Specialist',
    location: 'Gurugram, India',
    salaryMin: 6,
    salaryMax: 10,
    salaryLabel: '₹6 – 10 LPA',
    experience: '2–4 years',
    experienceLevel: 'mid',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    category: 'hr',
    status: { kind: 'urgent' },
  },
  {
    id: 'demo-8',
    company: 'Lumen Robotics',
    title: 'Frontend Engineer, React',
    location: 'Bengaluru, India',
    salaryMin: 10,
    salaryMax: 16,
    salaryLabel: '₹10 – 16 LPA',
    experience: '2–4 years',
    experienceLevel: 'mid',
    workMode: 'Remote',
    jobType: 'Full-time',
    category: 'tech',
    status: { kind: 'newToday' },
  },
  {
    id: 'demo-9',
    company: 'Ashford Consulting',
    title: 'Business Development Executive',
    location: 'Ahmedabad, India',
    salaryMin: 4,
    salaryMax: 7,
    salaryLabel: '₹4 – 7 LPA',
    experience: '0–2 years',
    experienceLevel: 'entry',
    workMode: 'On-site',
    jobType: 'Full-time',
    category: 'sales',
    status: { kind: 'posted' },
  },
  {
    id: 'demo-10',
    company: 'Meridian EdTech',
    title: 'Brand & Content Designer',
    location: 'Remote, India',
    salaryMin: 6,
    salaryMax: 9,
    salaryLabel: '₹6 – 9 LPA',
    experience: '1–3 years',
    experienceLevel: 'entry',
    workMode: 'Remote',
    jobType: 'Contract',
    category: 'design',
    status: { kind: 'applicants', meta: '5 applicants' },
  },
  {
    id: 'demo-11',
    company: 'Zenith Finserv',
    title: 'Growth & Ops Intern',
    location: 'Jaipur, India',
    salaryMin: 2,
    salaryMax: 4,
    salaryLabel: '₹2 – 4 LPA',
    experience: '0–1 years',
    experienceLevel: 'entry',
    workMode: 'On-site',
    jobType: 'Internship',
    category: 'ops',
    status: { kind: 'posted' },
  },
  {
    id: 'demo-12',
    company: 'BluePeak Analytics',
    title: 'HR Business Partner',
    location: 'Kolkata, India',
    salaryMin: 9,
    salaryMax: 13,
    salaryLabel: '₹9 – 13 LPA',
    experience: '3–6 years',
    experienceLevel: 'mid',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    category: 'hr',
    status: { kind: 'urgent' },
  },
]

function CustomCheckbox({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`flex items-center justify-center w-4.5 h-4.5 rounded-[6px] border-2 shrink-0 motion-safe:transition-colors motion-safe:duration-150 ${
          checked ? 'bg-(--explorer-blue) border-(--explorer-blue)' : 'bg-white border-(--explorer-border) group-hover:border-(--explorer-blue-border)'
        }`}
      >
        <Check size={11} strokeWidth={3.5} className={checked ? 'text-white' : 'text-transparent'} aria-hidden="true" />
      </span>
      <span className="text-[13.5px] font-medium text-(--explorer-navy)">{children}</span>
    </label>
  )
}

function CustomRadio({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`flex items-center justify-center w-4.5 h-4.5 rounded-full border-2 shrink-0 motion-safe:transition-colors motion-safe:duration-150 ${
          checked ? 'border-(--explorer-blue)' : 'border-(--explorer-border) group-hover:border-(--explorer-blue-border)'
        }`}
      >
        <span className={`w-2 h-2 rounded-full motion-safe:transition-transform motion-safe:duration-150 ${checked ? 'bg-(--explorer-blue) scale-100' : 'bg-transparent scale-0'}`} />
      </span>
      <span className="text-[13.5px] font-medium text-(--explorer-navy)">{children}</span>
    </label>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-wide text-(--explorer-muted) mb-3">{label}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

// Shared between the desktop sidebar and the mobile drawer — one filter
// state, two presentations.
function FilterSidebarContent({ state, setState, activeCount, onClear }) {
  function toggleInSet(key, value) {
    setState((prev) => {
      const set = new Set(prev[key])
      if (set.has(value)) set.delete(value)
      else set.add(value)
      return { ...prev, [key]: set }
    })
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-black uppercase tracking-wide text-(--explorer-navy)">Filters</p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) rounded-xs"
          >
            <X size={12} aria-hidden="true" /> Clear all
          </button>
        )}
      </div>

      <FilterGroup label="Job type">
        {JOB_TYPES.map((t) => (
          <CustomCheckbox key={t} checked={state.jobTypes.has(t)} onChange={() => toggleInSet('jobTypes', t)}>
            {t}
          </CustomCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup label="Work mode">
        {WORK_MODES.map((m) => (
          <CustomCheckbox key={m} checked={state.workModes.has(m)} onChange={() => toggleInSet('workModes', m)}>
            {m}
          </CustomCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup label="Experience">
        {EXPERIENCE_LEVELS.map((lvl) => (
          <CustomRadio
            key={lvl.key}
            checked={state.experienceLevel === lvl.key}
            onChange={() => setState((prev) => ({ ...prev, experienceLevel: prev.experienceLevel === lvl.key ? '' : lvl.key }))}
          >
            {lvl.label}
          </CustomRadio>
        ))}
      </FilterGroup>

      <FilterGroup label="Location">
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--explorer-muted)" aria-hidden="true" />
          <input
            type="text"
            value={state.location}
            onChange={(e) => setState((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="Search location..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-(--explorer-border) bg-white text-[13px] text-(--explorer-navy) outline-none focus:border-(--explorer-blue) focus:ring-3 focus:ring-(--explorer-blue)/12 transition-colors"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Salary">
        <div>
          <div className="flex items-center justify-between text-[12.5px] font-bold text-(--explorer-navy) mb-1.5">
            <span>Minimum</span>
            <span className="text-(--explorer-blue)">₹{state.minSalary}L+</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={state.minSalary}
            onChange={(e) => setState((prev) => ({ ...prev, minSalary: Number(e.target.value) }))}
            className="w-full accent-(--explorer-blue)"
            aria-label="Minimum salary in lakhs per annum"
          />
        </div>
      </FilterGroup>
    </div>
  )
}

function StatusTag({ status }) {
  const reduceMotion = useReducedMotion()
  if (!status) return null
  const style = STATUS_STYLES[status.kind]
  const label = status.kind === 'applicants' ? status.meta : style.label
  const Icon = status.kind === 'urgent' ? Flame : status.kind === 'applicants' ? Users : null
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide ${style.text}`}>
      <span className="relative flex items-center justify-center w-1.5 h-1.5">
        {/* A slow, barely-there breathing ring — not Tailwind's default 1s
            ping, which reads as busy rather than "alive". ~3s cycle, low
            amplitude, on every status kind (not just urgent/new). */}
        {!reduceMotion && (
          <motion.span
            className={`absolute inset-0 rounded-full ${style.dot}`}
            animate={{ scale: [1, 2.1, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
        <span className={`relative w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      </span>
      {Icon && <Icon size={11} aria-hidden="true" />}
      {label}
    </span>
  )
}

function JobCard({ job, tone, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="job-card-sheen group relative w-full h-full min-w-0 text-left flex flex-col rounded-2xl border p-5 motion-safe:transition-[transform,box-shadow,filter] motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_20px_38px_-20px_rgba(22,50,79,0.32),inset_0_0_0_1px_rgba(22,50,79,0.14)] motion-safe:hover:brightness-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.03]">
          <CompanyMark company={job.company} size="sm" tone="bg-white text-(--explorer-navy)" />
        </span>
        <StatusTag status={job.status} />
      </div>

      <p className="mt-3 text-[12px] font-bold text-(--explorer-navy)/70 truncate">{job.company}</p>
      <h3 className="mt-0.5 text-[16px] font-extrabold text-(--explorer-navy) leading-snug text-balance">{job.title}</h3>

      <p className="mt-2 flex items-center gap-1 text-[12.5px] text-(--explorer-navy)/70">
        <MapPin size={12} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{job.location}</span>
      </p>

      <p className="mt-2 text-[15px] font-black text-(--explorer-navy)">{job.salaryLabel}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-bold text-(--explorer-navy)/80">
        <span className="px-2 py-0.5 rounded-full bg-white/70">{job.jobType}</span>
        <span className="px-2 py-0.5 rounded-full bg-white/70">{job.workMode}</span>
        <span className="px-2 py-0.5 rounded-full bg-white/70">{job.experience}</span>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-end">
        <span className="inline-flex items-center gap-1 text-[12.5px] font-black text-(--explorer-navy) opacity-70 group-hover:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-300">
          View details
          <ArrowRight size={13} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

function FeaturedJobTile({ job, tone, onOpen }) {
  const reduceMotion = useReducedMotion()
  return (
    <button
      type="button"
      onClick={onOpen}
      className="job-card-sheen group relative w-full h-full min-w-0 text-left flex flex-col justify-between rounded-2xl border p-6 sm:p-7 motion-safe:transition-[transform,box-shadow,filter] motion-safe:duration-300 motion-safe:hover:-translate-y-1.5 hover:shadow-[0_26px_52px_-22px_rgba(22,50,79,0.36),inset_0_0_0_1px_rgba(22,50,79,0.16)] motion-safe:hover:brightness-[1.025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      {/* One-time highlight sweep, fired once as the card settles into
          place — not a hover effect, and never repeats. */}
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
          style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent)' }}
          initial={{ x: '-140%' }}
          whileInView={{ x: '480%' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.6, ease: 'easeInOut' }}
        />
      )}
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wide text-(--explorer-navy)/70">
            <Sparkles size={12} className="text-(--explorer-gold-hover)" aria-hidden="true" /> Featured opportunity
          </span>
          <StatusTag status={job.status} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.05]">
            <CompanyMark company={job.company} size="lg" tone="bg-white text-(--explorer-navy)" />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-(--explorer-navy)/70 truncate">{job.company}</p>
            <h3 className="text-[21px] sm:text-[24px] font-black text-(--explorer-navy) leading-snug text-balance">{job.title}</h3>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1 text-[13px] text-(--explorer-navy)/70">
          <MapPin size={13} className="shrink-0" aria-hidden="true" />
          {job.location}
        </p>
        <p className="mt-1.5 text-[22px] font-black text-(--explorer-navy)">{job.salaryLabel}</p>

        {job.description && <p className="mt-3 text-[13.5px] text-(--explorer-navy)/75 leading-relaxed max-w-md">{job.description}</p>}

        <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-bold text-(--explorer-navy)/80">
          <span className="px-2.5 py-1 rounded-full bg-white/70">{job.jobType}</span>
          <span className="px-2.5 py-1 rounded-full bg-white/70">{job.workMode}</span>
          <span className="px-2.5 py-1 rounded-full bg-white/70">{job.experience}</span>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/50 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[13.5px] font-black text-(--explorer-navy)">
          View opportunity
          <ArrowUpRight size={15} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

export default function JobMarketplace() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filterState, setFilterState] = useState({
    jobTypes: new Set(),
    workModes: new Set(),
    experienceLevel: '',
    location: '',
    minSalary: 0,
  })

  const activeFilterCount =
    filterState.jobTypes.size +
    filterState.workModes.size +
    (filterState.experienceLevel ? 1 : 0) +
    (filterState.location.trim() ? 1 : 0) +
    (filterState.minSalary > 0 ? 1 : 0)

  function clearFilters() {
    setFilterState({ jobTypes: new Set(), workModes: new Set(), experienceLevel: '', location: '', minSalary: 0 })
  }

  const results = useMemo(() => {
    let list = DEMO_JOBS.filter((job) => {
      if (category !== 'all' && job.category !== category) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false
      }
      if (filterState.jobTypes.size > 0 && !filterState.jobTypes.has(job.jobType)) return false
      if (filterState.workModes.size > 0 && !filterState.workModes.has(job.workMode)) return false
      if (filterState.experienceLevel && job.experienceLevel !== filterState.experienceLevel) return false
      if (filterState.location.trim() && !job.location.toLowerCase().includes(filterState.location.trim().toLowerCase())) return false
      if (job.salaryMax < filterState.minSalary) return false
      return true
    })

    if (sort === 'urgent') {
      list = [...list].sort((a, b) => (b.status.kind === 'urgent') - (a.status.kind === 'urgent'))
    } else if (sort === 'salary') {
      list = [...list].sort((a, b) => b.salaryMax - a.salaryMax)
    }
    return list
  }, [category, search, sort, filterState])

  const featured = results.find((j) => j.featured)
  const restJobs = results.filter((j) => j.id !== featured?.id)

  function openJob(job) {
    // Demo listings have no real detail record — a genuine job's card
    // (FeaturedJobCard/CompactJobRow above) already routes to /jobs/:id
    // with the real object in router state; this mirrors that exact
    // pattern so wiring in real data later needs no routing changes here.
    navigate(`/jobs/${encodeURIComponent(job.id)}`, { state: { job: toRealJobShape(job) } })
  }

  function toRealJobShape(job) {
    return {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salaryLabel,
      experience: job.experience,
      workMode: job.workMode,
      employmentType: job.jobType,
      description: job.description,
      postedDaysAgo: 0,
    }
  }

  function scrollToNextSection() {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={sectionRef} className="hero-afterglow-faint relative py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Heading — the hero's handoff into an actual marketplace */}
        <Reveal direction="up" duration={0.6} className="max-w-2xl">
          <motion.span
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="block w-px h-8 mb-4 origin-top"
            style={{ backgroundImage: 'linear-gradient(180deg, transparent, var(--explorer-blue-border))' }}
            aria-hidden="true"
          />
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-black uppercase tracking-wide text-(--explorer-teal)">
            <span className="relative flex items-center justify-center w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-(--explorer-teal) motion-safe:animate-ping opacity-60" aria-hidden="true" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-(--explorer-teal)" aria-hidden="true" />
            </span>
            Hiring now
          </span>
          <h2 className="mt-2.5 text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight text-balance">
            <span className="block text-(--explorer-navy)">Find your next</span>
            <span
              className="block"
              style={{ backgroundImage: 'var(--hero-cta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              opportunity.
            </span>
          </h2>
          <p className="mt-3 text-[15px] text-(--explorer-navy)/75 leading-relaxed">Explore fresh roles from companies hiring across India.</p>
        </Reveal>

        {/* Category navigation — editorial, underlined, not pills */}
        <Reveal direction="up" duration={0.5} delay={0.05} className="mt-8 careers-scroll-x overflow-x-auto -mx-1 px-1">
          <div className="flex items-center gap-5 sm:gap-6 border-b border-(--explorer-border) min-w-max">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                aria-pressed={category === c.key}
                className={`relative shrink-0 pb-3 text-[13.5px] font-bold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
                  category === c.key ? 'text-(--explorer-navy)' : 'text-(--explorer-muted) hover:text-(--explorer-navy)'
                }`}
              >
                {c.label}
                {category === c.key && (
                  <motion.span
                    layoutId="marketplace-category-underline"
                    className="absolute left-0 right-0 -bottom-px h-[2.5px] rounded-full"
                    style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Main composition: filter sidebar + marketplace */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[21%_1fr] gap-8">
          {/* Desktop sidebar — slides in from -20px, settles, then goes fully
              static (no lingering motion once revealed). */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 rounded-2xl border border-(--explorer-border) bg-white p-6">
              <FilterSidebarContent state={filterState} setState={setFilterState} activeCount={activeFilterCount} onClear={clearFilters} />
            </div>
          </motion.div>

          {/* Mobile filter trigger */}
          <div className="lg:hidden -mt-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-(--explorer-border) bg-white text-[13.5px] font-bold text-(--explorer-navy) shadow-[0_1px_2px_rgba(16,42,67,0.04)]"
            >
              <SlidersHorizontal size={15} aria-hidden="true" /> Filter jobs
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-(--explorer-blue) text-white text-[10.5px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="min-w-0">
            {/* Header: total + search + sort */}
            <Reveal direction="up" duration={0.5} delay={0.1} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
              <div className="shrink-0">
                <p className="text-[10.5px] font-black uppercase tracking-wide text-(--explorer-muted)">Total jobs</p>
                <p className="text-[22px] font-black text-(--explorer-navy) leading-none mt-0.5">
                  {results.length} <span className="text-[14px] font-bold text-(--explorer-muted)">opportunities</span>
                </p>
              </div>

              <div className="relative flex-1 min-w-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--explorer-muted)" aria-hidden="true" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs, skills or companies..."
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-(--explorer-border) bg-white text-[13.5px] text-(--explorer-navy) outline-none focus:border-(--explorer-blue) focus:ring-3 focus:ring-(--explorer-blue)/12 transition-colors"
                />
              </div>

              <div className="relative shrink-0">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort jobs"
                  className="h-10 pl-4 pr-9 rounded-full border border-(--explorer-border) bg-white text-[13px] font-bold text-(--explorer-navy) outline-none appearance-none cursor-pointer focus:border-(--explorer-blue) focus:ring-3 focus:ring-(--explorer-blue)/12 transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      Sort: {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--explorer-muted) pointer-events-none" aria-hidden="true" />
              </div>
            </Reveal>

            {/* Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${sort}-${search}-${JSON.stringify([...filterState.jobTypes, ...filterState.workModes, filterState.experienceLevel, filterState.location, filterState.minSalary])}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
                    <p className="text-[15px] font-bold text-(--explorer-navy)">No roles match these filters</p>
                    <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">Try clearing a filter or searching a different keyword.</p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-1.5 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-white text-[13px] font-bold"
                      style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" staggerDelay={0.08}>
                    {featured && (
                      <StaggerItem y={20} scale={1} duration={0.5} className="sm:col-span-2 sm:row-span-2">
                        <FeaturedJobTile job={featured} tone={CARD_TONES[0]} onOpen={() => openJob(featured)} />
                      </StaggerItem>
                    )}
                    {restJobs.map((job, i) => (
                      <StaggerItem key={job.id} y={20} scale={1} duration={0.45}>
                        <JobCard job={job} tone={CARD_TONES[(i + 1) % CARD_TONES.length]} onOpen={() => openJob(job)} />
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Transition toward the next section — compact on purpose (no
            network diagram, no empty canvas): the same location pin/city
            language the cards above already use, gathered into one small
            row that settles into place, then the CTA. ~200px total, so the
            next section starts close behind it rather than after a big gap. */}
        <div className="mt-10 md:mt-12 flex flex-col items-center text-center">
          <motion.div
            className="flex flex-wrap items-center justify-center gap-1.5"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            {TRANSITION_NODES.map((node) => (
              <motion.span
                key={node.label}
                variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="inline-flex items-center gap-1 h-6 pl-2 pr-2.5 rounded-full bg-(--explorer-blue-surface) text-[11px] font-bold text-(--explorer-blue)"
              >
                <MapPin size={10} aria-hidden="true" />
                {node.label}
              </motion.span>
            ))}
          </motion.div>

          <Reveal direction="up" duration={0.45} delay={0.35}>
            <p className="mt-3.5 text-[15.5px] font-black text-(--explorer-navy)">Opportunities don't stop at one city.</p>
            <p className="mt-1 text-[13px] text-(--explorer-navy)/70">Explore where India's next opportunities are opening up.</p>
          </Reveal>

          <Reveal direction="up" duration={0.45} delay={0.48}>
            <button
              type="button"
              onClick={scrollToNextSection}
              className="group mt-3.5 inline-flex items-center gap-2 text-[15px] font-black text-(--explorer-navy) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue) rounded-lg"
            >
              <span
                style={{ backgroundImage: 'var(--hero-cta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
              >
                Explore jobs across India
              </span>
              <motion.span
                animate={reduceMotion ? {} : { x: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                className="text-(--explorer-blue)"
              >
                <ArrowRight size={17} aria-hidden="true" />
              </motion.span>
            </button>
          </Reveal>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="absolute inset-0 bg-(--explorer-navy)/40 backdrop-blur-[2px]" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-[86%] max-w-sm bg-white p-6 overflow-y-auto shadow-[0_0_60px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[15px] font-black text-(--explorer-navy)">Filter jobs</p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-(--explorer-bg) text-(--explorer-navy)"
                  aria-label="Close filters"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <FilterSidebarContent state={filterState} setState={setFilterState} activeCount={activeFilterCount} onClear={clearFilters} />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-8 w-full h-11 rounded-full text-white text-[14px] font-bold"
                style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
              >
                Show {results.length} opportunities
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
