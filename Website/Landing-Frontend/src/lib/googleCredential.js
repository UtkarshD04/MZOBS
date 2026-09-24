// Decodes the (already backend-verifiable) JWT payload purely to prefill
// name/email in a signup form — never used for anything security-sensitive.
export function decodeGoogleCredential(credential) {
  try {
    const payload = credential.split('.')[1]
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return { email: json.email ?? '', name: json.name ?? '' }
  } catch {
    return { email: '', name: '' }
  }
}
