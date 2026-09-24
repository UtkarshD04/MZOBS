import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, BookmarkPlus } from 'lucide-react'
import { criteriaToChips, removeChip, NOTICE_OPTIONS, STAGE_LABELS } from '../lib/talent/criteria'
import { EMPLOYMENT_TYPE_LIST } from '../lib/talent/demoPool'
import { vocab } from '../lib/talent/vocab'
import { Chip } from './ui'

export function TagInput({ values, onChange, placeholder, suggestions = [] }) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const add = (v) => {
    const t = v.trim()
    if (t && !values.some((x) => x.toLowerCase() === t.toLowerCase())) onChange([...values, t])
    setText('')
  }
  const matches = text ? suggestions.filter((s) => s.toLowerCase().includes(text.toLowerCase()) && !values.includes(s)).slice(0, 6) : []
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-line bg-white p-1.5 focus-within:border-accent">
        {values.map((v) => (
          <Chip key={v} tone="accent" onRemove={() => onChange(values.filter((x) => x !== v))}>{v}</Chip>
        ))}
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setOpen(true) }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ',') && text.trim()) { e.preventDefault(); add(matches[0] ?? text) }
            if (e.key === 'Backspace' && !text && values.length) onChange(values.slice(0, -1))
          }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder={values.length ? '' : placeholder}
          className="min-w-[80px] flex-1 bg-transparent px-1.5 py-0.5 text-[13px] outline-none placeholder:text-[#8aa0b2]"
        />
      </div>
      {open && matches.length > 0 && (
        <div className="fade-up absolute inset-x-0 top-full z-20 mt-1 rounded-lg border border-line bg-white p-1 shadow-lift">
          {matches.map((m) => (
            <button key={m} onMouseDown={(e) => { e.preventDefault(); add(m) }} className="block w-full rounded-md px-2.5 py-1.5 text-left text-[13px] hover:bg-line-2">{m}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-line-2 last:border-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-3 text-left" aria-expanded={open}>
        <span className="flex items-center gap-2 text-[13.5px] font-semibold">
          {title}
          {count > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{count}</span>}
        </span>
        <ChevronDown size={15} className={clsx('text-muted transition-transform', open && 'rotate-180')} />
      </button>
      <div className={clsx('grid transition-all duration-200', open ? 'grid-rows-[1fr] pb-3.5 opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden"><div className={clsx(!open && 'invisible')}>{children}</div></div>
      </div>
    </div>
  )
}

function NumberPair({ a, b, onA, onB, unit, prefix, pa = 'Min', pb = 'Max' }) {
  const parse = (v) => (v === '' ? null : Math.max(0, Number(v)))
  const box = 'h-9 w-full rounded-lg border border-line bg-white px-2.5 text-[13px] outline-none focus:border-accent'
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        {prefix && <span className="pointer-events-none absolute left-2.5 top-2 text-[13px] text-muted">{prefix}</span>}
        <input type="number" min="0" value={a ?? ''} onChange={(e) => onA(parse(e.target.value))} placeholder={pa} className={clsx(box, prefix && 'pl-6')} />
      </div>
      <span className="text-muted">—</span>
      <div className="relative flex-1">
        {prefix && <span className="pointer-events-none absolute left-2.5 top-2 text-[13px] text-muted">{prefix}</span>}
        <input type="number" min="0" value={b ?? ''} onChange={(e) => onB(parse(e.target.value))} placeholder={pb} className={clsx(box, prefix && 'pl-6')} />
      </div>
      {unit && <span className="text-[12px] text-muted">{unit}</span>}
    </div>
  )
}

function Radio({ name, checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] hover:bg-line-2">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="accent-[#0a6f64]" /> {children}
    </label>
  )
}
function Check({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] hover:bg-line-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[#0a6f64]" /> {children}
    </label>
  )
}
function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-lg border border-line bg-white px-2.5 text-[13px] outline-none focus:border-accent">
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

const box = 'h-9 w-full rounded-lg border border-line bg-white px-2.5 text-[13px] outline-none focus:border-accent'

function Label({ children }) {
  return <p className="mb-1.5 mt-3 text-[12px] font-medium text-muted first:mt-0">{children}</p>
}

/** Suggest-as-you-type single value (degree, institute, company…). */
function Suggest({ value, onChange, placeholder, options = [], id }) {
  return (
    <>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} list={id} className={box} />
      <datalist id={id}>{options.slice(0, 60).map((o) => <option key={o} value={o} />)}</datalist>
    </>
  )
}

function Presets({ items, active, onPick }) {
  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {items.map(([label, val]) => (
        <button key={label} type="button" onClick={() => onPick(val)} className={clsx('rounded-full border px-2.5 py-0.5 text-[12px] font-medium transition-colors', active(val) ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:bg-line-2')}>{label}</button>
      ))}
    </div>
  )
}

const EXP_PRESETS = [['Fresher', [0, 1]], ['1–3', [1, 3]], ['3–5', [3, 5]], ['5–8', [5, 8]], ['8–12', [8, 12]], ['12+', [12, null]]]
const ACTIVE_OPTIONS = [['Any time', null], ['Last 1 day', 1], ['Last 7 days', 7], ['Last 14 days', 14], ['Last 30 days', 30], ['Last 90 days', 90]]
const FRESH_OPTIONS = [['Any time', null], ['Last 7 days', 7], ['Last 30 days', 30], ['Last 90 days', 90], ['Last 6 months', 180]]
const PROFILE_OPTIONS = [['Any', null], ['≥ 50%', 50], ['≥ 70%', 70], ['≥ 90%', 90]]
const TRUST_OPTIONS = [['Any', null], ['≥ 40', 40], ['≥ 60', 60], ['≥ 80', 80]]

function Choice({ name, value, options, onChange }) {
  return options.map(([label, v]) => (
    <Radio key={label} name={name} checked={value === v} onChange={() => onChange(v)}>{label}</Radio>
  ))
}

export default function FilterPanel({ criteria, onChange, onSave, onClear, meta }) {
  const m = meta ?? {}
  const c = criteria
  const set = (patch) => onChange({ ...c, ...patch })
  const chips = criteriaToChips(c)
  const n = (...flags) => flags.filter(Boolean).length
  const show = (k) => m[k] !== false // unknown meta (still loading) shows everything

  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-[14px] font-semibold">Filters</h2>
        <div className="flex items-center gap-1">
          <button onClick={onSave} disabled={!chips.length} className="flex items-center gap-1 rounded-md px-2 py-1 text-[12.5px] font-medium text-accent hover:bg-accent-soft disabled:text-muted disabled:hover:bg-transparent"><BookmarkPlus size={13} /> Save search</button>
          <button onClick={onClear} disabled={!chips.length} className="rounded-md px-2 py-1 text-[12.5px] font-medium text-muted hover:bg-line-2 disabled:opacity-40">Clear all</button>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-line-2 px-4 py-3">
          {chips.map((x) => (
            <Chip key={x.key} tone="accent" onRemove={() => onChange(removeChip(c, x.key))}>{x.label}</Chip>
          ))}
        </div>
      )}

      <div className="px-4">
        {m.pipeline && (m.jobs?.length > 0 || m.stages?.length > 0) && (
          <Section title="Job & pipeline" defaultOpen count={n(c.forJobId, c.stage)}>
            <div className="space-y-2">
              {m.jobs?.length > 0 && (
                <select value={c.forJobId} onChange={(e) => set({ forJobId: e.target.value, forJobTitle: m.jobs.find((j) => j.id === e.target.value)?.title ?? '' })} className={box} aria-label="Job">
                  <option value="">All jobs</option>
                  {m.jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              )}
              <Radio name="stage" checked={!c.stage} onChange={() => set({ stage: '' })}>Any stage</Radio>
              {m.stages.map((st) => <Radio key={st} name="stage" checked={c.stage === st} onChange={() => set({ stage: st })}>{STAGE_LABELS[st] ?? st}</Radio>)}
            </div>
          </Section>
        )}

        <Section title="Keywords" defaultOpen count={c.keywords.length + c.anyKeywords.length + c.exclude.length}>
          <Label>Must include (all)</Label>
          <TagInput values={c.keywords} onChange={(keywords) => set({ keywords })} placeholder="Add keyword…" />
          <Label>Any of these (at least one)</Label>
          <TagInput values={c.anyKeywords} onChange={(anyKeywords) => set({ anyKeywords })} placeholder="e.g. startup, fintech…" />
          <Label>Exclude</Label>
          <TagInput values={c.exclude} onChange={(exclude) => set({ exclude })} placeholder="Exclude keyword…" />
        </Section>

        <Section title="Skills" defaultOpen count={c.skills.length}>
          <TagInput values={c.skills} onChange={(skills) => set({ skills })} placeholder="Python, React, AWS…" suggestions={vocab.skills} />
          {c.skills.length > 1 && (
            <div className="mt-2 flex rounded-full border border-line p-0.5 text-[12px] font-semibold" role="group" aria-label="Skill match">
              {[['any', 'Any skill'], ['all', 'All skills']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => set({ skillsMode: v })} aria-pressed={c.skillsMode === v} className={clsx('flex-1 rounded-full px-2.5 py-1 transition-colors', c.skillsMode === v ? 'bg-accent text-white' : 'text-muted hover:text-ink')}>{l}</button>
              ))}
            </div>
          )}
        </Section>

        <Section title="Experience" defaultOpen={c.expMin != null || c.expMax != null} count={n(c.expMin != null || c.expMax != null)}>
          <Presets items={EXP_PRESETS} active={([a, b]) => c.expMin === a && c.expMax === b} onPick={([expMin, expMax]) => set({ expMin, expMax })} />
          <NumberPair a={c.expMin} b={c.expMax} onA={(expMin) => set({ expMin })} onB={(expMax) => set({ expMax })} unit="yrs" />
        </Section>

        <Section title="Location" defaultOpen={c.locations.length > 0} count={c.locations.length + c.prefLocations.length + n(c.relocate)}>
          <Label>Current location</Label>
          <TagInput values={c.locations} onChange={(locations) => set({ locations })} placeholder="City…" suggestions={vocab.cities} />
          {c.locations.length > 0 && <div className="mt-1.5"><Check checked={c.alsoPreferred} onChange={(alsoPreferred) => set({ alsoPreferred })}>Include people who prefer to relocate here</Check></div>}
          {show('relocation') && (
            <>
              <Label>Preferred location</Label>
              <TagInput values={c.prefLocations} onChange={(prefLocations) => set({ prefLocations })} placeholder="Where they want to work…" suggestions={vocab.cities} />
              <div className="mt-1.5"><Check checked={c.relocate} onChange={(relocate) => set({ relocate })}>Open to relocation</Check></div>
            </>
          )}
        </Section>

        {(show('salary') || show('currentSalary')) && (
          <Section title="Salary" count={n(c.salaryMin != null || c.salaryMax != null, c.curSalaryMin != null || c.curSalaryMax != null)}>
            {show('salary') && (<><Label>Expected annual salary</Label><NumberPair prefix="₹" a={c.salaryMin} b={c.salaryMax} onA={(salaryMin) => set({ salaryMin })} onB={(salaryMax) => set({ salaryMax })} unit="LPA" /></>)}
            {show('currentSalary') && (<><Label>Current annual salary</Label><NumberPair prefix="₹" a={c.curSalaryMin} b={c.curSalaryMax} onA={(curSalaryMin) => set({ curSalaryMin })} onB={(curSalaryMax) => set({ curSalaryMax })} unit="LPA" /></>)}
          </Section>
        )}

        {show('notice') && (
          <Section title="Notice period" count={n(c.noticeMax != null)}>
            <Radio name="notice" checked={c.noticeMax == null} onChange={() => set({ noticeMax: null })}>Any</Radio>
            {NOTICE_OPTIONS.map((o) => <Radio key={o.value} name="notice" checked={c.noticeMax === o.value} onChange={() => set({ noticeMax: o.value })}>{o.label}</Radio>)}
          </Section>
        )}

        <Section title="Role & company" count={n(c.designation, c.company, c.prevCompany, c.industry, c.department, c.companyType)}>
          <Label>Current designation</Label>
          <Suggest id="dl-roles" value={c.designation} onChange={(designation) => set({ designation })} placeholder="e.g. Senior Developer" options={vocab.roles} />
          {show('company') && (<><Label>Current company</Label><Suggest id="dl-co" value={c.company} onChange={(company) => set({ company })} placeholder="Company name" options={vocab.companies} /></>)}
          {show('prevCompany') && (<><Label>Previous company</Label><Suggest id="dl-prev" value={c.prevCompany} onChange={(prevCompany) => set({ prevCompany })} placeholder="Worked earlier at…" options={vocab.companies} /></>)}
          {show('industry') && (<><Label>Industry</Label><Select value={c.industry} onChange={(industry) => set({ industry })} options={vocab.industries} placeholder="Any industry" /></>)}
          {show('department') && (<><Label>Department</Label><Select value={c.department} onChange={(department) => set({ department })} options={vocab.departments} placeholder="Any department" /></>)}
          {show('companyType') && (<><Label>Company type</Label><Select value={c.companyType} onChange={(companyType) => set({ companyType })} options={vocab.companyTypes} placeholder="Any company type" /></>)}
        </Section>

        <Section title="Education" count={n(c.degree, c.institute, c.education, c.gradFrom != null || c.gradTo != null)}>
          {show('degree') && (<><Label>Degree</Label><Suggest id="dl-deg" value={c.degree} onChange={(degree) => set({ degree })} placeholder="e.g. B.Tech" options={vocab.degrees} /></>)}
          {show('institute') && (<><Label>Institute</Label><Suggest id="dl-inst" value={c.institute} onChange={(institute) => set({ institute })} placeholder="College / university" options={vocab.institutes} /></>)}
          {show('gradYear') && (<><Label>Year of passing</Label><NumberPair a={c.gradFrom} b={c.gradTo} onA={(gradFrom) => set({ gradFrom })} onB={(gradTo) => set({ gradTo })} pa="From" pb="To" /></>)}
        </Section>

        {(show('workMode') || show('employmentType')) && (
          <Section title="Work preferences" count={n(c.workMode, c.employmentType)}>
            {show('workMode') && (<><Label>Work mode</Label>{['', 'Remote', 'Hybrid', 'On-site'].map((w) => <Radio key={w || 'any'} name="mode" checked={c.workMode === w} onChange={() => set({ workMode: w })}>{w || 'Any'}</Radio>)}</>)}
            {show('employmentType') && (<><Label>Employment type</Label><Select value={c.employmentType} onChange={(employmentType) => set({ employmentType })} options={EMPLOYMENT_TYPE_LIST} placeholder="Any type" /></>)}
          </Section>
        )}

        {(show('languages') || show('certifications')) && (
          <Section title="Languages & certifications" count={c.languages.length + n(c.hasCertification)}>
            {show('languages') && (<><Label>Languages spoken (all)</Label><TagInput values={c.languages} onChange={(languages) => set({ languages })} placeholder="English, Hindi…" suggestions={vocab.languages} /></>)}
            {show('certifications') && <div className="mt-2"><Check checked={c.hasCertification} onChange={(hasCertification) => set({ hasCertification })}>Has certifications</Check></div>}
          </Section>
        )}

        {(show('activity') || show('resumeDate')) && (
          <Section title="Candidate activity" count={n(c.activeDays != null, c.resumeFreshDays != null)}>
            {show('activity') && (<><Label>Active in</Label><Choice name="active" value={c.activeDays} options={ACTIVE_OPTIONS} onChange={(activeDays) => set({ activeDays })} /></>)}
            {show('resumeDate') && (<><Label>Resume updated</Label><Choice name="fresh" value={c.resumeFreshDays} options={FRESH_OPTIONS} onChange={(resumeFreshDays) => set({ resumeFreshDays })} /></>)}
          </Section>
        )}

        <Section title="Verification & quality" defaultOpen count={n(c.verifiedOnly, c.contactVerified, c.verifiedEducation, c.verifiedEmployment, c.minMatch != null, c.profileMin != null, c.trustMin != null, c.hasPortfolio, c.hasVideo)}>
          <Check checked={c.verifiedOnly} onChange={(verifiedOnly) => set({ verifiedOnly })}>Identity verified</Check>
          {show('contactVerified') && <Check checked={c.contactVerified} onChange={(contactVerified) => set({ contactVerified })}>Phone &amp; email verified</Check>}
          <Check checked={c.verifiedEducation} onChange={(verifiedEducation) => set({ verifiedEducation })}>Education verified</Check>
          <Check checked={c.verifiedEmployment} onChange={(verifiedEmployment) => set({ verifiedEmployment })}>Employment verified</Check>
          {m.portfolio && <Check checked={c.hasPortfolio} onChange={(hasPortfolio) => set({ hasPortfolio })}>Has portfolio</Check>}
          {m.video && <Check checked={c.hasVideo} onChange={(hasVideo) => set({ hasVideo })}>Has video intro</Check>}
          <Check checked={c.minMatch != null} onChange={(v) => set({ minMatch: v ? 80 : null })}>AI match &gt; 80</Check>
          <Label>Mzobs Trust Score</Label>
          <Choice name="trust" value={c.trustMin} options={TRUST_OPTIONS} onChange={(trustMin) => set({ trustMin })} />
          <Label>Profile completeness</Label>
          <Choice name="profile" value={c.profileMin} options={PROFILE_OPTIONS} onChange={(profileMin) => set({ profileMin })} />
        </Section>

        {show('gender') && (
          <Section title="Diversity hiring" count={n(c.gender)}>
            <p className="mb-2 rounded-lg bg-warn-soft px-2.5 py-1.5 text-[11.5px] leading-snug text-warn">Use only where the law and your hiring policy allow inclusive or diversity-focused sourcing. Values are self-declared by candidates.</p>
            <Radio name="gender" checked={!c.gender} onChange={() => set({ gender: '' })}>Any</Radio>
            {['Female', 'Male', 'Non-binary'].map((g) => <Radio key={g} name="gender" checked={c.gender === g} onChange={() => set({ gender: g })}>{g}</Radio>)}
          </Section>
        )}

        <Section title="Already actioned" count={n(c.hideContacted, c.hideShortlisted)}>
          <Check checked={c.hideContacted} onChange={(hideContacted) => set({ hideContacted })}>Hide candidates I’ve contacted</Check>
          <Check checked={c.hideShortlisted} onChange={(hideShortlisted) => set({ hideShortlisted })}>Hide shortlisted candidates</Check>
        </Section>
      </div>
    </div>
  )
}
