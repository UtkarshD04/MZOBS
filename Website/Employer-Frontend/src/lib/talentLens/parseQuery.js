// Natural-language → SearchCriteria. This is a lightweight, fully
// deterministic keyword/regex parser standing in for a real NLP/AI service —
// there's no LLM wired into this app yet. It's isolated behind this one
// function on purpose: swap the body for a real API call later
// (`POST /talent-lens/parse-query`) and every caller (TalentLens.jsx) keeps
// working unchanged, since they only depend on the returned SearchCriteria
// shape (see types.js), not on how it was produced.

import { KNOWN_SKILLS, KNOWN_LOCATIONS, KNOWN_DESIGNATIONS, KNOWN_INDUSTRIES } from './mockCandidates'

function findAll(text, list) {
  const lower = text.toLowerCase()
  return list.filter((item) => lower.includes(item.toLowerCase()))
}

/**
 * @param {string} text
 * @returns {import('./types').SearchCriteria}
 */
export function parseNaturalLanguageQuery(text) {
  const criteria = { includeKeywords: [], excludeKeywords: [], skills: [], rawQuery: text }
  if (!text?.trim()) return criteria

  // Experience: "2-4 years", "2 to 4 years", "3+ years"
  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)\s*years?/i)
  const plusMatch = text.match(/(\d+(?:\.\d+)?)\s*\+\s*years?/i)
  if (rangeMatch) {
    criteria.experienceMin = Number(rangeMatch[1])
    criteria.experienceMax = Number(rangeMatch[2])
  } else if (plusMatch) {
    criteria.experienceMin = Number(plusMatch[1])
    criteria.experienceMax = Number(plusMatch[1]) + 6
  }

  // Availability: "within 30 days", "immediately", "immediate joiner"
  const withinMatch = text.match(/within\s+(\d+)\s*days?/i)
  if (withinMatch) criteria.availabilityDays = Number(withinMatch[1])
  else if (/immediate(ly)?\s*(joiner)?/i.test(text)) criteria.availabilityDays = 0

  // Skills — matched against the vocabulary already present in the talent pool
  criteria.skills = findAll(text, KNOWN_SKILLS)

  // Location — matched against known cities, plus a literal "remote" check
  const locations = findAll(text, KNOWN_LOCATIONS)
  if (locations.length) criteria.location = locations[0]
  else if (/\bremote\b/i.test(text)) criteria.location = 'Remote'

  // Role — longest matching known title wins. Shown back as a chip, but
  // deliberately NOT set as a hard `designation` filter (that field is for
  // Advanced Search's explicit dropdown) — a free-text "Python developer"
  // should still surface a great-fit Backend Developer, not exclude them.
  const designations = findAll(text, KNOWN_DESIGNATIONS).sort((a, b) => b.length - a.length)
  if (designations.length) criteria.roleKeyword = designations[0]

  // Industry
  const industries = findAll(text, KNOWN_INDUSTRIES)
  if (industries.length) criteria.industry = industries[0]

  return criteria
}

/** Turns a SearchCriteria back into the editable chip list the UI shows. */
export function criteriaToChips(criteria) {
  const chips = []
  if (criteria.roleKeyword) chips.push({ key: 'role', label: criteria.roleKeyword })
  if (criteria.experienceMin != null) chips.push({ key: 'experience', label: `${criteria.experienceMin}–${criteria.experienceMax} years` })
  criteria.skills?.forEach((s) => chips.push({ key: `skill:${s}`, label: s }))
  if (criteria.location) chips.push({ key: 'location', label: criteria.location })
  if (criteria.availabilityDays != null) chips.push({ key: 'availability', label: criteria.availabilityDays === 0 ? 'Immediately available' : `≤${criteria.availabilityDays} days` })
  if (criteria.industry) chips.push({ key: 'industry', label: criteria.industry })
  criteria.includeKeywords?.forEach((k) => chips.push({ key: `include:${k}`, label: `+${k}` }))
  criteria.excludeKeywords?.forEach((k) => chips.push({ key: `exclude:${k}`, label: `−${k}` }))
  return chips
}

/** Removes whatever criteria field produced the given chip key. */
export function removeChip(criteria, key) {
  const next = { ...criteria }
  if (key === 'role') {
    delete next.roleKeyword
    delete next.designation
  } else if (key === 'experience') {
    delete next.experienceMin
    delete next.experienceMax
  } else if (key === 'location') delete next.location
  else if (key === 'availability') delete next.availabilityDays
  else if (key === 'industry') delete next.industry
  else if (key.startsWith('skill:')) next.skills = (next.skills ?? []).filter((s) => s !== key.slice(6))
  else if (key.startsWith('include:')) next.includeKeywords = (next.includeKeywords ?? []).filter((k) => k !== key.slice(8))
  else if (key.startsWith('exclude:')) next.excludeKeywords = (next.excludeKeywords ?? []).filter((k) => k !== key.slice(8))
  return next
}
