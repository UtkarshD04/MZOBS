import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { BadgeCheck, Briefcase, Building2, Check, ChevronDown, Crosshair, Globe, Layers, LoaderCircle, MapPin, Search, SlidersHorizontal, Users, X } from 'lucide-react'
import { Chip } from './ui'
import { IS_DEMO } from '../lib/config'
import { canonCity } from '../lib/talent/vocab'
import { buildLocationStats } from '../lib/talent/geoStats'
import { getPoolRows } from '../services/talentService'
import { getHiringPincodes, getLocationFacets, getStates, getPinInfo, peekPinInfo, areaSummary, isPin, RADIUS_OPTIONS } from '../services/geoService'
import PinRadar from './PinRadar'

// Mzobs Talent Radar — the Location filter. Four connected steps (state → city → PIN → reach)
// that all write to the same search criteria (state, locations, pincode, pinNearby, prefLocations, relocate).
// Every number is counted from candidates and job openings that are actually loaded.

const SORTS = {
  match: { label: 'Most matching candidates', by: (a, b) => b.match - a.match || b.total - a.total },
  hiring: { label: 'Most active hiring', by: (a, b) => (b.active ?? 0) - (a.active ?? 0) || b.match - a.match },
  az: { label: 'A–Z', by: (a, b) => a.label.localeCompare(b.label) },
}

const n = (v) => Number(v).toLocaleString('en-IN')

function StepLabel({ num, title, hint }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-accent text-[10.5px] font-bold text-white">{num}</span>
      <span className="text-[12.5px] font-semibold text-ink">{title}</span>
      {hint && <span className="truncate text-[11.5px] text-muted">{hint}</span>}
    </div>
  )
}

/** Availability meter: share of the busiest option in this list. */
function Meter({ value, max, tone = 'accent' }) {
  const pct = max > 0 ? Math.max(value > 0 ? 6 : 0, Math.round((value / max) * 100)) : 0
  return (
    <span className="block h-1 w-full overflow-hidden rounded-full bg-line-2" aria-hidden>
      <span className={clsx('block h-full rounded-full transition-[width] duration-300', tone === 'blue' ? 'bg-blue' : 'bg-accent-2')} style={{ width: `${pct}%` }} />
    </span>
  )
}

/**
 * Searchable picker that opens *in the flow* of the sidebar (no floating popover, no inner scroller), so the one
 * sidebar scroll container always handles wheel / touch. Long lists reveal PAGE rows at a time.
 * Options: { key, label, badge?, meta?, body?, alt? }.
 * Multi-pick keeps `selected` keys highlighted; the caller decides what a pick does.
 */
const PAGE = 8
function Picker({ id, resetKey, label, icon: Icon, value, placeholder, options, selected = [], onPick, onClear, sorts, sort, onSort, searchPlaceholder, emptyText, status, disabled, headerNote, onOpen, onClose }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const [limit, setLimit] = useState(PAGE)
  const root = useRef(null)
  const input = useRef(null)
  const listId = `${id}-list`

  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', off)
    return () => document.removeEventListener('pointerdown', off)
  }, [open])
  // A parent selection changed underneath this list: close it rather than leave stale options open.
  useEffect(() => setOpen(false), [resetKey])
  useEffect(() => { if (open) { setQ(''); setActive(0); setLimit(PAGE); setTimeout(() => input.current?.focus(), 0); onOpen?.() } else onClose?.() }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setActive(0); setLimit(PAGE) }, [q])

  const shown = options.filter((o) => !q.trim() || o.label.toLowerCase().includes(q.trim().toLowerCase()) || (typeof o.alt === 'function' ? o.alt() : o.alt)?.toLowerCase().includes(q.trim().toLowerCase()))
  const pick = (o) => { onPick(o); setOpen(false) }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => { const next = Math.min(shown.length - 1, i + 1); if (next >= limit) setLimit((l) => l + PAGE); return next }) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (shown[active]) pick(shown[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
  }
  useEffect(() => {
    if (open) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, id])

  return (
    <div ref={root} className="relative">
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={label}
          className={clsx('flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-white px-3 text-left text-[13px] outline-none transition-colors focus-visible:border-accent', open ? 'border-accent' : 'border-line hover:border-[#c5d3de]', disabled && 'cursor-not-allowed bg-line-2 text-muted')}
        >
          {status === 'loading' ? <LoaderCircle size={14} className="shrink-0 animate-spin text-accent" /> : <Icon size={14} className="shrink-0 text-accent" />}
          <span className={clsx('truncate', value ? 'font-semibold text-ink' : 'text-[#6b8294]')}>{value || placeholder}</span>
          <ChevronDown size={14} className={clsx('ml-auto shrink-0 text-muted transition-transform', open && 'rotate-180')} />
        </button>
        {value && onClear && (
          <button type="button" onClick={onClear} aria-label={`Clear ${label}`} className="grid h-10 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted hover:bg-line-2 hover:text-ink"><X size={14} /></button>
        )}
      </div>

      {open && (
        <div className="fade-up mt-1.5 overflow-hidden rounded-xl border border-line bg-white">
          <div className="relative border-b border-line-2 p-2">
            <Search size={13} className="pointer-events-none absolute left-4 top-[19px] text-muted" aria-hidden />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder={searchPlaceholder} role="combobox" aria-expanded aria-controls={listId} aria-activedescendant={shown[active] ? `${id}-opt-${active}` : undefined} aria-label={searchPlaceholder} className="h-8 w-full rounded-md bg-line-2/70 pl-7 pr-2 text-[13px] outline-none placeholder:text-[#8aa0b2] focus:bg-white focus:ring-1 focus:ring-accent" />
          </div>
          {sorts && (
            <div className="flex items-center gap-1 border-b border-line-2 px-2 py-1.5" role="group" aria-label="Sort">
              {Object.entries(sorts).map(([k, s]) => (
                <button key={k} type="button" aria-pressed={sort === k} onClick={() => onSort(k)} className={clsx('rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors', sort === k ? 'bg-accent-soft text-[#0a6f64]' : 'text-muted hover:bg-line-2')}>{s.label}</button>
              ))}
            </div>
          )}
          {headerNote && <p className="border-b border-line-2 px-3 py-1.5 text-[11px] text-muted">{headerNote}</p>}
          <ul id={listId} role="listbox" aria-label={label} className="p-1">
            {shown.length === 0 && <li className="px-3 py-4 text-center text-[12.5px] text-muted">{emptyText}</li>}
            {shown.slice(0, limit).map((o, i) => {
              const on = selected.includes(o.key)
              return (
                <li key={o.key} id={`${id}-opt-${i}`} role="option" aria-selected={on}>
                  <button type="button" onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)} className={clsx('block w-full rounded-lg px-2.5 py-2 text-left transition-colors', i === active && 'bg-line-2/80', on && 'bg-accent-soft')}>
                    {o.body ? (
                      <span className="relative block pr-5">
                        {o.body(on)}
                        {on && <Check size={13} className="absolute right-0 top-0.5 text-accent" />}
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1.5">
                          <span className={clsx('truncate text-[13px]', on ? 'font-bold text-[#0a6f64]' : 'font-semibold text-ink')}>{o.label}</span>
                          {on && <Check size={13} className="ml-auto shrink-0 text-accent" />}
                          {!on && o.badge != null && <span className="ml-auto shrink-0 text-[11.5px] font-semibold text-muted">{o.badge}</span>}
                        </span>
                        {o.meta}
                      </>
                    )}
                  </button>
                </li>
              )
            })}
            {shown.length > limit && (
              <li>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setLimit((l) => l + PAGE)} className="w-full rounded-lg px-3 py-1.5 text-center text-[12px] font-semibold text-accent hover:bg-accent-soft">Show {Math.min(PAGE, shown.length - limit)} more <span className="font-normal text-muted">· {shown.length - limit} left</span></button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

function Stat({ icon: Icon, value, label, tone }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 text-[11px]', tone === 'strong' ? 'font-semibold text-[#0a6f64]' : 'text-muted')} title={`${n(value)} ${label}`}>
      <Icon size={11} aria-hidden /> {n(value)} <span className="sr-only">{label}</span>
    </span>
  )
}

/** Locality info for a PIN: status idle | loading | ok | none (no directory entry / demo) | error. */
function usePinInfo(pin, enabled) {
  const valid = enabled && isPin(pin)
  const [st, setSt] = useState({ pin: '', status: 'idle', info: null })
  useEffect(() => {
    if (!valid) return
    const known = peekPinInfo(pin)
    if (known) { setSt({ pin, status: 'ok', info: known }); return }
    if (IS_DEMO) { setSt({ pin, status: 'none', info: null }); return }
    let live = true
    setSt({ pin, status: 'loading', info: null })
    getPinInfo(pin)
      .then((info) => live && setSt({ pin, status: info ? 'ok' : 'none', info }))
      .catch(() => live && setSt({ pin, status: 'error', info: null }))
    return () => { live = false }
  }, [pin, valid])
  if (!valid) return { status: 'idle', info: null }
  return st.pin === pin ? st : { status: 'loading', info: null }
}

export default function LocationRadar({ criteria: c, set, meta, relocationEnabled, customPanel }) {
  const [rows, setRows] = useState([])
  const [facets, setFacets] = useState([])
  const [hiring, setHiring] = useState([])
  const [hiringFailed, setHiringFailed] = useState(false)
  const [geoStates, setGeoStates] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [attempt, setAttempt] = useState(0)
  const [citySort, setCitySort] = useState('match')
  const [customOpen, setCustomOpen] = useState(c.prefLocations.length > 0 || c.relocate)
  const [distOpen, setDistOpen] = useState(false)

  // Reference data: the candidate pool, this company's job cities, and the state / UT list.
  useEffect(() => {
    let live = true
    setStatus('loading')
    Promise.all([
      getPoolRows(),
      IS_DEMO ? [] : getLocationFacets().catch(() => []),
      IS_DEMO ? [] : getStates().catch(() => []),
      IS_DEMO ? { rows: [], failed: false } : getHiringPincodes().then((rows) => ({ rows, failed: false })).catch(() => ({ rows: [], failed: true })),
    ])
      .then(([r, f, s, h]) => { if (live) { setRows(r); setFacets(f); setGeoStates(s); setHiring(h.rows); setHiringFailed(h.failed); setStatus('ready') } })
      .catch(() => live && setStatus('error'))
    return () => { live = false }
  }, [meta?.syncedAt, attempt])

  // "Matching" counts follow every other active filter, so recompute lazily as they change.
  const lazy = useDeferredValue(c)
  const stats = useMemo(() => (status === 'ready' ? buildLocationStats(rows, lazy, facets) : null), [status, rows, lazy, facets])
  const stale = lazy !== c

  const hasCandidateGeo = !!stats && stats.cities.size > 0
  const selCities = c.locations
  const selKeys = selCities.map(canonCity)
  const stateKey = canonCity(c.state)

  // ---- Step 1: states ----
  const stateOptions = useMemo(() => {
    const names = new Map()
    geoStates.forEach((s) => names.set(canonCity(s), s))
    stats?.states.forEach((s, k) => { if (!names.has(k)) names.set(k, s.name) })
    const out = [...names].map(([k, name]) => {
      const s = stats?.states.get(k)
      return { key: k, label: name, total: s?.total ?? 0, match: s?.match ?? 0, badge: s?.total ? n(s.total) : null }
    })
    return out.sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))
  }, [geoStates, stats])
  const allStates = { key: '__all', label: 'All States', badge: stats ? n(rows.length) : null }

  // ---- Step 2: cities (of the chosen state, or everywhere) ----
  const cityOptions = useMemo(() => {
    if (!stats) return []
    const list = [...stats.cities.values()].filter((ct) => !stateKey || ct.states.has(stateKey))
    const max = { match: Math.max(1, ...list.map((x) => x.match)) }
    return list.map((ct) => ({
      key: ct.key, label: ct.name, match: ct.match, total: ct.total, active: ct.active, badge: null,
      meta: (
        <span className="mt-1 block">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <Stat icon={Briefcase} value={ct.active} label="active openings" />
            <Stat icon={BadgeCheck} value={ct.verified} label="verified candidates" />
            <Stat icon={Users} value={ct.match} label="match your filters" tone="strong" />
          </span>
          <span className="mt-1 block"><Meter value={ct.match} max={max.match} /></span>
        </span>
      ),
    }))
  }, [stats, stateKey])
  const sortedCities = useMemo(() => [...cityOptions].sort(SORTS[citySort].by), [cityOptions, citySort])

  // ---- Step 3: PIN Radar (PinRadar.jsx) — talent, hiring and postal PINs of the chosen cities ----
  const cityOpenings = selKeys.reduce((t, k) => t + (stats?.cities.get(k)?.active ?? 0), 0)
  const pinStat = c.pincode && stats?.pins.get(c.pincode)
  const pinOpen = c.pincode ? hiring.filter((h) => h.pincode === c.pincode).reduce((t, h) => t + h.active, 0) || null : null

  const chosen = usePinInfo(c.pincode, true)

  // ---- Handlers: a parent change resets only the dependent picks that no longer fit ----
  const cityFits = (name, sKey) => {
    const ct = stats?.cities.get(canonCity(name))
    return !sKey || !ct || ct.states.size === 0 || ct.states.has(sKey)
  }
  const pinFits = (pin, cities) => {
    const p = stats?.pins.get(pin)
    return !pin || !p || !cities.length || cities.some((x) => p.cities.has(canonCity(x)))
  }
  const pickState = (o) => {
    const name = o.key === '__all' ? '' : o.label
    const sk = canonCity(name)
    const locations = c.locations.filter((l) => cityFits(l, sk))
    const keepPin = pinFits(c.pincode, locations)
    set({ state: name, locations, ...(keepPin ? {} : { pincode: '', pinNearby: false }) })
  }
  const toggleCity = (o) => {
    const has = selKeys.includes(o.key)
    const locations = has ? c.locations.filter((l) => canonCity(l) !== o.key) : [...c.locations, o.label]
    const st = !c.state && !has ? [...(stats?.cities.get(o.key)?.states ?? [])] : []
    const keepPin = locations.length > 0 && pinFits(c.pincode, locations)
    set({ locations, ...(keepPin ? {} : { pincode: '', pinNearby: false }), ...(st.length === 1 ? { state: stateOptions.find((s) => s.key === st[0])?.label ?? c.state } : {}) })
  }

  const scope = c.pincode ? (c.pinNearby ? 'nearby' : 'pin') : c.locations.length ? 'city' : c.state || c.prefLocations.length || c.relocate ? 'other' : 'anywhere'
  const anywhere = () => { set({ state: '', locations: [], pincode: '', pinNearby: false, prefLocations: [], relocate: false, alsoPreferred: true }); setCustomOpen(false) }


  const showPin = selCities.length > 0
  const showReach = selCities.length > 0 || !!c.pincode
  const loading = status === 'loading'

  const scopes = [
    { id: 'pin', label: 'This PIN', icon: Crosshair, need: !c.pincode && 'Pick a PIN code in step 3', on: () => set({ pinNearby: false }) },
    { id: 'nearby', label: 'Nearby PINs', icon: Layers, need: !c.pincode && 'Pick a PIN code in step 3', on: () => set({ pinNearby: true }), sub: 'Same 3-digit PIN area' },
    { id: 'city', label: 'Entire city', icon: Building2, need: !selCities.length && 'Pick a city in step 2', on: () => set({ pincode: '', pinNearby: false }) },
    { id: 'anywhere', label: 'Anywhere', icon: Globe, on: anywhere, sub: 'No location limit' },
  ]

  return (
    <div className="space-y-3.5">
      {status === 'error' && (
        <div role="alert" className="flex items-center gap-2 rounded-lg bg-[#fdecec] px-3 py-2 text-[12.5px] text-bad">
          Couldn’t load location data.
          <button type="button" onClick={() => setAttempt((x) => x + 1)} className="ml-auto font-semibold underline">Retry</button>
        </div>
      )}

      {/* Step 1 — state */}
      <div>
        <StepLabel num="1" title="State" hint={stats && stats.states.size === 0 ? 'No state on candidate profiles yet' : undefined} />
        <Picker
          id="radar-state" label="State" icon={MapPin}
          value={c.state} placeholder="All States"
          options={[allStates, ...stateOptions]} selected={[c.state ? stateKey : '__all']}
          onPick={pickState} onClear={c.state ? () => pickState(allStates) : undefined}
          searchPlaceholder="Search state or union territory" emptyText="No matching state" status={loading ? 'loading' : undefined}
          headerNote={stats ? 'Numbers are candidates with that state on their profile.' : undefined}
        />
      </div>

      {/* Step 2 — hiring city */}
      <div className="fade-up">
        <StepLabel num="2" title="Hiring city" hint={c.state || undefined} />
        <Picker
          id="radar-city" label="Hiring city" icon={Building2} resetKey={stateKey}
          value={selCities.length ? `${selCities.length} ${selCities.length === 1 ? 'city' : 'cities'} selected` : ''} placeholder={loading ? 'Loading cities…' : hasCandidateGeo ? 'Search & pick cities' : 'No cities yet'}
          options={sortedCities} selected={selKeys}
          onPick={toggleCity}
          sorts={SORTS} sort={citySort} onSort={setCitySort}
          searchPlaceholder="Search city" status={loading ? 'loading' : undefined}
          disabled={!loading && !hasCandidateGeo}
          emptyText={c.state ? `No cities with candidates or openings in ${c.state}` : 'No cities found'}
          headerNote="Openings = your active jobs · verified = identity, phone, email or résumé verified · match = fits your other filters"
        />
        {selCities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selCities.map((l) => <Chip key={l} tone="accent" onRemove={() => toggleCity({ key: canonCity(l), label: l })}>{l}</Chip>)}
          </div>
        )}
        {selCities.length > 0 && (
          <label className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[12.5px] hover:bg-line-2">
            <input type="checkbox" checked={c.alsoPreferred} onChange={(e) => set({ alsoPreferred: e.target.checked })} className="accent-[#0a6f64]" /> Include people who prefer to relocate here
          </label>
        )}
      </div>

      {/* Step 3 — active hiring PIN codes */}
      {showPin && (
        <div className="fade-up">
          <StepLabel num="3" title="PIN Radar" hint={selCities.length === 1 ? selCities[0] : undefined} />
          <p className="mb-1.5 text-[11.5px] text-muted">Every PIN code in your cities, coloured by matching talent. Tap one to search there.</p>
          {loading ? (
            <div className="grid grid-cols-2 gap-1.5" aria-hidden>{Array.from({ length: 4 }, (_, i) => <span key={i} className="skeleton block h-16 rounded-lg" />)}</div>
          ) : (
            <PinRadar
              cities={selCities} stateName={c.state} hiring={hiring} hiringFailed={hiringFailed}
              talentPins={stats?.pins} cityOpenings={cityOpenings}
              value={c.pincode} onPick={(pin) => set({ pincode: pin, pinNearby: false })} onClear={() => set({ pincode: '', pinNearby: false })}
              onRetry={() => setAttempt((x) => x + 1)}
            />
          )}
          <PinTyped current={c.pincode} known={stats?.pins} onUse={(pin) => set({ pincode: pin, pinNearby: false })} />
          {c.pincode && (
            <p className="mt-1.5 text-[11.5px] text-muted" role="status">
              {pinOpen != null ? `${n(pinOpen)} active opening${pinOpen === 1 ? '' : 's'} · ` : ''}{pinStat ? `${n(pinStat.match)} of ${n(pinStat.total)} candidates here match your filters` : 'No candidate on file with this PIN code'}
              {chosen.status === 'ok' ? ` · ${areaSummary(chosen.info.areas, 3)}, ${chosen.info.district}, ${chosen.info.state}` : chosen.status === 'loading' ? '' : ' · Locality unavailable'}
            </p>
          )}
        </div>
      )}

      {/* Step 4 — reach */}
      {showReach && (
        <div className="fade-up">
          <StepLabel num="4" title="Search reach" />
          <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Search reach">
            {scopes.map((s) => {
              const on = scope === s.id
              return (
                <button key={s.id} type="button" role="radio" aria-checked={on} disabled={!!s.need} title={s.need || s.sub || undefined} onClick={s.on}
                  className={clsx('flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-left text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45', on ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line bg-white text-ink-2 hover:bg-line-2')}>
                  <s.icon size={13} className="shrink-0" /> <span className="truncate">{s.label}</span>
                </button>
              )
            })}
            <button type="button" role="switch" aria-checked={customOpen} onClick={() => setCustomOpen((v) => !v)}
              className={clsx('col-span-2 flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-left text-[12.5px] font-semibold transition-colors', customOpen || c.prefLocations.length ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line bg-white text-ink-2 hover:bg-line-2')}>
              <SlidersHorizontal size={13} /> Custom preferred locations
              {c.prefLocations.length > 0 && <span className="ml-auto text-[11px]">{c.prefLocations.length}</span>}
            </button>
          </div>
          <p className="mt-1.5 text-[11.5px] text-muted">
            {scope === 'anywhere' ? 'Searching all locations.' : scope === 'nearby' ? `Candidates in PIN area ${c.pincode.slice(0, 3)}xxx.` : scope === 'pin' ? `Candidates with PIN ${c.pincode} only.` : scope === 'city' ? 'Everyone in the selected cities.' : null}
          </p>

          <button type="button" onClick={() => setDistOpen((v) => !v)} aria-expanded={distOpen} className="mt-1 flex items-center gap-1 text-[11.5px] font-semibold text-accent hover:underline">
            Customize radius <ChevronDown size={12} className={clsx('transition-transform', distOpen && 'rotate-180')} />
          </button>
          {distOpen && (
            <div className="fade-up mt-1.5 rounded-lg border border-line-2 bg-line-2/40 p-2.5">
              <div className="flex flex-wrap gap-1.5" aria-label="Distance radius (unavailable)">
                {RADIUS_OPTIONS.filter((o) => [100, 500, 1000, 5000, 10000].includes(o.value) || o.value === 2000).map((o) => (
                  <button key={o.value} type="button" disabled className="h-7 cursor-not-allowed rounded-full border border-line bg-white px-2.5 text-[11.5px] font-semibold text-muted opacity-60">{o.label.replace('Within ', '')}</button>
                ))}
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-muted">Distance search isn’t available for candidates yet: profiles store a city and PIN code, not map coordinates, so a 100 m – 10 km radius would be a guess. Use <b>This PIN</b> or <b>Nearby PINs</b> for the closest honest match.</p>
            </div>
          )}

          {customOpen && <div className="fade-up mt-2">{relocationEnabled ? customPanel : <p className="text-[12px] text-muted">Preferred locations aren’t available on this data yet.</p>}</div>}
        </div>
      )}

      {!showReach && !c.state && !c.prefLocations.length && !c.relocate && (
        <p className="flex items-center gap-1.5 text-[11.5px] text-muted"><Globe size={12} /> Searching all locations. Pick a state or city to narrow.</p>
      )}
      {stale && <span className="sr-only" aria-live="polite">Updating counts</span>}
    </div>
  )
}

/** Lets a recruiter use a valid 6-digit PIN that isn't in the list (it will simply match stored PINs). */
function PinTyped({ current, known, onUse }) {
  const [v, setV] = useState('')
  const ok = isPin(v)
  const typed = usePinInfo(v, ok)
  return (
    <>
    <div className="mt-1.5 flex items-center gap-1.5">
      <input inputMode="numeric" maxLength={6} value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => { if (e.key === 'Enter' && ok) { onUse(v); setV('') } }} placeholder="Or type a 6-digit PIN" aria-label="Type a PIN code" className="h-8 min-w-0 flex-1 rounded-lg border border-line bg-white px-2.5 text-[12.5px] outline-none placeholder:text-[#8aa0b2] focus:border-accent" />
      <button type="button" disabled={!ok || v === current} onClick={() => { onUse(v); setV('') }} className="h-8 rounded-lg border border-line px-2.5 text-[12px] font-semibold text-accent hover:bg-accent-soft disabled:text-muted disabled:opacity-50 disabled:hover:bg-transparent">
        {known?.has(v) ? 'Use' : 'Use PIN'}
      </button>
    </div>
    {ok && <p className="mt-1 text-[11.5px] text-muted" role="status">{typed.status === 'loading' ? 'Looking up locality…' : typed.status === 'ok' ? `${areaSummary(typed.info.areas, 3)} · ${typed.info.district}, ${typed.info.state}` : 'Locality unavailable'}</p>}
    </>
  )
}
