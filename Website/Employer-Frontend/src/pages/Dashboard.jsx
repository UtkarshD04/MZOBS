import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import VerificationStatusCard from '../components/dashboard/VerificationStatusCard'
import CompactSummaryStrip from '../components/dashboard/CompactSummaryStrip'
import JobsResponsesTable from '../components/dashboard/JobsResponsesTable'
import CandidateResponseList from '../components/dashboard/CandidateResponseList'
import ResumeCreditsWidget from '../components/dashboard/ResumeCreditsWidget'
import { useCompanyQuery } from '../hooks/useCompany'
import { useMeQuery } from '../hooks/useMe'
import { useJobsQuery, useSetJobStatus, useDuplicateJob } from '../hooks/useJobs'
import { useCandidatesQuery } from '../hooks/useCandidates'
import { useCreditBalanceQuery } from '../hooks/useCvCredits'
import { useSubscriptionQuery, useAccessStatusQuery } from '../hooks/useSubscription'

const ACTIVE_JOB_STATUSES = ['sourcing', 'delivered']
const SHORTLISTED_STAGES = ['shortlisted', 'interviewing', 'offered', 'hired']

function groupBy(list, key) {
  return list.reduce((acc, item) => {
    const k = item[key]
    if (!k) return acc
    ;(acc[k] ??= []).push(item)
    return acc
  }, {})
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: company, isLoading: companyLoading, isError: companyError, refetch } = useCompanyQuery()
  const { data: me, isLoading: meLoading } = useMeQuery()
  const { data: jobs, isLoading: jobsLoading } = useJobsQuery()
  const { data: candidates, isLoading: candidatesLoading } = useCandidatesQuery()
  const { data: creditData, isLoading: creditsLoading } = useCreditBalanceQuery()
  const { data: subscriptionData } = useSubscriptionQuery()
  const { data: access } = useAccessStatusQuery()

  const setJobStatus = useSetJobStatus()
  const duplicateJob = useDuplicateJob()

  const isLoading = companyLoading || meLoading || jobsLoading || candidatesLoading || creditsLoading

  const derived = useMemo(() => {
    if (!jobs || !candidates) return null

    const candidatesByJob = groupBy(candidates, 'jobId')
    const jobsWithCounts = jobs.map((job) => {
      const jobCandidates = candidatesByJob[job.id] ?? []
      return {
        ...job,
        newCount: jobCandidates.filter((c) => c.stage === 'shared').length,
        shortlistedCount: jobCandidates.filter((c) => SHORTLISTED_STAGES.includes(c.stage)).length,
      }
    })

    const activeJobs = jobs.filter((j) => ACTIVE_JOB_STATUSES.includes(j.status))
    const newResponses = candidates.filter((c) => c.stage === 'shared')
    const shortlisted = candidates.filter((c) => c.stage === 'shortlisted')

    return { jobsWithCounts, activeJobs, newResponses, shortlisted }
  }, [jobs, candidates])

  if (isLoading) return <PageSkeleton />
  if (companyError || !company || !me || !derived) return <ErrorState onRetry={() => refetch()} />

  function handleDuplicate(id) {
    duplicateJob.mutate(id)
  }

  function handleClose(id) {
    setJobStatus.mutate({ id, status: 'closed' })
  }

  function handleViewCandidate(id) {
    navigate(`/candidates/${id}`)
  }

  const wallet = creditData?.wallet
  const remainingCredits = wallet?.remainingCredits ?? 0

  const summaryItems = [
    { label: 'Active jobs', value: derived.activeJobs.length, to: '/jobs' },
    { label: 'New responses', value: derived.newResponses.length, to: '/candidates?stage=shared' },
    { label: 'Shortlisted', value: derived.shortlisted.length, to: '/candidates?stage=shortlisted' },
    { label: 'Resume credits', value: remainingCredits, to: '/cv-credits' },
  ]

  return (
    <div>
      <PageHeader
        title={`Good ${greeting()}, ${company.name}`}
        subtitle="Manage jobs, review responses, and find relevant talent."
        actions={
          <>
            <Button variant="secondary" size="lg" onClick={() => navigate('/resume-search')}>
              <Users size={16} /> Search Resumes
            </Button>
            <Button variant="primary" size="lg" onClick={() => navigate('/jobs/new')}>
              <Plus size={16} /> Post a Job
            </Button>
          </>
        }
      />

      <VerificationStatusCard company={company} accessActive={access?.active} />

      <CompactSummaryStrip items={summaryItems} />

      <div className="mb-5">
        <JobsResponsesTable jobs={derived.jobsWithCounts} onDuplicate={handleDuplicate} onClose={handleClose} />
      </div>

      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <div className="col-span-2 max-xl:col-span-1">
          <CandidateResponseList candidates={candidates} onView={handleViewCandidate} />
        </div>
        <ResumeCreditsWidget wallet={wallet} subscription={subscriptionData?.subscription} />
      </div>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
