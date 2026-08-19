import { useNavigate } from 'react-router-dom'
import { MessageSquare, BookOpen, Mail } from 'lucide-react'
import Card from '../components/ui/Card'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'

export default function Support() {
  const navigate = useNavigate()

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-sm text-ink-secondary mt-1">We usually respond within a few hours.</p>
      </StaggerItem>
      <StaggerItem className="grid md:grid-cols-3 gap-5">
        <Card hover pad className="cursor-pointer" onClick={() => navigate('/app/messages')}>
          <MessageSquare size={22} className="text-navy" />
          <div className="text-[15px] font-semibold mt-3">Chat with Support</div>
          <div className="text-xs text-ink-tertiary mt-1">Get help with your account or payments</div>
        </Card>
        <Card hover pad className="cursor-pointer">
          <BookOpen size={22} className="text-navy" />
          <div className="text-[15px] font-semibold mt-3">Help Center</div>
          <div className="text-xs text-ink-tertiary mt-1">Browse guides and FAQs</div>
        </Card>
        <Card hover pad className="cursor-pointer">
          <Mail size={22} className="text-navy" />
          <div className="text-[15px] font-semibold mt-3">Email us</div>
          <div className="text-xs text-ink-tertiary mt-1">support@mzobs.com</div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
