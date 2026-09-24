import { ModalHead, ModalBody } from './ui/Modal'

// .doc/.docx/.rtf/.odt can't render natively in a browser tab — routed
// through Google's viewer to still show inline instead of downloading.
const OFFICE_DOC_RE = /\.(docx?|rtf|odt)(\?|$)/i

export function ResumeViewerModal({ url, fileName, onClose }) {
  const viewerSrc = OFFICE_DOC_RE.test(url) ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}` : url

  return (
    <>
      <ModalHead title={fileName || 'Resume'} onClose={onClose} />
      <ModalBody className="p-0">
        <iframe src={viewerSrc} title={fileName || 'Resume'} className="w-full h-[78vh] block" />
      </ModalBody>
    </>
  )
}
