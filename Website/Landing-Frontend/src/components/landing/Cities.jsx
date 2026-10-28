import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HOT_CITIES_DATA } from '../../lib/content'
import { useHotCities } from '../../lib/useHomeData'

function CityCard({ meta, openings, hidden }) {
  const [failed, setFailed] = useState(false)
  return (
    <Link to={`/jobs/city/${meta.slug}`} className="city" tabIndex={hidden ? -1 : undefined} aria-hidden={hidden ? 'true' : undefined}>
      {meta.imageUrl && !failed && (
        <img className="city-img" src={meta.imageUrl} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
      )}
      <span className="city-shade" />
      <span style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#e6e8f0' }}>{meta.state}{meta.landmark ? ` · ${meta.landmark}` : ''}</span>
        <strong style={{ display: 'block', marginTop: 4, fontSize: 34, letterSpacing: '-0.04em' }}>{meta.city}</strong>
        {openings > 0 && (
          <span style={{ display: 'inline-block', marginTop: 10, padding: '5px 12px', borderRadius: 999, background: '#20c997', color: '#111827', fontSize: 12, fontWeight: 800 }}>
            {openings.toLocaleString('en-IN')} OPEN {openings === 1 ? 'ROLE' : 'ROLES'}
          </span>
        )}
      </span>
    </Link>
  )
}

// City photos scroll sideways; each links to that city's own jobs page and
// shows its real live opening count.
export default function Cities() {
  const { data: live } = useHotCities()
  const list = useMemo(() => {
    const stats = new Map((live ?? []).map((c) => [c.slug, c.byFilter?.all?.openings ?? 0]))
    return HOT_CITIES_DATA.cities
      .map((meta) => ({ meta, openings: stats.get(meta.slug) ?? 0 }))
      .sort((a, b) => b.openings - a.openings)
  }, [live])

  return (
    <section id="cities" style={{ background: '#fff', overflow: 'hidden', scrollMarginTop: 52 }}>
      <div className="sec" style={{ paddingBottom: 48, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div data-r=""><p className="eyebrow">Explore jobs by city</p><h2 className="h2">Where opportunity<br />meets ambition.</h2></div>
        <Link data-r="" to="/jobs/cities" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '0 22px', borderRadius: 999, border: '1px solid #d0d5dd', color: '#111827', fontWeight: 600, textDecoration: 'none' }}>Explore all locations →</Link>
      </div>
      <div className="cities-wrap" data-r="" style={{ paddingBottom: 130 }}>
        <div className="cities-track">
          {[0, 1].map((copy) => list.map((c) => <CityCard key={`${copy}-${c.meta.slug}`} meta={c.meta} openings={c.openings} hidden={copy === 1} />))}
        </div>
      </div>
    </section>
  )
}
