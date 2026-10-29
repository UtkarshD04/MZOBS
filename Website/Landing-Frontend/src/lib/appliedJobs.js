import { useEffect, useState } from 'react'
import { fetchApplications } from './employeeApi'
import { getEmployeeSession, onEmployeeSessionChange } from './employeeSession'

// Ids of the jobs the signed-in candidate has already applied to, so a job's
// Apply button can say so up front instead of failing with a 409 afterwards.
// Loaded once per session and shared by every card on the page.
const PAGE = 200
let applied = new Set()
let loaded = false
let loading = null
const listeners = new Set()

function publish(next) {
  applied = next
  listeners.forEach((fn) => fn(next))
}

async function load() {
  if (loaded || loading) return loading
  loading = (async () => {
    const ids = new Set()
    let page = 1
    for (;;) {
      const { applications, total } = await fetchApplications(null, { page, limit: PAGE })
      applications.forEach((a) => a.job?.id && ids.add(a.job.id))
      if (page * PAGE >= total || !applications.length) break
      page += 1
    }
    loaded = true
    publish(ids)
  })()
    .catch(() => {})
    .finally(() => {
      loading = null
    })
  return loading
}

function reset() {
  loaded = false
  if (applied.size) publish(new Set())
}

export function markJobApplied(jobId) {
  if (jobId && !applied.has(jobId)) publish(new Set(applied).add(jobId))
}

export function useAppliedJobIds() {
  const [ids, setIds] = useState(applied)
  useEffect(() => {
    listeners.add(setIds)
    const sync = () => {
      if (getEmployeeSession()) load()
      else reset()
    }
    sync()
    const off = onEmployeeSessionChange(sync)
    return () => {
      listeners.delete(setIds)
      off()
    }
  }, [])
  return ids
}
