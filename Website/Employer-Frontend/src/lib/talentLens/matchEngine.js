// Match Intelligence — turns a SearchCriteria into a ranked list of
// CandidateMatch. Deliberately rule-based and fully deterministic (not a real
// model call): every number and sentence here is derived from a visible
// comparison the recruiter can double check, which is the whole point of
// "Why this match?" — see types.js for the shapes.
//
// Only dimensions the recruiter actually specified are scored — a criteria
// with no location requirement doesn't silently drag every candidate's
// overall score down for "not matching" a location nobody asked for.

const WEIGHTS = { skillMatch: 0.35, experienceMatch: 0.2, locationMatch: 0.2, availabilityMatch: 0.15, industryMatch: 0.1 }

function norm(s) {
  return (s ?? '').toString().trim().toLowerCase()
}

function skillMatch(candidate, criteria) {
  if (!criteria.skills?.length) return null
  const have = new Set(candidate.skills.map(norm))
  const matched = criteria.skills.filter((s) => have.has(norm(s)))
  return { value: Math.round((matched.length / criteria.skills.length) * 100), matched, missing: criteria.skills.filter((s) => !have.has(norm(s))) }
}

function experienceMatch(candidate, criteria) {
  if (criteria.experienceMin == null && criteria.experienceMax == null) return null
  const min = criteria.experienceMin ?? 0
  const max = criteria.experienceMax ?? min + 100
  const yrs = candidate.experienceYears
  if (yrs >= min && yrs <= max) return { value: 100, short: 0 }
  const distance = yrs < min ? min - yrs : yrs - max
  return { value: Math.max(35, Math.round(100 - distance * 18)), short: yrs < min ? Math.round((min - yrs) * 10) / 10 : -Math.round((yrs - max) * 10) / 10 }
}

function locationMatch(candidate, criteria) {
  if (!criteria.location) return null
  const want = norm(criteria.location)
  if (want === 'remote') return { value: candidate.workMode === 'Remote' || candidate.preferredLocations.some((l) => norm(l) === 'remote') ? 100 : 55 }
  if (norm(candidate.location) === want) return { value: 100 }
  if (candidate.preferredLocations.some((l) => norm(l) === want)) return { value: 85 }
  return { value: 45 }
}

function availabilityMatch(candidate, criteria) {
  if (criteria.availabilityDays == null) return null
  const over = candidate.noticePeriodDays - criteria.availabilityDays
  if (over <= 0) return { value: 100, overBy: 0 }
  return { value: Math.max(35, Math.round(100 - over * 1.8)), overBy: over }
}

function industryMatch(candidate, criteria) {
  if (!criteria.industry) return null
  return { value: norm(candidate.industry) === norm(criteria.industry) ? 100 : 58 }
}

function weightedOverall(parts) {
  const active = Object.entries(parts).filter(([, v]) => v != null)
  if (!active.length) return 100
  const totalWeight = active.reduce((s, [k]) => s + WEIGHTS[k], 0)
  const sum = active.reduce((s, [k, v]) => s + WEIGHTS[k] * v.value, 0)
  return Math.round(sum / totalWeight)
}

function buildExplanation(candidate, parts, strengths, gaps) {
  const lead = strengths.length
    ? `${candidate.name.split(' ')[0]} closely matches on ${strengths.slice(0, 2).join(' and ')}`
    : `${candidate.name.split(' ')[0]}'s profile was compared against your requirement`
  const exp = `, with ${candidate.experienceYears} years as a ${candidate.designation.toLowerCase()} based in ${candidate.location}.`
  const gapText = gaps.length ? ` The main difference is ${gaps[0].toLowerCase()}.` : ' No significant gaps against what you asked for.'
  return lead + exp + gapText
}

/**
 * @param {import('./types').Candidate} candidate
 * @param {import('./types').SearchCriteria} criteria
 * @returns {import('./types').CandidateMatch}
 */
export function computeMatch(candidate, criteria) {
  const skill = skillMatch(candidate, criteria)
  const experience = experienceMatch(candidate, criteria)
  const location = locationMatch(candidate, criteria)
  const availability = availabilityMatch(candidate, criteria)
  const industry = industryMatch(candidate, criteria)

  const parts = { skillMatch: skill, experienceMatch: experience, locationMatch: location, availabilityMatch: availability, industryMatch: industry }
  const overallMatch = weightedOverall(parts)

  const strengths = []
  const gaps = []

  if (skill) {
    strengths.push(...skill.matched)
    if (skill.missing.length) gaps.push(`No listed experience with ${skill.missing.join(', ')}`)
  }
  if (experience) {
    if (experience.value >= 85) strengths.push('Experience range')
    else if (experience.short > 0) gaps.push(`${experience.short} years short of your experience range`)
    else if (experience.short < 0) gaps.push(`${Math.abs(experience.short)} years above your experience range`)
  }
  if (location) {
    if (location.value >= 85) strengths.push('Preferred location')
    else gaps.push(`Not currently based in or open to ${criteria.location}`)
  }
  if (availability) {
    if (availability.value === 100) strengths.push('Available within your timeframe')
    else gaps.push(`Notice period is ${candidate.noticePeriodDays} days`)
  }
  if (industry) {
    if (industry.value === 100) strengths.push(`${candidate.industry} experience`)
    else gaps.push(`Limited ${criteria.industry} experience`)
  }

  return {
    candidateId: candidate.id,
    overallMatch,
    skillMatch: skill?.value ?? 100,
    experienceMatch: experience?.value ?? 100,
    locationMatch: location?.value ?? 100,
    availabilityMatch: availability?.value ?? 100,
    industryMatch: industry?.value ?? 100,
    strengths,
    gaps,
    explanation: buildExplanation(candidate, parts, strengths, gaps),
  }
}

function textIncludesAny(haystack, needles) {
  const h = norm(haystack)
  return needles.some((n) => h.includes(norm(n)))
}

/**
 * @param {import('./types').Candidate[]} pool
 * @param {import('./types').SearchCriteria} criteria
 * @returns {{candidate: import('./types').Candidate, match: import('./types').CandidateMatch}[]}
 */
export function rankCandidates(pool, criteria) {
  let filtered = pool

  if (criteria.excludeKeywords?.length) {
    filtered = filtered.filter((c) => {
      const text = `${c.designation} ${c.skills.join(' ')} ${c.employmentType}`
      return !textIncludesAny(text, criteria.excludeKeywords)
    })
  }
  if (criteria.includeKeywords?.length) {
    filtered = filtered.filter((c) => {
      const text = `${c.name} ${c.designation} ${c.skills.join(' ')} ${c.currentCompany}`
      return criteria.includeKeywords.every((kw) => norm(text).includes(norm(kw)))
    })
  }
  // Visual query builder output — AND across groups, OR within a group, e.g.
  // [["Python"], ["FastAPI","Django"], ["AWS"]] reads as
  // Python AND (FastAPI OR Django) AND AWS. See AdvancedSearchDrawer.jsx.
  if (criteria.skillGroups?.length) {
    const have = (c) => new Set(c.skills.map(norm))
    filtered = filtered.filter((c) => {
      const skills = have(c)
      return criteria.skillGroups.every((group) => group.some((s) => skills.has(norm(s))))
    })
  }
  if (criteria.designation) filtered = filtered.filter((c) => textIncludesAny(c.designation, [criteria.designation]))
  if (criteria.currentCompany) filtered = filtered.filter((c) => norm(c.currentCompany) === norm(criteria.currentCompany))
  if (criteria.employmentType) filtered = filtered.filter((c) => c.employmentType === criteria.employmentType)
  if (criteria.companyType) filtered = filtered.filter((c) => c.companyType === criteria.companyType)
  if (criteria.workMode) filtered = filtered.filter((c) => c.workMode === criteria.workMode)
  if (criteria.salaryMaxLPA) filtered = filtered.filter((c) => c.expectedSalaryLPA <= criteria.salaryMaxLPA)
  if (criteria.verificationStatus === 'verified') {
    filtered = filtered.filter((c) => c.verification.resumeSubmitted && c.verification.phoneVerified && c.verification.emailVerified)
  }
  if (criteria.profileActivity === 'active') filtered = filtered.filter((c) => c.lastActiveDaysAgo <= 14)

  return filtered
    .map((candidate) => ({ candidate, match: computeMatch(candidate, criteria) }))
    .sort((a, b) => b.match.overallMatch - a.match.overallMatch)
}

export function matchLevel(overallMatch) {
  if (overallMatch >= 85) return { label: 'Strong match', tone: 'green' }
  if (overallMatch >= 65) return { label: 'Good match', tone: 'navy' }
  return { label: 'Relevant match', tone: 'gray' }
}
