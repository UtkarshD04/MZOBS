import { AlertTriangle, Download, ShieldCheck, Users } from 'lucide-react'
import { ModalHead, ModalBody, ModalFoot } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { CompanyLogo } from '../components/ui/Avatar'
import Ring from '../components/ui/Ring'

export function openApplyModal(app, job) {
  app.openModal(
    <>
      <ModalHead title={`Apply to ${job.role}`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex gap-3 items-center mb-4">
          <CompanyLogo initials={job.logo} />
          <div>
            <div className="text-[15px] font-semibold">{job.co}</div>
            <div className="text-xs text-ink-tertiary">
              {job.loc} · {job.mode} · {job.sal} · {job.openings} opening{job.openings > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <p className="text-[13px] text-ink-secondary">
          Your application goes to the <b className="text-ink">Mzobs hiring team</b>, not to {job.co}. We screen you against the requirement and forward
          your verified resume if you make the shortlist — the company sees your profile only at that point.
        </p>

        <div className="bg-surface-sunken rounded-xl mt-4 p-3.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2.5">What we'll send on your behalf</div>
          <label className="flex items-start gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-0.5 accent-navy w-[15px] h-[15px]" /> My verified resume (v3)
          </label>
          <label className="flex items-start gap-2 text-[13px] cursor-pointer mt-2">
            <input type="checkbox" defaultChecked className="mt-0.5 accent-navy w-[15px] h-[15px]" /> Mock interview score and skill track
          </label>
          <label className="flex items-start gap-2 text-[13px] cursor-pointer mt-2">
            <input type="checkbox" defaultChecked className="mt-0.5 accent-navy w-[15px] h-[15px]" /> Skill assessment results
          </label>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-border px-3.5 py-3 mt-4">
          <ShieldCheck size={15} className="text-navy mt-0.5 flex-shrink-0" />
          <p className="text-[12.5px] text-ink-secondary">
            Applying is free and always will be. Mzobs is paid by the employer, never by you — and a shortlist is not a guarantee of selection.
          </p>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            app.addToast('success', 'Application received by Mzobs — we\'ll update you after screening')
          }}
        >
          Send to Mzobs
        </Button>
      </ModalFoot>
    </>
  )
}

export function openJobDetailModal(app, job) {
  app.openModal(
    <>
      <ModalHead title={job.role} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3 items-center">
            <CompanyLogo initials={job.logo} />
            <div>
              <div className="text-[15px] font-semibold">{job.co}</div>
              <div className="text-xs text-ink-tertiary">
                {job.loc} · {job.mode}
              </div>
            </div>
          </div>
          <Ring value={job.match} size={56} hero={job.match >= 90} />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Salary Range</div>
            <div className="text-[15px] font-semibold mt-1">{job.sal}</div>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Openings</div>
            <div className="text-[15px] font-semibold mt-1 flex items-center gap-1.5">
              <Users size={14} className="text-navy" />
              {job.openings}
            </div>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Posted</div>
            <div className="text-[15px] font-semibold mt-1">{job.posted}</div>
          </div>
        </div>
        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Requirements</div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.tags.map((t) => (
            <span key={t} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>
        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">How hiring works for this role</div>
        <p className="text-[13px] text-ink-secondary">
          {job.co} is a Mzobs-verified employer and has raised this requirement with us. We screen every applicant, shortlist against the brief, and send
          the company a batch of resumes to interview from. Being shortlisted gets you an interview — the final decision is the employer's.
        </p>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Save</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            openApplyModal(app, job)
          }}
        >
          Apply through Mzobs
        </Button>
      </ModalFoot>
    </>,
    true
  )
}

export function openRescheduleModal(app, company, contact = 'recruiter') {
  app.openModal(
    <>
      <ModalHead title="Request reschedule" onClose={app.closeModal} />
      <ModalBody>
        <p className="text-[13px] text-ink-secondary mb-4">
          Requesting a new time for your interview with <b className="text-ink">{company}</b>. Your {contact} will need to confirm — you won't be able to set this directly.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Preferred new date">
            <Input type="date" />
          </Field>
          <Field label="Preferred new time">
            <Select defaultValue="10:00 AM">
              <option>10:00 AM</option>
              <option>1:00 PM</option>
              <option>4:30 PM</option>
            </Select>
          </Field>
        </div>
        <Field label="Reason">
          <Textarea placeholder={`Let your ${contact} know why you're requesting this`} />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            app.addToast('success', `Reschedule request sent to ${company}`)
          }}
        >
          Send request
        </Button>
      </ModalFoot>
    </>
  )
}

export function openVersionCompareModal(app) {
  app.openModal(
    <>
      <ModalHead title="Compare resume versions" onClose={app.closeModal} />
      <ModalBody>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Badge tone="gray" className="mb-2">
              Version 2 · 2 Jul 2026
            </Badge>
            <div className="bg-surface-sunken rounded-xl p-3.5 text-[12.5px] leading-loose">
              <div>
                Resume Score: <b>68/100</b>
              </div>
              <div>
                ATS Compatibility: <b>Fair</b>
              </div>
              <div>Summary: Generic, no metrics</div>
              <div>Skills listed: 8</div>
              <div>Formatting: Dense, 2 columns</div>
            </div>
          </div>
          <div>
            <Badge tone="green" className="mb-2">
              Version 3 · 12 Jul 2026 (Current)
            </Badge>
            <div className="bg-surface border-2 border-green rounded-xl p-3.5 text-[12.5px] leading-loose">
              <div>
                Resume Score: <b>88/100</b>
              </div>
              <div>
                ATS Compatibility: <b>Excellent</b>
              </div>
              <div>Summary: Rewritten with quantified impact</div>
              <div>Skills listed: 14</div>
              <div>Formatting: Clean, ATS-friendly single column</div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Close</Button>
        <Button variant="primary">
          <Download size={15} /> Download v3
        </Button>
      </ModalFoot>
    </>,
    true
  )
}

export function openDeleteAccountModal(app) {
  app.openModal(
    <>
      <ModalHead title="Delete your account" onClose={app.closeModal} />
      <ModalBody>
        <div className="w-[52px] h-[52px] rounded-2xl bg-red-tint text-red flex items-center justify-center mb-3.5">
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm">This permanently deletes your profile, resume history, assessment scores and application data. This can't be undone.</p>
        <Field label={<span>Type <b>DELETE</b> to confirm</span>} className="mt-4">
          <Input placeholder="DELETE" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant="danger"
          onClick={() => {
            app.closeModal()
            app.addToast('error', 'Account deletion requires confirmation')
          }}
        >
          Delete my account
        </Button>
      </ModalFoot>
    </>
  )
}
