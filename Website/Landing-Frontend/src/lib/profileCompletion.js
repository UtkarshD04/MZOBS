// Same checklist the mobile app and the old dashboard used — every check runs
// against the real saved profile, so the percentage only rises when a
// genuine detail is added.
export const COMPLETION_CHECKS = [
  { key: 'resumeHeadline', label: 'Add a resume headline', section: 'headline', test: (p) => !!String(p.resumeHeadline ?? '').trim() },
  { key: 'skills', label: 'Add your skills', section: 'skills', test: (p) => (p.skills ?? []).length > 0 },
  { key: 'education', label: 'Add your education', section: 'education', test: (p) => (p.education ?? []).some((e) => !!String(e?.degree ?? '').trim()) },
  { key: 'location', label: 'Add your city, state and pincode', section: 'personal', test: (p) => !!(p.currentCity && p.state && p.pincode) },
  { key: 'personal', label: 'Add your date of birth and gender', section: 'personal', test: (p) => !!(p.dob && p.gender) },
  { key: 'resume', label: 'Add resume', section: 'resume', test: (p) => !!p.resume && p.resume.status !== 'none' },
  { key: 'links', label: 'Add a portfolio or LinkedIn link', section: 'links', test: (p) => !!(p.portfolioLink || p.linkedin) },
  { key: 'preferredRole', label: 'Set a preferred role', section: 'career', test: (p) => !!String(p.preferredRole ?? '').trim() },
  { key: 'preferredLocations', label: 'Add preferred locations', section: 'career', test: (p) => (p.preferredLocations ?? []).length > 0 },
]

export function profileCompletion(profile) {
  if (!profile) return { percent: 0, missing: [] }
  const missing = COMPLETION_CHECKS.filter((c) => !c.test(profile))
  const percent = Math.round(((COMPLETION_CHECKS.length - missing.length) / COMPLETION_CHECKS.length) * 100)
  return { percent, missing }
}
