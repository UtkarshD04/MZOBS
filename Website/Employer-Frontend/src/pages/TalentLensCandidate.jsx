import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Award, Briefcase, CalendarPlus, ExternalLink, FileText, FolderGit2, GraduationCap,
  MapPin, MessageSquare, Save, Sparkles, ThumbsUp, Wallet,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Modal from '../components/ui/Modal'
import ProgressBar from '../components/ui/ProgressBar'
import { Textarea } from '../components/ui/Field'
import { TALENT_POOL } from '../lib/talentLens/mockCandidates'
import { computeTrustSignal } from '../lib/talentLens/trustSignal'
import { useRecruiterNotes, useTalentPools } from '../lib/talentLens/store'
import { MatchScoreRing, MatchLevelBadge, TrustSignalPill, TrustSignalList, CareerTimeline } from '../components/talentLens/shared'
import { SaveToPoolMenu } from '../components/talentLens/TalentPoolsPanel'
import SimilarTalentPanel from '../components/talentLens/SimilarTalentPanel'

const DIMENSIONS = [
  ['skillMatch', 'Skills Match'],
  ['experienceMatch', 'Experience Match'],
  ['locationMatch', 'Location Match'],
  ['availabilityMatch', 'Availability Match'],
  ['industryMatch', 'Industry Match'],
]

function availabilityLabel(days) {
  if (days === 0) return 'Immediately available'
  return `${days} days notice`
}

export default function TalentLensCandidate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const candidate = TALENT_POOL.find((c) => c.id === id)
  const match = location.state?.match ?? null

  const [poolMenuOpen, setPoolMenuOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const { pools } = useTalentPools()
  const { notes, add: addNote } = useRecruiterNotes(id)

  if (!candidate) return <ErrorState title="Candidate not found" body="This profile may have been removed from the talent pool." onRetry={() => navigate('/talent-lens')} />

  const trust = computeTrustSignal(candidate)
  const inPools = pools.filter((p) => p.candidateIds.includes(candidate.id))

  function submitNote() {
    if (!noteText.trim()) return
    addNote(noteText.trim())
    setNoteText('')
  }

  return (
    <div>
      <button onClick={() => navigate('/talent-lens')} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-secondary hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to Talent Lens
      </button>

      <PageHeader
        title={candidate.name}
        subtitle={`${candidate.designation} at ${candidate.currentCompany} · ${candidate.location}`}
        actions={
          <>
            <Button variant="gold" size="md" onClick={() => toast.success(`${candidate.name} shortlisted (preview).`)}>
              <ThumbsUp size={16} /> Shortlist
            </Button>
            <Button variant="secondary" size="md" onClick={() => toast('Contact requests will route through Hiring Flow once connected.', { icon: '💬' })}>
              <MessageSquare size={16} /> Contact
            </Button>
            <Button variant="secondary" size="md" onClick={() => toast('Scheduling routes through Interviews once connected.', { icon: '📅' })}>
              <CalendarPlus size={16} /> Schedule Interview
            </Button>
            <Button variant="primary" size="md" onClick={() => setPoolMenuOpen(true)}>
              <Save size={16} /> Save to Pool
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <div className="col-span-2 max-xl:col-span-1 flex flex-col gap-5">
          <Card pad>
            <div className="flex items-start gap-4 flex-wrap">
              <Avatar initials={candidate.initials} size="lg" />
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[17px] font-bold tracking-tight">{candidate.name}</h2>
                </div>
                <div className="text-[13px] text-ink-secondary mt-0.5">
                  {candidate.designation} · {candidate.currentCompany}
                </div>
                <div className="flex items-center gap-3 flex-wrap mt-2.5">
                  {match && <MatchLevelBadge value={match.overallMatch} />}
                  <TrustSignalPill score={trust.score} />
                </div>
                {inPools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {inPools.map((p) => (
                      <span key={p.id} className="text-[11px] font-medium px-2 py-[3px] rounded-full bg-navy-tint text-navy">
                        {p.emoji} {p.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {match && <MatchScoreRing value={match.overallMatch} size={64} />}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border text-[13px] max-sm:grid-cols-1">
              <InfoRow icon={MapPin} label="Location" value={`${candidate.location}${candidate.preferredLocations.length ? ` (open to ${candidate.preferredLocations.join(', ')})` : ''}`} />
              <InfoRow icon={Wallet} label="Expected Salary" value={`₹${candidate.expectedSalaryLPA} LPA`} />
              <InfoRow icon={Briefcase} label="Experience" value={`${candidate.experienceYears} years`} />
              <InfoRow icon={GraduationCap} label="Availability" value={availabilityLabel(candidate.noticePeriodDays)} />
            </div>
          </Card>

          {match ? (
            <Card>
              <CardHead>
                <CardTitle>
                  <span className="inline-flex items-center gap-1.5"><Sparkles size={14} className="text-navy" /> AI Recruiter Summary</span>
                </CardTitle>
              </CardHead>
              <CardBody>
                <p className="text-[13.5px] leading-relaxed text-ink">{match.explanation}</p>
                <div className="flex flex-col gap-3 mt-4">
                  {DIMENSIONS.map(([key, label]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                        <span className="font-medium text-ink-secondary">{label}</span>
                        <span className="font-semibold tabular-nums">{match[key]}%</span>
                      </div>
                      <ProgressBar value={match[key]} tone={match[key] >= 85 ? 'green' : 'navy'} />
                    </div>
                  ))}
                </div>
                {(match.strengths.length > 0 || match.gaps.length > 0) && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border max-sm:grid-cols-1">
                    {match.strengths.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-tertiary mb-1.5">Strong matches</div>
                        <ul className="text-[12.5px] text-ink flex flex-col gap-1">
                          {match.strengths.map((s) => <li key={s}>✓ {s}</li>)}
                        </ul>
                      </div>
                    )}
                    {match.gaps.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-tertiary mb-1.5">Potential gaps</div>
                        <ul className="text-[12.5px] text-ink-secondary flex flex-col gap-1">
                          {match.gaps.map((g) => <li key={g}>· {g}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <EmptyState
                  icon={Sparkles}
                  title="No Match Intelligence for this visit"
                  body="Open this profile from a Talent Lens search to see how it was scored against your requirement."
                  action={
                    <Button variant="secondary" size="sm" onClick={() => navigate('/talent-lens')}>
                      Go to Talent Lens search
                    </Button>
                  }
                />
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHead><CardTitle>Career Timeline</CardTitle></CardHead>
            <CardBody>
              <CareerTimeline workHistory={candidate.workHistory} />
            </CardBody>
          </Card>

          <Card>
            <CardHead><CardTitle>Education</CardTitle></CardHead>
            <div className="px-[22px] pb-[22px] pt-1">
              {candidate.education.map((e, i) => (
                <div key={i} className="flex gap-3.5 py-3.5 border-b border-border last:border-b-0">
                  <span className="w-9 h-9 rounded-[10px] bg-teal-tint text-teal flex items-center justify-center flex-shrink-0"><GraduationCap size={16} /></span>
                  <div>
                    <div className="text-[13.5px] font-semibold">{e.degree}</div>
                    <div className="text-[12.5px] text-ink-secondary">{e.institute}</div>
                    <div className="text-[11.5px] text-ink-tertiary mt-0.5">{e.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {candidate.projects.length > 0 && (
            <Card>
              <CardHead><CardTitle>Projects</CardTitle></CardHead>
              <div className="px-[22px] pb-[22px] pt-1">
                {candidate.projects.map((p, i) => (
                  <div key={i} className="flex gap-3.5 py-3.5 border-b border-border last:border-b-0">
                    <span className="w-9 h-9 rounded-[10px] bg-violet-tint text-violet flex items-center justify-center flex-shrink-0"><FolderGit2 size={16} /></span>
                    <div>
                      <div className="text-[13.5px] font-semibold">{p.name}</div>
                      <div className="text-[12.5px] text-ink-secondary mt-0.5 leading-relaxed">{p.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <CardHead><CardTitle>Recruiter Notes</CardTitle></CardHead>
            <CardBody>
              <div className="flex gap-2">
                <Textarea rows={2} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a private note for your hiring team…" className="flex-1" />
              </div>
              <Button variant="secondary" size="sm" className="mt-2" onClick={submitNote} disabled={!noteText.trim()}>Add note</Button>
              {notes.length > 0 && (
                <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border">
                  {notes.map((n) => (
                    <div key={n.id} className="text-[12.5px] text-ink-secondary bg-surface-sunken rounded-lg px-3 py-2">{n.text}</div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHead><CardTitle>Skills</CardTitle></CardHead>
            <CardBody className="flex flex-wrap gap-1.5">
              {candidate.skills.map((s) => (
                <span key={s} className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${match?.strengths.includes(s) ? 'bg-teal-tint text-teal' : 'bg-surface-sunken text-ink-secondary'}`}>{s}</span>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHead>
              <CardTitle>Trust Signal</CardTitle>
              <span className="text-[13px] font-bold text-teal">{trust.score}/100</span>
            </CardHead>
            <CardBody>
              <TrustSignalList items={trust.items} />
            </CardBody>
          </Card>

          <Card>
            <CardHead><CardTitle>Resume</CardTitle></CardHead>
            <CardBody>
              {candidate.resumeAvailable ? (
                <Button variant="secondary" size="sm" className="w-full" onClick={() => toast('Resume access for Talent Lens profiles connects through the same CV credit system once wired up.', { icon: '📄' })}>
                  <FileText size={14} /> View Resume
                </Button>
              ) : (
                <p className="text-[12.5px] text-ink-tertiary">No resume on file yet.</p>
              )}
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                <InfoRow icon={Award} label="Certificates" value="See resume" small />
                {candidate.hasPortfolio && candidate.portfolioLink && (
                  <Link to={`https://${candidate.portfolioLink}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[12.5px] font-semibold text-navy hover:underline">
                    <ExternalLink size={13} /> {candidate.portfolioLink}
                  </Link>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHead><CardTitle>Profile Activity</CardTitle></CardHead>
            <CardBody className="text-[12.5px] text-ink-secondary">
              {candidate.lastActiveDaysAgo === 0 ? 'Active today' : `Active ${candidate.lastActiveDaysAgo} day${candidate.lastActiveDaysAgo === 1 ? '' : 's'} ago`}
            </CardBody>
          </Card>

          <Card>
            <CardHead><CardTitle>Find Similar Talent</CardTitle></CardHead>
            <CardBody>
              <SimilarTalentPanel candidate={candidate} />
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal open={poolMenuOpen} onClose={() => setPoolMenuOpen(false)} title="Save to a talent pool" size="sm">
        <SaveToPoolMenu candidateId={candidate.id} onDone={() => setPoolMenuOpen(false)} />
      </Modal>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, small }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`rounded-lg bg-surface-sunken text-ink-secondary flex items-center justify-center flex-shrink-0 ${small ? 'w-7 h-7' : 'w-8 h-8'}`}><Icon size={small ? 13 : 14} /></span>
      <div className="min-w-0">
        <div className="text-[11px] text-ink-tertiary">{label}</div>
        <div className="text-[13px] font-medium truncate">{value}</div>
      </div>
    </div>
  )
}
