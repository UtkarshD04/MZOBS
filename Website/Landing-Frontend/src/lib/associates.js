import { ASSOCIATES_API_URL } from './config'

export async function submitAssociateRequest(request) {
  const res = await fetch(ASSOCIATES_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong. Please try again.')
  return data
}
