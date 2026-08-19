import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeCheck, Building2, Edit3, Globe, Link2, Mail, MapPin, Phone, Plus, Trash2, Users } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { CompanyLogo } from '../components/ui/Avatar'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import Badge from '../components/ui/Badge'
import Drawer from '../components/ui/Drawer'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { useCompanyQuery, useUpdateCompany } from '../hooks/useCompany'
import { companySchema } from '../schemas/companySchema'
import { fmtDate, fmtINR } from '../lib/utils'

export default function CompanyProfile() {
  const { data: company, isLoading, isError, refetch } = useCompanyQuery()
  const updateCompany = useUpdateCompany()
  const [editOpen, setEditOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(companySchema) })

  useEffect(() => {
    if (company) reset({ name: company.name, industry: company.industry, size: company.size, founded: company.founded, website: company.website, linkedin: company.linkedin, hq: company.hq, about: company.about })
  }, [company, reset])

  if (isLoading) return <PageSkeleton />
  if (isError || !company) return <ErrorState onRetry={() => refetch()} />

  function onSave(values) {
    updateCompany.mutate(values, { onSuccess: () => setEditOpen(false) })
  }

  return (
    <div>
      <PageHeader
        title="Company Profile"
        subtitle="This is how candidates and the Mzobs team see your company."
        actions={
          <Button variant="primary" onClick={() => setEditOpen(true)}>
            <Edit3 size={16} /> Edit Profile
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <div className="col-span-2 max-xl:col-span-1 flex flex-col gap-5">
          <Card pad>
            <div className="flex items-start gap-4 flex-wrap">
              <CompanyLogo initials={company.logo} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[19px] font-bold tracking-tight">{company.name}</h2>
                  {company.verificationStatus === 'verified' ? (
                    <Badge tone="green" icon={<BadgeCheck size={12} />}>Verified {company.verifiedOn ? fmtDate(company.verifiedOn) : ''}</Badge>
                  ) : company.verificationStatus === 'pending' ? (
                    <Badge tone="amber">Pending Mzobs verification</Badge>
                  ) : (
                    <Badge tone="red">Verification rejected</Badge>
                  )}
                </div>
                <div className="text-[13px] text-ink-secondary mt-1">{company.industry} · {company.size}</div>
                <p className="text-[13px] text-ink-secondary leading-relaxed mt-3 max-w-xl">{company.about}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3.5 mt-5 pt-5 border-t border-border max-sm:grid-cols-1">
              <InfoRow icon={Globe} label="Website" value={company.website} />
              <InfoRow icon={Link2} label="LinkedIn" value={company.linkedin} />
              <InfoRow icon={MapPin} label="Headquarters" value={company.hq} />
              <InfoRow icon={Building2} label="Founded" value={company.founded} />
            </div>
          </Card>

          <Card>
            <CardHead><CardTitle>Office Locations</CardTitle></CardHead>
            <CardBody className="flex flex-wrap gap-2">
              {company.locations.map((loc) => (
                <span key={loc} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium px-3 py-1.5 rounded-full bg-surface-sunken text-ink-secondary">
                  <MapPin size={12} /> {loc}
                </span>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHead>
              <CardTitle>Hiring Contacts</CardTitle>
              <Button variant="ghost" size="sm" iconOnly><Plus size={15} /></Button>
            </CardHead>
            <div>
              {company.hiringContacts.map((c) => (
                <div key={c.id} className="flex items-start gap-3 px-[22px] py-3.5 border-b border-border last:border-b-0">
                  <span className="w-9 h-9 rounded-full bg-navy-tint text-navy flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                    {c.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold truncate">{c.name}</div>
                    <div className="text-[11.5px] text-ink-tertiary truncate">{c.role}</div>
                    <div className="flex items-center gap-1 text-[11.5px] text-ink-secondary mt-1"><Mail size={11} /> {c.email}</div>
                    <div className="flex items-center gap-1 text-[11.5px] text-ink-secondary mt-0.5"><Phone size={11} /> {c.phone}</div>
                  </div>
                  <button className="text-ink-tertiary hover:text-red flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead><CardTitle>Mzobs Verification</CardTitle></CardHead>
            <CardBody>
              <div className="flex flex-col gap-2.5">
                {[
                  ['Registered on', fmtDate(company.submittedOn)],
                  ['GSTIN', company.gstin],
                  ['PAN', company.pan],
                  ['Verified on', company.verifiedOn ? fmtDate(company.verifiedOn) : 'Pending'],
                  ['Verified by', company.verifiedBy ?? '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-[12.5px] py-1.5 border-b border-border last:border-b-0">
                    <span className="text-ink-tertiary">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[12.5px] text-ink-secondary leading-relaxed mt-3.5 pt-3.5 border-t border-border">
                {company.verificationStatus === 'verified'
                  ? 'Mzobs verified your GSTIN and PAN against public records. Only verified companies can raise requirements, which is why candidates trust every listing on the platform.'
                  : 'Mzobs is checking your GSTIN and PAN. Requirements you raise stay in draft until this clears.'}
              </p>
            </CardBody>
          </Card>

          <Card pad>
            <div className="flex items-center gap-2.5 mb-1">
              <Users size={16} className="text-navy" />
              <span className="text-[13.5px] font-semibold">Hiring with Mzobs</span>
            </div>
            <div className="flex items-center justify-between text-[12.5px] mt-3 py-1.5 border-b border-border">
              <span className="text-ink-tertiary">Openings purchased</span>
              <span className="font-semibold tabular-nums">{company.openingsPurchased}</span>
            </div>
            <div className="flex items-center justify-between text-[12.5px] py-1.5">
              <span className="text-ink-tertiary">Total billed</span>
              <span className="font-semibold tabular-nums">{fmtINR(company.totalBilled)}</span>
            </div>
          </Card>
        </div>
      </div>

      <Drawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Company Profile"
        subtitle="These details are shown to candidates browsing your jobs."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={updateCompany.isPending} onClick={handleSubmit(onSave)}>Save Changes</Button>
          </>
        }
      >
        <Field label="Company Name" error={errors.name?.message}>
          <Input error={!!errors.name} {...register('name')} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Industry" error={errors.industry?.message}>
            <Input error={!!errors.industry} {...register('industry')} />
          </Field>
          <Field label="Company Size" error={errors.size?.message}>
            <Select error={!!errors.size} {...register('size')}>
              <option value="1–50 employees">1–50 employees</option>
              <option value="51–200 employees">51–200 employees</option>
              <option value="201–500 employees">201–500 employees</option>
              <option value="501–1000 employees">501–1000 employees</option>
              <option value="1000+ employees">1000+ employees</option>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Founded Year" error={errors.founded?.message}>
            <Input error={!!errors.founded} {...register('founded')} />
          </Field>
          <Field label="Headquarters" error={errors.hq?.message}>
            <Input error={!!errors.hq} {...register('hq')} />
          </Field>
        </div>
        <Field label="Website" error={errors.website?.message}>
          <Input error={!!errors.website} {...register('website')} />
        </Field>
        <Field label="LinkedIn" error={errors.linkedin?.message}>
          <Input error={!!errors.linkedin} {...register('linkedin')} />
        </Field>
        <Field label="About" error={errors.about?.message}>
          <Textarea rows={5} error={!!errors.about} {...register('about')} />
        </Field>
      </Drawer>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-lg bg-surface-sunken text-ink-secondary flex items-center justify-center flex-shrink-0"><Icon size={14} /></span>
      <div className="min-w-0">
        <div className="text-[11px] text-ink-tertiary">{label}</div>
        <div className="text-[13px] font-medium truncate">{value}</div>
      </div>
    </div>
  )
}
