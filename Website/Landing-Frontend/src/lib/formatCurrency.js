// Mirrors Backend's formatINR (publicJobsController.js's toLatestJobSummary)
// exactly — kept as a small standalone helper here since the hot-cities
// endpoint returns raw salaryMin/salaryMax numbers (not a pre-formatted
// string like the regular job list does), so this page needs its own copy.
export function formatINRShort(n) {
  if (n == null) return ''
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr'
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L'
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return '₹' + n
}

export function formatSalaryRange(min, max) {
  if (!min || !max) return ''
  return `${formatINRShort(min)} – ${formatINRShort(max)}`
}
