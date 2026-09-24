import { useState } from 'react'
import { Download } from 'lucide-react'
import { ModalHead, ModalBody, ModalFoot } from './ui/Modal'
import Button from './ui/Button'

// .doc/.docx/.rtf/.odt can't render natively in a browser tab — routed
// through Google's viewer to still show inline instead of downloading.
const OFFICE_DOC_RE = /\.(docx?|rtf|odt)(\?|$)/i

// `download` attr is ignored for cross-origin URLs, so pull the file as a blob;
// fall back to opening it in a new tab if the fetch is blocked.
export async function downloadFile(url, fileName) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('fetch failed')
    const blobUrl = URL.createObjectURL(await res.blob())
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = fileName || url.split('/').pop().split('?')[0] || 'resume'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

export function ResumeViewerModal({ url, fileName, onClose }) {
  const [downloading, setDownloading] = useState(false)
  const viewerSrc = OFFICE_DOC_RE.test(url) ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}` : url

  return (
    <>
      <ModalHead title={fileName || 'Resume'} onClose={onClose} />
      <ModalBody className="p-0">
        <iframe src={viewerSrc} title={fileName || 'Resume'} className="w-full h-[78vh] block" />
      </ModalBody>
      <ModalFoot>
        <Button variant="secondary" size="sm" disabled={downloading} onClick={async () => { setDownloading(true); await downloadFile(url, fileName); setDownloading(false) }}>
          <Download size={14} /> {downloading ? 'Downloading…' : 'Download'}
        </Button>
      </ModalFoot>
    </>
  )
}

export function openResumeViewer(app, url, fileName) {
  app.openModal(<ResumeViewerModal url={url} fileName={fileName} onClose={app.closeModal} />, true)
}
