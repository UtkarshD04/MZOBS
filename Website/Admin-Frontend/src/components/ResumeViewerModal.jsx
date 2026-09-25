import { Download } from 'lucide-react'
import { ModalHead, ModalBody, ModalFoot } from './ui/Modal'
import Button from './ui/Button'

// .doc/.docx/.rtf/.odt can't render natively in a browser tab — routed
// through Google's viewer to still show inline instead of downloading.
const OFFICE_DOC_RE = /\.(docx?|rtf|odt)(\?|$)/i

// Token links (/files/resume/:token) carry no extension, so the stored file
// name decides when there is one.
export function resumeViewerSrc(url, fileName) {
  return OFFICE_DOC_RE.test(fileName || url) ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}` : url
}

// The `download` attr is ignored for cross-origin URLs, and fetching the file
// as a blob fails on the redirect to S3 (no CORS there) — so ask the API for
// an attachment instead: `/files/resume/:token?download=1` makes the browser
// save the file. Opened in a new tab so an expired link shows its message
// there instead of navigating away from the panel; for a successful download
// the browser closes that tab again on its own.
export function downloadFile(url) {
  const href = `${url}${url.includes('?') ? '&' : '?'}download=1`
  window.open(href, '_blank', 'noopener')
}

export function ResumeViewerModal({ url, fileName, onClose }) {
  const viewerSrc = resumeViewerSrc(url, fileName)

  return (
    <>
      <ModalHead title={fileName || 'Resume'} onClose={onClose} />
      <ModalBody className="p-0">
        <iframe src={viewerSrc} title={fileName || 'Resume'} className="w-full h-[78vh] block" />
      </ModalBody>
      <ModalFoot>
        <Button variant="secondary" size="sm" onClick={() => downloadFile(url)}>
          <Download size={14} /> Download
        </Button>
      </ModalFoot>
    </>
  )
}
