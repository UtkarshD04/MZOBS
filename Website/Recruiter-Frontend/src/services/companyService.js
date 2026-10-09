// The employer's own company record on the existing employer API:
//   GET  /company             → company (incl. gstVerification)
//   POST /company/verify-gst  { gstin, legalName, companyName } → { code, message, gstVerification }
// GST verification is mandatory: until gstVerification.status is VERIFIED the
// API answers 403 GST_VERIFICATION_REQUIRED and App.jsx shows the GST gate.
// The same endpoints back the employer mobile app, so GST status is always
// the one server-side record. Live mode only.
import { useEffect, useState } from 'react'
import { apiClient, GST_REQUIRED_EVENT } from '../lib/api'
import { IS_DEMO } from '../lib/config'

const CHANGED = 'mzt-company-changed'
let cached = null
let inflight = null

export function loadCompany({ force = false } = {}) {
  if (IS_DEMO) return Promise.resolve(null)
  if (cached && !force) return Promise.resolve(cached)
  inflight ??= apiClient
    .get('/company')
    .then((r) => {
      cached = r.data
      window.dispatchEvent(new Event(CHANGED))
      return cached
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

function setGstVerification(gstVerification) {
  if (!gstVerification) return
  cached = { ...cached, gstVerification }
  window.dispatchEvent(new Event(CHANGED))
}

// Resolves with the server's { code, message, gstVerification } on any
// answered request (including FAILED/UNDER_REVIEW and refusals like 409/429),
// so the UI always shows what the server decided. Rejects only when the
// server couldn't be reached.
export async function verifyGst({ gstin, legalName, companyName }) {
  try {
    const { data } = await apiClient.post('/company/verify-gst', { gstin, legalName, companyName })
    setGstVerification(data.gstVerification)
    loadCompany({ force: true }).catch(() => {}) // the company name may have changed with it
    return data
  } catch (err) {
    const data = err.response?.data
    if (!data) throw err
    setGstVerification(data.gstVerification)
    return { ...data, code: data.code ?? (err.response.status === 429 ? 'RATE_LIMITED' : 'PROVIDER_ERROR') }
  }
}

// Shared, live company record for any component (Settings, profile menu).
export function useCompany() {
  const [company, setCompany] = useState(cached)
  const [error, setError] = useState(false)
  useEffect(() => {
    const sync = () => setCompany(cached)
    // Any API call refused for GST reasons (lib/api.js) re-reads the status.
    const recheck = () => loadCompany({ force: true }).catch(() => {})
    window.addEventListener(CHANGED, sync)
    window.addEventListener(GST_REQUIRED_EVENT, recheck)
    loadCompany().then(sync).catch(() => setError(true))
    return () => {
      window.removeEventListener(CHANGED, sync)
      window.removeEventListener(GST_REQUIRED_EVENT, recheck)
    }
  }, [])
  return { company, error, reload: () => loadCompany({ force: true }).then(() => setError(false)).catch(() => setError(true)) }
}

export const GST_STATUS_LABEL = {
  NOT_SUBMITTED: 'GST not verified',
  PENDING: 'GST verifying',
  VERIFIED: 'GST verified',
  FAILED: 'GST not verified',
  UNDER_REVIEW: 'GST under review',
}
// Tone for the shared StatusPill (components/ui.jsx).
export const GST_STATUS_PILL = { VERIFIED: 'verified', PENDING: 'pending', UNDER_REVIEW: 'pending' }
