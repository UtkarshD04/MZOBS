import { Upload, RotateCw, FileText, Download, CheckCircle2, Zap, Check, ShieldCheck, Clock, Send } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Ring from '../components/ui/Ring'
import Bar from '../components/ui/Bar'
import Button from '../components/ui/Button'
import Stepper from '../components/ui/Stepper'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { useApp } from '../context/AppContext'
import { openVersionCompareModal } from '../lib/modals'
import { RESUME, RESUME_CHECKS, RESUME_HISTORY } from '../lib/data'

const VERIFICATION_STEPS = ['Uploaded', 'Received by Mzobs', 'Expert review', 'Verified', 'Eligible for dispatch']

export default function ResumeCenter() {
  const app = useApp()
  const verified = RESUME.status === 'verified'

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Center</h1>
          <p className="text-sm text-ink-secondary mt-1">Upload your resume here — the Mzobs team verifies it before any employer sees it.</p>
        </div>
        <div className="flex gap-2.5">
          <Button onClick={() => openVersionCompareModal(app)}>
            <RotateCw size={15} /> Compare versions
          </Button>
          <Button variant="primary" onClick={() => app.addToast('success', 'Resume uploaded — sent to the Mzobs team for verification')}>
            <Upload size={15} /> Upload new resume
          </Button>
        </div>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <span className="text-[15px] font-semibold">Verification status</span>
            <Badge tone={verified ? 'green' : 'gold'}>{verified ? 'Verified by Mzobs' : 'Pending verification'}</Badge>
          </div>
          <Stepper
            steps={VERIFICATION_STEPS.map((label, i) => ({
              label,
              state: verified ? 'done' : i < 2 ? 'done' : i === 2 ? 'current' : '',
            }))}
          />
          <p className="text-[13px] text-ink-secondary mt-6 pt-5 border-t border-border">
            {verified ? (
              <>
                Verified on <b className="text-ink">{RESUME.verifiedOn}</b> by <b className="text-ink">{RESUME.reviewer}</b> ({RESUME.reviewerRole}).
                Your resume is now eligible to be sent to hiring companies when a matching requirement opens.
              </>
            ) : (
              <>Our verification team usually clears resumes within 24–48 hours. You'll get a notification the moment it's decided.</>
            )}
          </p>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-[1.3fr_1fr] gap-5 mb-4">
        <Card pad>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-semibold">Current resume</span>
            <Badge tone={verified ? 'green' : 'gold'}>{verified ? 'Verified' : 'Under review'}</Badge>
          </div>
          <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl">
            <FileText size={30} className="text-navy flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold truncate">{RESUME.file}</div>
              <div className="text-xs text-ink-tertiary mt-1">
                Version {RESUME.version} · Uploaded {RESUME.uploadedOn} · Reviewed by {RESUME.reviewer}
              </div>
            </div>
            <Button size="sm">
              <Download size={14} /> Download
            </Button>
          </div>
          <div className="text-xs text-ink-tertiary mt-3 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-green" /> Passed ATS compatibility check on {RESUME.verifiedOn}
          </div>
          {RESUME.note && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-1.5">Reviewer note</div>
              <p className="text-[13px] text-ink-secondary">{RESUME.note}</p>
            </div>
          )}
        </Card>
        <Card pad className="flex flex-col items-center justify-center text-center">
          <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Verification Score</div>
          <Ring value={RESUME.score} size={96} thick={9} hero />
          <div className="text-[13px] text-ink-secondary mt-2.5">Assigned by the Mzobs verification team</div>
          <div className="text-xs text-ink-tertiary mt-1">A higher score means you're shortlisted earlier in a dispatch batch.</div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-2 gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">What we checked</span>
            <span className="text-xs text-ink-tertiary">Mzobs verification standard</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3.5">
            {RESUME_CHECKS.map(([label, v, max, note]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span>{label}</span>
                  <span className="text-ink-secondary">
                    {v}/{max}
                  </span>
                </div>
                <Bar value={(v / max) * 100} thin />
                <div className="text-[11.5px] text-ink-tertiary mt-1">{note}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Suggestions to improve</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3.5">
            <div className="flex gap-2.5">
              <div className="w-[30px] h-[30px] rounded-[9px] bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
                <Zap size={14} />
              </div>
              <div className="text-[13px]">Add 2–3 more quantified achievements to your most recent role (e.g. "improved X by 20%").</div>
            </div>
            <div className="flex gap-2.5">
              <div className="w-[30px] h-[30px] rounded-[9px] bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
                <Zap size={14} />
              </div>
              <div className="text-[13px]">Include "Data Visualization" — it appears in most Analytics track requirements.</div>
            </div>
            <div className="flex gap-2.5">
              <div className="w-[30px] h-[30px] rounded-[9px] bg-green-tint text-green flex items-center justify-center flex-shrink-0">
                <Check size={14} />
              </div>
              <div className="text-[13px]">Formatting is clean and ATS-parsable — no changes needed.</div>
            </div>
            <div className="mt-1 pt-4 border-t border-border flex items-start gap-2.5">
              <Send size={15} className="text-navy mt-0.5 flex-shrink-0" />
              <div className="text-[12.5px] text-ink-secondary">
                Re-uploading resets verification. Your new version goes back into the Mzobs queue, and only the verified version is sent to employers.
              </div>
            </div>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Upload history</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Version', 'Uploaded', 'Score', 'Mzobs decision', '']}>
              {RESUME_HISTORY.map((r) => (
                <Tr key={r.version}>
                  <Td className="font-bold">{r.version}</Td>
                  <Td>{r.uploadedOn}</Td>
                  <Td className="font-bold">{r.score}</Td>
                  <Td>
                    <Badge tone={r.tone}>{r.status}</Badge>
                  </Td>
                  <Td>
                    <Button variant="ghost" size="sm">
                      <Download size={14} />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card pad className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={17} />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold">Why we verify every resume</div>
            <p className="text-[13px] text-ink-secondary mt-1 flex items-start gap-1.5">
              <Clock size={13} className="mt-0.5 flex-shrink-0 text-ink-tertiary" />
              Employers pay Mzobs for a pre-screened shortlist, not a pile of applications. Verification is what makes your resume worth sending — and
              it's why an unverified resume never leaves our system.
            </p>
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
