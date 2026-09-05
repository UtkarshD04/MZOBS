// Cross-app links. This site is a marketing shell in front of two separate
// portal apps — point these at the real deployed URLs when they exist.
export const EMPLOYEE_APP_URL = import.meta.env.VITE_EMPLOYEE_APP_URL ?? 'http://localhost:5173'
export const EMPLOYER_APP_URL = import.meta.env.VITE_EMPLOYER_APP_URL ?? 'http://localhost:5175'

export const EMPLOYEE_REGISTER_URL = `${EMPLOYEE_APP_URL}/register`
export const EMPLOYEE_LOGIN_URL = `${EMPLOYEE_APP_URL}/login`

// The employer backend (see Backend/) — this marketing site signs employers
// in/up directly against it, then hands the app a token via ?token=.
export const EMPLOYER_API_URL = import.meta.env.VITE_EMPLOYER_API_URL ?? 'http://localhost:4000/api/employer'

// Same Backend, employee side — this marketing site signs employees in/up
// directly against it too, then hands the app a token via ?token=.
export const EMPLOYEE_API_URL = import.meta.env.VITE_EMPLOYEE_API_URL ?? 'http://localhost:4000/api/employee'

// Same Backend — public contact form submissions.
export const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL ?? 'http://localhost:4000/api/contact'

// Same Backend — public, unauthenticated feed of jobs admin/ops have
// approved and pushed live, for the home page's "Latest jobs" section.
export const PUBLIC_JOBS_API_URL = import.meta.env.VITE_PUBLIC_JOBS_API_URL ?? 'http://localhost:4000/api/jobs'

// Google OAuth Web Client ID — must match GOOGLE_CLIENT_ID on the backend,
// since it checks this as the token audience. Left blank, the Google button
// renders but fails on click instead of crashing the app.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

// MSG91 OTP widget credentials (Widget ID + Token Auth from the MSG91
// dashboard) — these are meant to live in client-side JS by design, unlike
// the backend's MSG91 Auth Key which must stay server-only.
export const MSG91_WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID ?? ''
export const MSG91_TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH ?? ''

export const CONTACT_EMAIL = 'hello@mzobs.com'
export const CONTACT_PHONE = '+91 98765 43210'
export const CONTACT_ADDRESS = '4th Floor, Cyber Towers, HITEC City, Hyderabad, IN 500081'
