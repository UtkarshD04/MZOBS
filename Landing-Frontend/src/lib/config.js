// Cross-app links. This site is a marketing shell in front of two separate
// portal apps — point these at the real deployed URLs when they exist.
export const EMPLOYEE_APP_URL = 'http://localhost:5173'
export const EMPLOYER_APP_URL = 'http://localhost:5175'

export const EMPLOYEE_REGISTER_URL = `${EMPLOYEE_APP_URL}/register`
export const EMPLOYEE_LOGIN_URL = `${EMPLOYEE_APP_URL}/login`

// The employer backend (see Backend/) — this marketing site signs employers
// in/up directly against it, then hands the app a token via ?token=.
export const EMPLOYER_API_URL = 'http://localhost:4000/api/employer'

// Same Backend, employee side — this marketing site signs employees in/up
// directly against it too, then hands the app a token via ?token=.
export const EMPLOYEE_API_URL = 'http://localhost:4000/api/employee'

export const CONTACT_EMAIL = 'hello@mzobs.com'
export const CONTACT_PHONE = '+91 98765 43210'
export const CONTACT_ADDRESS = '4th Floor, Cyber Towers, HITEC City, Hyderabad, IN 500081'
