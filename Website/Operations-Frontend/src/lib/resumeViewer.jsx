import { ResumeViewerModal } from '../components/ResumeViewerModal'

export function openResumeViewer(app, url, fileName) {
  app.openModal(<ResumeViewerModal url={url} fileName={fileName} onClose={app.closeModal} />, true)
}
