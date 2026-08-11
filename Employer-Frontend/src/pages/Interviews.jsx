import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isSameDay } from 'date-fns'
import { CalendarCheck, CalendarPlus, MapPin, Star, Video, X } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardHead } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { InterviewStatusBadge } from '../components/ui/StatusBadge'
import { PillTabs } from '../components/ui/Tabs'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { CardListSkeleton } from '../components/ui/Skeleton'
import Calendar from '../components/ui/Calendar'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { useCancelInterview, useInterviewsQuery, useRescheduleInterview, useScheduleInterview, useSubmitFeedback } from '../hooks/useInterviews'
import { useCandidatesQuery } from '../hooks/useCandidates'
import { fmtDateTime } from '../lib/utils'

export default function Interviews() {
  const navigate = useNavigate()
  const { data: interviews = [], isLoading, isError, refetch } = useInterviewsQuery()
  const { data: shortlisted = [] } = useCandidatesQuery({ stage: 'shortlisted' })
  const cancelInterview = useCancelInterview()
  const rescheduleInterview = useRescheduleInterview()
  const scheduleInterview = useScheduleInterview()
  const submitFeedback = useSubmitFeedback()

  const [tab, setTab] = useState(0)
  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [cancelId, setCancelId] = useState(null)
  const [rescheduleId, setRescheduleId] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [feedbackId, setFeedbackId] = useState(null)
  const [feedbackScore, setFeedbackScore] = useState(80)
  const [feedbackNotes, setFeedbackNotes] = useState('')
  const [feedbackOutcome, setFeedbackOutcome] = useState('Selected')

  const [form, setForm] = useState({ candidateId: '', round: '', date: '', time: '', durationMins: 45, mode: 'Video Call', location: '', meetingLink: '' })

  const upcoming = useMemo(() => interviews.filter((i) => i.status === 'Confirmed' || i.status === 'Awaiting confirmation' || i.status === 'Rescheduled'), [interviews])
  const completed = useMemo(() => interviews.filter((i) => i.status === 'Completed' || i.status === 'Cancelled'), [interviews])
  const markedDates = useMemo(() => new Set(interviews.map((i) => format(new Date(i.startsAt), 'yyyy-MM-dd'))), [interviews])

  const list = tab === 0 ? upcoming : completed
  const filtered = selectedDate ? list.filter((i) => isSameDay(new Date(i.startsAt), selectedDate)) : list

  function resetForm() {
    setForm({ candidateId: '', round: '', date: '', time: '', durationMins: 45, mode: 'Video Call', location: '', meetingLink: '' })
  }

  function submitSchedule() {
    const candidate = shortlisted.find((c) => c.id === form.candidateId)
    if (!candidate || !form.round || !form.date || !form.time) return
    scheduleInterview.mutate(
      {
        candidateId: candidate.id,
        candidateName: candidate.name,
        initials: candidate.initials,
        role: candidate.appliedFor,
        round: form.round,
        startsAt: `${form.date}T${form.time}:00`,
        durationMins: form.durationMins,
        mode: form.mode,
        location: form.mode === 'On-site' ? form.location : undefined,
        meetingLink: form.mode !== 'On-site' ? form.meetingLink : undefined,
        panel: ['RK'],
      },
      { onSuccess: () => { setScheduleOpen(false); resetForm() } }
    )
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle="Coordinate and track interviews with candidates shared by Mzobs."
        actions={
          <Button variant="primary" onClick={() => setScheduleOpen(true)} disabled={shortlisted.length === 0}>
            <CalendarPlus size={16} /> Schedule Interview
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <Card pad className="h-fit">
          <Calendar month={month} onMonthChange={setMonth} selectedDate={selectedDate} onSelectDate={(d) => setSelectedDate((cur) => (cur && isSameDay(cur, d) ? null : d))} markedDates={markedDates} />
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="mt-3 text-[12px] font-semibold text-navy hover:underline flex items-center gap-1">
              <X size={12} /> Clear date filter
            </button>
          )}
        </Card>

        <div className="col-span-2 max-xl:col-span-1">
          <Card>
            <CardHead>
              <PillTabs items={['Upcoming', 'Completed']} active={tab} onChange={setTab} />
            </CardHead>

            {isLoading ? (
              <div className="p-5"><CardListSkeleton count={3} /></div>
            ) : isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title={tab === 0 ? 'No upcoming interviews' : 'No completed interviews yet'}
                body={tab === 0 ? 'Schedule an interview with a shortlisted candidate to see it here.' : 'Interview outcomes and feedback will appear here once completed.'}
              />
            ) : (
              <div>
                {filtered.map((iv) => (
                  <div key={iv.id} className="flex items-start gap-3.5 px-[22px] py-4 border-b border-border last:border-b-0">
                    <Avatar initials={iv.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => navigate(`/candidates/${iv.candidateId}`)} className="text-[13.5px] font-semibold hover:text-navy hover:underline">{iv.candidateName}</button>
                        <InterviewStatusBadge status={iv.status} />
                      </div>
                      <div className="text-[12.5px] text-ink-secondary mt-0.5">{iv.role} · {iv.round}</div>
                      <div className="flex items-center gap-1.5 text-[12px] text-ink-tertiary mt-1">
                        {iv.mode === 'On-site' ? <MapPin size={12} /> : <Video size={12} />}
                        {fmtDateTime(iv.startsAt)} · {iv.durationMins} mins · {iv.location || iv.meetingLink || iv.mode}
                      </div>
                      {iv.feedback && (
                        <div className="mt-2 flex items-center gap-2 text-[12px] bg-surface-sunken rounded-lg px-2.5 py-1.5">
                          <Star size={12} className="text-gold-dot" /> Score {iv.feedback.score}/100 · {iv.feedback.outcome}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                      {tab === 0 ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setRescheduleId(iv.id)
                              setRescheduleDate(format(new Date(iv.startsAt), "yyyy-MM-dd'T'HH:mm"))
                            }}
                          >
                            Reschedule
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red" onClick={() => setCancelId(iv.id)}>
                            Cancel
                          </Button>
                        </>
                      ) : iv.status === 'Completed' && !iv.feedback ? (
                        <Button variant="secondary" size="sm" onClick={() => setFeedbackId(iv.id)}>Add Feedback</Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule Interview"
        subtitle="Only shortlisted candidates can be scheduled."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={scheduleInterview.isPending} onClick={submitSchedule}>Schedule</Button>
          </>
        }
      >
        <Field label="Candidate">
          <Select value={form.candidateId} onChange={(e) => setForm((f) => ({ ...f, candidateId: e.target.value }))}>
            <option value="">Select a shortlisted candidate</option>
            {shortlisted.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.appliedFor}</option>
            ))}
          </Select>
        </Field>
        <Field label="Interview Round">
          <Input value={form.round} onChange={(e) => setForm((f) => ({ ...f, round: e.target.value }))} placeholder="e.g. Round 1 — Technical" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date">
            <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </Field>
          <Field label="Time">
            <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Duration (minutes)">
            <Input type="number" value={form.durationMins} onChange={(e) => setForm((f) => ({ ...f, durationMins: Number(e.target.value) }))} />
          </Field>
          <Field label="Mode">
            <Select value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}>
              <option value="Video Call">Video Call</option>
              <option value="Phone Call">Phone Call</option>
              <option value="On-site">On-site</option>
            </Select>
          </Field>
        </div>
        {form.mode === 'On-site' ? (
          <Field label="Location">
            <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Bengaluru HQ, 4th Floor" />
          </Field>
        ) : (
          <Field label="Meeting Link" optional>
            <Input value={form.meetingLink} onChange={(e) => setForm((f) => ({ ...f, meetingLink: e.target.value }))} placeholder="meet.google.com/…" />
          </Field>
        )}
      </Modal>

      <Modal
        open={!!rescheduleId}
        onClose={() => setRescheduleId(null)}
        title="Reschedule Interview"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setRescheduleId(null)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              loading={rescheduleInterview.isPending}
              onClick={() => {
                if (rescheduleId && rescheduleDate) rescheduleInterview.mutate({ id: rescheduleId, startsAt: rescheduleDate })
                setRescheduleId(null)
              }}
            >
              Confirm New Time
            </Button>
          </>
        }
      >
        <Field label="New date & time">
          <Input type="datetime-local" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
        </Field>
      </Modal>

      <ConfirmDialog
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={() => { if (cancelId) cancelInterview.mutate(cancelId); setCancelId(null) }}
        title="Cancel this interview?"
        body="The candidate and your hiring panel will be notified of the cancellation."
        confirmLabel="Cancel Interview"
        loading={cancelInterview.isPending}
      />

      <Modal
        open={!!feedbackId}
        onClose={() => setFeedbackId(null)}
        title="Interview Feedback"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setFeedbackId(null)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              loading={submitFeedback.isPending}
              onClick={() => {
                if (feedbackId) submitFeedback.mutate({ id: feedbackId, feedback: { score: feedbackScore, notes: feedbackNotes, outcome: feedbackOutcome } })
                setFeedbackId(null)
                setFeedbackNotes('')
              }}
            >
              Submit Feedback
            </Button>
          </>
        }
      >
        <Field label="Score (out of 100)">
          <Input type="number" min={0} max={100} value={feedbackScore} onChange={(e) => setFeedbackScore(Number(e.target.value))} />
        </Field>
        <Field label="Outcome">
          <Select value={feedbackOutcome} onChange={(e) => setFeedbackOutcome(e.target.value)}>
            <option value="Selected">Selected</option>
            <option value="Not selected">Not selected</option>
            <option value="On hold">On hold</option>
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea rows={4} value={feedbackNotes} onChange={(e) => setFeedbackNotes(e.target.value)} placeholder="Summarize the candidate's strengths and gaps…" />
        </Field>
      </Modal>
    </div>
  )
}
