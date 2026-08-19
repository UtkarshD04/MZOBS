import { useState } from 'react'
import * as Icons from 'lucide-react'
import { Check, GraduationCap } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { PillTabs } from '../components/ui/Tabs'
import EmptyState from '../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { NOTIFS } from '../lib/data'
import { useApp } from '../context/AppContext'

const toneClass = { navy: 'bg-navy-tint text-navy', gold: 'bg-gold-tint text-gold-strong', green: 'bg-green-tint text-green' }
const TABS = ['All', 'Unread', 'Applications', 'Resume', 'Interviews', 'Training']
const TAB_CATS = [null, null, 'applications', 'resume', 'interviews', 'training']

function NotifRow({ n }) {
  const Icon = Icons[n.ic]
  return (
    <div className="flex gap-[11px] px-4 py-[13px] border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-hover">
      <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${toneClass[n.tone]}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold">{n.title}</span>
          {n.unread && <span className="w-2 h-2 rounded-full bg-gold-dot flex-shrink-0" />}
        </div>
        <div className="text-xs text-ink-tertiary mt-1">{n.body}</div>
        <div className="text-xs text-ink-tertiary mt-1">{n.time}</div>
      </div>
    </div>
  )
}

export default function Notifications() {
  const [tab, setTab] = useState(0)
  const { addToast } = useApp()

  const cat = TAB_CATS[tab]
  const list = tab === 1 ? NOTIFS.filter((n) => n.unread) : cat ? NOTIFS.filter((n) => n.cat === cat) : NOTIFS

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-ink-secondary mt-1">Stay updated on your career journey.</p>
        </div>
        <Button onClick={() => addToast('success', 'All notifications marked as read')}>
          <Check size={15} /> Mark all read
        </Button>
      </StaggerItem>

      <StaggerItem className="mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
      </StaggerItem>

      <StaggerItem>
        <Card>
          {list.length === 0 && cat === 'training' ? (
            <EmptyState icon={GraduationCap} title="No training notifications" body="You'll see updates about courses and live sessions here." />
          ) : list.length === 0 ? (
            <EmptyState title="You're all caught up" body="Nothing new to see here." />
          ) : (
            <div>
              {list.map((n, i) => (
                <NotifRow key={i} n={n} />
              ))}
            </div>
          )}
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
