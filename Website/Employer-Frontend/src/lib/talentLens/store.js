// Talent Pools / Saved Searches / Talent Radar / recruiter notes — there's no
// backend for these yet, so they're persisted to localStorage per browser as
// a working placeholder (per-recruiter, this device only — not shared with
// the hiring team). Every hook below returns the same {data, create, update,
// remove} shape a real `useMutation`-backed version would, so swapping in
// real endpoints later only touches this one file.

import { useCallback, useEffect, useState } from 'react'
import { TALENT_POOL } from './mockCandidates'
import { computeMatch } from './matchEngine'

const KEYS = {
  pools: 'mzobs-talent-lens-pools',
  searches: 'mzobs-talent-lens-saved-searches',
  radar: 'mzobs-talent-lens-radar',
  notes: 'mzobs-talent-lens-notes',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private browsing / storage disabled — state just won't persist across reloads.
  }
}

function seedPools() {
  const starter = TALENT_POOL.filter((c) => c.skills.includes('React')).slice(0, 2).map((c) => c.id)
  const joiners = TALENT_POOL.filter((c) => c.noticePeriodDays <= 20).slice(0, 3).map((c) => c.id)
  return [
    { id: 'pool-react', name: 'Top React Developers', emoji: '⭐', candidateIds: starter, notes: {}, createdAt: new Date().toISOString() },
    { id: 'pool-immediate', name: 'Immediate Joiners', emoji: '⚡', candidateIds: joiners, notes: {}, createdAt: new Date().toISOString() },
    { id: 'pool-future', name: 'Future Hiring', emoji: '🎯', candidateIds: [], notes: {}, createdAt: new Date().toISOString() },
    { id: 'pool-sales', name: 'Sales Leadership', emoji: '💼', candidateIds: [], notes: {}, createdAt: new Date().toISOString() },
    { id: 'pool-campus', name: 'Campus Talent', emoji: '🌱', candidateIds: [], notes: {}, createdAt: new Date().toISOString() },
  ]
}

function seedRadar() {
  const criteria = { designation: 'React Developer', skills: ['React'], experienceMin: 3, experienceMax: 5, location: 'Bengaluru', availabilityDays: 21 }
  const candidate = TALENT_POOL.find((c) => c.id === 'tl-4') // Priya Raghavan — Senior React Developer, Bengaluru
  const match = candidate ? computeMatch(candidate, criteria) : null
  return [
    {
      id: 'radar-react-blr',
      title: 'Senior React Developer · 3–5 years · Bengaluru',
      criteria,
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      notifications: match
        ? [{ candidateId: candidate.id, overallMatch: match.overallMatch, availabilityDays: candidate.noticePeriodDays, matchedAt: new Date(Date.now() - 2 * 86400000).toISOString() }]
        : [],
    },
  ]
}

function useLocalCollection(key, seed) {
  const [data, setData] = useState(() => read(key, null) ?? (typeof seed === 'function' ? seed() : seed))

  useEffect(() => {
    if (read(key, null) === null) write(key, data)
  }, [key, data])

  const persist = useCallback(
    (updater) => {
      setData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        write(key, next)
        return next
      })
    },
    [key]
  )

  return [data, persist]
}

export function useTalentPools() {
  const [pools, setPools] = useLocalCollection(KEYS.pools, seedPools)

  const createPool = useCallback((name, emoji = '📁') => setPools((prev) => [...prev, { id: `pool-${Date.now()}`, name, emoji, candidateIds: [], notes: {}, createdAt: new Date().toISOString() }]), [setPools])
  const removePool = useCallback((id) => setPools((prev) => prev.filter((p) => p.id !== id)), [setPools])
  const toggleCandidate = useCallback(
    (poolId, candidateId) =>
      setPools((prev) =>
        prev.map((p) => (p.id === poolId ? { ...p, candidateIds: p.candidateIds.includes(candidateId) ? p.candidateIds.filter((id) => id !== candidateId) : [...p.candidateIds, candidateId] } : p))
      ),
    [setPools]
  )
  const moveCandidate = useCallback(
    (candidateId, fromPoolId, toPoolId) =>
      setPools((prev) =>
        prev.map((p) => {
          if (p.id === fromPoolId) return { ...p, candidateIds: p.candidateIds.filter((id) => id !== candidateId) }
          if (p.id === toPoolId) return { ...p, candidateIds: p.candidateIds.includes(candidateId) ? p.candidateIds : [...p.candidateIds, candidateId] }
          return p
        })
      ),
    [setPools]
  )
  const addNote = useCallback(
    (poolId, candidateId, text) =>
      setPools((prev) => prev.map((p) => (p.id === poolId ? { ...p, notes: { ...p.notes, [candidateId]: [...(p.notes[candidateId] ?? []), text] } } : p))),
    [setPools]
  )

  return { pools, createPool, removePool, toggleCandidate, moveCandidate, addNote }
}

export function useSavedSearches() {
  const [searches, setSearches] = useLocalCollection(KEYS.searches, [])
  const save = useCallback((name, criteria) => setSearches((prev) => [{ id: `search-${Date.now()}`, name, criteria, createdAt: new Date().toISOString() }, ...prev]), [setSearches])
  const remove = useCallback((id) => setSearches((prev) => prev.filter((s) => s.id !== id)), [setSearches])
  return { searches, save, remove }
}

export function useTalentRadar() {
  const [watches, setWatches] = useLocalCollection(KEYS.radar, seedRadar)
  const watch = useCallback(
    (title, criteria) =>
      setWatches((prev) => {
        // One-off match against the current pool at creation time — there's no
        // background job re-running this, so it's a preview of the mechanic
        // rather than a live feed (see the comment in TalentRadarPanel.jsx).
        const best = TALENT_POOL.map((c) => ({ c, m: computeMatch(c, criteria) }))
          .filter(({ m }) => m.overallMatch >= 70)
          .sort((a, b) => b.m.overallMatch - a.m.overallMatch)[0]
        const notifications = best ? [{ candidateId: best.c.id, overallMatch: best.m.overallMatch, availabilityDays: best.c.noticePeriodDays, matchedAt: new Date().toISOString() }] : []
        return [{ id: `radar-${Date.now()}`, title, criteria, createdAt: new Date().toISOString(), notifications }, ...prev]
      }),
    [setWatches]
  )
  const remove = useCallback((id) => setWatches((prev) => prev.filter((w) => w.id !== id)), [setWatches])
  const dismissNotification = useCallback(
    (watchId, candidateId) => setWatches((prev) => prev.map((w) => (w.id === watchId ? { ...w, notifications: w.notifications.filter((n) => n.candidateId !== candidateId) } : w))),
    [setWatches]
  )
  return { watches, watch, remove, dismissNotification }
}

export function useRecruiterNotes(candidateId) {
  const [all, setAll] = useLocalCollection(KEYS.notes, {})
  const notes = all[candidateId] ?? []
  const add = useCallback(
    (text) => setAll((prev) => ({ ...prev, [candidateId]: [{ id: `note-${Date.now()}`, candidateId, text, createdAt: new Date().toISOString() }, ...(prev[candidateId] ?? [])] })),
    [candidateId, setAll]
  )
  return { notes, add }
}
