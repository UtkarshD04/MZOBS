// A `tel:` link for a stored phone number. Numbers are kept in several shapes
// ("9876543210", "+91 98765 43210", "919876543210", "09876543210"); an Indian
// mobile in any of them becomes +91XXXXXXXXXX so both a phone and a desktop
// dialer (FaceTime, Teams, Skype…) accept it. Anything else is passed through.
export function telHref(phone) {
  const raw = String(phone ?? '').replace(/[^\d+]/g, '')
  const bare = raw.replace(/^\+/, '')
  if (/^[6-9]\d{9}$/.test(bare)) return `tel:+91${bare}`
  if (/^91[6-9]\d{9}$/.test(bare)) return `tel:+${bare}`
  if (/^0[6-9]\d{9}$/.test(bare)) return `tel:+91${bare.slice(1)}`
  return `tel:${raw}`
}

export const dial = (phone) => {
  window.location.href = telHref(phone)
}
