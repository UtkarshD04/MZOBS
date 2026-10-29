import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Download } from 'lucide-react'
import { Button, EmptyState } from '../components/ui'
import { ErrorState, ListSkeleton, PageShell } from '../components/rc'
import { useWorkspace } from '../store/workspace'
import JobInsights from '../components/JobInsights'
import { apiMessage, exportApplicants, getApplicantsSummary, PIPELINE, usePermissions } from '../services/recruiterService'
import { IS_DEMO } from '../lib/config'

// Hiring funnel per job, straight from the stored pipeline. Charts are limited to the one stage bar per job: nothing here is projected.
export default function Reports() {
  const { toast } = useWorkspace()
  const { can } = usePermissions()
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState('')
  const [jobId, setJobId] = useState('')
  const load = useCallback(() => { setError(''); getApplicantsSummary().then(setJobs).catch((e) => setError(apiMessage(e, 'Could not load reports.'))) }, [])
  useEffect(() => { if (!IS_DEMO) load() }, [load])

  if (IS_DEMO) return <PageShell title="Reports"><EmptyState icon={BarChart3} title="Reports need a live workspace" body="Reports are built from your real hiring activity, so they aren’t available in the demo workspace." /></PageShell>
  const exp = async () => {
    try {
      await exportApplicants('all')
      toast('Export downloaded')
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    }
  }
  return (
    <PageShell title="Reports" sub="Where candidates are in your hiring, job by job." actions={can('exports.run') && <Button size="sm" icon={Download} onClick={exp}>Export applicants (CSV)</Button>}>
      {error ? <ErrorState message={error} onRetry={load} /> : !jobs ? <ListSkeleton /> : jobs.length === 0 ? (
        <EmptyState icon={BarChart3} title="No jobs yet" body="Post a job and its hiring funnel will show up here as candidates move through your pipeline." />
      ) : (
        <div className="space-y-5">
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead className="border-b border-line bg-[#faf9f6] text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-2">
                <tr><th className="px-4 py-2">Job</th><th className="px-3 py-2 text-right">Total</th>{PIPELINE.map((s) => <th key={s.key} className="px-3 py-2 text-right">{s.label}</th>)}<th /></tr>
              </thead>
              <tbody className="divide-y divide-line-2">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-[#faf9f6]">
                    <td className="px-4 py-2.5"><b className="block font-semibold">{j.title}</b><span className="text-[12px] text-muted">{j.status === 'sourcing' ? 'Live' : j.status.replace(/_/g, ' ')}</span></td>
                    <td className="num px-3 py-2.5 text-right font-bold">{j.total}</td>
                    {PIPELINE.map((s) => <td key={s.key} className="num px-3 py-2.5 text-right text-ink-2">{j.counts[s.key]}</td>)}
                    <td className="px-3 py-2.5 text-right"><button type="button" onClick={() => setJobId(j.id === jobId ? '' : j.id)} className="mr-3 text-[12.5px] font-semibold text-accent hover:underline">{j.id === jobId ? 'Hide insights' : 'Insights'}</button><Link to={`/jobs/${j.id}/applicants`} className="text-[12.5px] font-semibold text-accent hover:underline">Pipeline</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {jobId && <JobInsights jobId={jobId} />}
        </div>
      )}
    </PageShell>
  )
}
