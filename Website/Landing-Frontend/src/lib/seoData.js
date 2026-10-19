// Shared SEO data — used by the client-rendered <Seo> component (for SPA
// navigation head updates) and, identically, by the server's HTML-string
// head builder (renderHead.js) and the build-time prerender script, so the
// initial HTML and the post-hydration DOM never disagree.

export const SITE_URL = 'https://mzobs.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo.png`

// Normalizes a path before it becomes a canonical URL: drops any query
// string/hash (a tracking link like ?utm_source=... must not mint its own
// canonical), lowercases it, and drops a trailing slash (except the root
// itself) so /About/ and /about resolve to the exact same canonical. Used
// everywhere a canonical gets built — server.js, scripts/prerender.js,
// buildJobSeo below, and the client-side <Seo> component — so all four
// agree on the same URL for the same page.
export function canonicalPath(path) {
  const bare = path.split('?')[0].split('#')[0].toLowerCase()
  return bare.length > 1 && bare.endsWith('/') ? bare.slice(0, -1) : bare
}

// Title/description for every prerendered public static route — kept in
// sync with the routes registered in App.jsx and prerendered by
// scripts/prerender.js.
// Title/description for the client-only public pages (never prerendered, so
// not in STATIC_PAGE_SEO) — used by server.js for their <head> tags.
// TODO: /ally and /associate render only on the client, so their page content
// is not server-rendered; only these head tags are. Listed for review.
export const CLIENT_ONLY_PAGE_SEO = {
  '/ally': {
    title: 'Mzobs Ally | Represent Mzobs on Your Campus',
    description: 'Become a Mzobs Ally: represent Mzobs on your campus, help classmates get hired and build real-world experience.',
  },
  '/associate': {
    title: 'Associate with Mzobs | Partner With Us',
    description: 'Partner with Mzobs to connect verified talent with employers who are hiring.',
  },
}

export const STATIC_PAGE_SEO = {
  '/': {
    title: 'Mzobs | Talent × Opportunity × Smart Hiring',
    description:
      'Discover jobs from top employers across India, get matched to roles that fit your skills and experience, and move from profile to offer faster. Employers find quality talent and hire in one pipeline.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://mzobs.com/#organization',
          name: 'Mzobs',
          url: 'https://mzobs.com/',
          logo: 'https://mzobs.com/images/logo.png',
          email: 'support@mzobs.com',
          sameAs: ['https://www.instagram.com/mzobs2601'],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://mzobs.com/#website',
          name: 'Mzobs',
          url: 'https://mzobs.com/',
          publisher: { '@id': 'https://mzobs.com/#organization' },
          inLanguage: 'en-IN',
        },
      ],
    },
  },
  '/our-story': {
    title: 'Our Story | Mzobs',
    description: 'How Mzobs began and where it is headed: the story behind the platform.',
  },
  '/employers': {
    title: 'For Employers | Mzobs',
    description: 'Post jobs, discover candidates ranked by fit and manage interviews and offers in one hiring pipeline with Mzobs.',
  },
  '/employers/pricing': {
    title: 'Pricing | Mzobs for Employers',
    description: 'One simple annual plan for unlimited job postings and applicant resume access on Mzobs.',
  },
  '/careers': {
    title: 'Careers | Mzobs',
    description: 'Build your future with Mzobs. Learn how we work and explore opportunities to help connect talent with opportunity.',
  },
  '/contact': {
    title: 'Contact Us | Mzobs',
    description: 'Get in touch with the Mzobs team for support, partnerships, or general enquiries.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Mzobs',
    description: 'Read the Mzobs privacy policy to understand how we collect, use, and protect your data.',
  },
  '/terms-of-service': {
    title: 'Terms & Conditions | Mzobs',
    description: 'Read the Mzobs Terms & Conditions that govern the use of the platform for candidates and employers.',
  },
  // One entry per HOT_CITIES_DATA.cities slug (see components/sections/home/
  // HotJobsByCity.jsx and pages/CityJobs.jsx) — adding a city there means
  // adding its slug here too, so it gets prerendered and shows up in
  // sitemap.xml like every other static route.
  '/jobs/city/bengaluru': {
    title: 'Bengaluru Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Bengaluru from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/mumbai': {
    title: 'Mumbai Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Mumbai from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/delhi-ncr': {
    title: 'Delhi NCR Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Delhi NCR from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/hyderabad': {
    title: 'Hyderabad Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Hyderabad from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/pune': {
    title: 'Pune Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Pune from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/chennai': {
    title: 'Chennai Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Chennai from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/noida': {
    title: 'Noida Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Noida from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/gurugram': {
    title: 'Gurugram Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Gurugram from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/kolkata': {
    title: 'Kolkata Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Kolkata from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/lucknow': {
    title: 'Lucknow Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Lucknow from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/ahmedabad': {
    title: 'Ahmedabad Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Ahmedabad from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/jaipur': {
    title: 'Jaipur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Jaipur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/chandigarh': {
    title: 'Chandigarh Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Chandigarh from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/indore': {
    title: 'Indore Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Indore from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/bhopal': {
    title: 'Bhopal Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Bhopal from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/agra': {
    title: 'Agra Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Agra from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/kanpur': {
    title: 'Kanpur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Kanpur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/varanasi': {
    title: 'Varanasi Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Varanasi from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/prayagraj': {
    title: 'Prayagraj Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Prayagraj from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/dehradun': {
    title: 'Dehradun Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Dehradun from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/haridwar': {
    title: 'Haridwar Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Haridwar from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/jodhpur': {
    title: 'Jodhpur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Jodhpur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/ludhiana': {
    title: 'Ludhiana Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Ludhiana from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/amritsar': {
    title: 'Amritsar Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Amritsar from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/jammu': {
    title: 'Jammu Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Jammu from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/srinagar': {
    title: 'Srinagar Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Srinagar from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/coimbatore': {
    title: 'Coimbatore Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Coimbatore from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/thiruvananthapuram': {
    title: 'Thiruvananthapuram Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Thiruvananthapuram from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/kozhikode': {
    title: 'Kozhikode Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Kozhikode from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/mysuru': {
    title: 'Mysuru Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Mysuru from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/mangaluru': {
    title: 'Mangaluru Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Mangaluru from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/visakhapatnam': {
    title: 'Visakhapatnam Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Visakhapatnam from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/vijayawada': {
    title: 'Vijayawada Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Vijayawada from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/tirupati': {
    title: 'Tirupati Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Tirupati from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/madurai': {
    title: 'Madurai Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Madurai from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/tiruchirappalli': {
    title: 'Tiruchirappalli Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Tiruchirappalli from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/salem': {
    title: 'Salem Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Salem from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/nashik': {
    title: 'Nashik Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Nashik from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/nagpur': {
    title: 'Nagpur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Nagpur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/thane': {
    title: 'Thane Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Thane from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/navi-mumbai': {
    title: 'Navi Mumbai Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Navi Mumbai from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/aurangabad': {
    title: 'Aurangabad Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Aurangabad from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/surat': {
    title: 'Surat Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Surat from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/vadodara': {
    title: 'Vadodara Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Vadodara from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/rajkot': {
    title: 'Rajkot Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Rajkot from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/gandhinagar': {
    title: 'Gandhinagar Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Gandhinagar from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/bhubaneswar': {
    title: 'Bhubaneswar Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Bhubaneswar from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/cuttack': {
    title: 'Cuttack Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Cuttack from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/guwahati': {
    title: 'Guwahati Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Guwahati from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/ranchi': {
    title: 'Ranchi Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Ranchi from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/jamshedpur': {
    title: 'Jamshedpur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Jamshedpur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/patna': {
    title: 'Patna Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Patna from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/gaya': {
    title: 'Gaya Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Gaya from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/raipur': {
    title: 'Raipur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Raipur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/jabalpur': {
    title: 'Jabalpur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Jabalpur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/gwalior': {
    title: 'Gwalior Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Gwalior from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/faridabad': {
    title: 'Faridabad Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Faridabad from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/ghaziabad': {
    title: 'Ghaziabad Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Ghaziabad from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/greater-noida': {
    title: 'Greater Noida Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Greater Noida from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/sonipat': {
    title: 'Sonipat Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Sonipat from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/panipat': {
    title: 'Panipat Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Panipat from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/meerut': {
    title: 'Meerut Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Meerut from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/bhiwadi': {
    title: 'Bhiwadi Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Bhiwadi from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/tiruppur': {
    title: 'Tiruppur Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Tiruppur from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/hubballi': {
    title: 'Hubballi Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Hubballi from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/belagavi': {
    title: 'Belagavi Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Belagavi from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  '/jobs/city/kochi': {
    title: 'Kochi Jobs: Openings Hiring Now | Mzobs',
    description: 'Browse job openings in Kochi from employers hiring now, with salary, experience and work mode on each listing, updated as new roles come in.',
  },
  // The "Explore all locations" page. Registered in server.js ahead of
  // /jobs/:id, so "cities" is never looked up as a job id.
  '/jobs/cities': {
    title: 'Jobs by City: All Locations Hiring | Mzobs',
    description: 'Explore job openings in every city Mzobs covers, with live opening counts for each location.',
  },
}

// Auth/dashboard-handoff routes — never worth indexing, and never
// prerendered/SSR'd (see server.js's catch-all).
export const NOINDEX_PREFIXES = [
  '/employees/recommended',
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
  const title = `${job.title} at ${job.company} | Mzobs`
  const descSource = (job.description || '').replace(/\s+/g, ' ').trim()
  const description = descSource
    ? truncate(descSource, 160)
    : `${job.title} job opening at ${job.company}${job.location ? `, ${job.location}` : ''}. Apply on Mzobs.`
  const canonical = `${SITE_URL}${canonicalPath(path)}`

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
