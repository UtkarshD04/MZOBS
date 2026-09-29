// Mirrors Backend/src/config/env.js (EMPLOYER_ANNUAL_PLAN_AMOUNT_PAISE,
// GST_RATE_PERCENT) — this marketing site has no authenticated pricing
// endpoint to call, so these numbers are kept in sync by hand. Update both
// places together if the plan price ever changes. Shared by EmployerPricing
// and the pricing teaser on the main /employers page so they never drift.
export const PLAN = {
  name: 'MZOBS Employer Annual',
  baseAmount: 999,
  gstRatePercent: 18,
}

export const gstAmount = Math.round(PLAN.baseAmount * (PLAN.gstRatePercent / 100) * 100) / 100
export const totalAmount = PLAN.baseAmount + gstAmount

export function fmtINR(n) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}
