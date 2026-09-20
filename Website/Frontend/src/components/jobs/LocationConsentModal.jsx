import { MapPin } from 'lucide-react'
import Button from '../ui/Button'
import { ModalHead, ModalBody, ModalFoot } from '../ui/Modal'

// Shown BEFORE the browser's own location prompt ("Nearest to me" sort), so people
// know why we're asking and how it's used. Not now / close never triggers the prompt.
export default function LocationConsentModal({ onAllow, onCancel }) {
  return (
    <>
      <ModalHead title="Allow location access?" onClose={onCancel} />
      <ModalBody>
        <div className="flex items-start gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-navy-tint text-navy flex items-center justify-center flex-shrink-0">
            <MapPin size={19} />
          </span>
          <p className="text-[14px] text-ink-secondary leading-relaxed">
            Mzobs uses your location once, right now, to show the jobs nearest to you first. It isn't tracked in the background or stored on your profile,
            and you can turn it off anytime in your browser settings.
          </p>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button variant="secondary" onClick={onCancel}>
          Not now
        </Button>
        <Button variant="primary" onClick={onAllow} autoFocus>
          Allow location
        </Button>
      </ModalFoot>
    </>
  )
}
