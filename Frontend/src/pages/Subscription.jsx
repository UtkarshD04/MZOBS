import { ShieldCheck, Video, Layers, Send, GraduationCap, MessageSquare, Download, Info, Check } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import CountUp from '../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { INVOICES, PROGRAM_FEE, SUBSCRIPTION, USER } from '../lib/data'
import { fmtINR } from '../lib/utils'

const UNLOCKS = [
  [ShieldCheck, 'Resume verification', 'Our team reviews your resume line by line and verifies your work history before any employer sees it.'],
  [Video, 'Mock interview with our panel', 'A real interview round with a Mzobs panel member, with written feedback and a score.'],
  [Layers, 'Skill track assignment', 'We place you in the track that matches your strengths, so you are matched against the right requirements.'],
  [Send, 'Profile dispatch to employers', 'When a matching requirement opens, we shortlist and send your resume to the company directly.'],
  [GraduationCap, 'Training & assessments', 'Full access to courses, practice tests and live sessions for your track.'],
  [MessageSquare, 'Placement desk support', 'Direct line to the Mzobs team through your entire job search.'],
]

export default function Subscription() {
  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-sm text-ink-secondary mt-1">Your one-time ₹{PROGRAM_FEE} Placement Support Programme.</p>
      </StaggerItem>

      <StaggerItem>
        <div className="rounded-2xl p-6 text-white relative overflow-hidden mb-5 bg-gradient-to-br from-navy-950 to-navy-900">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(320px 220px at 88% 20%, rgba(198,138,31,.25), transparent 65%), radial-gradient(280px 260px at 8% 95%, rgba(125,95,214,.20), transparent 65%)',
            }}
          />
          <div className="flex items-center justify-between flex-wrap gap-4 relative">
            <div>
              <Badge dot={false} className="!bg-white/15 !text-white">
                Active
              </Badge>
              <div className="text-2xl font-bold tracking-tight mt-2.5">{SUBSCRIPTION.name}</div>
              <div className="text-[13px] text-white/70 mt-1.5">
                Purchased {SUBSCRIPTION.purchasedOn} · One-time payment · No renewal, no monthly fee
              </div>
              <div className="text-[13px] text-white/70 mt-1">
                Candidate ID {USER.candidateId}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[30px] font-bold">
                <CountUp value={PROGRAM_FEE} prefix="₹" duration={900} />
              </div>
              <div className="text-xs text-white/60">Paid once, valid for life</div>
            </div>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem className="mb-6">
        <Card pad className="flex items-start gap-3 border-gold-dot/40 bg-gold-tint">
          <Info size={18} className="text-gold-strong mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[13.5px] font-semibold">This is placement support, not a job guarantee</div>
            <p className="text-[13px] text-ink-secondary mt-1">
              The ₹{PROGRAM_FEE} fee covers verification, a mock interview, training and getting your resume in front of hiring companies. Whether you
              are selected is the employer's decision — we do not promise a job, and we never charge you again at any stage.
            </p>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="text-xl font-bold mb-3">What your ₹{PROGRAM_FEE} unlocks</StaggerItem>
      <StaggerItem className="grid md:grid-cols-3 gap-5 mb-6">
        {UNLOCKS.map(([Icon, title, desc]) => (
          <Card key={title} pad>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center">
                <Icon size={17} />
              </div>
              <Check size={15} className="text-green" />
            </div>
            <div className="text-[15px] font-semibold mt-3">{title}</div>
            <div className="text-xs text-ink-tertiary mt-1 leading-relaxed">{desc}</div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-6">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">What you will never be charged for</span>
          </CardHead>
          <div className="p-[22px] grid md:grid-cols-3 gap-4">
            {[
              ['Applying to a job', 'Every requirement on your portal is free to apply to.'],
              ['Being shortlisted', 'Employers pay Mzobs for shortlists — you never do.'],
              ['Getting placed', 'No success fee, no cut of your salary. Ever.'],
            ].map(([t, b]) => (
              <div key={t} className="flex gap-2.5">
                <div className="w-[30px] h-[30px] rounded-[9px] bg-green-tint text-green flex items-center justify-center flex-shrink-0">
                  <Check size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{t}</div>
                  <div className="text-xs text-ink-tertiary mt-0.5">{b}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Payment history</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Description', 'Date', 'Amount', 'Status', '']}>
              {INVOICES.map((i) => (
                <Tr key={i.id}>
                  <Td>{i.desc}</Td>
                  <Td>{i.date}</Td>
                  <Td className="font-bold">{fmtINR(i.amount)}</Td>
                  <Td>
                    <Badge tone="green">Paid</Badge>
                  </Td>
                  <Td>
                    <Button variant="ghost" size="sm">
                      <Download size={14} /> Invoice
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
