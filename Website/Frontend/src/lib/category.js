export const CATEGORIES = {
  analytics: { label: 'Analytics & Data', tone: 'navy' },
  design: { label: 'Design & Creative', tone: 'violet' },
  sales: { label: 'Sales & BD', tone: 'amber' },
  marketing: { label: 'Marketing', tone: 'teal' },
  hr: { label: 'HR & Recruitment', tone: 'green' },
  support: { label: 'Customer Success', tone: 'gray' },
  tech: { label: 'Engineering', tone: 'navy' },
  ops: { label: 'Operations', tone: 'gray' },
}

export function categoryOf(key) {
  return CATEGORIES[key] || CATEGORIES.support
}

// Maps the "Find Your Team" category cards on the marketing site to the real
// job.track values above. Categories with no corresponding track (finance,
// IT as distinct from engineering) intentionally map to an empty list —
// they show the "no openings" state instead of borrowing unrelated jobs.
const BROWSE_CATEGORY_TRACKS = {
  'Sales & Distribution': ['sales'],
  'Engineering & Technology': ['tech'],
  'IT & Systems': ['tech'],
  'HR & Training': ['hr'],
  'Finance & Accounting': [],
  Operations: ['ops'],
}

export function trackKeysForCategoryTitle(title) {
  return BROWSE_CATEGORY_TRACKS[title] ?? []
}
