import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Loader2, ArrowLeft, Sparkles, Award, Users, FileCheck } from 'lucide-react'
import Seo from '../components/Seo'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingElement from '../components/ui/FloatingElement'
import ParallaxImage from '../components/ui/ParallaxImage'
import Reveal from '../components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { getEmployeeSession } from '../lib/employeeSession'
import { getEmployeeProfile } from '../lib/employeeProfile'
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
  confirmMockSubscriptionPayment,
  previewSubscriptionCoupon,
} from '../lib/employeeSubscription'
import { openRazorpayCheckout } from '../lib/razorpay'
import { EMPLOYEE_PRICING_DATA } from '../lib/content'
import CouponBox from '../components/ui/CouponBox'

const NEVER_CHARGED = [
  ['Applying to a job', 'Every requirement on your portal is free to apply to.'],
  ['Being shortlisted', 'Employers pay Mzobs for shortlists — you never do.'],
  ['Getting placed', 'No success fee, no cut of your salary. Ever.'],
]

const WHY_PREMIUM = [
  {
    icon: FileCheck,
    title: 'Verified by real recruiters',
    desc: 'Your resume is checked and structured by our team, not left to a bot.',
    bg: 'bg-(--jobs-teal-tint)',
    text: 'text-(--jobs-teal-dark)',
  },
  {
    icon: Sparkles,
    title: 'Mock interviews',
    desc: 'Practice with real feedback before you meet an actual hiring manager.',
    bg: 'bg-(--jobs-blue-tint)',
    text: 'text-(--jobs-blue-dark)',
  },
  {
    icon: Users,
    title: 'In front of real employers',
    desc: 'Every company on Mzobs is vetted — no fake listings, no ghost jobs.',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    icon: Award,
    title: 'Lifetime access',
    desc: 'Pay once. No renewal, no monthly fee, no expiry — ever.',
    bg: 'bg-(--jobs-gold-soft)',
    text: 'text-(--jobs-gold)',
  },
]

export default function EmployeeSubscription() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [couponResult, setCouponResult] = useState(null)

  function reload(tok) {
    return getEmployeeProfile(tok).then(setProfile)
  }

  useEffect(() => {
    const session = getEmployeeSession()
    if (!session?.token) {
      navigate('/employees/signin?redirect=%2Femployees%2Fsubscription')
      return
    }
    setToken(session.token)
    reload(session.token)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

  async function handlePay() {
    if (!token) return
    setPayError('')
    setPaying(true)
    try {
      const order = await createSubscriptionOrder(token, couponResult?.code)
      if (order.mock) {
        await confirmMockSubscriptionPayment(token, order.orderId)
      } else {
        const result = await openRazorpayCheckout(order)
        await verifySubscriptionPayment(token, {
          razorpay_order_id: result.razorpay_order_id,
          razorpay_payment_id: result.razorpay_payment_id,
          razorpay_signature: result.razorpay_signature,
        })
      }
      await reload(token)
    } catch (err) {
      setPayError(err.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  const isPaid = profile?.subscription?.status === 'paid'
  const fee = profile?.subscription?.amount ?? 99

  return (
    <div className="min-h-screen bg-white text-(--jobs-navy) font-sans antialiased selection:bg-blue-200">
      <Seo path="/employees/subscription" title="Subscription — Mzobs" noindex />
      <Navbar />

      {loading ? (
        <div className="pt-40 pb-24 flex items-center justify-center text-(--jobs-ink-soft)">
          <Loader2 size={22} className="animate-spin mr-2" /> Loading...
        </div>
      ) : error ? (
        <div className="pt-40 pb-24 text-center">
          <p className="text-[14px] font-semibold text-red-600">{error}</p>
          <Link to="/employees/signin?redirect=%2Femployees%2Fsubscription" className="inline-block mt-4 text-[13.5px] font-bold text-(--jobs-blue-dark) hover:underline">
            Sign in again
          </Link>
        </div>
      ) : (
        <>
          <section className="pt-28 pb-8 px-6 md:px-10">
            <div className="max-w-5xl mx-auto">
              <Link to="/employees/profile" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors mb-6">
                <ArrowLeft size={15} /> Back to profile
              </Link>

              {/* Hero card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-(--jobs-navy-deep) to-(--jobs-navy) text-white p-8 sm:p-12"
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <ParallaxImage
                    src="/images/new_images/cta_band.jpg"
                    alt=""
                    offset={30}
                    className="w-full h-full object-cover opacity-[0.16]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-(--jobs-navy-deep) via-(--jobs-navy-deep)/85 to-(--jobs-navy)/60 pointer-events-none" />
                <FloatingElement duration={8} distance={22} className="absolute -top-10 -right-10 w-72 h-72 bg-(--jobs-teal)/20 rounded-full blur-3xl pointer-events-none" />
                <FloatingElement duration={10} distance={16} className="absolute -bottom-16 -left-10 w-64 h-64 bg-(--jobs-gold)/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide mb-4 ${
                        isPaid ? 'bg-(--jobs-teal)/20 text-(--jobs-teal)' : 'bg-white/15 text-white/80'
                      }`}
                    >
                      {isPaid ? <ShieldCheck size={12} /> : <Sparkles size={12} />} {isPaid ? 'Active' : 'Not yet active'}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Placement Support Programme</h1>
                    <p className="text-[14px] text-white/70 mt-2.5 max-w-md leading-relaxed">
                      {isPaid
                        ? `You're all set — every premium feature is unlocked, for life.${profile.subscription?.paidOn ? ` Paid on ${new Date(profile.subscription.paidOn).toLocaleDateString('en-IN')}.` : ''}`
                        : 'One-time fee. Lifetime access. No renewal, no hidden charges, ever.'}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
                    {couponResult ? (
                      <>
                        <div className="text-[15px] text-white/50 line-through">₹{fee}</div>
                        <div className="text-5xl font-black tracking-tight">₹{couponResult.finalAmount}</div>
                      </>
                    ) : (
                      <div className="text-5xl font-black tracking-tight">₹{fee}</div>
                    )}
                    <div className="text-[12.5px] text-white/60 mt-1">{isPaid ? 'Paid once, valid for life' : 'one-time payment'}</div>
                    {!isPaid && (
                      <>
                        <button
                          type="button"
                          onClick={handlePay}
                          disabled={paying}
                          className="mt-4 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-(--jobs-teal) text-(--jobs-navy-deep) text-[14px] font-bold hover:bg-white transition-colors disabled:opacity-60 w-full sm:w-auto"
                        >
                          {paying ? <Loader2 size={16} className="animate-spin" /> : null}
                          {paying ? 'Processing...' : `Pay ₹${couponResult?.finalAmount ?? fee} now`}
                        </button>
                        <div className="mt-3 sm:w-72">
                          <CouponBox
                            onPreview={previewSubscriptionCoupon}
                            applied={couponResult}
                            onApply={setCouponResult}
                            onRemove={() => setCouponResult(null)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {payError && <p className="relative z-10 text-[12.5px] text-red-300 mt-4">{payError}</p>}
              </motion.div>
            </div>
          </section>

          {/* Why premium */}
          <section className="py-14 px-6 md:px-10">
            <div className="max-w-5xl mx-auto">
              <Reveal direction="up" className="max-w-xl mb-8">
                <h2 className="text-2xl sm:text-[28px] font-black tracking-tight text-(--jobs-navy)">What's included</h2>
                <p className="mt-2 text-[14px] text-(--jobs-ink-soft) leading-relaxed">{EMPLOYEE_PRICING_DATA.desc}</p>
              </Reveal>

              <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {WHY_PREMIUM.map((item) => (
                  <StaggerItem key={item.title}>
                    <div className="h-full rounded-2xl border border-(--jobs-border) bg-white p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                        <item.icon size={19} className={item.text} />
                      </div>
                      <h3 className="text-[14px] font-black text-(--jobs-navy) mb-1.5">{item.title}</h3>
                      <p className="text-[12.5px] text-(--jobs-ink-soft) leading-relaxed">{item.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </section>

          {/* Full perk list + never charged */}
          <section className="pb-16 px-6 md:px-10">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-2xl border border-(--jobs-teal-dark)/15 bg-(--jobs-teal-tint) p-6 sm:p-7">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-(--jobs-teal)/20 rounded-full blur-3xl pointer-events-none" />
                <h3 className="relative z-10 text-[15px] font-black text-(--jobs-navy) mb-4">Everything you unlock</h3>
                <ul className="relative z-10 space-y-3">
                  {EMPLOYEE_PRICING_DATA.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="text-(--jobs-teal-dark) shrink-0 mt-0.5" />
                      <span className="text-[13.5px] text-(--jobs-navy) font-medium leading-relaxed">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-(--jobs-border) bg-white p-6 sm:p-7">
                <h3 className="text-[15px] font-black text-(--jobs-navy) mb-4">You'll never be charged for</h3>
                <ul className="space-y-4">
                  {NEVER_CHARGED.map(([t, b]) => (
                    <li key={t} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={15} />
                      </div>
                      <div>
                        <p className="text-[13.5px] font-bold text-(--jobs-navy)">{t}</p>
                        <p className="text-[12.5px] text-(--jobs-ink-soft) mt-0.5">{b}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Payment history */}
          <section className="pb-20 px-6 md:px-10">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-2xl border border-(--jobs-border) bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-(--jobs-border)">
                  <h3 className="text-[15px] font-black text-(--jobs-navy)">Payment history</h3>
                </div>
                <div className="p-6">
                  {isPaid ? (
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-[13.5px] font-semibold text-(--jobs-navy)">Mzobs placement programme — one-time fee</p>
                        <p className="text-[12px] text-(--jobs-ink-soft) mt-0.5">
                          {profile.subscription?.paidOn ? new Date(profile.subscription.paidOn).toLocaleDateString('en-IN') : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[14px] font-black text-(--jobs-navy)">₹{fee}</span>
                        <span className="px-2.5 py-1 rounded-full bg-(--jobs-teal-tint) text-(--jobs-teal-dark) text-[11px] font-bold">Paid</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-(--jobs-ink-soft)">No payment recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}
