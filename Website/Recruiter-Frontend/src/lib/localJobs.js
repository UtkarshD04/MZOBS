// Demo-mode job store (localStorage). Live mode never touches this — jobs come
// from the employer API. Records mirror the API's Job shape so the same
// mapping (talentService.mapApiJob) and screens work for both.
const KEY = 'mzt-demo-jobs'

export function readLocalJobs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function writeLocalJobs(jobs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(jobs))
  } catch {
    /* storage unavailable — jobs live for this session only */
  }
}
