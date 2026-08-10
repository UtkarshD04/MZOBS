import { ListChecks, Clock } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Bar from '../components/ui/Bar'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import CountUp from '../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { TESTS_AVAILABLE, TESTS_DONE } from '../lib/data'
import { useApp } from '../context/AppContext'

export default function SkillAssessment() {
  const { addToast } = useApp()

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Skill Assessment</h1>
        <p className="text-sm text-ink-secondary mt-1">Prove your skills — top scores unlock better company matches.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
        {[
          ['Overall Skill Score', 82, '/100', 'text-navy'],
          ['Tests Completed', 3, '/7', 'text-teal'],
          ['Avg. Percentile', 88, 'th', 'text-violet'],
          ['Certificates Earned', 2, '', 'text-gold-strong'],
        ].map(([label, val, suffix, colorClass]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${colorClass}`}>
              <CountUp value={val} />
              <span className="text-[19px] font-semibold text-ink-tertiary">{suffix}</span>
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="text-xl font-bold mb-3">Available tests</StaggerItem>
      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
        {TESTS_AVAILABLE.map((t) => (
          <Card key={t.title} hover pad>
            <div className="flex justify-between">
              <div className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center">
                <ListChecks size={17} />
              </div>
              <Badge tone="gray">{t.diff}</Badge>
            </div>
            <div className="text-[15px] font-semibold mt-3">{t.title}</div>
            <div className="text-xs text-ink-tertiary mt-1.5 flex items-center gap-1">
              <Clock size={12} /> {t.dur} · {t.qs} questions
            </div>
            <Button variant="primary" className="w-full mt-3.5" onClick={() => addToast('success', `Starting: ${t.title}`)}>
              Start test
            </Button>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Completed tests</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Test', 'Score', 'Percentile', 'Date']}>
              {TESTS_DONE.map((t) => (
                <Tr key={t.title}>
                  <Td>{t.title}</Td>
                  <Td className="font-bold">{t.score}%</Td>
                  <Td className="font-bold">{t.percentile}th</Td>
                  <Td>{t.date}</Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Skill score by area</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3.5">
            {[
              ['Quantitative Aptitude', 82],
              ['Verbal Reasoning', 76],
              ['MS Excel', 88],
              ['Communication', 71],
            ].map(([label, v]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span>{label}</span>
                  <span className="text-ink-secondary">{v}%</span>
                </div>
                <Bar value={v} thin />
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Leaderboard</span>
            <Badge tone="navy">Your rank: #142 of 3,204</Badge>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Rank', 'Candidate', 'Score']}>
              {[
                [1, 'RK', 'Rohit K.', '98%', true],
                [2, 'SN', 'Sneha N.', '97%', false],
                [3, 'VP', 'Vikram P.', '95%', false],
              ].map((r) => (
                <Tr key={r[0]}>
                  <Td className="font-bold">{r[0]}</Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={r[1]} size="sm" gold={r[4]} />
                      {r[2]}
                    </div>
                  </Td>
                  <Td className="font-bold">{r[3]}</Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
