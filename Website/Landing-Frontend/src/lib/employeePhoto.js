import { EMPLOYEE_API_URL } from './config'

// Same allowlist/size the backend enforces (see Backend/src/controllers/employeePhotoController.js
// and middleware/photoUpload.js); checked here only for fast feedback.
export const PHOTO_MAX_SIZE = 3 * 1024 * 1024
const PHOTO_TYPES = ['image/jpeg', 'image/png']

// The API returns a photo as a root-relative `/files/photo/:token` link that
// lives on the API's own origin, not this site's.
export function photoSrc(path) {
  return path ? new URL(path, new URL(EMPLOYEE_API_URL).origin).href : ''
}

export function validatePhotoClientSide(file) {
  if (!file) return null
  if (!PHOTO_TYPES.includes(file.type)) return 'Only JPG or PNG photos are accepted.'
  if (file.size > PHOTO_MAX_SIZE) return 'Photo is too large. The limit is 3MB.'
  return null
}

async function photoRequest(method, body) {
  const res = await fetch(`${EMPLOYEE_API_URL}/photo`, {
    method,
    credentials: 'include',
    headers: { 'X-Requested-With': 'mzobs-web' },
    body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Could not update your photo.')
  return data
}

export function uploadEmployeePhoto(file) {
  const body = new FormData()
  body.append('photo', file)
  return photoRequest('POST', body)
}

export const deleteEmployeePhoto = () => photoRequest('DELETE')
