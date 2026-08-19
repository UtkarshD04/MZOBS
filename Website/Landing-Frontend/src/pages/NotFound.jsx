import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <title>Page Not Found — Mzobs</title>
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="text-[13px] font-bold tracking-[0.14em] uppercase text-gold-strong mb-3">404</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-ink-secondary text-[14.5px] mt-2.5 max-w-sm">The page you're looking for doesn't exist or may have moved.</p>
        <Button to="/" variant="primary" size="lg" className="mt-7">
          <ArrowLeft size={16} /> Back to home
        </Button>
      </div>
      <Footer />
    </div>
  )
}
