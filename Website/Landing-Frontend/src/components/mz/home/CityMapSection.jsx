import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { Container, Reveal, SectionHead } from '../primitives'
import { useHotCities } from '../../../lib/useHomeData'
import { HOT_CITIES_DATA } from '../../../lib/content'

// Every city here is chosen live from real opening counts — not a fixed
// curated list of "showcase" metros — so a city only ever appears when it
// genuinely has openings right now. HOT_CITIES_DATA.cities supplies the
// display metadata (landmark name + photo) for whichever slugs the live
// data says are hiring; a city with no real openings is dropped rather
// than shown with a hollow "0 openings" card.
const MAX_FEATURED_CITIES = 9

function hashOf(str) {
  return [...str].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
}

// Premium, non-photographic placeholder for a city with no curated photo
// yet — a brand-gradient mesh + one oversized translucent monogram, so a
// city never falls back to a broken-image icon or an unbranded grey box.
function CityVisualPlaceholder({ city }) {
  const seed = hashOf(city)
  const angle = 120 + (seed % 40)
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(${angle}deg, #2a2d6e 0%, #5b5fef 70%, #20c997 140%)` }}>
      <span className="absolute -bottom-4 -right-2 font-bold text-[100px] leading-none text-white/[0.14] select-none" aria-hidden="true">
        {city[0]}
      </span>
    </div>
  )
}

function CityVisual({ city, landmark, imageUrl, eager }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = imageUrl && !failed
  return showPhoto ? (
    <img
      src={imageUrl}
      alt={`${landmark}, ${city}`}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  ) : (
    <CityVisualPlaceholder city={city} />
  )
}

// One destination card — the monument photograph IS the card (full-bleed,
// no white chrome around it). Hover lifts the card, zooms the photo,
// strengthens the gradient, nudges the text upward, reveals the top real
// job categories, and fills the arrow badge white.
function CityCard({ meta, stats, index, onOpen }) {
  const [hovered, setHovered] = useState(false)
  const openings = stats?.openings ?? 0
  const categories = stats?.topCategories ?? []

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Explore jobs in ${meta.city}`}
      className="group relative h-[380px] w-full overflow-hidden rounded-[28px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mz-primary sm:h-[420px]"
      style={{ boxShadow: 'var(--shadow-mz-float)' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div className="absolute inset-0" animate={{ scale: hovered ? 1.06 : 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <CityVisual city={meta.city} landmark={meta.landmark} imageUrl={meta.imageUrl} eager={index < 3} />
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0.88 }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 p-6 sm:p-7"
        animate={{ y: hovered ? -10 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/75">Discover opportunities in</p>
        <h3 className="mt-1 text-[26px] font-black uppercase leading-none tracking-tight text-white sm:text-[30px]">{meta.city}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-white/80">
          <MapPin size={12} className="shrink-0" aria-hidden="true" />
          {meta.landmark}
        </p>

        <AnimatePresence>
          {hovered && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="mt-2.5 flex flex-wrap gap-1.5"
            >
              {categories.slice(0, 3).map((c) => (
                <span key={c} className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white/90">
                  {c}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[14px] font-black text-white sm:text-[15px]">
            {openings.toLocaleString('en-IN')}+ Active {openings === 1 ? 'opportunity' : 'opportunities'}
          </span>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 ${
              hovered ? 'border-white bg-white text-mz-ink' : ''
            }`}
            aria-hidden="true"
          >
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </motion.div>
    </motion.button>
  )
}

function CityCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mz-skeleton h-[380px] rounded-[28px] sm:h-[420px]" />
      ))}
    </div>
  )
}

// "Where is India hiring right now?" — every city shown here has real,
// live openings (from Backend's GET /api/jobs/hot-cities), displayed
// through its own famous monument photograph. Clicking a card opens that
// city's dedicated page (/jobs/city/:slug) with a real job list.
export default function CityMapSection() {
  const navigate = useNavigate()
  const { data: cities, status } = useHotCities()

  const destinations = useMemo(() => {
    if (!cities) return []
    return cities
      .map((c) => {
        const meta = HOT_CITIES_DATA.cities.find((m) => m.slug === c.slug)
        const stats = c.byFilter?.all
        if (!meta || !stats || stats.openings <= 0) return null
        return { meta, stats }
      })
      .filter(Boolean)
      .sort((a, b) => b.stats.openings - a.stats.openings)
      .slice(0, MAX_FEATURED_CITIES)
  }, [cities])

  const loading = status === 'loading' && destinations.length === 0

  return (
    <section id="cities" aria-labelledby="cities-title" className="relative overflow-hidden bg-[#F8F9FD] py-20 lg:py-28">
      <Container>
        <SectionHead id="cities-title" eyebrow="Explore by city" title="Explore Jobs by City">
          Discover opportunities across India&rsquo;s major and emerging employment hubs &mdash; every number here reflects real, live hiring.
        </SectionHead>

        <div className="mt-12">
          {loading ? (
            <CityCardSkeleton />
          ) : destinations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-mz-line-strong py-16 px-6 text-center">
              <p className="text-[15px] font-bold text-mz-ink">No live city openings right now</p>
              <p className="text-[13.5px] text-mz-muted">Check back soon as new roles come in.</p>
            </div>
          ) : (
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {destinations.map(({ meta, stats }, index) => (
                  <CityCard key={meta.slug} meta={meta} stats={stats} index={index} onOpen={() => navigate(`/jobs/city/${meta.slug}`)} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
