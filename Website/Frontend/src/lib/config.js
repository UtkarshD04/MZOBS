// Landing-Frontend is the real marketing/auth entry point for this app —
// sign-in/sign-up happen there, then the token is handed off via ?token=.
export const LANDING_URL = 'http://localhost:5176'
export const EMPLOYEE_SIGNIN_URL = `${LANDING_URL}/employees/signin`
export const EMPLOYEE_SIGNUP_URL = `${LANDING_URL}/employees/signup`

export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL ?? 'http://localhost:4000'
