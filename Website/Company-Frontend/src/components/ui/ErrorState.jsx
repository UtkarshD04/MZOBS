import { AlertTriangle } from 'lucide-react'
import EmptyState from './EmptyState'
import Button from './Button'

export default function ErrorState({ title = 'Something went wrong', body = "We couldn't load this data. Please try again.", onRetry }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      tone="red"
      title={title}
      body={body}
      action={
        onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  )
}
