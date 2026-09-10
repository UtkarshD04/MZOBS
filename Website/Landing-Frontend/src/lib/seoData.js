// Shared SEO data — used by the client-rendered <Seo> component (for SPA
// navigation head updates) and, identically, by the server's HTML-string
// head builder (renderHead.js) and the build-time prerender script, so the
// initial HTML and the post-hydration DOM never disagree.

export const SITE_URL = 'https://mzobs.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo.png`

// Title/description for every prerendered public static route — kept in
// sync with the routes registered in App.jsx and prerendered by
// scripts/prerender.js.
export const STATIC_PAGE_SEO = {
  '/': {
    title: 'Mzobs — Find Verified Jobs & Hire Job-Ready Talent',
    description: 'Mzobs connects verified job seekers with employers hiring — one platform for candidates and companies.',
  },
  '/about': {
    title: 'Who We Are — Mzobs',
    description: 'Learn about Mzobs, the hiring platform built to connect verified candidates with genuine employers.',
  },
  '/our-story': {
    title: 'Our Story — Mzobs',
    description: 'How Mzobs began and where it is headed — the story behind the platform.',
  },
  '/employees': {
    title: 'For Employees — Mzobs',
    description: 'Search verified job openings, apply directly, and get matched with employers hiring now on Mzobs.',
  },
  '/employers': {
    title: 'For Employers — Mzobs',
    description: 'Post jobs and hire pre-verified, job-ready candidates fast with Mzobs.',
  },
  '/employers/pricing': {
    title: 'Pricing — Mzobs for Employers',
    description: 'One simple annual plan for unlimited job postings and applicant resume access on Mzobs.',
  },
  '/contact': {
    title: 'Contact Us — Mzobs',
    description: 'Get in touch with the Mzobs team for support, partnerships, or general enquiries.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy — Mzobs',
    description: 'Read the Mzobs privacy policy to understand how we collect, use, and protect your data.',
  },
  '/terms-of-service': {
    title: 'Terms of Service — Mzobs',
    description: 'Read the terms of service that govern the use of the Mzobs platform.',
  },
  // One entry per HOT_CITIES_DATA.cities slug (see components/sections/home/
  // HotJobsByCity.jsx and pages/CityJobs.jsx) — adding a city there means
  // adding its slug here too, so it gets prerendered and shows up in
  // sitemap.xml like every other static route.
  '/jobs/city/bengaluru': {
    title: 'Bengaluru Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Bengaluru. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/mumbai': {
    title: 'Mumbai Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Mumbai. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/delhi-ncr': {
    title: 'Delhi NCR Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Delhi NCR. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/hyderabad': {
    title: 'Hyderabad Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Hyderabad. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/pune': {
    title: 'Pune Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Pune. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/chennai': {
    title: 'Chennai Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Chennai. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/noida': {
    title: 'Noida Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Noida. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/gurugram': {
    title: 'Gurugram Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Gurugram. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/kolkata': {
    title: 'Kolkata Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Kolkata. Real employers, screened listings, updated as new requirements come in.',
  },
  '/jobs/city/lucknow': {
    title: 'Lucknow Jobs — Verified Openings Hiring Now | Mzobs',
    description: 'Browse verified job openings in Lucknow. Real employers, screened listings, updated as new requirements come in.',
  },
}

// Auth/dashboard-handoff routes — never worth indexing, and never
// prerendered/SSR'd (see server.js's catch-all).
export const NOINDEX_PREFIXES = [
  '/employees/signup',
  '/employees/signin',
  '/employees/forgot-password',
  '/employees/reset-password',
  '/employers/signup',
  '/employers/signin',
  '/employers/forgot-password',
  '/employers/reset-password',
]

const EMPLOYMENT_TYPE_SCHEMA = {
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME',
  Contract: 'CONTRACTOR',
  Internship: 'INTERN',
}

function toISODateSafe(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function truncate(text, max) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

// Builds everything a public job page (Landing Frontend's /jobs/:id) needs:
// title/description/canonical for the <Seo> tags, plus a real JobPosting
// JSON-LD object built only from fields the public jobs API actually
// returns (see Backend's toLatestJobSummary) — never fabricated.
export function buildJobSeo(job, path) {
  const title = `${job.title} at ${job.company} — Mzobs`
  const descSource = (job.description || '').replace(/\s+/g, ' ').trim()
  const description = descSource
    ? truncate(descSource, 160)
    : `${job.title} job opening at ${job.company}${job.location ? `, ${job.location}` : ''}. Apply on Mzobs.`
  const canonical = `${SITE_URL}${path}`

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || description,
    url: canonical,
    identifier: { '@type': 'PropertyValue', name: 'MZOBS', value: job.id },
    hiringOrganization: { '@type': 'Organization', name: job.company },
  }

  const datePosted = toISODateSafe(job.postedOn)
  if (datePosted) jsonLd.datePosted = datePosted

  const validThrough = toISODateSafe(job.deadline)
  // A deadline that's already passed makes this an expired posting — Google
  // penalizes JobPosting schema left on expired listings, so drop the
  // structured data entirely rather than emit a stale one (the page itself
  // still renders normally; it just carries no JSON-LD).
  if (validThrough && new Date(validThrough).getTime() < Date.now()) {
    return { title, description, canonical, jsonLd: null }
  }
  if (validThrough) jsonLd.validThrough = validThrough

  const employmentType = EMPLOYMENT_TYPE_SCHEMA[job.employmentType]
  if (employmentType) jsonLd.employmentType = employmentType

  // location is free text (no structured address from the backend) — Google
  // still accepts a single addressLocality. addressCountry is a static
  // assumption (Mzobs is an India-only platform, see CONTACT_ADDRESS in
  // config.js), not per-job fabricated data.
  if (job.workMode === 'Remote') {
    jsonLd.jobLocationType = 'TELECOMMUTE'
    jsonLd.applicantLocationRequirements = { '@type': 'Country', name: 'IN' }
  } else if (job.location) {
    jsonLd.jobLocation = {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'IN' },
    }
  }

  if (job.salaryMin && job.salaryMax) {
    jsonLd.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: { '@type': 'QuantitativeValue', minValue: job.salaryMin, maxValue: job.salaryMax, unitText: 'YEAR' },
    }
  }

  return { title, description, canonical, jsonLd }
}
