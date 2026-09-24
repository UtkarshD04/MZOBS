export function ago(days) {
  if (days == null) return '—'
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.round(days / 30)} mo ago`
  return `${Math.round(days / 365)} yr ago`
}
export function agoDate(iso) {
  return ago(Math.floor((Date.now() - new Date(iso).getTime()) / 86400000))
}
export function lpa(n) {
  return n == null ? '—' : `₹${Number(n) % 1 === 0 ? n : n.toFixed(1)} LPA`
}
export function notice(days) {
  if (days == null) return '—'
  return days === 0 ? 'Immediate' : `${days} days`
}
export function years(n) {
  if (n == null) return '—'
  return `${n % 1 === 0 ? n : n.toFixed(1)} yrs`
}
export function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
