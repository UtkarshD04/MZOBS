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
