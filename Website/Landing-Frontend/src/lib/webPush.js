// This marketing site has no login of its own (sign-in/up hand off to the
// Employee/Employer portal apps), so there's no account to link a push
// subscription to here — this only shows the browser's permission prompt.
export async function requestNotificationPermission() {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return
  await navigator.serviceWorker.register('/sw.js')
  await Notification.requestPermission()
}
