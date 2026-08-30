import { useEffect, useRef, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-[#e0e0e0]" />
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#9E9E9E]">or</span>
      <div className="h-px flex-1 bg-[#e0e0e0]" />
    </div>
  )
}

function GoogleGLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 27 35.7 24 35.7c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.6C41.8 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  )
}

// Google's branding guidelines require the actual click target to be their
// own rendered button — but they don't require it to be *visible*. This
// draws a button in the site's own style (matches Input's h-11/rounded-xl)
// and stacks Google's real button on top at full size, invisible, so a
// click on "our" button is really a click on theirs. Same OAuth flow and
// ID-token result as their default widget, just styled to match the rest
// of the form instead of looking like an embedded foreign element.
export function GoogleAuthButton({ onCredential, onError, label = 'Continue with Google' }) {
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full h-11 mb-2"
    >
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2.5 rounded-xl border text-[13.5px] font-bold text-black transition-all duration-150 ${
          hovered ? 'border-[#a8a8a8] bg-[#fafafa] shadow-sm' : 'border-[#C9C9C9] bg-white'
        }`}
      >
        <GoogleGLogo />
        {label}
      </div>

      {width > 0 && (
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-0">
          <GoogleLogin
            onSuccess={(res) => {
              if (res.credential) onCredential(res.credential)
              else onError?.('Google sign-in did not return a credential. Please try again.')
            }}
            onError={() => onError?.('Google sign-in failed. Please try again.')}
            width={width}
            size="large"
          />
        </div>
      )}
    </div>
  )
}

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
