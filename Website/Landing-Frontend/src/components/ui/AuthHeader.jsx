import { Link } from 'react-router-dom'

// Compact header for focused auth flows (signup/signin) — just the logo and
// a way back to the other auth action, instead of the full sitewide Navbar
// with its marketing nav links. Keeps the same --jobs-* palette so it still
// reads as part of the same site.
export default function AuthHeader({ prompt = 'Already have an account?', linkTo = '/employees/signin', linkLabel = 'Sign in' }) {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-(--jobs-border)">
      <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/images/logo.png" alt="Mzobs" className="h-12 w-auto object-contain" />
        </Link>

        <p className="text-[13px] sm:text-[13.5px] font-medium text-(--jobs-ink-soft)">
          {prompt}{' '}
          <Link to={linkTo} className="font-bold text-(--jobs-blue-dark) hover:text-(--jobs-navy) transition-colors">
            {linkLabel}
          </Link>
        </p>
      </div>
    </header>
  )
}
