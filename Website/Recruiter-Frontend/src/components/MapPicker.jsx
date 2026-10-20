import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// India-wide default view until a point is chosen.
const INDIA_CENTER = [22.6, 79.0]

/**
 * Click-to-pick map (Leaflet + OpenStreetMap tiles). Controlled by `value` ({lat,lng} | null);
 * clicking calls onPick(lat, lng). When `radiusM` is set a circle shows the search area.
 * Markers are vector circles, so no image assets are needed by the bundler.
 */
export default function MapPicker({ value, radiusM, onPick, height = 260 }) {
  const el = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)
  const circle = useRef(null)
  const pickRef = useRef(onPick)
  pickRef.current = onPick

  useEffect(() => {
    const m = L.map(el.current, { center: INDIA_CENTER, zoom: 4, scrollWheelZoom: false })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(m)
    m.on('click', (e) => pickRef.current?.(e.latlng.lat, e.latlng.lng))
    map.current = m
    return () => { m.remove(); map.current = null; marker.current = null; circle.current = null }
  }, [])

  useEffect(() => {
    const m = map.current
    if (!m) return
    marker.current?.remove()
    circle.current?.remove()
    marker.current = circle.current = null
    if (!value) return
    const at = [value.lat, value.lng]
    marker.current = L.circleMarker(at, { radius: 8, color: '#08685e', weight: 3, fillColor: '#0a8a7a', fillOpacity: 0.9 }).addTo(m)
    if (radiusM) {
      circle.current = L.circle(at, { radius: radiusM, color: '#1c68ab', weight: 1.5, fillOpacity: 0.08 }).addTo(m)
      m.fitBounds(circle.current.getBounds(), { padding: [24, 24], maxZoom: 18 })
    } else {
      m.setView(at, Math.max(m.getZoom(), 15))
    }
  }, [value?.lat, value?.lng, radiusM])

  return (
    <div
      ref={el}
      style={{ height }}
      className="w-full overflow-hidden rounded-lg border border-line"
      role="application"
      aria-label="Map — click to choose a location"
    />
  )
}
