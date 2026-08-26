import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as jobsService from '../services/jobsService'
import { openRazorpayCheckout } from '../lib/razorpay'

export function useJobsQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.jobs(filters), queryFn: () => jobsService.listJobs(filters) })
}

export function useJobQuery(id) {
  return useQuery({ queryKey: queryKeys.job(id ?? ''), queryFn: () => jobsService.getJob(id), enabled: !!id })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input) => jobsService.createJob(input),
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
    mutationFn: ({ id, input }) => jobsService.updateJob(id, input),
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
    mutationFn: ({ id, status }) => jobsService.setJobStatus(id, status),
    onSuccess: (_job, vars) => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      const labels = {
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

// Real money changes hands here: the fee is fixed server-side when the order
// is created, Razorpay Checkout collects the actual payment, and the job is
// only released into sourcing once the signature-verified response comes back.
// In dev, when the backend has no Razorpay keys configured, the order comes
// back flagged `mock: true` — Checkout is skipped and the mock-confirm
// endpoint releases the job directly, same as the employee subscription flow.
export function usePayJobInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const order = await jobsService.createJobPaymentOrder(id)
      if (order.mock) {
        return jobsService.confirmMockJobPayment(id, order.orderId)
      }
      const result = await openRazorpayCheckout(order)
      return jobsService.verifyJobPayment(id, {
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
      })
    },
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      qc.invalidateQueries({ queryKey: ['billing'] })
      toast.success(`Payment received — Mzobs is now sourcing ${job?.resumesPromised ?? 0} resumes`)
    },
    onError: (err) => {
      const message = err.response?.data?.message ?? err.message
      if (message !== 'Payment cancelled') toast.error(message ?? 'Payment could not be processed.')
    },
  })
}

export function useDuplicateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => jobsService.duplicateJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job duplicated')
    },
  })
}

export function useDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => jobsService.deleteJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted')
    },
  })
}
