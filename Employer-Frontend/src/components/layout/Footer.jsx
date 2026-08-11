import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="flex items-center justify-between pt-6 mt-8 border-t border-border text-[11.5px] text-ink-tertiary flex-wrap gap-2">
      <span>© 2026 Mzobs Technologies Pvt. Ltd. All rights reserved.</span>
      <div className="flex items-center gap-4">
        <Link to="#" className="hover:text-ink-secondary">Privacy Policy</Link>
        <Link to="#" className="hover:text-ink-secondary">Terms of Service</Link>
        <Link to="#" className="hover:text-ink-secondary">Contact Support</Link>
      </div>
    </footer>
  )
}
