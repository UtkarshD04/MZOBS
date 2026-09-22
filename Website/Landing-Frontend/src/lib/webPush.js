import { EMPLOYEE_API_URL, VAPID_PUBLIC_KEY } from './config'

// Browser push subscriptions (web-push/VAPID) for signed-in employees —
// counterpart to the Mobile App's Expo push tokens. Backend/src/utils/push.js
// sends to both channels from the same `sendPush(recipient, payload)` call,
// so this only has to get a subscription onto the employee's account; when
// (job match, application update, etc.) to actually notify is decided there.
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

async function postJSON(path, token, body) {
  await fetch(`${EMPLOYEE_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
}

// Called once a session exists (sign-in/up, or an already-signed-in return
// visit) — asks for notification permission and, if granted, registers a
// push subscription against this employee's account. Silently no-ops if the
// browser lacks push support, the key isn't configured, or permission is
// denied — notifications are a nice-to-have, never a blocker.
export async function subscribeToWebPush(token) {
  if (!token || !VAPID_PUBLIC_KEY) return
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
    }
    if (Notification.permission !== 'granted') return

    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }

    const { endpoint, keys } = subscription.toJSON()
    await postJSON('/push/subscribe', token, { endpoint, keys })
  } catch {
    // Permission dialogs dismissed, SW registration blocked in this
    // context, etc. — nothing actionable for the visitor, so stay quiet.
  }
}

// Called on sign-out so this browser stops receiving the account's
// notifications (mirrors the Mobile App unregistering its Expo token).
export async function unsubscribeFromWebPush(token) {
  if (!token || !('serviceWorker' in navigator)) return
  try {
    const registration = await navigator.serviceWorker.getRegistration('/sw.js')
    const subscription = await registration?.pushManager.getSubscription()
    if (!subscription) return

    const { endpoint } = subscription.toJSON()
    await subscription.unsubscribe()
    await postJSON('/push/unsubscribe', token, { endpoint })
  } catch {
    // Best-effort cleanup — a failed unsubscribe just means this browser
    // may get a stray notification later, not worth surfacing to the user.
  }
}
