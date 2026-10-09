// Builds the "add campus" college picker data (src/data/colleges/*.json) from
// the AICTE-approved college list in data/aicte-colleges-2025-26.md.
//
//   node scripts/buildColleges.js
//
// Output: one JSON file per state — an array of [name, typeIndex], where
// typeIndex points into COLLEGE_TYPES (same order as the form's
// INSTITUTION_TYPES in pages/CampusApply.jsx). The source only has state +
// name, so the type is inferred from the name (see collegeType below) — it's
// a best guess for filtering the list, not official data.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(root, 'data', 'aicte-colleges-2025-26.md')
const OUT_DIR = join(root, 'src', 'data', 'colleges')

export const COLLEGE_TYPES = ['University', 'Engineering College', 'Degree College', 'Management Institute', 'Polytechnic', 'Other']

// Source headings → the state names the form uses.
const STATE_NAMES = {
  'Andaman & Nicobar Islands': 'Andaman and Nicobar Islands',
  'Dadra & Nagar Haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'Daman & Diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'Jammu & Kashmir': 'Jammu and Kashmir',
}

export const stateSlug = (state) => state.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')

// First match wins; checked in this order so e.g. "Polytechnic" beats the
// "Technology" in "Institute Of Technology", and an explicit "Engineering"
// beats "Management" in "College Of Engineering And Management".
const RULES = [
  ['Polytechnic', /polyte|diploma/i],
  ['University', /universit|vishwavidyala|vishvavidyala|vidyapeeth|vidyapith|deemed/i],
  ['Engineering College', /engg|engineer|enginnering|enginering/i],
  ['Management Institute', /management|managment|manegment|business|b[- ]?school|\bmba\b|\bpgdm\b|\bbba\b/i],
  ['Engineering College', /technolog|technical|techonolog|institute of tech|\biit\b|\bnit\b/i],
  ['Other', /pharma/i],
  ['Degree College', /degree|arts|science|commerce|mahavidyala|mahavidhyala|first grade|kalasala|\bp\.?g\.?\b|coll?e?ge/i],
]

export function collegeType(name) {
  return RULES.find(([, re]) => re.test(name))?.[0] ?? 'Other'
}

// The source has some double-encoded characters (a mangled apostrophe and
// "²", with invisible C1 control characters inside) and stray quotes.
export function cleanName(raw) {
  return raw
    .replace(/ã¢Â\u0082¬Â\u0084¢/g, "'")
    .replace(/ã\u0082Â²/g, '²')
    .replace(/^["']+|["']+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function build() {
  const byState = new Map()
  let state = null
  for (const line of readFileSync(SOURCE, 'utf8').split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*\(\d+\)\s*$/)
    if (heading) {
      state = STATE_NAMES[heading[1]] ?? heading[1]
      if (!byState.has(state)) byState.set(state, new Map())
      continue
    }
    const item = state && line.match(/^\d+\.\s+(.+)$/)
    if (!item) continue
    const name = cleanName(item[1])
    if (name) byState.get(state).set(name.toLowerCase(), name)
  }

  rmSync(OUT_DIR, { recursive: true, force: true })
  mkdirSync(OUT_DIR, { recursive: true })
  const summary = {}
  let total = 0
  for (const [st, names] of byState) {
    const rows = [...names.values()].sort((a, b) => a.localeCompare(b)).map((n) => [n, COLLEGE_TYPES.indexOf(collegeType(n))])
    writeFileSync(join(OUT_DIR, `${stateSlug(st)}.json`), JSON.stringify(rows))
    summary[st] = rows.length
    total += rows.length
  }
  return { summary, total }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { summary, total } = build()
  console.log(`${total} colleges in ${Object.keys(summary).length} states/UTs → src/data/colleges/`)
}
