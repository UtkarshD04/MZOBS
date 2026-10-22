import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, Crosshair, Info, MapPin, Search } from 'lucide-react'
import { Button, Chip } from './ui'
import Combobox from './Combobox'
import LocationPicker from './LocationPicker'
import { RADIUS_OPTIONS, PRECISE_RADIUS_BELOW_M, radiusLabel, isPin, getStates, getLocationFacets, searchPlaces, lookupPincode, geoError, getDevicePosition, deviceError } from '../services/geoService'

export const EMPTY_LOCATION = { state: '', city: '', locality: '', pincode: '', place: null, radius: 1000 }

export const hasLocationFilter = (f) => !!(f.state || f.city || f.locality || f.pincode || f.place)

/** Filter state → GET /jobs query params (the backend validates them again). */
export function locationParams(f) {
  const p = {}
  if (f.state) p.state = f.state
  if (f.city) p.city = f.city
  if (f.locality) p.locality = f.locality
  if (f.pincode) p.pincode = f.pincode
  if (f.place) Object.assign(p, { lat: f.place.lat, lng: f.place.lng, radius: f.radius })
  return p
}

const uniq = (arr) => [...new Set(arr.filter(Boolean))]
const has = (text, q) => text.toLowerCase().includes(q.toLowerCase())

// Debounced geocoder lookup; `enabled` keeps idle fields from calling the API at all.
function usePlaces(q, { state, city, enabled }) {
  const [st, setSt] = useState({ rows: [], loading: false, error: '' })
  useEffect(() => {
    const text = q.trim()
    if (!enabled || text.length < 3) { setSt({ rows: [], loading: false, error: '' }); return }
    const ctl = new AbortController()
    setSt((s) => ({ ...s, loading: true, error: '' }))
    const t = setTimeout(() => {
      searchPlaces(text, { state, city, signal: ctl.signal })
        .then((rows) => setSt({ rows, loading: false, error: '' }))
        .catch((e) => { const m = geoError(e); if (m) setSt({ rows: [], loading: false, error: m }) })
    }, 450)
    return () => { clearTimeout(t); ctl.abort() }
  }, [q, state, city, enabled])
  return st
}

const label = 'text-[12.5px] font-medium text-ink-2'

export default function LocationFilters({ applied, onApply, error, total, busy }) {
  const [open, setOpen] = useState(true)
  const [draft, setDraft] = useState(applied)
  const [errors, setErrors] = useState({})
  const [states, setStates] = useState([])
  const [statesError, setStatesError] = useState('')
  const [facets, setFacets] = useState([])
  const [pinInfo, setPinInfo] = useState(null) // { ok, text }
  const [search, setSearch] = useState('')
  const [locating, setLocating] = useState(false)
  const [searchNote, setSearchNote] = useState('')
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  useEffect(() => setDraft(applied), [applied])

  // Reference data loads on first open, not on page load.
  useEffect(() => {
    if (!open || states.length) return
    getStates().then(setStates).catch((e) => setStatesError(geoError(e)))
    getLocationFacets().then(setFacets).catch(() => setFacets([]))
  }, [open, states.length])

  // PIN → state / district / areas (reference data only; the filter itself matches stored PINs).
  const [pinAreas, setPinAreas] = useState([])
  useEffect(() => {
    setPinInfo(null)
    setPinAreas([])
    if (!isPin(draft.pincode)) return
    let live = true
    lookupPincode(draft.pincode)
      .then((r) => { if (live) { setPinAreas(r.areas); setPinInfo({ ok: true, text: `${r.areas.length} area${r.areas.length === 1 ? '' : 's'} · ${r.district}, ${r.state}` }) } })
      .catch((e) => { if (live) setPinInfo({ ok: false, text: e?.response?.status === 404 ? 'No area found for this PIN code — it will still filter by stored PIN.' : geoError(e) }) })
    return () => { live = false }
  }, [draft.pincode])

  const cityPlaces = usePlaces(draft.city, { state: draft.state, enabled: open && !!draft.state })
  const localityPlaces = usePlaces(draft.locality, { state: draft.state, city: draft.city, enabled: open && !!draft.city })
  const searchPlacesSt = usePlaces(search, { enabled: open })

  const stateOptions = useMemo(() => uniq([...states, ...facets.map((f) => f.state)]).filter((s) => !draft.state || has(s, draft.state)).map((s) => ({ key: s, label: s })), [states, facets, draft.state])

  const cityOptions = useMemo(() => {
    const own = facets.filter((f) => !draft.state || f.state === draft.state).map((f) => f.city)
    const found = cityPlaces.rows.filter((p) => !draft.state || p.state === draft.state).map((p) => p.city)
    return uniq([...own.filter((c) => !draft.city || has(c, draft.city)), ...found]).map((c) => ({ key: c, label: c }))
  }, [facets, cityPlaces.rows, draft.state, draft.city])

  const localityOptions = useMemo(() => {
    const own = facets.filter((f) => f.city === draft.city).map((f) => f.locality)
    const found = localityPlaces.rows.map((p) => p.locality)
    return uniq([...own, ...pinAreas, ...found]).filter((l) => !draft.locality || has(l, draft.locality)).map((l) => ({ key: l, label: l }))
  }, [facets, pinAreas, localityPlaces.rows, draft.city, draft.locality])

  // Quick pick: this company's own job-opening cities (busiest first), then the
  // areas it already hires in for the chosen city.
  const cityPicks = useMemo(() => {
    const by = new Map()
    facets.forEach((f) => { if (f.city) by.set(f.city, { city: f.city, state: f.state, count: (by.get(f.city)?.count ?? 0) + (f.count ?? 1) }) })
    return [...by.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
  }, [facets])
  const areaPicks = useMemo(() => {
    if (!draft.city) return []
    return facets.filter((f) => f.city === draft.city && f.locality).sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  }, [facets, draft.city])
  const pickCity = (name) => {
    const c = cityPicks.find((x) => x.city === name)
    set(c ? { city: c.city, state: c.state || draft.state, locality: '' } : { city: '', locality: '' })
  }

  // Unified search: states, cities, a PIN, nearby-me, then geocoder addresses.
  const searchOptions = useMemo(() => {
    const q = search.trim()
    const out = []
    if (!q) return [{ key: 'near-me', label: 'Jobs near my current location', hint: 'Asks for your browser location', action: 'near-me' }]
    if (/^\d{6}$/.test(q)) out.push({ key: `pin-${q}`, label: `PIN code ${q}`, hint: 'Match jobs stored with this PIN', action: 'pin', pin: q })
    if (q.length >= 2) {
      states.filter((s) => has(s, q)).slice(0, 4).forEach((s) => out.push({ key: `st-${s}`, label: s, hint: 'State', action: 'state', state: s }))
      uniq(facets.filter((f) => has(f.city, q)).map((f) => `${f.city}|${f.state}`)).slice(0, 4).forEach((k) => {
        const [city, state] = k.split('|')
        out.push({ key: `ct-${k}`, label: city, hint: `City · ${state}`, action: 'city', city, state })
      })
    }
    searchPlacesSt.rows.forEach((p, i) => out.push({ key: `pl-${i}-${p.lat}`, label: p.label, hint: 'Place · approximate point', action: 'place', place: p }))
    return out
  }, [search, states, facets, searchPlacesSt.rows])

  const nearMe = async () => {
    setSearchNote('')
    setLocating(true)
    try {
      const p = await getDevicePosition()
      set({ place: { label: 'My current location', state: '', city: '', locality: '', pincode: '', lat: p.lat, lng: p.lng, accuracyM: p.accuracyM, accuracy: p.accuracyM <= 100 ? 'precise' : 'approximate', source: 'device_location' } })
    } catch (e) {
      setSearchNote(deviceError(e))
    } finally {
      setLocating(false)
    }
  }

  const pickSearch = (o) => {
    setSearch('')
    setSearchNote('')
    if (o.action === 'near-me') nearMe()
    else if (o.action === 'pin') set({ pincode: o.pin })
    else if (o.action === 'state') set({ state: o.state, city: '', locality: '' })
    else if (o.action === 'city') set({ state: o.state, city: o.city, locality: '' })
    else if (o.action === 'place') {
      const p = o.place
      set({ place: { ...p, source: 'geocoded_address', accuracy: 'approximate' }, ...(p.state ? { state: p.state } : {}), ...(p.city ? { city: p.city } : {}) })
    }
  }

  const apply = () => {
    const e = {}
    if (draft.state && states.length && !states.some((s) => s.toLowerCase() === draft.state.toLowerCase()) && !facets.some((f) => f.state.toLowerCase() === draft.state.toLowerCase())) e.state = 'Choose a state from the list'
    if (draft.pincode && !isPin(draft.pincode)) e.pincode = 'Enter a valid 6-digit PIN code'
    setErrors(e)
    if (Object.keys(e).length) return
    onApply({ ...draft, locality: draft.locality.trim(), city: draft.city.trim() })
  }
  const reset = () => { setErrors({}); setSearch(''); setDraft(EMPTY_LOCATION); onApply(EMPTY_LOCATION) }
  const clearOne = (patch) => onApply({ ...applied, ...patch })

  const active = hasLocationFilter(applied)
  const precisionOnly = draft.place && draft.radius < PRECISE_RADIUS_BELOW_M
  return (
    <section className="mt-5 rounded-2xl border border-line bg-white shadow-card" aria-label="Location filters">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-[14px] font-semibold"><MapPin size={15} className="text-accent" /> Advanced location filters {active && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11.5px] text-[#0a6f64]">On</span>}</span>
        <ChevronDown size={16} className={clsx('text-muted transition-transform', open && 'rotate-180')} />
      </button>

      {active && (
        <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3" aria-label="Active location filters">
          {applied.state && <Chip tone="accent" onRemove={() => clearOne({ state: '', city: '', locality: '' })}>{applied.state}</Chip>}
          {applied.city && <Chip tone="accent" onRemove={() => clearOne({ city: '', locality: '' })}>{applied.city}</Chip>}
          {applied.locality && <Chip tone="accent" onRemove={() => clearOne({ locality: '' })}>{applied.locality}</Chip>}
          {applied.pincode && <Chip tone="accent" onRemove={() => clearOne({ pincode: '' })}>PIN {applied.pincode}</Chip>}
          {applied.place && <Chip tone="hit" onRemove={() => clearOne({ place: null })}>{`${radiusLabel(applied.radius)} of ${applied.place.label.split(',')[0]}`}</Chip>}
          {total != null && <span className="ml-1 text-[12.5px] text-muted" role="status">{total} matching job{total === 1 ? '' : 's'}</span>}
        </div>
      )}
      {error && <p role="alert" className="mx-4 mb-3 rounded-lg bg-[#fdecec] px-3 py-2 text-[13px] text-bad">{error}</p>}

      {open && (
        <div className="space-y-4 border-t border-line-2 px-4 pb-4 pt-3">
          <div className="rounded-xl border border-line-2 bg-line-2/40 p-3">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-start">
              <div>
                <label htmlFor="loc-quick-city" className={label}>Job city</label>
                <select id="loc-quick-city" value={cityPicks.some((c) => c.city === draft.city) ? draft.city : ''} onChange={(e) => pickCity(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-[14px] outline-none focus:border-accent">
                  <option value="">{cityPicks.length ? 'All cities with openings' : 'No job cities yet'}</option>
                  {cityPicks.map((c) => <option key={c.city} value={c.city}>{c.city} ({c.count})</option>)}
                </select>
              </div>
              <div>
                <span className={label}>Popular hiring locations{draft.city ? ` in ${draft.city}` : ''}</span>
                {!draft.city ? (
                  <p className="mt-2 text-[12.5px] text-muted">Pick a city to see where you already hire, then choose a preferred location.</p>
                ) : areaPicks.length === 0 ? (
                  <p className="mt-2 text-[12.5px] text-muted">No area saved on your jobs in {draft.city} yet — type one in Area / locality below.</p>
                ) : (
                  <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="Preferred location">
                    <button type="button" aria-pressed={!draft.locality} onClick={() => set({ locality: '' })} className={clsx('inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-semibold', !draft.locality ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line bg-white text-ink-2 hover:bg-line-2')}>Any area</button>
                    {areaPicks.map((a) => (
                      <button key={a.locality} type="button" aria-pressed={draft.locality === a.locality} onClick={() => set({ locality: a.locality })} className={clsx('inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold', draft.locality === a.locality ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line bg-white text-ink-2 hover:bg-line-2')}>
                        <MapPin size={12} aria-hidden /> {a.locality} <span className="text-muted">{a.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <Combobox
              hideLabel
              label="Search state, city, area, PIN code or nearby jobs"
              value={search}
              onInput={setSearch}
              options={searchOptions}
              onSelect={pickSearch}
              loading={searchPlacesSt.loading || locating}
              error={searchPlacesSt.error || searchNote}
              placeholder="Search state, city, area, pincode or nearby jobs..."
              emptyText="No matches — use the fields below or pick a point on the map"
              inputClass="pl-9"
            />
            <Search size={15} className="pointer-events-none absolute left-3 top-[13px] text-muted" aria-hidden />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Combobox label="State / UT" value={draft.state} onInput={(v) => set({ state: v, city: '', locality: '' })} options={stateOptions} onSelect={(o) => set({ state: o.label, city: '', locality: '' })} error={errors.state || statesError} placeholder="Select state" emptyText="No matching state" />
            <Combobox label="City" value={draft.city} onInput={(v) => set({ city: v, locality: '' })} options={cityOptions} onSelect={(o) => set({ city: o.label, locality: '' })} loading={cityPlaces.loading} error={cityPlaces.error} placeholder={draft.state ? 'Search city' : 'Search city (or pick a state first)'} emptyText="No cities found — type the city name" />
            <Combobox label="Area / locality" value={draft.locality} onInput={(v) => set({ locality: v })} options={localityOptions} onSelect={(o) => set({ locality: o.label })} loading={localityPlaces.loading} error={localityPlaces.error} disabled={!draft.city} placeholder={draft.city ? 'Search locality' : 'Select a city first'} emptyText="No localities found" />
            <div>
              <label htmlFor="loc-pin" className={label}>PIN code</label>
              <input id="loc-pin" inputMode="numeric" maxLength={6} value={draft.pincode} onChange={(e) => { set({ pincode: e.target.value.replace(/\D/g, '') }); setErrors((x) => ({ ...x, pincode: '' })) }} placeholder="6-digit PIN code" aria-invalid={errors.pincode ? true : undefined} className={clsx('mt-1 h-10 w-full rounded-lg border bg-white px-3 text-[14px] outline-none focus:border-accent', errors.pincode ? 'border-bad' : 'border-line')} />
              {errors.pincode ? <p role="alert" className="mt-1 text-[12px] text-bad">{errors.pincode}</p> : pinInfo ? <p className={clsx('mt-1 text-[12px]', pinInfo.ok ? 'text-muted' : 'text-warn')}>{pinInfo.text}</p> : <p className="mt-1 text-[12px] text-muted">Matches jobs saved with this PIN — not a distance search.</p>}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
            <LocationPicker compact value={draft.place} onChange={(place) => set({ place })} radiusM={draft.place ? draft.radius : undefined} state={draft.state} city={draft.city} />
            <div>
              <label htmlFor="loc-radius" className={label}>Nearby radius</label>
              <select id="loc-radius" value={draft.radius} disabled={!draft.place} onChange={(e) => set({ radius: Number(e.target.value) })} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-[14px] outline-none focus:border-accent disabled:bg-line-2 disabled:text-muted">
                {RADIUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button type="button" disabled={!draft.place} onClick={() => set({ radius: 100 })} className={clsx('mt-2 inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold disabled:opacity-50', draft.radius === 100 ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line text-ink-2 hover:bg-line-2')}><Crosshair size={13} /> Within 100 m</button>
              {!draft.place && <p className="mt-1 text-[12px] text-muted">Choose an exact location to search nearby.</p>}
            </div>
          </div>

          {precisionOnly && (
            <p className="flex items-start gap-1.5 rounded-lg bg-warn-soft px-3 py-2 text-[12.5px] text-warn"><Info size={14} className="mt-0.5 shrink-0" /> Searches under 1 km only include jobs pinned precisely on a map. Jobs with an address-level location are left out rather than reported as exact.</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={apply} disabled={busy}>{busy ? 'Applying…' : 'Apply filters'}</Button>
            <Button onClick={reset} disabled={busy || (!active && !hasLocationFilter(draft))}>Reset location filters</Button>
          </div>
        </div>
      )}
    </section>
  )
}
