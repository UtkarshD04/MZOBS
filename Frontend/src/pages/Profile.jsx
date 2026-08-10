import { useState } from 'react'
import { Edit, Plus, ShieldCheck, Mail, Phone, Briefcase, Award, BadgeCheck, FileText, Download, Link as LinkIcon } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa6'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Ring from '../components/ui/Ring'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { Tabs } from '../components/ui/Tabs'
import { Field, Input, Select } from '../components/ui/Field'
import EmptyState from '../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { USER } from '../lib/data'

const TAB_LABELS = ['Personal', 'Education', 'Experience', 'Projects', 'Skills', 'Achievements', 'Resume', 'Certificates', 'Portfolio', 'Social Links']

export default function Profile() {
  const [tab, setTab] = useState(0)

  return (
    <StaggerGroup>
      <StaggerItem>
      <Card pad className="mb-4">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex gap-4">
            <Avatar initials={USER.initials} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{USER.name}</h1>
                <Badge tone="green" icon={<ShieldCheck size={12} />}>
                  Verified
                </Badge>
              </div>
              <div className="text-sm text-ink-secondary mt-1">
                {USER.role} · {USER.location}
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                <Mail size={13} className="text-ink-tertiary" />
                <span className="text-xs text-ink-tertiary">{USER.email}</span>
                <span className="text-xs text-ink-tertiary">·</span>
                <Phone size={13} className="text-ink-tertiary" />
                <span className="text-xs text-ink-tertiary">{USER.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Ring value={USER.profileCompletion} size={60} thick={7} />
            <Button variant="primary">
              <Edit size={15} /> Edit Profile
            </Button>
          </div>
        </div>
      </Card>
      </StaggerItem>

      <StaggerItem>
      <Card>
        <Tabs items={TAB_LABELS} active={tab} onChange={setTab} className="px-5" />
        <div className="p-[22px]">
          {tab === 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name">
                <Input defaultValue="Ananya Sharma" />
              </Field>
              <Field label="Date of birth">
                <Input type="date" defaultValue="2001-04-12" />
              </Field>
              <Field label="Email">
                <Input defaultValue="ananya.sharma@gmail.com" />
              </Field>
              <Field label="Phone">
                <Input defaultValue="+91 98765 43210" />
              </Field>
              <Field label="Location">
                <Input defaultValue="Bengaluru, Karnataka" />
              </Field>
              <Field label="Gender" optional>
                <Select defaultValue="Female">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Prefer not to say</option>
                </Select>
              </Field>
            </div>
          )}
          {tab === 1 && (
            <>
              <div className="border border-dashed border-border-strong rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-semibold">B.Tech, Computer Science</div>
                  <div className="text-[13px] text-ink-secondary mt-1">RV College of Engineering · 2021 – 2025</div>
                  <div className="text-xs text-ink-tertiary mt-1">CGPA: 8.6/10</div>
                </div>
                <button className="p-1.5 rounded-lg text-ink-tertiary hover:bg-surface-hover hover:text-ink">
                  <Edit size={16} />
                </button>
              </div>
              <Button className="mt-3">
                <Plus size={15} /> Add education
              </Button>
            </>
          )}
          {tab === 2 && (
            <EmptyState
              icon={Briefcase}
              title="No work experience added yet"
              body="Add internships or jobs to strengthen your profile."
              action={
                <Button variant="primary" className="mt-2">
                  <Plus size={15} /> Add experience
                </Button>
              }
            />
          )}
          {tab === 3 && (
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <div className="p-[22px]">
                  <div className="text-[15px] font-semibold">Campus Placement Predictor</div>
                  <div className="text-[13px] text-ink-secondary mt-1.5">ML model predicting placement likelihood using student data.</div>
                  <div className="flex gap-1.5 mt-2.5">
                    <span className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">Python</span>
                    <span className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">scikit-learn</span>
                  </div>
                </div>
              </Card>
              <div className="border border-dashed border-border-strong rounded-xl flex items-center justify-center">
                <Button variant="ghost">
                  <Plus size={15} /> Add project
                </Button>
              </div>
            </div>
          )}
          {tab === 4 && (
            <>
              <div className="flex flex-wrap gap-2">
                {['MS Excel', 'SQL', 'Data Analysis', 'Communication', 'Power BI', 'Python', 'Product Sense', 'Stakeholder Management'].map((s) => (
                  <span key={s} className="text-[12.5px] font-semibold text-ink-secondary bg-surface-sunken px-3 py-1.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
              <Button className="mt-4">
                <Plus size={15} /> Add skill
              </Button>
            </>
          )}
          {tab === 5 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-[38px] h-[38px] rounded-[11px] bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold">Excel Assessment — Top 5%</div>
                  <div className="text-xs text-ink-tertiary">20 Jul 2026</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-[38px] h-[38px] rounded-[11px] bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
                  <BadgeCheck size={18} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold">Resume Verified by Mzobs</div>
                  <div className="text-xs text-ink-tertiary">15 Jul 2026</div>
                </div>
              </div>
            </div>
          )}
          {tab === 6 && (
            <div className="flex items-center justify-between p-3.5 border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <FileText size={22} className="text-navy" />
                <div>
                  <div className="text-[13.5px] font-semibold">Ananya_Sharma_Resume_v3.pdf</div>
                  <div className="text-xs text-ink-tertiary">Uploaded 12 Jul 2026 · 240 KB</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="green">Verified</Badge>
                <Button size="sm">
                  <Download size={14} />
                </Button>
              </div>
            </div>
          )}
          {tab === 7 && (
            <EmptyState
              icon={BadgeCheck}
              title="No certificates added"
              body="Upload certifications from courses or platforms."
              action={
                <Button variant="primary" className="mt-2">
                  <FileText size={15} /> Upload certificate
                </Button>
              }
            />
          )}
          {tab === 8 && (
            <Field label="Portfolio URL">
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <Input placeholder="https://yourportfolio.com" className="pl-[38px]" />
              </div>
            </Field>
          )}
          {tab === 9 && (
            <>
              <Field label="LinkedIn">
                <div className="relative">
                  <FaLinkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                  <Input defaultValue="linkedin.com/in/ananyasharma" className="pl-[38px]" />
                </div>
              </Field>
              <Field label="GitHub">
                <div className="relative">
                  <FaGithub size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                  <Input placeholder="github.com/username" className="pl-[38px]" />
                </div>
              </Field>
            </>
          )}
        </div>
      </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
