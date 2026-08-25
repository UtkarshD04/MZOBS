import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AlertTriangle, KeyRound, Save, ShieldCheck, Smartphone } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { Field, Input } from '../components/ui/Field'
import Switch from '../components/ui/Switch'
import { Tabs } from '../components/ui/Tabs'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useMeQuery, useUpdateMe } from '../hooks/useMe'
import { sendTestPushNotification } from '../services/notificationsService'

const TAB_LABELS = ['Profile', 'Security', 'Notifications', 'Danger Zone']

export default function Settings() {
  const [tab, setTab] = useState(0)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState({ candidates: true, interviews: true, offers: true, billing: true, product: false })
  const { data: me, isLoading } = useMeQuery()
  const updateMe = useUpdateMe()
  const [name, setName] = useState('')

  useEffect(() => {
    if (me) setName(me.name)
  }, [me])

  if (isLoading || !me) return <PageSkeleton />

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, security and notification preferences." />

      <Card>
        <div className="px-[22px] pt-1">
          <Tabs items={TAB_LABELS} active={tab} onChange={setTab} />
        </div>

        {tab === 0 && (
          <CardBody className="max-w-xl">
            <div className="flex items-center gap-4 mb-5">
              <Avatar initials={me.initials} size="lg" />
              <div>
                <Button variant="secondary" size="sm" onClick={() => toast.success('Profile photo updated')}>Change Photo</Button>
                <p className="text-[11.5px] text-ink-tertiary mt-1.5">JPG or PNG, up to 2MB.</p>
              </div>
            </div>
            <Field label="Full Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Role" hint="Managed from the Team page"><Input value={me.role} disabled /></Field>
            <Field label="Work Email"><Input type="email" defaultValue={me.email} disabled /></Field>
            <Button variant="primary" size="md" loading={updateMe.isPending} onClick={() => updateMe.mutate({ name })}>
              <Save size={15} /> Save Changes
            </Button>
          </CardBody>
        )}

        {tab === 1 && (
          <CardBody className="max-w-xl flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3"><KeyRound size={16} className="text-navy" /><span className="text-[13.5px] font-semibold">Change Password</span></div>
              <Field label="Current Password"><Input type="password" placeholder="••••••••" /></Field>
              <Field label="New Password"><Input type="password" placeholder="••••••••" /></Field>
              <Field label="Confirm New Password"><Input type="password" placeholder="••••••••" /></Field>
              <Button variant="primary" size="md" onClick={() => toast.success('Password updated')}>Update Password</Button>
            </div>
            <div className="pt-5 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-[10px] bg-green-tint text-green flex items-center justify-center"><Smartphone size={16} /></span>
                <div>
                  <div className="text-[13px] font-semibold">Two-Factor Authentication</div>
                  <div className="text-[12px] text-ink-tertiary">Add an extra layer of security to your account</div>
                </div>
              </div>
              <Switch on={false} onChange={() => toast('Two-factor setup would open here.', { icon: '🔐' })} />
            </div>
            <div className="flex items-center gap-2 text-[12.5px] text-ink-secondary bg-navy-tint/50 rounded-lg px-3.5 py-3">
              <ShieldCheck size={15} className="text-navy flex-shrink-0" /> Your account was last accessed from Bengaluru, India on 6 Aug 2026.
            </div>
          </CardBody>
        )}

        {tab === 2 && (
          <CardBody className="max-w-xl flex flex-col gap-1">
            {[
              ['candidates', 'Resume batch delivered', 'Get notified when Mzobs delivers profiles for a requirement'],
              ['interviews', 'Interview reminders', 'Reminders before scheduled interviews'],
              ['offers', 'Offer status updates', 'When a candidate accepts or declines an offer'],
              ['billing', 'Invoices & payments', 'When Mzobs raises an invoice for a new requirement'],
              ['product', 'Product updates', 'New features and platform announcements'],
            ].map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between py-3.5 border-b border-border last:border-b-0">
                <div>
                  <div className="text-[13px] font-semibold">{label}</div>
                  <div className="text-[12px] text-ink-tertiary mt-0.5">{desc}</div>
                </div>
                <Switch on={notifPrefs[key]} onChange={(v) => setNotifPrefs((p) => ({ ...p, [key]: v }))} />
              </div>
            ))}
            <div className="flex items-center justify-between pt-5 mt-2 border-t border-border">
              <div>
                <div className="text-[13px] font-semibold">Push notifications</div>
                <div className="text-[12px] text-ink-tertiary mt-0.5">Send yourself a test push to confirm they're working on this device.</div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => sendTestPushNotification().then(() => toast.success('Test notification sent')).catch(() => toast.error('Could not send test notification'))}
              >
                Send test notification
              </Button>
            </div>
          </CardBody>
        )}

        {tab === 3 && (
          <CardBody className="max-w-xl">
            <div className="flex gap-3.5 p-4 rounded-xl border border-red-tint bg-red-tint/40">
              <span className="w-9 h-9 rounded-[10px] bg-red-tint text-red flex items-center justify-center flex-shrink-0"><AlertTriangle size={17} /></span>
              <div>
                <div className="text-[13.5px] font-semibold text-red">Delete Account</div>
                <p className="text-[12.5px] text-ink-secondary mt-1 leading-relaxed">
                  Permanently delete your Mzobs employer account and all associated data. This cannot be undone, and active job postings will be removed immediately.
                </p>
                <Button variant="danger" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>Delete My Account</Button>
              </div>
            </div>
          </CardBody>
        )}
      </Card>

      <Card className="mt-5">
        <CardHead><CardTitle>Workspace</CardTitle></CardHead>
        <CardBody className="text-[12.5px] text-ink-secondary leading-relaxed">
          Company-level settings — locations, hiring contacts and verification — are managed from your{' '}
          <Link to="/company" className="text-navy font-semibold hover:underline">Company Profile</Link> page.
        </CardBody>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { setDeleteOpen(false); toast.success('Account deletion request submitted') }}
        title="Delete your account?"
        body="This will permanently remove your access and all workspace data. This action cannot be undone."
        confirmLabel="Yes, Delete Account"
      />
    </div>
  )
}
