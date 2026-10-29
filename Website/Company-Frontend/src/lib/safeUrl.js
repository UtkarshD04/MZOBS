// Links that come from user-entered data (portfolio, LinkedIn, meeting links…)
// must never reach an href as-is: `javascript:` / `data:` URLs would run script
// in this app's origin when clicked, and a script-injected click could act as the signed-in user.
// Returns the normalised URL for http(s) only, otherwise undefined (no href).
export function safeHref(value) {
  if (typeof value !== 'string') return undefined
  const raw = value.trim()
  if (!raw) return undefined
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch {
    return undefined
  }
}
