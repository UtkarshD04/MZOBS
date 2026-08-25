import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'

export default function ComingSoon({ icon, title, subtitle }) {
  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-secondary mt-1">{subtitle}</p>}
      </StaggerItem>
      <StaggerItem>
        <Card>
          <EmptyState icon={icon} title="Coming soon" body={`${title} is still being built. Check back shortly.`} />
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
