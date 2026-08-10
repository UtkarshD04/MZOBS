import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as jobsService from '../services/jobsService'
import type { JobFilters, JobInput } from '../services/jobsService'
import type { JobStatus } from '../types'

export function useJobsQuery(filters: JobFilters = {}) {
  return useQuery({ queryKey: queryKeys.jobs(filters), queryFn: () => jobsService.listJobs(filters) })
}

export function useJobQuery(id: string | undefined) {
  return useQuery({ queryKey: queryKeys.job(id ?? ''), queryFn: () => jobsService.getJob(id!), enabled: !!id })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: JobInput) => jobsService.createJob(input),
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success(job?.status === 'pending_review' ? 'Requirement submitted to Mzobs for review' : 'Requirement saved as draft')
    },
    onError: () => toast.error('Could not save the requirement. Please try again.'),
  })
}

export function useUpdateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<JobInput> }) => jobsService.updateJob(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job updated')
    },
    onError: () => toast.error('Could not update the job.'),
  })
}

export function useSetJobStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) => jobsService.setJobStatus(id, status),
    onSuccess: (_job, vars) => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      const labels: Record<JobStatus, string> = {
        draft: 'moved to draft',
        pending_review: 'submitted to Mzobs for review',
        awaiting_payment: 'approved — invoice raised',
        sourcing: 'released to Mzobs sourcing',
        delivered: 'marked as delivered',
        closed: 'closed',
        archived: 'archived',
      }
      toast.success(`Requirement ${labels[vars.status]}`)
    },
    onError: () => toast.error('Could not update the requirement.'),
  })
}

export function usePayJobInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => jobsService.payJobInvoice(id),
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      qc.invalidateQueries({ queryKey: ['billing'] })
      toast.success(`Payment received — Mzobs is now sourcing ${job?.resumesPromised ?? 0} resumes`)
    },
    onError: () => toast.error('Payment could not be processed.'),
  })
}

export function useDuplicateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => jobsService.duplicateJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job duplicated')
    },
  })
}

export function useDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => jobsService.deleteJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted')
    },
  })
}
