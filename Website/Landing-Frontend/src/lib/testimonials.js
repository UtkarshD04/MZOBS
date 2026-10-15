import { TESTIMONIALS_API_URL } from './config'

// Candidate testimonials that the candidate consented to publish and staff
// approved — see Backend's publicTestimonialsController. Returns
// [{ id, name, photo, feedback, placementVerified, featured }].
export async function fetchPublicTestimonials({ signal } = {}) {
  const res = await fetch(TESTIMONIALS_API_URL, { signal })
  if (!res.ok) throw new Error('Failed to load testimonials')
  const data = await res.json()
  return Array.isArray(data?.testimonials) ? data.testimonials : []
}
