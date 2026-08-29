import { Sun, Moon } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { useApp } from '../../context/AppContext'
import { useMeQuery } from '../../hooks/useAuth'

export default function Settings() {
  const { isDark, toggleTheme } = useApp()
  const { data: me, isLoading } = useMeQuery()

  if (isLoading) return <PageSkeleton />

  const isAdmin = me?.accessLevel === 'admin'

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-ink-secondary mt-1">Your account and appearance preferences.</p>
      </StaggerItem>

      <StaggerItem className="mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Profile</span>
          </CardHead>
          <div className="p-[22px] flex items-center gap-4">
            <Avatar initials={me?.initials} size="lg" />
            <div>
              <div className="text-[15px] font-semibold">{me?.name}</div>
              <div className="text-[13px] text-ink-secondary mt-0.5">{me?.email}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge tone="navy">{me?.role}</Badge>
                <Badge tone={isAdmin ? 'gold' : 'gray'}>{isAdmin ? 'Owner' : 'Worker'}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Appearance</span>
          </CardHead>
          <div className="p-[22px] flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-semibold">Theme</div>
              <div className="text-xs text-ink-tertiary mt-0.5">Switch between light and dark mode.</div>
            </div>
            <Button variant="secondary" onClick={toggleTheme}>
              {isDark ? <Moon size={15} /> : <Sun size={15} />} {isDark ? 'Dark' : 'Light'}
            </Button>
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
