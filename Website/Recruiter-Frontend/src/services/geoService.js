// Location lookups for the employer dashboard, all through the backend's /geo proxy
// (Backend/src/routes/geoRoutes.js) so no geocoder credentials reach the browser:
//   GET /geo/states, /geo/places?q=, /geo/reverse?lat&lng, /geo/pincode/:pin
//   GET /jobs/location-facets  — the state/city/locality values this company's jobs already carry
import { apiClient } from '../lib/api'

export const RADIUS_OPTIONS = [
  { value: 100, label: 'Within 100 m' },
  { value: 250, label: 'Within 250 m' },
  { value: 500, label: 'Within 500 m' },
  { value: 1000, label: 'Within 1 km' },
  { value: 2000, label: 'Within 2 km' },
  { value: 5000, label: 'Within 5 km' },
  { value: 10000, label: 'Within 10 km' },
  { value: 25000, label: 'Within 25 km' },
]
export const radiusLabel = (m) => RADIUS_OPTIONS.find((o) => o.value === m)?.label ?? `Within ${m} m`
// Mirrors Backend/src/utils/jobLocation.js — below this the server only matches map-pinned jobs.
export const PRECISE_RADIUS_BELOW_M = 1000

export const isPin = (v) => /^[1-9]\d{5}$/.test(v)

export const getStates = () => apiClient.get('/geo/states').then((r) => r.data.states)
export const getLocationFacets = () => apiClient.get('/jobs/location-facets').then((r) => r.data)
export const searchPlaces = (q, { state, city, signal } = {}) =>
  apiClient.get('/geo/places', { params: { q, state: state || undefined, city: city || undefined }, signal }).then((r) => r.data)
export const reverseGeocode = (lat, lng) => apiClient.get('/geo/reverse', { params: { lat, lng } }).then((r) => r.data)
export const lookupPincode = (pin) => apiClient.get(`/geo/pincode/${pin}`).then((r) => r.data)

/** Human message for a failed location request. */
export function geoError(e) {
  if (e?.code === 'ERR_CANCELED') return ''
  return e?.response?.data?.message ?? 'Location service is unavailable. You can still pick a point on the map.'
}

/** Distance label for a job: "Within 100 m", "250 m away", "1.2 km away". */
export function distanceLabel(meters, radius) {
  if (meters == null) return ''
  if (radius === 100 && meters <= 100) return 'Within 100 m'
  if (meters < 1000) return `${meters} m away`
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km away`
}

/** Reads the device position — only ever called from an explicit user action. */
export function getDevicePosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(Object.assign(new Error('unsupported'), { code: 'UNSUPPORTED' }))
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracyM: p.coords.accuracy }),
      (err) => reject(Object.assign(new Error(err.message), { code: err.code === 1 ? 'DENIED' : err.code === 3 ? 'TIMEOUT' : 'UNAVAILABLE' })),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    )
  })
}

export function deviceError(e) {
  if (e.code === 'DENIED') return 'Location permission was denied. Search an address or pick a point on the map instead.'
  if (e.code === 'UNSUPPORTED') return 'This browser can’t share your location. Search an address or pick a point on the map.'
  if (e.code === 'TIMEOUT') return 'Couldn’t get your location in time. Try again, or pick a point on the map.'
  return 'Your location is unavailable right now. Search an address or pick a point on the map.'
}
