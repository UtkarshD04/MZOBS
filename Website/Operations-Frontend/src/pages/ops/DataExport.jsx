import { useState } from 'react'
import { Users, ClipboardList, Download } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../lib/appContext'
import { exportEmployeesCsv, exportApplicationsCsv } from '../../services/exportService'

const EXPORTS = [
  { key: 'employees', icon: Users, title: 'Employees', body: 'Every candidate account — contact, profile, resume status, subscription and activity.', run: exportEmployeesCsv },
  { key: 'applications', icon: ClipboardList, title: 'Applications', body: 'Every job application — candidate, job, company, status, fit, dates and notes.', run: exportApplicationsCsv },
]

export default function DataExport() {
  const app = useApp()
  const [busy, setBusy] = useState(null)

  async function download(item) {
    setBusy(item.key)
    try {
      await item.run()
    } catch {
      app.addToast('error', 'Could not export CSV')
    }
    setBusy(null)
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Data export</h1>
        <p className="text-sm text-ink-secondary mt-1">Download the full data as a CSV file that opens in Excel or Google Sheets.</p>
      </StaggerItem>
      <StaggerItem className="grid sm:grid-cols-2 gap-4">
        {EXPORTS.map((item) => (
          <Card key={item.key} pad>
            <div className="flex items-center gap-2 text-[15px] font-semibold">
              <item.icon size={16} className="text-navy" /> {item.title}
            </div>
            <p className="text-[13px] text-ink-secondary mt-2 mb-4">{item.body}</p>
            <Button variant="primary" onClick={() => download(item)} disabled={busy !== null}>
              <Download size={15} /> {busy === item.key ? 'Exporting...' : 'Export CSV'}
            </Button>
          </Card>
        ))}
      </StaggerItem>
    </StaggerGroup>
  )
}
