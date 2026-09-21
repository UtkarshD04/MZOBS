// Local data for the "Jobs matching your profile" deck (RecommendedForYou.jsx),
// kept apart from the JSX so a real backend response can replace the sample
// content later without touching the layout. The deck supports any number of
// jobs — each item just needs this shape:
//
//   id, company, logo, role, location, employmentType,
//   skills[], matchLevel ('strong' | 'good' | 'relevant'),
//   matchReasons[], accent ('blue' | 'lavender' | 'mint'), to? / href?
//
// Everything below is DEMONSTRATION content — shown to signed-out visitors as a
// preview and labelled "Sample preview · not live openings" in the UI. None of
// it is a live opening, and there are deliberately no percentage scores: match
// strength is one of three plain-language labels.

export const MATCH_LEVELS = {
  strong: { label: 'Strong match' },
  good: { label: 'Good match' },
  relevant: { label: 'Relevant match' },
}

export const sampleJobs = [
  {
    id: 'sample-software-engineer',
    company: 'Solace Technologies',
    logo: null,
    role: 'Software Engineer',
    location: 'Bengaluru',
    employmentType: 'Full-time',
    skills: ['Python', 'React', 'SQL'],
    matchLevel: 'strong',
    matchReasons: ['Python', 'React', 'Bengaluru'],
    accent: 'blue',
    to: '/employees/signin',
  },
  {
    id: 'sample-data-analyst',
    company: '',
    logo: null,
    role: 'Data Analyst',
    location: 'Remote',
    employmentType: 'Full-time',
    skills: ['SQL', 'Python', 'Analytics'],
    matchLevel: 'good',
    matchReasons: ['SQL', 'Python', 'Remote'],
    accent: 'lavender',
    to: '/employees/signin',
  },
  {
    id: 'sample-cybersecurity-analyst',
    company: '',
    logo: null,
    role: 'Cybersecurity Analyst',
    location: 'Hyderabad',
    employmentType: 'Hybrid',
    skills: ['Security', 'Linux', 'SIEM'],
    matchLevel: 'relevant',
    matchReasons: ['Security interest', 'Hyderabad'],
    accent: 'mint',
    to: '/employees/signin',
  },
]
