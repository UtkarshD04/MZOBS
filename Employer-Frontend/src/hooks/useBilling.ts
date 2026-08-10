import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import * as billingService from '../services/billingService'

export function useBillingSummaryQuery() {
  return useQuery({ queryKey: queryKeys.billingSummary, queryFn: billingService.getBillingSummary })
}

export function useInvoicesQuery() {
  return useQuery({ queryKey: queryKeys.invoices, queryFn: billingService.listInvoices })
}
