import { apiClient } from './api'

// The VAPID key endpoint is mounted at the API root (/api/push/...), not
// under this app's /api/employee/... base — it's unauthenticated on purpose
// so Landing-Frontend (no login) can fetch it too. Derive the root from
// apiClient's own baseURL rather than hardcoding a second env var.
function apiRoot() {
  return apiClient.defaults.baseURL.replace(/\/api\/.*$/, '/api')
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

// Registers the service worker, prompts for notification permission (the
// browser's "Allow notifications?" popup), and links the push subscription
// to the signed-in employee's account. No-ops quietly if the browser doesn't
// support push, or the user denies/dismisses the prompt.
export async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return

  const registration = await navigator.serviceWorker.register('/sw.js')
  const existing = await registration.pushManager.getSubscription()
  const subscription =
    existing ??
    (await (async () => {
      const res = await fetch(`${apiRoot()}/push/vapid-public-key`)
      const data = await res.json()
      if (!data.publicKey) return null
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      })
    })())
  if (!subscription) return

  const json = subscription.toJSON()
  await apiClient.post('/push/subscribe', { endpoint: json.endpoint, keys: json.keys })
}
