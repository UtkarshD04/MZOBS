import { CAMPUS_MANTRI_API_URL } from './config'

export async function submitCampusMantriApplication(application) {
  const res = await fetch(CAMPUS_MANTRI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong. Please try again.')
  return data
}
