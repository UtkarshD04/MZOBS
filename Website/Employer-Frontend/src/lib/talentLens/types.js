// Talent Lens — shared shapes, documented with JSDoc so editors get
// intellisense without pulling in TypeScript. Nothing here executes; it's a
// contract. Swap `lib/talentLens/mockCandidates.js` + `matchEngine.js`'s mock
// path for a real `/talent-lens/*` API surface later and these shapes should
// still hold — `overallMatch` etc. arrive from the backend instead of being
// computed client-side, but the field names stay the same.

/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} name
 * @property {string} initials
 * @property {string} designation           Current job title
 * @property {string} currentCompany
 * @property {number} experienceYears
 * @property {number} currentSalaryLPA
 * @property {number} expectedSalaryLPA
 * @property {string} location               Current city
 * @property {string[]} preferredLocations
 * @property {number} noticePeriodDays        0 = immediately available
 * @property {string[]} skills
 * @property {string} industry
 * @property {'Full-time'|'Contract'|'Internship'} employmentType
 * @property {'Startup'|'Product'|'MNC'|'Services'} companyType
 * @property {'Remote'|'Hybrid'|'On-site'} workMode
 * @property {{degree: string, institute: string, year: number}[]} education
 * @property {{role: string, company: string, startYear: number, endYear: number|null}[]} workHistory
 * @property {{name: string, description: string}[]} projects
 * @property {boolean} resumeAvailable
 * @property {boolean} hasPortfolio
 * @property {string|null} portfolioLink
 * @property {number} lastActiveDaysAgo
 * @property {{
 *   phoneVerified: boolean,
 *   emailVerified: boolean,
 *   resumeSubmitted: boolean,
 *   educationVerified: boolean,
 *   employmentVerified: boolean,
 *   profileRecentlyUpdatedDays: number,
 * }} verification
 */

/**
 * @typedef {Object} SearchCriteria
 * @property {string} [roleKeyword]
 * @property {string[]} includeKeywords
 * @property {string[]} excludeKeywords
 * @property {string[]} skills
 * @property {number} [experienceMin]
 * @property {number} [experienceMax]
 * @property {string} [location]
 * @property {number} [availabilityDays]      "can join within N days"
 * @property {string} [industry]
 * @property {number} [salaryMaxLPA]
 * @property {string} [designation]
 * @property {string} [currentCompany]
 * @property {string} [previousCompany]
 * @property {string} [education]
 * @property {string} [degree]
 * @property {string} [institute]
 * @property {string} [employmentType]
 * @property {string} [companyType]
 * @property {string} [workMode]
 * @property {'active'|'any'} [profileActivity]
 * @property {'verified'|'any'} [verificationStatus]
 * @property {string} [rawQuery]              The original natural-language text, if any
 */

/**
 * @typedef {Object} CandidateMatch
 * @property {string} candidateId
 * @property {number} overallMatch        0–100
 * @property {number} skillMatch
 * @property {number} experienceMatch
 * @property {number} locationMatch
 * @property {number} availabilityMatch
 * @property {number} industryMatch
 * @property {string[]} strengths          Plain-language, e.g. "Python", "Preferred location"
 * @property {string[]} gaps               Plain-language, e.g. "Notice period is 38 days"
 * @property {string} explanation          One short paragraph, deterministically generated
 */

/**
 * @typedef {Object} TrustSignal
 * @property {number} score                0–100
 * @property {{key: string, label: string, ok: boolean}[]} items
 */

/**
 * @typedef {Object} SavedSearch
 * @property {string} id
 * @property {string} name
 * @property {SearchCriteria} criteria
 * @property {string} createdAt            ISO date
 */

/**
 * @typedef {Object} TalentPool
 * @property {string} id
 * @property {string} name
 * @property {string} emoji
 * @property {string[]} candidateIds
 * @property {Record<string, string[]>} notes   candidateId -> note strings
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TalentRadarNotification
 * @property {string} candidateId
 * @property {number} overallMatch
 * @property {number} availabilityDays
 * @property {string} matchedAt
 */

/**
 * @typedef {Object} TalentRadarWatch
 * @property {string} id
 * @property {string} title
 * @property {SearchCriteria} criteria
 * @property {string} createdAt
 * @property {TalentRadarNotification[]} notifications
 */

/** @typedef {'applied'|'shortlisted'|'contacted'|'screening'|'interview'|'offer'|'hired'} HiringStage */

/**
 * @typedef {Object} RecruiterNote
 * @property {string} id
 * @property {string} candidateId
 * @property {string} text
 * @property {string} createdAt
 */

export {}
