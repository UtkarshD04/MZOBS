import { ExternalLink } from 'lucide-react'
import { Modal } from './ui'
import { FILE_BASE_URL } from '../lib/config'

// Word files can't render in a browser frame, so they go through Google's
// viewer — same approach as Company-Frontend's ResumeViewerModal.
const OFFICE_DOC_RE = /\.(docx?|rtf|odt)$/i

/** `url` is the API's root-relative `/files/resume/:token` link (valid ~10 minutes). */
export const resumeHref = (url) => new URL(`${FILE_BASE_URL}${url}`, window.location.href).href

export function ResumeFrame({ url, fileName, title, className = 'h-[72vh]' }) {
  const href = resumeHref(url)
  const src = OFFICE_DOC_RE.test(fileName ?? '') ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(href)}` : href
  return <iframe src={src} title={title || 'CV'} className={`block w-full rounded-lg border border-line bg-[#f5f9fb] ${className}`} />
}

export function OpenResumeLink({ url }) {
  return (
    <a href={resumeHref(url)} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 text-[13px] font-medium hover:bg-line-2">
      <ExternalLink size={14} /> Open in new tab
    </a>
  )
}

/** `file`: { url, fileName?, name } or null. */
export function ResumeViewer({ file, onClose }) {
  return (
    <Modal open={!!file} onClose={onClose} title={file ? `${file.name} — CV` : 'CV'} subtitle={file?.fileName || undefined} width={960} footer={file && <OpenResumeLink url={file.url} />}>
      {file && <ResumeFrame url={file.url} fileName={file.fileName} title={`${file.name} — CV`} />}
    </Modal>
  )
}
