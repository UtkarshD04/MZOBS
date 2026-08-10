import { mockResolve } from '../lib/api'
import { COMPANY, INVOICES, JOBS, PRICING } from '../data/mock'
import type { Invoice } from '../types'

/**
 * There is no plan and no subscription — Mzobs bills per opening, upfront.
 * Everything here is derived from the requirements we've raised.
 */
export function getBillingSummary() {
  const billable = JOBS.filter((j) => j.status !== 'draft')
  const paid = billable.filter((j) => j.feeStatus === 'paid')
  const unpaid = billable.filter((j) => j.feeStatus === 'unpaid' && j.status !== 'pending_review')

  return mockResolve({
    perOpeningFee: PRICING.perOpeningFee,
    resumesPerOpening: PRICING.resumesPerOpening,
    openingsPaid: paid.reduce((n, j) => n + j.vacancies, 0),
    totalBilled: paid.reduce((n, j) => n + j.feeTotal, 0),
    outstanding: unpaid.reduce((n, j) => n + j.feeTotal, 0),
    outstandingCount: unpaid.length,
    resumesPromised: paid.reduce((n, j) => n + j.resumesPromised, 0),
    resumesDelivered: paid.reduce((n, j) => n + j.candidatesShared, 0),
    hires: JOBS.reduce((n, j) => n + j.hiresSelected, 0),
    verificationStatus: COMPANY.verificationStatus,
    paymentMethod: { brand: 'Visa', last4: '4242', expiry: '08/28' },
  })
}

export function listInvoices(): Promise<Invoice[]> {
  return mockResolve([...INVOICES])
}
