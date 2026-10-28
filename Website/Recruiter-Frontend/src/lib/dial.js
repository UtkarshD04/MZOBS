// A `tel:` link for a stored phone number. Numbers are kept in many shapes
// ("9876543210", "+91 98765 43210", "919876543210", "09876543210",
// "0091 98765 43210", "+91 0 98765 43210") and sometimes carry stray digits in
// front. An Indian mobile is always the LAST 10 digits (it starts 6–9), so
// whatever precedes them is dropped and +91 is put back: the dialer then shows
// exactly the real number, and both a phone and a desktop dialer accept it. A
// number written with another country code (+1…) keeps it; anything that is not
// a mobile is passed through as digits.
export function dialNumber(phone) {
  const text = String(phone ?? '').trim()
  const digits = text.replace(/\D/g, '')
  const foreign = text.startsWith('+') && !digits.startsWith('91')
  if (foreign) return `+${digits}`
  if (digits.length >= 10 && /^[6-9]\d{9}$/.test(digits.slice(-10))) return `+91${digits.slice(-10)}`
  return digits
}

export const telHref = (phone) => `tel:${dialNumber(phone)}`

export const dial = (phone) => {
  window.location.href = telHref(phone)
}
