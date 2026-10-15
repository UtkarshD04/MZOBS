// Layout-check fixtures. Only ever loaded by a dynamic import guarded by
// `import.meta.env.DEV` AND the explicit `?demo-stories` URL flag (see
// SuccessStoriesSection.jsx), so they are stripped from production builds and
// never appear unless a developer asks for them.
export const DEV_FIXTURES = [
  { id: 'dev-1', name: 'Sample Person One', photo: '', placementVerified: true, feedback: 'Layout fixture. A medium-length note, long enough to wrap onto several lines so that line height, width and spacing can be judged at every breakpoint.' },
  { id: 'dev-2', name: 'Sample Person Two With A Rather Long Full Name', photo: '', placementVerified: false, feedback: 'Layout fixture. A deliberately long piece of feedback to confirm that a card grows to fit its text without truncation, that nothing is hidden behind a click, and that neighbouring cards keep their own natural height instead of stretching to match. It keeps going for a few more lines so the difference is visible next to the shorter cards in the same row.' },
  { id: 'dev-3', name: 'Sample Person Three', photo: '', placementVerified: true, feedback: 'Layout fixture, short.' },
  { id: 'dev-4', name: 'Sample Person Four', photo: '', placementVerified: false, feedback: 'Layout fixture. Another medium note for the second row of the grid, so that the column rhythm is easy to judge.' },
  { id: 'dev-5', name: 'Sample Person Five', photo: '', placementVerified: true, feedback: 'Layout fixture. One more card so that the grid has two full rows on desktop.' },
]
