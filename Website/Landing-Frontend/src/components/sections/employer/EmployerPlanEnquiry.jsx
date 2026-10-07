import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, Loader2 } from 'lucide-react'
import { submitPlanEnquiry } from '../../../lib/employerAuth'

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-(--explorer-border) bg-white text-[13.5px] text-(--explorer-navy) outline-none transition-colors placeholder:text-(--explorer-navy)/35 focus:border-(--explorer-blue) focus:ring-[3px] focus:ring-(--explorer-blue)/15'

const EMPTY = { name: '', companyName: '', phone: '', email: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "Customize plan" — for employers who don't fit the fixed tiers. The Operations
// team sees every submission on the Plan enquiries page and calls back.
export default function EmployerPlanEnquiry({ open, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('form') // form | sending | done
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: key === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value }))
  const valid = form.name.trim() && form.companyName.trim() && form.phone.length === 10 && EMAIL_RE.test(form.email.trim())

  function handleClose() {
    if (status === 'sending') return
    setForm(EMPTY)
    setStatus('form')
    setError('')
    onClose()
  }

  async function submit(e) {
    e.preventDefault()
    if (!valid) return
    setStatus('sending')
    setError('')
    try {
      await submitPlanEnquiry(form)
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('form')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-(--explorer-navy)/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-full sm:max-w-md sm:rounded-[28px] rounded-t-[28px] bg-white border border-(--explorer-navy)/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center text-(--explorer-navy)/50 hover:text-(--explorer-navy) hover:bg-(--explorer-bg) transition-colors"
            >
              <X size={18} />
            </button>

            {status === 'done' ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-(--explorer-blue-surface) flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-(--explorer-blue)" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-(--explorer-navy)">We'll call you soon.</h3>
                <p className="text-[13px] text-(--explorer-muted) mt-1.5">Thanks, our team has your details and will reach out with a plan built for your hiring needs.</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 w-full h-11 rounded-xl bg-(--explorer-navy) text-(--explorer-teal-surface) text-[13.5px] font-bold hover:bg-(--explorer-blue) transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 className="font-sans text-2xl font-bold text-(--explorer-navy)">Customize your plan</h3>
                <p className="text-[13px] text-(--explorer-muted) mt-1.5 mb-6">Tell us how to reach you and our team will get back with a plan that fits.</p>

                {error && <p className="text-[12.5px] text-red-600 mb-4 -mt-2">{error}</p>}

                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-[12.5px] font-bold text-(--explorer-navy) mb-1.5" htmlFor="pe-name">Your name</label>
                    <input id="pe-name" className={inputClass} value={form.name} onChange={set('name')} maxLength={120} autoComplete="name" />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-bold text-(--explorer-navy) mb-1.5" htmlFor="pe-company">Company name</label>
                    <input id="pe-company" className={inputClass} value={form.companyName} onChange={set('companyName')} maxLength={200} autoComplete="organization" />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-bold text-(--explorer-navy) mb-1.5" htmlFor="pe-phone">Phone number</label>
                    <input id="pe-phone" type="tel" inputMode="numeric" className={inputClass} value={form.phone} onChange={set('phone')} placeholder="98765 43210" autoComplete="tel-national" />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-bold text-(--explorer-navy) mb-1.5" htmlFor="pe-email">Email</label>
                    <input id="pe-email" type="email" className={inputClass} value={form.email} onChange={set('email')} maxLength={200} autoComplete="email" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!valid || status === 'sending'}
                  className="mt-6 w-full h-11 rounded-xl bg-(--explorer-navy) text-(--explorer-teal-surface) text-[13.5px] font-bold hover:bg-(--explorer-blue) transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : 'Submit'}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
