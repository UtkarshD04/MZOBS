// Trust Signal — separate from Match Score on purpose (see CandidateCard /
// TalentLensCandidate): a match tells you if someone fits the role, trust
// tells you how much of their profile Mzobs has actually been able to check.
// Every item here reads straight off `candidate.verification` — nothing is
// inferred or guessed, so this only ever shows verification states that
// genuinely exist in the (mock, for now) data.

/**
 * @param {import('./types').Candidate} candidate
 * @returns {import('./types').TrustSignal}
 */
export function computeTrustSignal(candidate) {
  const v = candidate.verification
  const items = [
    { key: 'phone', label: 'Phone verified', ok: v.phoneVerified },
    { key: 'email', label: 'Email verified', ok: v.emailVerified },
    { key: 'resume', label: 'Resume submitted', ok: v.resumeSubmitted },
    { key: 'education', label: 'Education information verified', ok: v.educationVerified },
    { key: 'employment', label: 'Employment information verified', ok: v.employmentVerified },
    { key: 'recent', label: 'Profile recently updated', ok: v.profileRecentlyUpdatedDays <= 30 },
  ]
  const score = Math.round((items.filter((i) => i.ok).length / items.length) * 100)
  return { score, items }
}
