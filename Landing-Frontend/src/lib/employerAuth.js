import { EMPLOYER_API_URL } from './config'

async function postJSON(path, body) {
  const res = await fetch(`${EMPLOYER_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong. Please try again.')
  return data
}

export function loginEmployer({ email, password }) {
  return postJSON('/auth/login', { email, password })
}

export function signupEmployer({ companyName, name, email, phone, password, industry, size, website, hq }) {
  return postJSON('/auth/signup', { companyName, name, email, phone, password, industry, size, website, hq })
}
