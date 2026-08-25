export function cn(...args) {
  return args.filter(Boolean).join(' ')
}

export function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}
