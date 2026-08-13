import toast from 'react-hot-toast'
import { LifeBuoy, Mail, MessageCircle, Phone } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import Accordion from '../components/ui/Accordion'
import { useState } from 'react'
import { useSubmitTicket } from '../hooks/useSupport'

const FAQS = [
  { question: 'What exactly do I pay for?', answer: '₹2,000 per opening, paid upfront. For every opening you pay for, Mzobs delivers 5 screened resumes — so 100 openings means 500 profiles to choose from. There is no plan, no monthly fee and no success fee.' },
  { question: 'Why can\'t I see the people who applied?', answer: 'Applications go to Mzobs, not to you. Mzobs verifies each candidate\'s resume, runs a mock interview and shortlists against your brief. You receive the finished shortlist as a resume batch — which is the whole point of the service.' },
  { question: 'How does candidate verification work?', answer: 'Every candidate pays for the Mzobs placement programme, has their resume verified line by line, and clears a mock interview with a Mzobs panel before they are eligible for any batch.' },
  { question: 'Can I contact candidates directly?', answer: 'Yes. Once a profile is delivered in a batch, contact details are on the profile and you can reach out or schedule interviews through the platform.' },
  { question: 'What if I don\'t hire anyone from the batch?', answer: 'Talk to your account manager. Mzobs will keep sourcing against the openings you have already paid for rather than charging you again.' },
  { question: 'How do I close a requirement that\'s been filled?', answer: 'Open it from Requirements and choose "Close Requirement" from the actions menu. Mzobs stops sourcing against it immediately.' },
]

export default function Support() {
  const [form, setForm] = useState({ subject: '', category: 'General', message: '' })
  const submitTicket = useSubmitTicket()

  return (
    <div>
      <PageHeader title="Help & Support" subtitle="Get help from the Mzobs team, or browse answers to common questions." />

      <div className="grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
        <ContactCard icon={MessageCircle} title="Live Chat" desc="Avg. reply time: 3 minutes" action="Start Chat" onClick={() => toast('Live chat would open here.', { icon: '💬' })} />
        <ContactCard icon={Mail} title="Email Support" desc="support@mzobs.com" action="Send Email" onClick={() => toast.success('Opening your email client…')} />
        <ContactCard icon={Phone} title="Call Us" desc="+91 80 4567 8900 · Mon–Sat, 9am–7pm" action="Call Now" onClick={() => toast.success('Redirecting to dialer…')} />
      </div>

      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <Card className="col-span-2 max-xl:col-span-1">
          <CardHead><CardTitle>Frequently Asked Questions</CardTitle></CardHead>
          <CardBody>
            <Accordion items={FAQS} />
          </CardBody>
        </Card>

        <Card>
          <CardHead><CardTitle>Raise a Ticket</CardTitle></CardHead>
          <CardBody>
            <Field label="Subject">
              <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Briefly describe your issue" />
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                <option>General</option>
                <option>Billing</option>
                <option>Candidate Quality</option>
                <option>Technical Issue</option>
              </Select>
            </Field>
            <Field label="Message">
              <Textarea rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tell us more…" />
            </Field>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              loading={submitTicket.isPending}
              onClick={() => {
                if (!form.subject || !form.message) {
                  toast.error('Please fill in a subject and message.')
                  return
                }
                submitTicket.mutate(form, {
                  onSuccess: () => {
                    toast.success('Support ticket submitted — we\'ll respond within 24 hours.')
                    setForm({ subject: '', category: 'General', message: '' })
                  },
                  onError: () => toast.error('Could not submit your ticket. Please try again.'),
                })
              }}
            >
              <LifeBuoy size={15} /> Submit Ticket
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function ContactCard({ icon: Icon, title, desc, action, onClick }) {
  return (
    <Card hover pad className="flex items-start gap-3.5">
      <span className="w-10 h-10 rounded-xl bg-navy-tint text-navy flex items-center justify-center flex-shrink-0"><Icon size={18} /></span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold">{title}</div>
        <div className="text-[12px] text-ink-tertiary mt-0.5">{desc}</div>
        <button onClick={onClick} className="text-[12.5px] font-semibold text-navy hover:underline mt-2">{action} →</button>
      </div>
    </Card>
  )
}
