import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from '../lib/config'

const LAST_UPDATED = 'August 18, 2026'

const SECTIONS = [
  {
    title: '1. What this policy covers',
    body: [
      'This Privacy Policy explains what information Mzobs collects from job seekers and employers who use our platform, how we use it, and the choices you have.',
    ],
  },
  {
    title: '2. Information we collect',
    body: [
      'Account details — your name, email, phone number, and password when you sign up.',
      'Profile & resume details — education, skills, work history, expected salary, preferred locations, resume file, and links (LinkedIn, GitHub, portfolio) you choose to add.',
      'Payment information — when you pay the one-time programme fee, payment is processed by our payment partner (Razorpay). Mzobs does not receive or store your card, UPI, or bank details — only the payment status and transaction reference.',
      'Usage data — basic information like login activity, device/browser type, and pages visited, used to keep the platform secure and working correctly.',
    ],
  },
  {
    title: '3. How we use your information',
    body: [
      'To verify your resume and work history, run your mock interview, and assign you to the right skill track.',
      'To match and share your profile with employers who have a matching, live requirement.',
      'To communicate with you about your application, verification status, and account.',
      'To improve Mzobs and keep the platform secure.',
    ],
  },
  {
    title: '4. When we share your information',
    body: [
      'Your verified profile and resume are shared with an employer only when there is a genuine, matching requirement open on Mzobs — not broadcast to every company on the platform.',
      'We share limited data with service providers who help us run Mzobs (for example, our payment processor and hosting/email providers), only as needed to provide the service.',
      'We do not sell your personal information to third parties.',
    ],
  },
  {
    title: '5. Data security',
    body: [
      'We use reasonable technical and organisational measures — including password hashing and access controls — to protect your information. No online service can guarantee absolute security, but we work to keep your data safe.',
    ],
  },
  {
    title: '6. Data retention',
    body: [
      'We retain your account and profile information for as long as your account is active, so we can continue matching you with employers. You can request deletion of your account at any time (see your rights below).',
    ],
  },
  {
    title: '7. Your rights',
    body: [
      'You can request access to, correction of, or deletion of your personal data by writing to us. We will respond within a reasonable time, subject to any records we are legally required to keep.',
    ],
  },
  {
    title: '8. Cookies',
    body: [
      'We use minimal, functional cookies/local storage to keep you signed in and remember your preferences. We do not use them for third-party advertising.',
    ],
  },
  {
    title: '9. Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. We will update the "Last updated" date above whenever we do.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Privacy Policy — Mzobs</title>
      <Navbar />

      <section className="relative bg-white pt-[76px] overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <Reveal direction="up" duration={0.7} scale={0.96} blur>
            <SectionLabel>Privacy Policy</SectionLabel>
            <h1 className="text-3xl sm:text-4xl font-black text-black leading-[1.15] tracking-tight">
              How We Handle <span className="text-[var(--careers-accent)]">Your Data</span>.
            </h1>
            <p className="text-sm text-[#9E9E9E] font-medium mt-3">Last updated: {LAST_UPDATED}</p>
          </Reveal>

          <div className="mt-10 space-y-9">
            {SECTIONS.map((section) => (
              <Reveal key={section.title} direction="up" duration={0.6} scale={0.98}>
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
              </Reveal>
            ))}

            <Reveal direction="up" duration={0.6} scale={0.98}>
              <div>
                <h2 className="text-lg font-black text-black mb-2">10. Contact us</h2>
                <p className="text-[13.5px] text-[#595959] leading-relaxed font-medium">
                  Questions about this Privacy Policy or your data? Reach us at{' '}
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
                <Link to="/terms-of-service" className="text-[var(--careers-accent)] font-bold hover:underline">
                  Terms of Service
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
