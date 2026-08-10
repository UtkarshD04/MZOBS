import { mockResolve } from '../lib/api'
import { ACTIVITY, DASHBOARD_STATS, DEPARTMENT_SPLIT, FUNNEL, HIRING_TREND, INTERVIEWS } from '../data/mock'

export function getDashboard() {
  const upcoming = [...INTERVIEWS]
    .filter((i) => i.status === 'Confirmed' || i.status === 'Awaiting confirmation')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 4)

  return mockResolve({
    stats: DASHBOARD_STATS,
    funnel: FUNNEL,
    trend: HIRING_TREND,
    departments: DEPARTMENT_SPLIT,
    activity: ACTIVITY,
    upcomingInterviews: upcoming,
  })
}
