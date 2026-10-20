import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Crosshair, Map as MapIcon, MapPin, X } from 'lucide-react'
import Combobox from './Combobox'
import { Skeleton } from './ui'
import { searchPlaces, reverseGeocode, getDevicePosition, deviceError, geoError } from '../services/geoService'

const MapPicker = lazy(() => import('./MapPicker'))

// A device fix worse than this is stored as approximate, never as a precise pin.
const PRECISE_DEVICE_ACCURACY_M = 100

export const accuracyLabel = (p) => (p?.accuracy === 'precise' ? 'Precise pin' : 'Approximate (address-level)')

/**
 * Exact-location control shared by the Jobs filters and the job form: address search,
 * "Use my location" (only on click — never on load) and a click-to-pick map.
 * `value` / onChange use { label, state, city, locality, pincode, lat, lng, accuracy, source }.
 * Accuracy is 'precise' only for a hand-placed pin or a good device fix; a geocoded
 * address is always 'approximate'.
 */
export default function LocationPicker({ value, onChange, radiusM, state, city, compact }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [busy, setBusy] = useState(false)
  const pickSeq = useRef(0)

  useEffect(() => {
    setError('')
    const q = query.trim()
    if (q.length < 3) { setResults([]); setLoading(false); return }
    const ctl = new AbortController()
    setLoading(true)
    const t = setTimeout(() => {
      searchPlaces(q, { state, city, signal: ctl.signal })
        .then((rows) => { setResults(rows); if (!rows.length) setError('') })
        .catch((e) => { const m = geoError(e); if (m) { setResults([]); setError(m) } })
        .finally(() => !ctl.signal.aborted && setLoading(false))
    }, 450)
    return () => { clearTimeout(t); ctl.abort() }
  }, [query, state, city])

  const options = results.map((p, i) => ({ key: `${p.lat},${p.lng},${i}`, label: p.label, hint: [p.locality, p.city, p.state, p.pincode].filter(Boolean).join(' · '), place: p }))

  const chooseAddress = (o) => {
    pickSeq.current++
    setQuery('')
    setResults([])
    onChange({ ...o.place, source: 'geocoded_address', accuracy: 'approximate' })
  }

  // A hand-placed / device point: show it immediately, then fill in the address when reverse geocoding answers.
  const setPoint = async (lat, lng, source, accuracy) => {
    const seq = ++pickSeq.current
    const base = { label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, state: '', city: '', locality: '', pincode: '', lat, lng, accuracy, source }
    onChange(base)
    try {
      const addr = await reverseGeocode(lat, lng)
      if (addr && seq === pickSeq.current) onChange({ ...base, label: addr.label, state: addr.state, city: addr.city, locality: addr.locality, pincode: addr.pincode })
    } catch { /* the pin itself is valid without an address */ }
  }

  const useMyLocation = async () => {
    setError('')
    setBusy(true)
    try {
      const p = await getDevicePosition()
      setShowMap(true)
      await setPoint(p.lat, p.lng, 'device_location', p.accuracyM <= PRECISE_DEVICE_ACCURACY_M ? 'precise' : 'approximate')
    } catch (e) {
      setError(deviceError(e))
    } finally {
      setBusy(false)
    }
  }

  const pill = 'inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-[12.5px] font-semibold text-ink-2 hover:bg-line-2 disabled:opacity-50'
  return (
    <div className="min-w-0 space-y-2">
      <Combobox
        label="Exact location"
        value={query}
        onInput={setQuery}
        options={options}
        onSelect={chooseAddress}
        loading={loading}
        error={error}
        placeholder="Search address, landmark or area…"
        emptyText={query.trim().length < 3 ? 'Type at least 3 characters' : 'No places found — try a different spelling or pick on the map'}
        notice={compact ? undefined : 'Searching an address gives an approximate point. Drop a pin on the map for a precise one.'}
      />
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={pill} onClick={useMyLocation} disabled={busy}><Crosshair size={13} /> {busy ? 'Locating…' : 'Use my location'}</button>
        <button type="button" className={clsx(pill, showMap && 'border-accent bg-accent-soft text-[#0a6f64]')} aria-pressed={showMap} onClick={() => setShowMap((v) => !v)}><MapIcon size={13} /> {showMap ? 'Hide map' : 'Pick on map'}</button>
      </div>
      {showMap && (
        <Suspense fallback={<Skeleton className="h-[260px] w-full" />}>
          <MapPicker value={value} radiusM={radiusM} onPick={(lat, lng) => setPoint(lat, lng, 'map_pin', 'precise')} />
        </Suspense>
      )}
      {value && (
        <div className="flex items-start justify-between gap-2 rounded-lg bg-line-2 px-3 py-2 text-[12.5px] text-ink-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-medium"><MapPin size={13} className="shrink-0 text-muted" /><span className="truncate">{value.label}</span></p>
            <p className="mt-0.5 text-muted">{value.lat.toFixed(5)}, {value.lng.toFixed(5)} · <span className={value.accuracy === 'precise' ? 'font-semibold text-[#1a8f5a]' : 'font-semibold text-warn'}>{accuracyLabel(value)}</span></p>
          </div>
          <button type="button" onClick={() => { pickSeq.current++; onChange(null) }} aria-label="Clear exact location" className="grid h-6 w-6 shrink-0 place-items-center rounded hover:bg-black/10"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}
