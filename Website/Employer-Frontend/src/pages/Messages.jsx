import { MessageSquare } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

export default function Messages() {
  return (
    <div>
      <PageHeader title="Messages" subtitle="Direct conversations with candidates you've shortlisted." />
      <Card>
        <EmptyState
          icon={MessageSquare}
          title="Messaging isn't available yet"
          body="Direct candidate messaging is coming to MZOBS Employer soon. For now, use Notify from a candidate's profile to reach out, or contact Support for help coordinating with a candidate."
        />
      </Card>
    </div>
  )
}
