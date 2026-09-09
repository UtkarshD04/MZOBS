import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Switch from '../components/ui/Switch'
import Bar from '../components/ui/Bar'
import { Field, Input, Select } from '../components/ui/Field'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton, Skeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { useApp } from '../context/AppContext'
import { openDeleteAccountModal } from '../lib/modals'
import { cn } from '../lib/utils'
import { useProfileQuery, useUpdateProfileMutation } from '../hooks/useProfile'
import { useNotificationPreferencesQuery, useUpdateNotificationPreferencesMutation } from '../hooks/useNotificationPreferences'
import { sendTestPushNotification } from '../services/notificationsService'

const TABS = ['Account', 'Password', 'Privacy', 'Notifications', 'Delete Account']

// Mirrors the backend's NotificationPreference categories 1:1 (see
// Backend/src/models/NotificationPreference.js) — no made-up categories that
// don't actually map to a stored preference.
const NOTIFICATION_CATEGORIES = [
  { key: 'applications', label: 'Application updates' },
  { key: 'resume', label: 'Resume status updates' },
  { key: 'interviews', label: 'Interview reminders' },
  { key: 'training', label: 'Training & mock interviews' },
  { key: 'track', label: 'Skill track updates' },
  { key: 'system', label: 'Account & payment updates' },
]

function PrivacyRow({ title, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-3.5 border-t border-border first:border-t-0">
      <div>
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="text-xs text-ink-tertiary mt-1 max-w-[420px]">{desc}</div>
      </div>
      <Switch on={on} onChange={setOn} />
    </div>
  )
}

export default function Settings() {
  const [tab, setTab] = useState(0)
  const app = useApp()
  const { data: profile, isLoading, isError, refetch } = useProfileQuery()
  const updateProfile = useUpdateProfileMutation()
  const { data: notifPrefs, isLoading: notifPrefsLoading } = useNotificationPreferencesQuery({ enabled: tab === 3 })
  const updateNotifPrefs = useUpdateNotificationPreferencesMutation()
  const [name, setName] = useState(null)
  const [phone, setPhone] = useState(null)

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  function toggleNotifChannel(category, channel, value) {
    updateNotifPrefs.mutate({ [category]: { [channel]: value } })
  }

  function saveAccount() {
    updateProfile.mutate(
      { name: name ?? profile.name, phone: phone ?? profile.phone },
      {
        onSuccess: () => app.addToast('success', 'Account details saved'),
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Could not save. Please try again.'),
      }
    )
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-ink-secondary mt-1">Manage your account, security and preferences.</p>
      </StaggerItem>

      <StaggerItem className="grid md:grid-cols-[220px_1fr] gap-6">
        <nav>
          {TABS.map((t, i) => (
            <div
              key={t}
              onClick={() => setTab(i)}
              className={cn('px-2.5 py-[9px] rounded-[9px] cursor-pointer mb-0.5 text-[13.5px] font-medium', i === tab ? 'bg-navy-tint text-navy font-semibold' : 'text-ink-secondary hover:bg-surface-hover')}
            >
              {t}
            </div>
          ))}
        </nav>

        <div>
          {tab === 0 && (
            <Card pad>
              <div className="text-xl font-bold mb-4">Account details</div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name">
                  <Input value={name ?? profile.name ?? ''} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Email">
                  <Input value={profile.email} disabled />
                </Field>
                <Field label="Phone">
                  <Input value={phone ?? profile.phone ?? ''} onChange={(e) => setPhone(e.target.value)} />
                </Field>
                <Field label="Preferred language">
                  <Select defaultValue="English">
                    <option>English</option>
                    <option>Hindi</option>
                  </Select>
                </Field>
              </div>
              <Button variant="primary" onClick={saveAccount} disabled={updateProfile.isPending}>
                Save changes
              </Button>
            </Card>
          )}
          {tab === 1 && (
            <Card pad className="max-w-[440px]">
              <div className="text-xl font-bold mb-4">Change password</div>
              <Field label="Current password">
                <Input type="password" placeholder="Enter current password" />
              </Field>
              <Field label="New password">
                <Input type="password" placeholder="Enter new password" />
              </Field>
              <Bar value={70} tone="green" thin className="mb-1" />
              <div className="text-xs text-ink-tertiary mb-4">Strong password</div>
              <Field label="Confirm new password">
                <Input type="password" placeholder="Re-enter new password" />
              </Field>
              <Button variant="primary" onClick={() => app.addToast('success', 'Password updated successfully')}>
                Update password
              </Button>
            </Card>
          )}
          {tab === 2 && (
            <Card pad>
              <div className="text-xl font-bold mb-2">Privacy</div>
              <PrivacyRow title="Profile visible to partner recruiters" desc="Allow verified companies to view your profile before applying" defaultOn />
              <PrivacyRow title="Share assessment scores with recruiters" desc="Include skill test results when applying" defaultOn />
              <PrivacyRow title="Allow data sharing for career insights" desc="Anonymized data used to improve recommendations" />
            </Card>
          )}
          {tab === 3 && (
            <Card pad>
              <div className="text-xl font-bold mb-1">Notification preferences</div>
              <p className="text-[13px] text-ink-secondary mb-4">Email and SMS are off by default — turn them on for the updates you actually want sent to you.</p>
              {notifPrefsLoading ? (
                <Skeleton className="w-full h-40" />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {['Category', 'In-app', 'Email', 'SMS'].map((c) => (
                          <th key={c} className="text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-tertiary px-4 py-3 bg-surface-sunken border-b border-border">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {NOTIFICATION_CATEGORIES.map(({ key, label }) => (
                        <tr key={key} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-3 text-[13.5px]">{label}</td>
                          {['inApp', 'email', 'sms'].map((channel) => (
                            <td key={channel} className="px-4 py-3">
                              <Switch on={notifPrefs?.[key]?.[channel] ?? channel === 'inApp'} onChange={(v) => toggleNotifChannel(key, channel, v)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
                <div>
                  <div className="text-[13px] font-semibold">Push notifications</div>
                  <div className="text-xs text-ink-tertiary mt-1">Send yourself a test push to confirm they're working on this device.</div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    sendTestPushNotification()
                      .then(() => app.addToast('success', 'Test notification sent'))
                      .catch(() => app.addToast('error', 'Could not send test notification'))
                  }
                >
                  Send test notification
                </Button>
              </div>
            </Card>
          )}
          {tab === 4 && (
            <Card pad className="border-red">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={20} className="text-red" />
                <span className="text-xl font-bold text-red">Danger zone</span>
              </div>
              <p className="text-[13px] text-ink-secondary mb-4">Deleting your account removes your resume, assessment history and application data permanently. This cannot be undone.</p>
              <Button variant="danger" onClick={() => openDeleteAccountModal(app)}>
                Delete my account
              </Button>
            </Card>
          )}
        </div>
      </StaggerItem>
    </StaggerGroup>
  )
}
