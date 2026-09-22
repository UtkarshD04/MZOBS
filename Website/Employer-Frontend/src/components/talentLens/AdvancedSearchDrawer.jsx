import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Chip from '../ui/Chip'
import { Field, Input, Select } from '../ui/Field'
import { KNOWN_SKILLS, KNOWN_LOCATIONS, KNOWN_INDUSTRIES } from '../../lib/talentLens/mockCandidates'

const EMPTY = () => ({
  keywords: '',
  excludeKeywords: '',
  skillGroups: [[]],
  experienceMin: '',
  experienceMax: '',
  location: '',
  preferredLocation: '',
  salaryMaxLPA: '',
  availabilityDays: '',
  currentCompany: '',
  previousCompany: '',
  designation: '',
  industry: '',
  education: '',
  degree: '',
  institute: '',
  employmentType: '',
  companyType: '',
  workMode: '',
  profileActivity: 'any',
  verificationStatus: 'any',
})

// A skill "group" is OR'd internally; groups are AND'd together — reads as
// Python AND (FastAPI OR Django) AND AWS without exposing raw Boolean syntax.
function SkillGroupBuilder({ groups, onChange }) {
  function setGroup(i, skills) {
    onChange(groups.map((g, gi) => (gi === i ? skills : g)))
  }
  function addGroup() {
    onChange([...groups, []])
  }
  function removeGroup(i) {
    onChange(groups.length > 1 ? groups.filter((_, gi) => gi !== i) : groups)
  }

  return (
    <div className="flex flex-col gap-2.5">
      {groups.map((group, i) => (
        <div key={i}>
          {i > 0 && <div className="text-[11px] font-bold uppercase tracking-wide text-ink-tertiary mb-2">and</div>}
          <div className="rounded-xl border border-border-strong bg-surface-sunken p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-ink-tertiary">{group.length > 1 ? 'Any of these (OR)' : 'Skill'}</span>
              {groups.length > 1 && (
                <button onClick={() => removeGroup(i)} className="text-ink-tertiary hover:text-red">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {KNOWN_SKILLS.map((skill) => (
                <Chip key={skill} selected={group.includes(skill)} onClick={() => setGroup(i, group.includes(skill) ? group.filter((s) => s !== skill) : [...group, skill])}>
                  {skill}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button onClick={addGroup} className="self-start inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy hover:underline">
        <Plus size={14} /> Add AND condition
      </button>
    </div>
  )
}

/**
 * @param {{open: boolean, onClose: () => void, onApply: (criteria: import('../../lib/talentLens/types').SearchCriteria) => void}} props
 */
export default function AdvancedSearchDrawer({ open, onClose, onApply }) {
  const [form, setForm] = useState(EMPTY)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function apply() {
    const skillGroups = form.skillGroups.map((g) => g.filter(Boolean)).filter((g) => g.length)
    onApply({
      includeKeywords: form.keywords ? form.keywords.split(',').map((s) => s.trim()).filter(Boolean) : [],
      excludeKeywords: form.excludeKeywords ? form.excludeKeywords.split(',').map((s) => s.trim()).filter(Boolean) : [],
      skills: skillGroups.flat(),
      skillGroups: skillGroups.length ? skillGroups : undefined,
      experienceMin: form.experienceMin ? Number(form.experienceMin) : undefined,
      experienceMax: form.experienceMax ? Number(form.experienceMax) : undefined,
      location: form.location || undefined,
      salaryMaxLPA: form.salaryMaxLPA ? Number(form.salaryMaxLPA) : undefined,
      availabilityDays: form.availabilityDays ? Number(form.availabilityDays) : undefined,
      currentCompany: form.currentCompany || undefined,
      designation: form.designation || undefined,
      industry: form.industry || undefined,
      employmentType: form.employmentType || undefined,
      companyType: form.companyType || undefined,
      workMode: form.workMode || undefined,
      profileActivity: form.profileActivity,
      verificationStatus: form.verificationStatus,
    })
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Advanced Search"
      subtitle="Build a detailed requirement — Mzobs still shows it back to you as editable filters."
      size="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={() => setForm(EMPTY())}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={apply}>
            Apply filters
          </Button>
        </>
      }
    >
      <Field label="Include keywords" hint="Comma-separated — must all appear on the profile.">
        <Input value={form.keywords} onChange={(e) => set('keywords', e.target.value)} placeholder="e.g. fintech, payments" />
      </Field>
      <Field label="Exclude keywords" optional hint="Comma-separated — profiles matching any of these are hidden.">
        <Input value={form.excludeKeywords} onChange={(e) => set('excludeKeywords', e.target.value)} placeholder="e.g. intern, fresher" />
      </Field>

      <div className="mb-4">
        <label className="text-[13px] font-semibold mb-[7px] block">Skills</label>
        <SkillGroupBuilder groups={form.skillGroups} onChange={(skillGroups) => set('skillGroups', skillGroups)} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 max-sm:grid-cols-1">
        <Field label="Experience — min (years)">
          <Input type="number" min="0" value={form.experienceMin} onChange={(e) => set('experienceMin', e.target.value)} />
        </Field>
        <Field label="Experience — max (years)">
          <Input type="number" min="0" value={form.experienceMax} onChange={(e) => set('experienceMax', e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-3 max-sm:grid-cols-1">
        <Field label="Current location">
          <Select value={form.location} onChange={(e) => set('location', e.target.value)}>
            <option value="">Any location</option>
            <option value="Remote">Remote</option>
            {KNOWN_LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>
        </Field>
        <Field label="Industry">
          <Select value={form.industry} onChange={(e) => set('industry', e.target.value)}>
            <option value="">Any industry</option>
            {KNOWN_INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-3 max-sm:grid-cols-1">
        <Field label="Notice period — within (days)" optional>
          <Input type="number" min="0" value={form.availabilityDays} onChange={(e) => set('availabilityDays', e.target.value)} placeholder="e.g. 30" />
        </Field>
        <Field label="Expected salary — up to (LPA)" optional>
          <Input type="number" min="0" value={form.salaryMaxLPA} onChange={(e) => set('salaryMaxLPA', e.target.value)} placeholder="e.g. 20" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-3 max-sm:grid-cols-1">
        <Field label="Designation" optional>
          <Input value={form.designation} onChange={(e) => set('designation', e.target.value)} placeholder="e.g. Backend Developer" />
        </Field>
        <Field label="Current company" optional>
          <Input value={form.currentCompany} onChange={(e) => set('currentCompany', e.target.value)} placeholder="e.g. Finzo Payments" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-x-3 max-sm:grid-cols-1">
        <Field label="Employment type">
          <Select value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)}>
            <option value="">Any</option>
            <option>Full-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </Select>
        </Field>
        <Field label="Company type">
          <Select value={form.companyType} onChange={(e) => set('companyType', e.target.value)}>
            <option value="">Any</option>
            <option>Startup</option>
            <option>Product</option>
            <option>MNC</option>
            <option>Services</option>
          </Select>
        </Field>
        <Field label="Work mode">
          <Select value={form.workMode} onChange={(e) => set('workMode', e.target.value)}>
            <option value="">Any</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-3 max-sm:grid-cols-1">
        <Field label="Profile activity">
          <Select value={form.profileActivity} onChange={(e) => set('profileActivity', e.target.value)}>
            <option value="any">Any</option>
            <option value="active">Active in the last 2 weeks</option>
          </Select>
        </Field>
        <Field label="Verification status">
          <Select value={form.verificationStatus} onChange={(e) => set('verificationStatus', e.target.value)}>
            <option value="any">Any</option>
            <option value="verified">Phone, email &amp; resume verified</option>
          </Select>
        </Field>
      </div>
    </Drawer>
  )
}
