// Professional summary for the candidate card, built only from data the search
// response already carries (parsed profile fields + the CV's own words). No
// network or AI call; results are cached per candidate. Contact details and
// links are scrubbed so nothing protected behind the unlock flow can leak.

const HEADING = /^\s*(?:professional\s+summary|career\s+summary|executive\s+summary|profile\s+summary|summary|objective|career\s+objective|profile|about\s+me|about)\s*[:\-–]?\s*$/i
const OTHER_HEADING = /^\s*(?:experience|work\s+experience|employment|education|skills|technical\s+skills|projects|certifications?|achievements|languages|interests|references|declaration|personal\s+(?:details|information))\s*[:\-–]?\s*$/i

const MAX_NARRATIVE = 420
const cache = new Map()

export function scrub(text) {
  return String(text ?? '')
    .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '')
    .replace(/(?:https?:\/\/|www\.)\S+/gi, '')
    .replace(/\b(?:linkedin|github)\.com\S*/gi, '')
    .replace(/(?:\+?\d[\d\s().-]{8,}\d)/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, '')}…`)
const sentenceCase = (s) => s.replace(/\s+/g, ' ').trim()

/** The candidate's own "Summary / Objective" paragraph, when the CV has one. */
function narrativeFromResume(resumeText) {
  if (!resumeText) return ''
  const lines = String(resumeText).split(/\r?\n/)
  const at = lines.findIndex((l) => HEADING.test(l))
  if (at < 0) return ''
  const body = []
  for (const line of lines.slice(at + 1, at + 14)) {
    if (OTHER_HEADING.test(line)) break
    const clean = scrub(line.replace(/^[\s•\-–*▪●]+/, ''))
    if (clean) body.push(clean)
  }
  const text = sentenceCase(body.join(' '))
  return text.length >= 60 ? clip(text, MAX_NARRATIVE) : ''
}

function norm(s) {
  return String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

/** A profile headline repeats the designation; only keep text that says more. */
function isDistinctProse(text, c) {
  const t = norm(text)
  return t.length >= 60 && t !== norm(c.designation)
}

function composeFromProfile(c, strong) {
  const parts = []
  const exp = c.experienceYears
  const hist = (c.workHistory ?? []).filter((w) => w.role || w.company)
  const path = []
  const seen = new Set()
  for (const w of hist) {
    const label = [w.role, w.company].filter(Boolean).join(' at ')
    if (label && !seen.has(label.toLowerCase())) { seen.add(label.toLowerCase()); path.push(label) }
    if (path.length === 3) break
  }
  if (path.length > 1) {
    parts.push(`${exp ? `${exp % 1 === 0 ? exp : exp.toFixed(1)} years of experience across ` : 'Experience across '}${path.slice(0, 3).join(', ')}.`)
  } else if (exp > 0 && (c.skills ?? []).length) {
    parts.push(`${exp % 1 === 0 ? exp : exp.toFixed(1)} years of hands-on experience${path[0] && !c.currentCompany ? `, most recently ${path[0]}` : ''}.`)
  }

  const project = (c.projects ?? []).find((p) => p.name && p.description) ?? (c.projects ?? []).find((p) => p.name)
  if (project) {
    const tech = (project.tech ?? []).slice(0, 3).join(', ')
    const desc = project.description ? `: ${clip(sentenceCase(scrub(project.description)), 110)}` : ''
    parts.push(`Built ${project.name}${desc}${tech ? ` (${tech})` : ''}${/[.…]$/.test(desc) ? '' : '.'}`)
  }

  const edu = c.education?.[0]
  if (edu?.degree) parts.push(`${edu.degree}${edu.institute ? `, ${edu.institute}` : ''}.`)

  if (strong.length) parts.push(`Relevant to your search: ${strong.slice(0, 4).join(', ')}.`)
  return parts.join(' ')
}

/**
 * @returns {{ text: string } | null} null when there is nothing honest to say.
 */
export function buildSummary(c, match) {
  const strong = match?.strong ?? []
  const key = `${c.id}|${strong.join(',')}`
  if (cache.has(key)) return cache.get(key)

  let text = narrativeFromResume(c.resumeText)
  if (!text && isDistinctProse(c.summary, c)) text = clip(sentenceCase(scrub(c.summary)), MAX_NARRATIVE)
  if (text && strong.length && !strong.some((s) => text.toLowerCase().includes(s.toLowerCase()))) {
    text += ` Relevant to your search: ${strong.slice(0, 3).join(', ')}.`
  }
  if (!text) text = composeFromProfile(c, strong)

  const result = text.trim() ? { text: text.trim() } : null
  if (cache.size > 2000) cache.clear()
  cache.set(key, result)
  return result
}
