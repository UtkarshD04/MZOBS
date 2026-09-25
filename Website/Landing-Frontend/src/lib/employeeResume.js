import { EMPLOYEE_API_URL } from './config'

// Same allowlist/size the backend enforces (see Backend/src/utils/fileValidation.js
// and middleware/upload.js) — checked here too just for fast, friendly
// feedback before the file ever leaves the browser. The backend re-validates
// the real content regardless, so this is a convenience, not the real gate.
export const RESUME_MAX_SIZE = 5 * 1024 * 1024
export const RESUME_ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']

// The API returns a resume as a root-relative `/files/resume/:token` link,
// which lives on the API's own origin, not this site's. `?download=1` makes
// the API serve it as an attachment, so the browser saves the file instead
// of opening it.
export function resumeDownloadUrl(path) {
  const url = new URL(path, new URL(EMPLOYEE_API_URL).origin)
  url.searchParams.set('download', '1')
  return url.href
}

export function validateResumeFileClientSide(file) {
  if (!file) return null
  const ext = /\.[a-zA-Z0-9]+$/.exec(file.name)?.[0]?.toLowerCase()
  if (!ext || !RESUME_ALLOWED_EXTENSIONS.includes(ext)) return 'Only PDF, DOC or DOCX files are accepted.'
  if (file.size > RESUME_MAX_SIZE) return 'File is too large — the limit is 5MB.'
  return null
}

export async function uploadEmployeeResume(token, file) {
  const body = new FormData()
  body.append('resume', file)

  const res = await fetch(`${EMPLOYEE_API_URL}/resume`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Could not upload your resume.')
  return data
}
