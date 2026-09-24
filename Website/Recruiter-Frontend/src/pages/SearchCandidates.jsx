import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { Sparkles, SlidersHorizontal, LayoutList, Rows3, Search, History, ArrowDownUp, FlaskConical, RefreshCw, Radio } from 'lucide-react'
import SearchComposer from '../components/SearchComposer'
import FilterPanel from '../components/FilterPanel'
import CandidateCard from '../components/CandidateCard'
import { useActions } from '../components/useActions'
import { Button, CardSkeleton, Chip, EmptyState, Modal, Sheet } from '../components/ui'
import { EMPTY_CRITERIA, SORTS, criteriaToChips, criteriaTitle, hasActiveCriteria, makeCriteria, removeChip } from '../lib/talent/criteria'
import { parseQuery } from '../lib/talent/parse'
import { collectTerms } from '../lib/talent/boolean'
import { searchTalent, getPoolMeta, refreshPool } from '../services/talentService'
import { useWorkspace } from '../store/workspace'
import { IS_DEMO } from '../lib/config'
import { agoDate } from '../lib/format'
import { saveLastCriteria } from '../lib/lastCriteria'
import { saveLastResults } from '../lib/lastResults'

const PAGE = 20

function useDebounced(value, ms) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function SearchCandidates() {
  const location = useLocation()
  const { recent, pushRecent, clearRecent, saveSearch, selected, selectMany, clearSelection, toast, messages, shortlists, viewed } = useWorkspace()
  const [criteria, setCriteria] = useState(() => makeCriteria(location.state?.criteria ?? {}))
  const [sort, setSort] = useState('relevance')
  const [view, setView] = useState('list')
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [meta, setMeta] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const req = useRef(0)
  const sentinel = useRef(null)

  // An unlock changes contact/pipeline fields, so re-run the search against the refreshed pool.
  const { onAction, host } = useActions(criteria, { onUnlocked: () => setCriteria((c) => ({ ...c })) })

  useEffect(() => {
    getPoolMeta().then(setMeta).catch(() => setMeta(null))
  }, [])
  const resync = async () => {
    setSyncing(true)
    try {
      setMeta(await refreshPool())
      setCriteria((c) => ({ ...c }))
      toast('Candidates refreshed')
    } catch {
      toast('Could not refresh — check your connection', { tone: 'warn' })
    } finally {
      setSyncing(false)
    }
  }

  // deep links (saved search / recent / job talent) hand criteria over via router state
  useEffect(() => {
    if (location.state?.criteria) setCriteria(makeCriteria(location.state.criteria))
  }, [location.state])

  const debounced = useDebounced(criteria, 280)
  // Candidates the recruiter has already acted on, for the "Already actioned" filters. Kept out of the criteria so saved searches stay portable.
  const hiddenViewed = debounced.hideViewed ? viewed : null
  const exclude = useMemo(() => {
    const ids = new Set()
    if (debounced.hideContacted) messages.forEach((x) => ids.add(x.candidateId))
    if (debounced.hideShortlisted) shortlists.forEach((l) => l.candidateIds.forEach((id) => ids.add(id)))
    if (hiddenViewed) Object.keys(hiddenViewed).forEach((id) => ids.add(id))
    return ids.size ? ids : null
  }, [debounced.hideContacted, debounced.hideShortlisted, messages, shortlists, hiddenViewed])
  useEffect(() => saveLastCriteria(debounced), [debounced])
  useEffect(() => {
    const id = ++req.current
    setLoading(true)
    setError(false)
    searchTalent(debounced, { sort, page: 1, pageSize: PAGE, exclude })
      .then((r) => {
        if (id !== req.current) return
        setRows(r.items)
        saveLastResults(r.ids)
        setTotal(r.total)
        setPage(1)
        setHasMore(r.hasMore)
      })
      .catch(() => id === req.current && setError(true))
      .finally(() => id === req.current && setLoading(false))
  }, [debounced, sort, exclude])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    const id = req.current
    setLoadingMore(true)
    searchTalent(debounced, { sort, page: page + 1, pageSize: PAGE, exclude })
      .then((r) => {
        if (id !== req.current) return
        setRows((x) => [...x, ...r.items])
        setPage(r.page)
        setHasMore(r.hasMore)
      })
      .finally(() => setLoadingMore(false))
  }, [loadingMore, hasMore, debounced, sort, page, exclude])

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver((e) => e[0].isIntersecting && loadMore(), { rootMargin: '400px' })
    io.observe(el)
    return () => io.disconnect()
  }, [loadMore])

  const runQuery = (text, mode, scope) => {
    const parsed = { ...parseQuery(text, mode), scope }
    setCriteria(parsed)
    if (hasActiveCriteria(parsed)) pushRecent(parsed)
  }

  const chips = useMemo(() => criteriaToChips(criteria), [criteria])
  const terms = useMemo(() => [...criteria.skills, ...criteria.keywords, ...criteria.keywordGroups.flat(), ...collectTerms(criteria.boolExpr)], [criteria])
  const active = hasActiveCriteria(criteria)
  const scored = rows.some((r) => r.match.overall != null)
  const pageIds = rows.map((r) => r.candidate.id)
  const allSelected = pageIds.length > 0 && pageIds.every((i) => selected.includes(i))
  const aiUnderstood = criteria.mode === 'ai' && criteria.q.trim() && chips.length > 0

  const openSave = () => {
    setSaveName(criteriaTitle(criteria))
    setSaveOpen(true)
  }
  const clearAll = () => setCriteria({ ...EMPTY_CRITERIA, scope: criteria.scope })

  const filterPanel = <FilterPanel criteria={criteria} onChange={setCriteria} onSave={openSave} onClear={clearAll} meta={meta} />

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-32 pt-6 lg:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] text-ink md:text-[40px]">Search <em className="font-semibold italic text-accent">candidates</em></h1>
          <p className="mt-1 text-[14px] text-muted">Discover verified talent matched to your hiring requirements.</p>
        </div>
        {!IS_DEMO && (
          <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-1 text-[12px] font-medium text-ink-2" title={meta ? `Every verified candidate in the Mzobs resume database · ${meta.shared} in your pipeline` : undefined}>
            <Radio size={13} className="text-ok" /> Live · {meta ? `${meta.total} candidates` : 'connecting…'}
            <button onClick={resync} disabled={syncing} aria-label="Refresh candidates" className="grid h-5 w-5 place-items-center rounded text-muted hover:bg-line-2 hover:text-ink"><RefreshCw size={12} className={syncing ? 'animate-spin' : ''} /></button>
            <Link to="/unlocked" className="border-l border-line pl-2 text-accent hover:underline">Unlocked CVs</Link>
          </span>
        )}
        {IS_DEMO && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#f3dfb8] bg-warn-soft px-2.5 py-1 text-[12px] font-medium text-warn" title="VITE_TALENT_SOURCE=demo: this screen searches a generated sample pool, not the Mzobs resume database.">
            <FlaskConical size={13} /> Demo data — sample candidates
          </span>
        )}
      </div>

      <SearchComposer criteria={criteria} onSearch={runQuery} loading={loading} />

      {aiUnderstood && (
        <div className="fade-up mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-[#bfe6df] bg-[#f2fbf9] px-3.5 py-2.5">
          <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0a6f64]"><Sparkles size={13} /> Mzobs understood your search</span>
          {chips.map((c) => <Chip key={c.key} tone="ai" onRemove={() => setCriteria(removeChip(criteria, c.key))}>{c.label}</Chip>)}
          <span className="ml-auto text-[11.5px] text-muted">Rule-based parser · edit anything in Filters</span>
        </div>
      )}

      {!active && recent.length > 0 && (
        <div className="fade-up mt-3 rounded-2xl border border-line bg-white p-3.5 shadow-card">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold"><History size={14} className="text-muted" /> Recent searches</h2>
            <button onClick={clearRecent} className="text-[12px] text-muted hover:text-ink">Clear</button>
          </div>
          <ul className="divide-y divide-line-2">
            {recent.slice(0, 4).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="min-w-0 truncate text-[13px] text-ink-2">{criteriaTitle(r.criteria)} <span className="text-muted">· {agoDate(r.at)}</span></span>
                <span className="flex gap-1">
                  <button onClick={() => setCriteria(makeCriteria({ ...r.criteria, q: r.criteria.q }))} className="rounded-md px-2 py-1 text-[12px] font-medium text-accent hover:bg-accent-soft">Search profiles</button>
                  <button onClick={() => { saveSearch(criteriaTitle(r.criteria), r.criteria, null); toast('Search saved') }} className="rounded-md px-2 py-1 text-[12px] font-medium text-muted hover:bg-line-2">Save</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">
          <div className="scroll-thin sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto rounded-2xl">{filterPanel}</div>
        </aside>

        <section aria-live="polite">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[13px] text-ink-2">
              <input type="checkbox" checked={allSelected} onChange={() => (allSelected ? clearSelection() : selectMany(pageIds))} className="h-4 w-4 accent-[#0a6f64]" aria-label="Select all on this page" />
              <span className="hidden sm:inline">Select page</span>
            </label>
            <div className="min-w-[200px] flex-1">
              <p className="text-[15px] font-semibold">
                {loading && total == null ? 'Searching…' : `${(total ?? 0).toLocaleString('en-IN')} candidate${total === 1 ? '' : 's'} found`}
              </p>
              {scored && !loading && <p className="flex items-center gap-1 text-[12.5px] text-[#0a6f64]"><Sparkles size={12} /> Mzobs AI ranked {total?.toLocaleString('en-IN')} candidate{total === 1 ? '' : 's'} against your requirements.</p>}
              {!scored && !loading && <p className="text-[12.5px] text-muted">{chips.length ? 'Filtered by your search. Add skills, a role or location to rank by AI match.' : 'Showing all talent. Add skills, a role or location to rank by AI match.'}</p>}
            </div>
            <Button className="lg:hidden" icon={SlidersHorizontal} onClick={() => setFiltersOpen(true)}>Filters{chips.length > 0 && ` (${chips.length})`}</Button>
            <label className="flex items-center gap-1.5 text-[13px] text-muted">
              <ArrowDownUp size={14} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-lg border border-line bg-white px-2 text-[13px] text-ink outline-none focus:border-accent" aria-label="Sort by">
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <div className="hidden rounded-lg border border-line bg-white p-0.5 sm:flex" role="group" aria-label="View">
              {[['list', LayoutList, 'List'], ['compact', Rows3, 'Compact list']].map(([id, Icon, label]) => (
                <button key={id} onClick={() => setView(id)} aria-label={label} title={label} aria-pressed={view === id} className={clsx('grid h-8 w-8 place-items-center rounded-md', view === id ? 'bg-accent-soft text-accent' : 'text-muted hover:text-ink')}><Icon size={15} /></button>
              ))}
            </div>
          </div>

          {error ? (
            <EmptyState icon={Search} title="Couldn't load candidates" body="Check your connection and try again." action={<Button onClick={() => setCriteria({ ...criteria })}>Retry</Button>} />
          ) : loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }, (_, i) => <CardSkeleton key={i} />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Search}
              title={!IS_DEMO && chips.length === 0 ? 'No candidates in the resume database yet' : 'No candidates match these filters'}
              body={!IS_DEMO && chips.length === 0 ? 'Candidates appear here once job seekers with a verified CV join Mzobs.' : 'Try removing a filter or widening your experience range.'}
              action={chips.length > 0 && <div className="flex flex-wrap justify-center gap-1.5">{chips.slice(0, 6).map((c) => <Chip key={c.key} tone="accent" onRemove={() => setCriteria(removeChip(criteria, c.key))}>{c.label}</Chip>)}</div>}
            />
          ) : (
            <div className={clsx('fade-up', view === 'compact' ? 'space-y-2' : 'space-y-3')}>
              {rows.map((r) => <CandidateCard key={r.candidate.id} row={r} terms={terms} compact={view === 'compact'} onAction={onAction} />)}
            </div>
          )}

          <div ref={sentinel} className="h-8" />
          {loadingMore && <div className="space-y-3"><CardSkeleton /></div>}
          {!loading && !hasMore && rows.length > PAGE && <p className="py-6 text-center text-[12.5px] text-muted">You've reached the end of the results.</p>}
        </section>
      </div>

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" width={380} footer={<Button variant="primary" className="w-full" onClick={() => setFiltersOpen(false)}>Show {total ?? ''} candidates</Button>}>
        {filterPanel}
      </Sheet>

      <Modal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Save this search"
        subtitle="Find it again in Saved Searches and turn on alerts for new candidates."
        width={460}
        footer={<><Button onClick={() => setSaveOpen(false)}>Cancel</Button><Button variant="primary" disabled={!saveName.trim()} onClick={() => { saveSearch(saveName.trim(), criteria, total); setSaveOpen(false); toast('Search saved') }}>Save search</Button></>}
      >
        <input autoFocus value={saveName} onChange={(e) => setSaveName(e.target.value)} className="h-10 w-full rounded-lg border border-line px-3 text-[14px] outline-none focus:border-accent" aria-label="Search name" />
        <div className="mt-3 flex flex-wrap gap-1.5">{chips.map((c) => <Chip key={c.key}>{c.label}</Chip>)}</div>
      </Modal>

      {host}
    </div>
  )
}
