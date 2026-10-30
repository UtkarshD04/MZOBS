import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Briefcase, Flame, LoaderCircle, Search, Users, X } from 'lucide-react'
import { IS_DEMO } from '../lib/config'
import { canonCity } from '../lib/talent/vocab'
import { areaSummary, getCityPincodes, getPinInfo, isPinSettled, peekPinInfo, prefetchPinInfo } from '../services/geoService'

// PIN Radar — step 3 of the Talent Radar. Every PIN code of the chosen cities as a heat tile,
// from three real sources at once:
//   talent    — PINs on candidate profiles in those cities (tile colour = how many match your filters)
//   hiring    — PINs your active openings are saved with
//   directory — the cities' India Post PIN codes, so any local area can be targeted
// Nothing is estimated: a tile only shows counts that were actually loaded.

const PAGE = 8
const n = (v) => Number(v).toLocaleString('en-IN')

const MODES = {
  all: { label: 'All', keep: () => true },
  talent: { label: 'Talent', keep: (p) => p.talent > 0 },
  hiring: { label: 'Hiring', keep: (p) => p.active > 0 },
}

// Best talent first, then where you hire, then everything else by PIN.
const order = (a, b) => b.match - a.match || b.active - a.active || b.talent - a.talent || a.pin.localeCompare(b.pin)

/** Postal areas for a PIN: the directory's (already cached) or one lazy lookup once the tile is on screen. */
function useAreas(pin, visible) {
  const [info, setInfo] = useState(() => peekPinInfo(pin))
  useEffect(() => {
    if (info || !visible || IS_DEMO) return
    let live = true
    getPinInfo(pin).then((i) => live && setInfo(i)).catch(() => {})
    return () => { live = false }
  }, [pin, visible, info])
  return info
}

function PinTile({ p, maxMatch, hot, on, onClick }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (visible || !ref.current) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setVisible(true); io.disconnect() } })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [visible])
  const info = useAreas(p.pin, visible)
  const areas = areaSummary(info?.areas ?? p.areas, 1)

  // Heat: share of the best tile's matching candidates. Tiles with no talent stay white.
  const heat = p.match > 0 ? 0.18 + 0.72 * (p.match / maxMatch) : p.talent > 0 ? 0.08 : 0
  const dark = heat > 0.55
  const label = [
    `PIN ${p.pin}`,
    areas && `(${areas})`,
    p.talent ? `${p.match} of ${p.talent} candidates match` : 'no candidates on file',
    p.active ? `${p.active} active opening${p.active === 1 ? '' : 's'}` : '',
  ].filter(Boolean).join(', ')

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      title={info?.areas?.length ? info.areas.join(', ') : undefined}
      style={heat ? { backgroundColor: `color-mix(in srgb, var(--color-accent-2) ${Math.round(heat * 100)}%, white)` } : undefined}
      className={clsx(
        'relative flex min-h-16 min-w-0 flex-col rounded-lg border px-2 py-1.5 text-left transition-[box-shadow,transform] hover:-translate-y-px hover:shadow-sm',
        on ? 'border-accent ring-2 ring-accent' : heat ? 'border-transparent' : 'border-dashed border-line bg-white',
        dark ? 'text-white' : 'text-ink'
      )}
    >
      <span className="flex items-center gap-1">
        <span className="text-[13px] font-bold tabular-nums">{p.pin}</span>
        {hot && <Flame size={12} className={clsx('shrink-0', dark ? 'text-white' : 'text-warn')} aria-hidden />}
        {p.active > 0 && <span className={clsx('ml-auto h-2 w-2 shrink-0 rounded-full', dark ? 'bg-white' : 'bg-blue')} aria-hidden />}
      </span>
      <span className={clsx('truncate text-[11px] leading-tight', dark ? 'text-white/85' : 'text-muted')}>
        {areas || (visible && !info ? 'Locality unavailable' : ' ')}
      </span>
      <span className={clsx('mt-auto flex items-center gap-2 pt-0.5 text-[10.5px] font-semibold', dark ? 'text-white' : 'text-ink-2')}>
        {p.talent > 0 && <span className="inline-flex items-center gap-0.5"><Users size={10} aria-hidden />{n(p.match)}<span className="font-normal opacity-75">/{n(p.talent)}</span></span>}
        {p.active > 0 && <span className="inline-flex items-center gap-0.5"><Briefcase size={10} aria-hidden />{n(p.active)}</span>}
        {!p.talent && !p.active && <span className="font-normal opacity-70">Postal area</span>}
      </span>
    </button>
  )
}

export default function PinRadar({ cities, stateName, hiring, hiringFailed, talentPins, cityOpenings, value, onPick, onClear, onRetry }) {
  const [mode, setMode] = useState('all')
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const [directory, setDirectory] = useState({ key: '', rows: [], status: 'idle' })
  const [, setPinTick] = useState(0) // bumps as locality lookups land so the search re-reads the cache
  const [prefetch, setPrefetch] = useState({ running: false, failed: 0 })
  const prefetchCtl = useRef(null)
  const cityKeys = cities.map(canonCity)
  const dirKey = `${cityKeys.join('|')}#${stateName}`

  // The chosen cities' India Post PIN codes.
  useEffect(() => {
    if (!cities.length || IS_DEMO) return
    let live = true
    setDirectory({ key: dirKey, rows: [], status: 'loading' })
    Promise.allSettled(cities.map((ct) => getCityPincodes(ct, stateName))).then((res) => {
      if (!live) return
      const rows = res.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      setDirectory({ key: dirKey, rows, status: res.every((r) => r.status === 'rejected') ? 'error' : 'ready' })
    })
    return () => { live = false }
  }, [dirKey]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setLimit(PAGE) }, [mode, q, dirKey])

  const pins = useMemo(() => {
    const by = new Map()
    const at = (pin) => by.get(pin) ?? by.set(pin, { pin, active: 0, talent: 0, match: 0, areas: [], inDirectory: false }).get(pin)
    for (const h of hiring) {
      if (!cityKeys.includes(canonCity(h.city))) continue
      if (stateName && h.state && canonCity(h.state) !== canonCity(stateName)) continue
      at(h.pincode).active += h.active
    }
    for (const [pin, s] of talentPins ?? []) {
      if (![...s.cities].some((k) => cityKeys.includes(k))) continue
      const p = at(pin)
      p.talent += s.total
      p.match += s.match
    }
    if (directory.key === dirKey) {
      for (const d of directory.rows) {
        const p = at(d.pincode)
        p.inDirectory = true
        p.areas = d.areas
      }
    }
    return [...by.values()].sort(order)
  }, [hiring, talentPins, directory, dirKey, stateName]) // eslint-disable-line react-hooks/exhaustive-deps

  // Focusing the search looks up locality names for every PIN not yet known (directory PINs already
  // are), so a locality search covers the whole grid, not just the tiles scrolled into view. Lookups
  // are cached and deduped in geoService; leaving, or the cities changing, stops the queue.
  const stopPrefetch = () => { if (prefetchCtl.current) prefetchCtl.current.cancelled = true }
  const startPrefetch = () => {
    stopPrefetch()
    if (IS_DEMO) return
    const todo = pins.map((p) => p.pin).filter((pin) => !isPinSettled(pin))
    if (!todo.length) { setPrefetch({ running: false, failed: 0 }); return }
    const ctl = { cancelled: false }
    prefetchCtl.current = ctl
    setPrefetch({ running: true, failed: 0 })
    prefetchPinInfo(todo, ctl, () => setPinTick((t) => t + 1)).then(({ failed }) => {
      if (!ctl.cancelled) setPrefetch({ running: false, failed })
    })
  }
  useEffect(() => stopPrefetch, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { stopPrefetch(); setPrefetch({ running: false, failed: 0 }) }, [dirKey]) // eslint-disable-line react-hooks/exhaustive-deps
  const located = pins.filter((p) => isPinSettled(p.pin)).length

  const counts = Object.fromEntries(Object.entries(MODES).map(([k, m]) => [k, pins.filter(m.keep).length]))
  const term = q.trim().toLowerCase()
  const shown = pins.filter(MODES[mode].keep).filter((p) => {
    if (!term) return true
    if (p.pin.startsWith(term)) return true
    const info = peekPinInfo(p.pin)
    return [...(info?.areas ?? p.areas), info?.district ?? ''].some((a) => a.toLowerCase().includes(term))
  })
  const maxMatch = Math.max(1, ...pins.map((p) => p.match))
  const hotPins = new Set(pins.filter((p) => p.match > 0).slice(0, 3).map((p) => p.pin))
  const best = pins.find((p) => p.match > 0)
  const pinnedOpenings = pins.reduce((t, p) => t + p.active, 0)
  const unpinned = Math.max(0, cityOpenings - pinnedOpenings)
  const where = cities.length === 1 ? cities[0] : 'these cities'
  const loading = directory.status === 'loading' && directory.key === dirKey

  return (
    <div className="space-y-2">
      {best && (
        <p className="flex items-start gap-1.5 rounded-lg bg-accent-soft px-2.5 py-1.5 text-[12px] leading-snug text-[#0a6f64]">
          <Flame size={13} className="mt-px shrink-0" aria-hidden />
          <span>
            Most matching talent in {where}: <b className="tabular-nums">{best.pin}</b>
            {areaSummary(peekPinInfo(best.pin)?.areas ?? best.areas, 1) ? ` (${areaSummary(peekPinInfo(best.pin)?.areas ?? best.areas, 1)})` : ''} · {n(best.match)} candidate{best.match === 1 ? '' : 's'}
          </span>
        </p>
      )}

      {unpinned > 0 && (
        <p className="rounded-lg border border-dashed border-line px-2.5 py-1.5 text-[11.5px] leading-snug text-muted">
          {n(unpinned)} of your active opening{unpinned === 1 ? '' : 's'} in {where} {unpinned === 1 ? 'has' : 'have'} no PIN code, so {unpinned === 1 ? 'it isn’t' : 'they aren’t'} on the map.{' '}
          <Link to="/jobs" className="font-semibold text-accent hover:underline">Add a PIN to your jobs</Link>
        </p>
      )}
      {hiringFailed && (
        <p role="alert" className="rounded-lg bg-[#fdecec] px-2.5 py-1.5 text-[11.5px] text-bad">
          Couldn’t load your hiring PIN codes. <button type="button" onClick={onRetry} className="font-semibold underline">Retry</button>
        </p>
      )}

      <div className="flex items-center gap-1" role="group" aria-label="Show PIN codes">
        {Object.entries(MODES).map(([k, m]) => (
          <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} disabled={k !== 'all' && counts[k] === 0}
            className={clsx('rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40', mode === k ? 'bg-accent text-white' : 'bg-line-2 text-ink-2 hover:bg-line')}>
            {m.label} <span className="tabular-nums opacity-80">{counts[k]}</span>
          </button>
        ))}
        {loading && <LoaderCircle size={13} className="ml-auto animate-spin text-accent" aria-label="Loading PIN codes" />}
      </div>

      <div className="relative">
        <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={startPrefetch} placeholder="Search PIN or locality" aria-label="Search PIN or locality"
          className="h-8 w-full rounded-lg border border-line bg-white pl-7 pr-7 text-[12.5px] outline-none placeholder:text-[#8aa0b2] focus:border-accent" />
        {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-1.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded text-muted hover:text-ink"><X size={12} /></button>}
      </div>
      {(prefetch.running || prefetch.failed > 0) && (
        <p className="text-[11px] text-muted" role="status">
          {prefetch.running
            ? `Loading locality names… ${n(located)}/${n(pins.length)}`
            : `Locality names couldn’t be loaded for ${n(prefetch.failed)} PIN${prefetch.failed === 1 ? '' : 's'}; search those by PIN code, or click the search again to retry.`}
        </p>
      )}

      {shown.length > 0 ? (
        <div className="grid grid-cols-2 gap-1.5">
          {shown.slice(0, limit).map((p) => (
            <PinTile key={p.pin} p={p} maxMatch={maxMatch} hot={hotPins.has(p.pin)} on={value === p.pin} onClick={() => (value === p.pin ? onClear() : onPick(p.pin))} />
          ))}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-1.5" aria-hidden>
          {Array.from({ length: 4 }, (_, i) => <span key={i} className="skeleton block h-16 rounded-lg" />)}
        </div>
      ) : (
        <p className="rounded-lg bg-line-2/70 px-3 py-2 text-[12px] text-muted">
          {term ? 'No PIN code matches that search.' : directory.status === 'error' ? `Couldn’t load PIN codes for ${where} right now. You can still type a PIN below.` : `No PIN codes found for ${where} yet. You can still type a PIN below.`}
        </p>
      )}
      {shown.length > limit && (
        <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="w-full rounded-lg py-1.5 text-center text-[12px] font-semibold text-accent hover:bg-accent-soft">
          Show {Math.min(PAGE, shown.length - limit)} more <span className="font-normal text-muted">· {shown.length - limit} left</span>
        </button>
      )}

      {pins.length > 0 && (
        <div className="flex items-center gap-2 text-[10.5px] text-muted" aria-hidden>
          <span>Fewer</span>
          <span className="h-1.5 flex-1 rounded-full" style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--color-accent-2) 18%, white), var(--color-accent-2))' }} />
          <span>More matching talent</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue" />Hiring</span>
        </div>
      )}
    </div>
  )
}
