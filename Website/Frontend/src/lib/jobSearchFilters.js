// Powers the hero search bar on the marketing site (Website/Landing-Frontend's
// JobSearchHero + QuickDiscoveryStrip) — those build a `?q=&location=&experience=`
// URL via buildJobsUrl() and land here, on /app/jobs. Filtering is done
// client-side over the already-fetched `jobs` list, same approach this page
// already uses for its `category` param (see trackKeysForCategoryTitle).

const EXPERIENCE_LABELS = {
  '0-1': 'Fresher',
  '1-3': '1–3 years',
  '3-5': '3–5 years',
  '5-10': '5–10 years',
  '10+': '10+ years',
}

export function experienceLabel(value) {
  return EXPERIENCE_LABELS[value] || value
}

function parseExperienceRange(value) {
  if (value === '10+') return { min: 10, max: Infinity }
  const match = /^(\d+)-(\d+)$/.exec(value)
  if (!match) return null
  return { min: Number(match[1]), max: Number(match[2]) }
}

export function matchesJobSearch(job, { q, location, experience } = {}) {
  if (q?.trim()) {
    const needle = q.trim().toLowerCase()
    const haystack = [job.title, job.company, ...(job.skills ?? [])].join(' ').toLowerCase()
    if (!haystack.includes(needle)) return false
  }

  if (location?.trim()) {
    const needle = location.trim().toLowerCase()
    // "Remote"/"Hybrid"/"On-site" come in through this same param (see
    // CATEGORY_DATA's Remote Jobs card and QuickDiscoveryStrip) even though
    // they describe workMode, not the location string — match either field.
    const locationMatch = (job.location ?? '').toLowerCase().includes(needle)
    const workModeMatch = (job.workMode ?? '').toLowerCase() === needle
    if (!locationMatch && !workModeMatch) return false
  }

  if (experience) {
    const range = parseExperienceRange(experience)
    if (range) {
      const jobMin = job.experienceMin ?? 0
      const jobMax = job.experienceMax ?? jobMin
      if (jobMax < range.min || (Number.isFinite(range.max) && jobMin > range.max)) return false
    }
  }

  return true
}
