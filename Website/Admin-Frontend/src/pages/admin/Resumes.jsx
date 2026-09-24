import { useMemo } from 'react'
import { Inbox, FileText, Eye, Download, Star } from 'lucide-react'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useApp } from '../../context/AppContext'
import { useResumeQueueQuery } from '../../hooks/useResumes'
import { openResumeViewer, downloadFile } from '../../components/ResumeViewerModal'
import { FILE_BASE_URL } from '../../lib/config'

export default function Resumes() {
  const app = useApp()
  const { data: rawRows = [], isLoading, isError, refetch } = useResumeQueueQuery({})

  const rows = useMemo(() => rawRows.filter((c) => c.resume?.file), [rawRows])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resumes</h1>
          <p className="text-sm text-ink-secondary mt-1">The moment a candidate uploads a resume, it lands here.</p>
        </div>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Resumes received</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={rows.length} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Inbox} tone="green" title="No resumes yet" body="Resumes show up here as soon as a candidate uploads one." />
          </Card>
        ) : (
          <TableWrap>
            <Table columns={['Candidate', 'Resume', 'Uploaded']}>
              {rows.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={c.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                      <div className="min-w-0">
                        <div className="font-semibold truncate flex items-center gap-1.5">
                          {c.name}
                          {c.subscription?.status === 'paid' && <Star size={13} className="text-gold fill-gold flex-shrink-0" title="Paid subscription" />}
                        </div>
                        <div className="text-xs text-ink-tertiary truncate">{c.currentCity || 'City not set'}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-navy flex-shrink-0" />
                      <span className="truncate max-w-[220px]">{c.resume.file}</span>
                      {c.resume.url && (
                        <button onClick={() => openResumeViewer(app, `${FILE_BASE_URL}${c.resume.url}`, c.resume.file)} title="View" className="text-ink-tertiary hover:text-navy flex-shrink-0">
                          <Eye size={14} />
                        </button>
                      )}
                      {c.resume.url && (
                        <button onClick={() => downloadFile(`${FILE_BASE_URL}${c.resume.url}`, c.resume.file)} title="Download" className="text-ink-tertiary hover:text-navy flex-shrink-0">
                          <Download size={14} />
                        </button>
                      )}
                    </div>
                  </Td>
                  <Td className="text-ink-tertiary whitespace-nowrap">{c.resume.uploadedOn ? new Date(c.resume.uploadedOn).toLocaleDateString('en-IN') : '—'}</Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
