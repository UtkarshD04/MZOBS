export const COMPLETION_CHECKS = [
  { key: 'resumeHeadline', label: 'Add a resume headline', section: 'resume-headline', test: (p) => !!p.resumeHeadline },
  { key: 'skills', label: 'Add your skills', section: 'skills', test: (p) => (p.skills ?? []).length > 0 },
  { key: 'education', label: 'Add your education', section: 'education', test: (p) => (p.education ?? []).length > 0 },
  { key: 'currentCity', label: 'Add your location', section: 'personal', test: (p) => !!p.currentCity },
  { key: 'resume', label: 'Add resume', section: 'resume', test: (p) => p.resume?.status !== 'none' },
  { key: 'phone', label: 'Verify mobile number', section: 'personal', test: (p) => !!p.phoneVerified },
  { key: 'links', label: 'Add a portfolio or LinkedIn link', section: 'portfolio', test: (p) => !!(p.portfolioLink || p.linkedin) },
  { key: 'preferredRole', label: 'Set a preferred role', section: 'career', test: (p) => !!p.preferredRole },
  { key: 'preferredLocations', label: 'Add preferred locations', section: 'career', test: (p) => (p.preferredLocations ?? []).length > 0 },
]

export function profileCompletion(profile) {
  if (!profile) return { percent: 0, missing: [] }
  const missing = COMPLETION_CHECKS.filter((c) => !c.test(profile))
  const percent = Math.round(((COMPLETION_CHECKS.length - missing.length) / COMPLETION_CHECKS.length) * 100)
  return { percent, missing }
}
