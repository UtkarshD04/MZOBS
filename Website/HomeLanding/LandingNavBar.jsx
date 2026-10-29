import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../Landing-Frontend/src/lib/content'

const LandingNavBar = () => {
  
   const [keyword, setKeyword] = useState('')
     const [location, setLocation] = useState('')
     const [experience, setExperience] = useState('')
     const [scrolled, setScrolled] = useState(false)
     const [open, setOpen] = useState(false)
     const progressRef = useRef(null)
   
     function handleSearch(event) {
       event.preventDefault()
       const params = new URLSearchParams()
       if (keyword.trim()) params.set('q', keyword.trim())
       if (location.trim()) params.set('location', location.trim())
       if (experience) params.set('experience', experience)
       window.location.assign(`/?${params.toString()}#latest-jobs`)
     }
   
     const navLinks = NAV_LINKS.map((link) =>
       link.label === 'Find Jobs' ? { ...link, label: 'Candidate' } : link
     )
   
     useEffect(() => {
       const onScroll = () => {
         const y = window.scrollY
         setScrolled(y > 4)
         // Reading-progress hairline along the bottom of the floating bar.
         const max = document.documentElement.scrollHeight - window.innerHeight
         if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
       }
       window.addEventListener('scroll', onScroll, { passive: true })
       onScroll()
       return () => window.removeEventListener('scroll', onScroll)
     }, [])
   
     return (
       <>
       <main className="min-h-[343px] bg-green-950/60 pb-8 text-white text-(--job-navy)/775 md:pb-9">
   
   
         <header className="fixed inset-x-0 top-0 z-50 h-16">
           <div
             className={`relative mx-auto flex items-center justify-between gap-6 border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled || open
                 ? 'mt-1.5 h-[52px] w-[calc(100%-24px)] max-w-[1080px] rounded-full border-white/70 bg-white/55 px-5 shadow-[0_12px_32px_-14px_rgba(16,42,67,0.3)] backdrop-blur-xl backdrop-saturate-150 md:px-7'
                 : 'h-full w-full max-w-[1200px] border-transparent px-4 sm:px-6 lg:px-8'
               }`}
           >
   
             <Link to="/" aria-label="Mzobs home" className="shrink-0">
               <img src="/images/logo.png" alt="Mzobs" className="h-9 w-[70px] object-contain mix-blend-multiply" />
             </Link>
   
             <nav aria-label="Main navigation" className="hidden flex-1 items-center gap-7 text-sm font-medium text-slate-600 md:flex">
               {navLinks.map((link) => (
                 link.children ? (
                   <details key={link.label} className="group relative">
                     <summary className="flex cursor-pointer list-none items-center gap-1 transition-colors hover:text-teal-700">
                       {link.label}<ChevronDown size={14} aria-hidden="true" className="transition-transform group-open:rotate-180" />
                     </summary>
                     <div className="absolute left-0 top-full z-10 min-w-48 pt-3">
                       <div className="rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg">
                         {link.children.map((child) => (
                           <Link key={child.label} to={child.to} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-700">
                             {child.label}
                           </Link>
                         ))}
                       </div>
                     </div>
                   </details>
                 ) : (
                   <Link key={link.label} to={link.to} className="transition-colors hover:text-teal-700">
                     {link.label}
                   </Link>
                 )
               ))}
             </nav>
   
             <div className="flex items-center gap-2">
               <Link to="/employers" className="rounded-[10px] bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(15,118,110,0.16)] transition-colors hover:bg-teal-800 sm:px-4 sm:text-sm">
                 For Employers
               </Link>
               <Link to="/employees/signin" className="rounded-[10px] bg-pink-700 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(190,24,93,0.16)] transition-colors hover:bg-pink-800 sm:px-4 sm:text-sm">
                 Sign in
               </Link>
             </div>
             <button
               type="button"
               aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
               aria-expanded={open}
               onClick={() => setOpen((value) => !value)}
               className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
               >
               {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
             </button>
           </div>
         </header>
   
         <AnimatePresence>
           {open && (
             <>
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="fixed inset-0 top-16 z-40 bg-black/25 lg:hidden"
                 onClick={() => setOpen(false)}
                 aria-hidden="true"
               />
               <motion.div
                 initial={{ opacity: 0, y: -8 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -8 }}
                 transition={{ duration: 0.18 }}
                 className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-(--jobs-border) bg-white shadow-lg lg:hidden"
               >
                 <nav aria-label="Mobile navigation" className="flex flex-col px-5 pb-5 pt-2">
                   {navLinks.map((link) => (
                     <div key={link.label} className="border-b border-slate-100 py-3">
                       {link.to ? (
                         <Link to={link.to} onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-700">
                           {link.label}
                         </Link>
                       ) : (
                         <>
                           <span className="text-sm font-semibold text-slate-700">{link.label}</span>
                           <div className="mt-2 flex flex-col gap-2 pl-3">
                             {link.children.map((child) => (
                               <Link key={child.label} to={child.to} onClick={() => setOpen(false)} className="text-sm text-slate-600 hover:text-teal-700">
                                 {child.label}
                               </Link>
                             ))}
                           </div>
                         </>
                       )}
                     </div>
                   ))}
                 </nav>
               </motion.div>
             </>
           )}
         </AnimatePresence>

         
   
   
       </main>
       </>
  )
}

export default LandingNavBar