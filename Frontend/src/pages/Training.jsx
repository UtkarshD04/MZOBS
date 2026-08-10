import { useNavigate } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Bar from '../components/ui/Bar'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { COURSES } from '../lib/data'
import { categoryOf } from '../lib/category'

const gradientTones = {
  navy: 'from-navy-700 to-navy',
  violet: 'from-violet/70 to-violet',
  teal: 'from-teal/70 to-teal',
  amber: 'from-amber/70 to-amber',
  green: 'from-green/70 to-green',
  gray: 'from-ink-tertiary/70 to-ink-tertiary',
}

export default function Training() {
  const navigate = useNavigate()

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Training</h1>
        <p className="text-sm text-ink-secondary mt-1">Courses assigned based on your assessment results.</p>
      </StaggerItem>

      <StaggerItem className="grid md:grid-cols-3 gap-5 mb-4">
        {COURSES.map((c) => {
          const cat = categoryOf(c.category)
          return (
            <Card key={c.title} hover>
              <div className={`h-[104px] rounded-t-xl bg-gradient-to-br ${gradientTones[cat.tone]} relative flex items-end justify-between p-3`}>
                <span className="text-[11px] font-bold text-white bg-white/15 rounded-full px-2.5 py-0.5">{cat.label}</span>
                <span className="text-[11px] font-bold text-white bg-white/15 rounded-full px-2.5 py-0.5">
                  {c.done}/{c.lessons} lessons
                </span>
              </div>
              <div className="p-[22px]">
                <div className="text-[15px] font-semibold">{c.title}</div>
                <div className="text-xs text-ink-tertiary mt-1">Mentor: {c.mentor}</div>
                <Bar value={c.progress} thin className="mt-3" />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-ink-tertiary">{c.progress}% complete</span>
                  <span className="text-navy font-semibold text-xs cursor-pointer hover:underline">Continue</span>
                </div>
              </div>
            </Card>
          )
        })}
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-2 gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Assignments</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13.5px] font-semibold">Excel Case Assignment 3</div>
                <div className="text-xs text-ink-tertiary mt-0.5">Due 8 Aug 2026</div>
              </div>
              <Badge tone="gold">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13.5px] font-semibold">SQL Query Set 2</div>
                <div className="text-xs text-ink-tertiary mt-0.5">Submitted 2 Aug 2026</div>
              </div>
              <Badge tone="green">Reviewed</Badge>
            </div>
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Live sessions</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13.5px] font-semibold">Case Study Interviews</div>
                <div className="text-xs text-ink-tertiary mt-0.5">6 Aug 2026, 6:00 PM</div>
              </div>
              <Button size="sm">Join</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13.5px] font-semibold">Excel Power Tools Workshop</div>
                <div className="text-xs text-ink-tertiary mt-0.5">10 Aug 2026, 5:00 PM</div>
              </div>
              <Button size="sm">Remind me</Button>
            </div>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-2 gap-5">
        <Card pad className="flex items-center gap-4">
          <Avatar initials="KM" size="lg" gold />
          <div className="flex-1">
            <div className="text-[15px] font-semibold">Karan Mehta</div>
            <div className="text-[13px] text-ink-secondary">Your assigned mentor · Ex-Deloitte Analyst</div>
          </div>
          <Button onClick={() => navigate('/app/messages')}>Message</Button>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Certificates earned</span>
          </CardHead>
          <div className="p-[22px] flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
              <BadgeCheck size={22} />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold">MS Excel Basics — Certified</div>
              <div className="text-xs text-ink-tertiary">Issued 21 Jul 2026</div>
            </div>
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
