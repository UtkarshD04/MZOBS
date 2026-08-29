import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from '../lib/config'

const LAST_UPDATED = 'August 18, 2026'

const SECTIONS = [
  {
    title: '1. Agreement to these terms',
    body: [
      'These Terms of Service ("Terms") govern your use of Mzobs and the Placement Support Programme offered to job seekers ("candidates", "you"). By creating an account or making a payment, you agree to these Terms.',
    ],
  },
  {
    title: '2. What Mzobs provides — placement support, not a placement guarantee',
    body: [
      'Mzobs is a placement support service. Once your one-time fee is paid, our team verifies your resume, conducts a mock interview with written feedback, assigns you to a skill track, and forwards your profile to employers when a matching requirement opens.',
      'Mzobs does not guarantee a job offer, an interview, or employment of any kind. Whether you are shortlisted, interviewed, or hired is decided entirely by the employer — Mzobs has no control over and makes no promises about that outcome.',
    ],
  },
  {
    title: '3. Fees and payment — non-refundable',
    body: [
      'The Placement Support Programme costs a one-time fee of ₹299. There are no recurring charges, subscriptions, or paid tiers — you are never charged again after this payment.',
      'All payments made to Mzobs are final and non-refundable. This applies regardless of outcome, including if you are not shortlisted by any employer, not selected after an interview, or if your resume verification does not go the way you expected. By paying, you acknowledge and accept this no-refund policy.',
    ],
  },
  {
    title: '4. Your account',
    body: [
      'You must provide accurate, current information when creating your account and keep your login credentials confidential. You are responsible for all activity under your account.',
    ],
  },
  {
    title: '5. A note on fraud',
    highlight: true,
    body: [
      'Mzobs will never ask you to pay anything beyond the listed one-time programme fee to receive a job offer, an interview call, or a verification. If anyone contacts you claiming to represent Mzobs and asks for additional payment, treat it as fraudulent and report it to us immediately.',
    ],
  },
  {
    title: '6. Employer interactions',
    body: [
      'Mzobs introduces verified candidates to employers with matching requirements. Any offer, compensation, or employment terms are agreed directly between you and the employer — Mzobs is not a party to that employment relationship.',
    ],
  },
  {
    title: '7. Acceptable use',
    body: [
      'You agree not to submit false information, misrepresent your qualifications, or misuse the platform in any way that could harm Mzobs, employers, or other candidates.',
    ],
  },
  {
    title: '8. Suspension and termination',
    body: [
      'Mzobs may suspend or terminate an account that violates these Terms, submits fraudulent information, or misuses the platform, without entitlement to a refund of the programme fee already paid.',
    ],
  },
  {
    title: '9. Limitation of liability',
    body: [
      'Mzobs provides placement support on a best-effort basis and is not liable for hiring decisions, employment outcomes, or any indirect losses arising from your use of the platform.',
    ],
  },
  {
    title: '10. Changes to these terms',
    body: [
      'We may update these Terms from time to time. Continued use of Mzobs after a change means you accept the updated Terms.',
    ],
  },
]

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Terms of Service — Mzobs</title>
      <Navbar />

      <section className="relative bg-white pt-[76px] overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <Reveal direction="up" duration={0.7} scale={0.96} blur>
            <SectionLabel>Terms of Service</SectionLabel>
            <h1 className="text-3xl sm:text-4xl font-black text-black leading-[1.15] tracking-tight">
              The Rules Of Using <span className="text-[var(--careers-accent)]">Mzobs</span>.
            </h1>
            <p className="text-sm text-[#9E9E9E] font-medium mt-3">Last updated: {LAST_UPDATED}</p>
          </Reveal>

          <div className="mt-10 space-y-9">
            {SECTIONS.map((section) => (
              <Reveal key={section.title} direction="up" duration={0.6} scale={0.98}>
                {section.highlight ? (
                  <div className="flex items-start gap-3 bg-[#F5F5F5] border border-[#e0e0e0] rounded-2xl px-5 py-4">
                    <ShieldAlert size={18} className="text-[var(--careers-accent)] shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-base font-black text-black mb-1.5">{section.title}</h2>
                      {section.body.map((p, i) => (
                        <p key={i} className="text-[13.5px] text-[#595959] leading-relaxed font-medium">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-black text-black mb-2">{section.title}</h2>
                    <div className="space-y-2.5">
                      {section.body.map((p, i) => (
                        <p key={i} className="text-[13.5px] text-[#595959] leading-relaxed font-medium">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>
            ))}

            <Reveal direction="up" duration={0.6} scale={0.98}>
              <div>
                <h2 className="text-lg font-black text-black mb-2">11. Contact us</h2>
                <p className="text-[13.5px] text-[#595959] leading-relaxed font-medium">
                  Questions about these Terms? Reach us at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--careers-accent)] font-bold hover:underline">
                    {CONTACT_EMAIL}
                  </a>{' '}
                  or{' '}
                  <a href={`tel:${CONTACT_PHONE}`} className="text-[var(--careers-accent)] font-bold hover:underline">
                    {CONTACT_PHONE}
                  </a>
                  . {CONTACT_ADDRESS}.
                </p>
              </div>
            </Reveal>

            <Reveal direction="up" duration={0.6} scale={0.98}>
              <p className="text-[13px] text-[#9E9E9E] font-medium">
                See also our{' '}
                <Link to="/privacy-policy" className="text-[var(--careers-accent)] font-bold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
