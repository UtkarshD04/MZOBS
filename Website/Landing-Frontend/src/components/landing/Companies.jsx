import { useMemo, useState } from 'react'
import { COMPANIES_HIRING_DATA } from '../../lib/content'
import { useCompanyJobCounts } from '../../lib/useHomeData'

const NAMES = COMPANIES_HIRING_DATA.map((c) => c.name)

// Intrinsic logo sizes (from the files in /public/industry-logos) so every tile
// reserves its final width before the image loads — no layout shift.
const SIZE = {
  '/industry-logos/ampin.png': [2560, 1023],
  '/industry-logos/amplus.jpg': [264, 140],
  '/industry-logos/fourthpartner.png': [210, 106],
  '/industry-logos/haldirams.png': [2658, 1410],
  '/industry-logos/prakash-steel.png': [330, 120],
  '/industry-logos/rimjhim-ispat.png': [230, 63],
  '/industry-logos/sunsource.svg': [170, 80],
  '/industry-logos/sunsure.svg': [488, 146],
}

function Tile({ company, index, roles, onPick }) {
  const [failed, setFailed] = useState(false)
  const [w, h] = SIZE[company.logo] ?? [3, 1]
  const detail = [company.industry, roles > 0 ? `${roles} open ${roles === 1 ? 'role' : 'roles'}` : null].filter(Boolean).join(' · ')
  return (
    <button
      type="button"
      className={`co-tile${index % 2 ? ' co-tint' : ''}`}
      aria-label={`${company.name}${detail ? `, ${detail}` : ''}. Show their jobs`}
      onClick={() => onPick({ id: company.name, label: company.name, params: { q: [company.name] } })}
    >
      <span className="co-logo">
        {company.logo && !failed ? (
          <img src={company.logo} alt="" width={w} height={h} loading="lazy" decoding="async" style={{ aspectRatio: `${w} / ${h}` }} onError={() => setFailed(true)} />
        ) : (
          <span className="co-name">{company.name}</span>
        )}
      </span>
      {detail && <span className="co-cap" aria-hidden="true">{detail}</span>}
    </button>
  )
}

// One marquee row. The list is laid out twice per "copy" and the track holds
// two copies, sliding by exactly half its width — so the loop is seamless at any
// viewport width. Only the first run is exposed to assistive tech/keyboard;
// every repeat is aria-hidden + inert.
function Row({ items, counts, onPick, reverse, duration }) {
  const runs = [0, 1, 2, 3]
  return (
    <div className="co-row">
      <div className={`co-track${reverse ? ' co-rev' : ''}`} style={{ animationDuration: `${duration}s` }}>
        {runs.map((run) => (
          <ul key={run} className={`co-run${run ? ' co-dup' : ''}`} aria-hidden={run ? 'true' : undefined} inert={run ? true : undefined}>
            {items.map((c, i) => (
              <li key={c.name}>
                <Tile company={c} index={i} roles={counts[c.name]} onPick={onPick} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default function Companies({ onPick }) {
  const counts = useCompanyJobCounts(NAMES)
  // Second row starts from a different company so the two rows never line up.
  const second = useMemo(() => [...COMPANIES_HIRING_DATA.slice(4), ...COMPANIES_HIRING_DATA.slice(0, 4)], [])

  return (
    <section id="companies" className="co-section" aria-labelledby="co-title">
      <div className="co-head" data-r="">
        <div>
          <p className="eyebrow">Companies hiring through Mzobs</p>
          <h2 id="co-title" className="h2">In good company.</h2>
        </div>
        <p className="co-sub">Meet the organisations creating opportunities through Mzobs.</p>
      </div>
      <div className="co-rule" aria-hidden="true"><span /></div>
      <div className="co-gallery" data-r="">
        <Row items={COMPANIES_HIRING_DATA} counts={counts} onPick={onPick} duration={70} />
        <Row items={second} counts={counts} onPick={onPick} reverse duration={85} />
      </div>
    </section>
  )
}
