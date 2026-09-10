import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Phone, CheckCircle2, Loader2, Copy, Check, ArrowRight } from 'lucide-react'
import { createGuestSubscriptionOrder, guestSubscribeSignup } from '../../../lib/employerAuth'
import { openRazorpayCheckout } from '../../../lib/razorpay'
import { EMPLOYER_APP_URL } from '../../../lib/config'

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-[#20251F]/15 bg-white text-[13.5px] text-[#20251F] outline-none transition-colors placeholder:text-[#20251F]/35 focus:border-[#246B5A] focus:ring-[3px] focus:ring-[#246B5A]/15'

// The pricing page's "no signup form" path: take the phone number, pay the
// plan price, and the account (Company + Admin user + an already-active
// subscription) is created server-side in that same payment-verify call —
// see guestSubscribeSignup in Backend/src/controllers/authController.js.
// There's no email/company-name form here by design; those get filled in
// later from the dashboard's Company Profile page.
export default function EmployerGuestSubscribe({ open, onClose }) {
  const [step, setStep] = useState('phone') // phone | paying | success
  const [phone, setPhone] = useState('')

  const [payError, setPayError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  function reset() {
    setStep('phone')
    setPhone('')
    setPayError('')
    setResult(null)
    setCopied(false)
  }

  function handleClose() {
    if (step === 'paying') return // don't let a stray click strand a payment in flight
    reset()
    onClose()
  }

  function handleContinue() {
    setStep('paying')
    startPayment()
  }

  async function startPayment() {
    setPayError('')
    try {
      const order = await createGuestSubscriptionOrder()
      const signupResult = order.mock
        ? await guestSubscribeSignup({ phone, mockOrderId: order.orderId })
        : await (async () => {
            const paid = await openRazorpayCheckout(order)
            return guestSubscribeSignup({
              phone,
              razorpay_order_id: paid.razorpay_order_id,
              razorpay_payment_id: paid.razorpay_payment_id,
              razorpay_signature: paid.razorpay_signature,
            })
          })()
      setResult(signupResult)
      setStep('success')
    } catch (err) {
      setPayError(err.message)
      setStep('phone')
    }
  }

  function copyCredentials() {
    if (!result) return
    navigator.clipboard?.writeText(`Email: ${result.placeholderEmail}\nTemporary password: ${result.tempPassword}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function goToDashboard() {
    window.location.href = `${EMPLOYER_APP_URL}/dashboard?token=${encodeURIComponent(result.token)}`
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#20251F]/50 backdrop-blur-sm"
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
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-full sm:max-w-md sm:rounded-[28px] rounded-t-[28px] bg-white border border-[#20251F]/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            {step !== 'paying' && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center text-[#20251F]/50 hover:text-[#20251F] hover:bg-[#F1EDE5] transition-colors"
              >
                <X size={18} />
              </button>
            )}

            {step === 'phone' && (
              <>
                <h3 className="font-serif text-2xl font-bold text-[#20251F]">Add your mobile number</h3>
                <p className="text-[13px] text-[#526051] mt-1.5 mb-6">
                  We'll use this to reach you about your account — then take you straight to payment, no signup form to fill in.
                </p>

                {payError && <p className="text-[12.5px] text-red-600 mb-4 -mt-2">{payError}</p>}

                <label className="block text-[12.5px] font-bold text-[#20251F] mb-1.5">Mobile number</label>
                <div className="flex gap-2">
                  <div className="h-11 px-3.5 flex items-center rounded-xl border border-[#20251F]/15 bg-[#F1EDE5] text-[13.5px] font-bold text-[#20251F] shrink-0">
                    +91
                  </div>
                  <div className="relative flex-1">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#20251F]/40" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={phone.length !== 10}
                  className="mt-3 w-full h-11 rounded-xl bg-[#20251F] text-[#FAF7F1] text-[13.5px] font-bold hover:bg-[#246B5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to payment
                </button>
              </>
            )}

            {step === 'paying' && (
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <Loader2 size={28} className="animate-spin text-[#246B5A]" />
                <p className="text-[14px] font-bold text-[#20251F]">Setting up your subscription…</p>
                <p className="text-[12.5px] text-[#526051]">Complete the payment in the window that opens.</p>
              </div>
            )}

            {step === 'success' && result && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#DDE6DF] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-[#246B5A]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#20251F]">You're subscribed.</h3>
                <p className="text-[13px] text-[#526051] mt-1.5">Your MZOBS Employer Annual plan is active. Save these details to sign in later:</p>

                <div className="mt-5 rounded-2xl border border-[#20251F]/12 bg-[#FAF7F1] p-4 text-left">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#526051]">Login email</div>
                  <div className="text-[13.5px] font-bold text-[#20251F] break-all mt-0.5">{result.placeholderEmail}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#526051] mt-3">Temporary password</div>
                  <div className="text-[13.5px] font-bold text-[#20251F] font-mono mt-0.5">{result.tempPassword}</div>
                  <button
                    type="button"
                    onClick={copyCredentials}
                    className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#246B5A] hover:underline"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy details'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={goToDashboard}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#20251F] text-[#FAF7F1] text-sm font-bold hover:bg-[#246B5A] transition-colors"
                >
                  Go to your dashboard <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
