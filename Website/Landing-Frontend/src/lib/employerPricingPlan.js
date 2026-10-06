// Mirrors Backend/src/config/env.js (employerPlan.plans, GST_RATE_PERCENT) —
// this marketing site has no authenticated pricing endpoint to call, so these
// numbers are kept in sync by hand. Update both places together if a plan
// price ever changes. Shared by EmployerPricing and the pricing section on the
// main /employers page so they never drift.
export const GST_RATE_PERCENT = 18

export const PLANS = [
  { code: 'EMPLOYER_ANNUAL_999', name: 'MZOBS Employer Annual', baseAmount: 999, extras: [] },
  { code: 'EMPLOYER_ANNUAL_1499', name: 'MZOBS Employer Annual Plus', baseAmount: 1499, extras: ['Enhanced candidate CVs'], popular: true },
  { code: 'EMPLOYER_ANNUAL_2199', name: 'MZOBS Employer Annual Pro', baseAmount: 2199, extras: ['Enhanced candidate CVs'] },
]

export const gstAmount = (base) => Math.round(base * (GST_RATE_PERCENT / 100) * 100) / 100
export const totalAmount = (base) => base + gstAmount(base)

export function fmtINR(n) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}
