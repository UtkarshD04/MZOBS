// Shared by the four auth forms: on success we don't redirect instantly —
// we let the page show its convergence transition for a beat first, then
// hand off. `onSuccess` is optional so a form used without the constellation
// UI still redirects immediately.
export function completeAuth({ onSuccess, redirectTo }) {
  if (!onSuccess) {
    window.location.href = redirectTo
    return
  }
  onSuccess()
  setTimeout(() => {
    window.location.href = redirectTo
  }, 900)
}
