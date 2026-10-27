// nav: 'primary' shows in the top bar, 'more' in the More menu, undefined = not in nav.
// perm: any one of these permissions shows the item (the API enforces the same rules; this only hides dead ends).
// match: extra paths that count as "inside" this item, so e.g. a job's applicant pipeline highlights Applicants, not Jobs.
export const ROUTES = [
  { path: '/talent-pool', label: 'Talent Pool', nav: 'primary', perm: ['candidates.view'] },
  { path: '/overview', label: 'Overview', nav: 'primary' },
  { path: '/jobs', label: 'Jobs', nav: 'primary', perm: ['jobs.manage', 'candidates.view'], exclude: /^\/jobs\/[^/]+\/applicants/ },
  { path: '/applicants', label: 'Applicants', nav: 'primary', perm: ['candidates.view', 'candidates.viewAssigned'], match: /^\/jobs\/[^/]+\/applicants/ },
  { path: '/search', label: 'Talent Search', nav: 'primary', perm: ['candidates.view'] },
  { path: '/interviews', label: 'Interviews', nav: 'primary', perm: ['candidates.view', 'candidates.viewAssigned'] },
  { path: '/offers', label: 'Offers', nav: 'primary', perm: ['offers.manage', 'candidates.view'] },
  { path: '/messages', label: 'Messages', nav: 'primary', perm: ['candidates.view'] },
  { path: '/reports', label: 'Reports', nav: 'primary', perm: ['candidates.view', 'exports.run'] },
  { path: '/saved-searches', label: 'Saved Searches', nav: 'more', perm: ['candidates.view'] },
  { path: '/shortlists', label: 'Shortlists / Talent Pools', nav: 'more', perm: ['candidates.view'] },
  { path: '/unlocked', label: 'Unlocked CVs', nav: 'more', perm: ['candidates.view'] },
  { path: '/feedback', label: 'Feedback follow-ups', nav: 'more', perm: ['candidates.view'] },
  { path: '/ai-talent', label: 'AI Talent', nav: 'more', perm: ['candidates.view'] },
  { path: '/credits', label: 'CV Credits & Billing', nav: 'more', perm: ['billing.view'] },
  { path: '/team', label: 'Team & Permissions', nav: 'more', perm: ['team.manage', 'audit.view'] },
  { path: '/settings', label: 'Settings', nav: 'more' },
  { path: '/help', label: 'Help & Support', nav: 'more' },
]

export const isRouteActive = (route, pathname) => {
  if (route.exclude?.test(pathname)) return false
  if (route.match?.test(pathname)) return true
  return route.end ? pathname === route.path : pathname === route.path || pathname.startsWith(`${route.path}/`)
}
