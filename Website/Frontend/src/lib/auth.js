import { EMPLOYEE_SIGNIN_URL } from './config'

const TOKEN_KEY = 'mzobs-employee-token'

// A plain, non-reactive read — every place the token can change (sign-in,
// sign-out, RequireAuth's bounce-to-signin) already does a full
// window.location.href navigation, so re-reading it on mount is always current.
export function hasEmployeeToken() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function signInUrl(redirectTo = window.location.pathname + window.location.search) {
  return `${EMPLOYEE_SIGNIN_URL}?redirect=${encodeURIComponent(redirectTo)}`
}
