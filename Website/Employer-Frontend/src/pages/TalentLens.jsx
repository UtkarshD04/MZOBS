import { useMemo, useState } from 'react'
import { Bell, CalendarPlus, Sparkles, SlidersHorizontal, ThumbsUp, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input, Select } from '../components/ui/Field'
import { PillTabs } from '../components/ui/Tabs'
import EmptyState from '../components/ui/EmptyState'
import { CardListSkeleton } from '../components/ui/Skeleton'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import { TALENT_POOL } from '../lib/talentLens/mockCandidates'
import { parseNaturalLanguageQuery } from '../lib/talentLens/parseQuery'
import { rankCandidates } from '../lib/talentLens/matchEngine'
import { computeTrustSignal } from '../lib/talentLens/trustSignal'
import { useTalentPools, useTalentRadar } from '../lib/talentLens/store'
import CandidateCard from '../components/talentLens/CandidateCard'
import SmartFilterChips from '../components/talentLens/SmartFilterChips'
import AdvancedSearchDrawer from '../components/talentLens/AdvancedSearchDrawer'
import WhyMatchDrawer from '../components/talentLens/WhyMatchDrawer'
import HiringPulseStrip from '../components/talentLens/HiringPulseStrip'
import TalentPoolsPanel, { SaveToPoolMenu } from '../components/talentLens/TalentPoolsPanel'
import SavedSearchesPanel, { SaveSearchModal } from '../components/talentLens/SavedSearchesPanel'
import TalentRadarPanel from '../components/talentLens/TalentRadarPanel'
import Copilot from '../components/talentLens/Copilot'

const TABS = ['Find candidates', 'Talent Pools', 'Saved Searches', 'Talent Radar']
const PAGE_SIZE = 6
const SORTS = [
  { value: 'best', label: 'Best match' },
  { value: 'active', label: 'Recently active' },
  { value: 'relevant', label: 'Most relevant' },
  { value: 'experience', label: 'Experience' },
  { value: 'availability', label: 'Availability' },
]

function sortResults(results, sort) {
  const arr = [...results]
  switch (sort) {
    case 'active':
      return arr.sort((a, b) => a.candidate.lastActiveDaysAgo - b.candidate.lastActiveDaysAgo)
    case 'relevant':
      return arr.sort((a, b) => b.match.skillMatch - a.match.skillMatch)
    case 'experience':
      return arr.sort((a, b) => b.candidate.experienceYears - a.candidate.experienceYears)
    case 'availability':
      return arr.sort((a, b) => a.candidate.noticePeriodDays - b.candidate.noticePeriodDays)
    default:
      return arr.sort((a, b) => b.match.overallMatch - a.match.overallMatch)
  }
}

export default function TalentLens() {
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [criteria, setCriteria] = useState(null)
  const [searched, setSearched] = useState(false)
  const [sort, setSort] = useState('best')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [whyMatch, setWhyMatch] = useState(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [poolMenuFor, setPoolMenuFor] = useState(null)
  const { toggleCandidate, pools } = useTalentPools()
  const { watch: watchRequirement } = useTalentRadar()

  function runSearch(text) {
    setQuery(text)
    const parsed = parseNaturalLanguageQuery(text)
    setCriteria(parsed)
    setSearched(true)
    setPage(1)
    setSelectedIds([])
  }

  function applyAdvanced(advCriteria) {
    setCriteria(advCriteria)
    setSearched(true)
    setPage(1)
  }

  const ranked = useMemo(() => (criteria ? rankCandidates(TALENT_POOL, criteria) : []), [criteria])
  const sorted = useMemo(() => sortResults(ranked, sort), [ranked, sort])
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const summary = useMemo(() => {
    const strong = ranked.filter((r) => r.match.overallMatch >= 85).length
    const soon = ranked.filter((r) => r.candidate.noticePeriodDays <= 30).length
    const verified = ranked.filter((r) => computeTrustSignal(r.candidate).score >= 80).length
    const active = ranked.filter((r) => r.candidate.lastActiveDaysAgo <= 7).length
    return { strong, soon, verified, active }
  }, [ranked])

  function toggleSelected(id) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  function broadenSearch() {
    if (!criteria) return
    const next = { ...criteria }
    delete next.experienceMin
    delete next.experienceMax
    if (next.skills?.length) next.skills = next.skills.slice(0, Math.max(0, next.skills.length - 1))
    setCriteria(next)
    setPage(1)
  }

  const savedInPools = (id) => pools.some((p) => p.candidateIds.includes(id))

  return (
    <div>
      <PageHeader
        title="Talent Lens"
        subtitle="See the right talent, clearly."
        actions={
          <Button variant="secondary" size="md" onClick={() => setAdvancedOpen(true)}>
            <SlidersHorizontal size={15} /> Advanced search
          </Button>
        }
      />

      <div className="mb-6">
        <HiringPulseStrip />
      </div>

      <PillTabs items={TABS} active={tab} onChange={setTab} className="mb-5" />

      {tab === 0 && (
        <>
          <Card className="mb-5">
            <CardBody>
              <label className="text-[13px] font-semibold mb-2 block">Find people who fit the role — not just the keywords.</label>
              <div className="flex items-start gap-2.5 flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runSearch(query)}
                    placeholder="Describe the person you're looking for…"
                    className="!h-11"
                  />
                  <p className="text-[11.5px] text-ink-tertiary mt-1.5">
                    e.g. "Looking for a Python developer with 2–4 years of experience, strong FastAPI and AWS skills, based in Bengaluru, who can join within 30 days."
                  </p>
                </div>
                <Button variant="primary" size="lg" className="!h-11" onClick={() => runSearch(query)}>
                  <Sparkles size={16} /> Find matching talent
                </Button>
              </div>

              {criteria && (
                <div className="mt-4 pt-4 border-t border-border">
                  <SmartFilterChips criteria={criteria} onChange={(c) => { setCriteria(c); setPage(1) }} />
                </div>
              )}
            </CardBody>
          </Card>

          {!searched ? (
            <Card>
              <EmptyState
                icon={Sparkles}
                title="Describe who you're hiring for"
                body="Type a plain-English requirement above, or use Advanced search for detailed filters — Mzobs will show you exactly how it understood your search."
              />
            </Card>
          ) : sorted.length === 0 ? (
            <Card>
              <EmptyState
                icon={Users}
                title="No candidates found"
                body="Try widening your experience range, removing one skill requirement, or expanding your location."
                action={
                  <div className="flex items-center gap-2 mt-1">
                    <Button variant="secondary" size="sm" onClick={broadenSearch}>Broaden search</Button>
                    <Button variant="primary" size="sm" onClick={() => setAdvancedOpen(true)}>Edit requirements</Button>
                  </div>
                }
              />
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div>
                  <div className="text-[15px] font-semibold">{sorted.length} candidate{sorted.length === 1 ? '' : 's'} found</div>
                  <div className="text-[12px] text-ink-secondary mt-0.5">
                    {summary.strong} strong match{summary.strong === 1 ? '' : 'es'} · {summary.soon} available within 30 days · {summary.verified} highly verified · {summary.active} recently active
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {selectedIds.length > 0 && (
                    <Card className="!rounded-full">
                      <div className="flex items-center gap-1 px-2 py-1">
                        <span className="text-[11.5px] font-semibold text-ink-secondary px-2">{selectedIds.length} selected</span>
                        <Button variant="ghost" size="sm" onClick={() => setPoolMenuFor('bulk')}>Add to pool</Button>
                        <Button variant="ghost" size="sm" onClick={() => toast('Contact requests will route through Hiring Flow once connected.', { icon: '💬' })}>Contact</Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.success(`${selectedIds.length} candidate(s) shortlisted (preview).`)}>
                          <ThumbsUp size={13} /> Shortlist
                        </Button>
                        <Button variant="ghost" size="sm" iconOnly title="Schedule interview" onClick={() => toast('Scheduling routes through Interviews once connected.', { icon: '📅' })}>
                          <CalendarPlus size={14} />
                        </Button>
                      </div>
                    </Card>
                  )}
                  <Select value={sort} onChange={(e) => setSort(e.target.value)} className="!w-44">
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>Sort: {s.label}</option>
                    ))}
                  </Select>
                  <Button variant="secondary" size="sm" onClick={() => setSaveOpen(true)}>
                    <Bell size={13} /> Save search
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                {paged.map(({ candidate, match }) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    match={match}
                    selected={selectedIds.includes(candidate.id)}
                    onToggleSelect={toggleSelected}
                    onWhyMatch={(c, m) => setWhyMatch({ candidate: c, match: m })}
                    inPool={savedInPools(candidate.id)}
                  />
                ))}
              </div>
              <Pagination page={page} pageCount={pageCount} onChange={setPage} total={sorted.length} pageSize={PAGE_SIZE} />
            </>
          )}
        </>
      )}

      {tab === 1 && <TalentPoolsPanel />}
      {tab === 2 && <SavedSearchesPanel onRun={(c) => { setCriteria(c); setSearched(true); setTab(0); setPage(1) }} />}
      {tab === 3 && <TalentRadarPanel onCreateFromCriteria={watchRequirement} />}

      <AdvancedSearchDrawer open={advancedOpen} onClose={() => setAdvancedOpen(false)} onApply={applyAdvanced} />
      <WhyMatchDrawer open={!!whyMatch} onClose={() => setWhyMatch(null)} candidate={whyMatch?.candidate} match={whyMatch?.match} />
      {criteria && <SaveSearchModal open={saveOpen} onClose={() => setSaveOpen(false)} criteria={criteria} onSaved={() => toast.success('Search saved')} />}

      <Modal open={poolMenuFor === 'bulk'} onClose={() => setPoolMenuFor(null)} title="Add selected to a pool" size="sm">
        <div className="flex flex-col gap-1">
          {pools.map((pool) => (
            <button
              key={pool.id}
              onClick={() => {
                selectedIds.forEach((id) => {
                  if (!pool.candidateIds.includes(id)) toggleCandidate(pool.id, id)
                })
                toast.success(`Added ${selectedIds.length} candidate(s) to ${pool.name}`)
                setPoolMenuFor(null)
              }}
              className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px] text-left"
            >
              <span>{pool.emoji}</span>
              <span>{pool.name}</span>
            </button>
          ))}
        </div>
      </Modal>

      <Copilot
        results={sorted}
        selectedIds={selectedIds}
        onApplyAvailability={(days) => {
          setCriteria((c) => ({ ...(c ?? {}), availabilityDays: days }))
          setSearched(true)
          setTab(0)
          setPage(1)
        }}
        onAddSkillRequirement={(skill) => {
          setCriteria((c) => ({ ...(c ?? {}), skills: [...new Set([...(c?.skills ?? []), skill])] }))
          setSearched(true)
          setTab(0)
        }}
      />
    </div>
  )
}
