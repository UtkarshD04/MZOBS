// Google Analytics 4 (G-4J3T6LLDB5) with Google Consent Mode v2 and an
// in-house consent banner (src/components/ui/CookieConsent.jsx).
//
// Kept as an external file, not an inline snippet, so it works under the CSP
// in server.js (script-src has no 'unsafe-inline').
//
// Behaviour:
//  - Consent defaults to "denied" for everyone (all regions) before anything
//    else runs.
//  - gtag.js is NOT downloaded and no _ga cookies are set until the visitor
//    accepts analytics ("basic" consent mode: nothing reaches Google before
//    consent, not even cookieless pings).
//  - The choice is stored in localStorage and re-applied on every page load.
//  - Ads storage / personalisation stay denied permanently: this site uses GA4
//    for measurement only.
//  - page_view is sent manually (send_page_view:false) with a sanitised URL:
//    query strings (except utm_*) and hashes are stripped so no PII in a URL
//    can reach Google. window.mzobsAnalytics.pageView is called from
//    CookieConsent.jsx on every route change.
(function () {
  var GA_ID = 'G-4J3T6LLDB5'
  var KEY = 'mzobs_consent_v1'
  var UTM = /^utm_(source|medium|campaign|term|content)$/

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = window.gtag || gtag

  var loaded = false

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY))
      if (v && typeof v.analytics === 'boolean') return v
    } catch {}
    return null
  }

  function write(analytics) {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics: analytics, ts: Date.now() })) } catch {}
  }

  function deleteGaCookies() {
    var parts = location.hostname.split('.')
    var domains = ['', location.hostname]
    for (var i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'))
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim()
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name.indexOf('_gat') === 0) {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '')
        })
      }
    })
  }

  // Strip everything that could carry PII (query string, hash) except
  // campaign tags, so GA gets origin + path (+ utm_*) only.
  function cleanUrl() {
    try {
      var u = new URL(location.href)
      var keep = new URLSearchParams()
      u.searchParams.forEach(function (val, k) { if (UTM.test(k)) keep.set(k, val.slice(0, 100)) })
      var qs = keep.toString()
      return u.origin + u.pathname + (qs ? '?' + qs : '')
    } catch { return location.origin + location.pathname }
  }

  function cleanReferrer() {
    try {
      if (!document.referrer) return undefined
      var r = new URL(document.referrer)
      return r.origin + r.pathname
    } catch { return undefined }
  }

  function loadGtag() {
    if (loaded) return
    loaded = true
    var s = document.createElement('script')
    s.async = true
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
    document.head.appendChild(s)
    gtag('js', new Date())
    gtag('config', GA_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
  }

  function apply(analytics) {
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    if (analytics) {
      // Re-enable after an earlier withdrawal in the same page session
      // (loadGtag only runs its body once).
      window['ga-disable-' + GA_ID] = false
      loadGtag()
    } else {
      window['ga-disable-' + GA_ID] = true
      deleteGaCookies()
    }
  }

  // gtag.js queues and batches hits for a few seconds, and 'ga-disable-*' does
  // not recall hits already queued. So when consent is withdrawn, hits that were
  // generated while it was granted could still be sent afterwards. Drop any GA
  // collect request made while analytics consent is not granted.
  //
  // The same guard drops GA's own "browser history" page_view (Enhanced
  // Measurement). It duplicates ours and carries the previous page's raw URL
  // (query string included) as referrer. Ours are tagged with mz_pv (sent as
  // ep.mz_pv); a lone page_view hit without it is the automatic one. Turning that
  // option off in the GA4 stream makes this a no-op.
  // GA4 collect endpoints only: google-analytics.com / analytics.google.com and
  // their subdomains (www., region1., ...), matched on whole host labels.
  var COLLECT = /^https?:\/\/(?:[a-z0-9-]+\.)*(?:google-analytics\.com|analytics\.google\.com)(?::\d+)?\/g\/collect(?:[?#]|$)/i
  function consentGranted() { var c = read(); return !!(c && c.analytics) }
  function dropHit(url, body) {
    if (!COLLECT.test(url)) return false
    if (!consentGranted()) return true
    var isPv = /[?&]en=page_view(&|$)/.test(url)
    var batched = body && typeof body === 'string' && body.length > 0
    return isPv && !batched && !/[?&]epn?\.mz_pv=/.test(url)
  }
  var realFetch = window.fetch
  if (realFetch) {
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && (input.url || input.href)) || ''
      if (dropHit(url, init && init.body)) return Promise.resolve(new Response(null, { status: 204 }))
      return realFetch.apply(this, arguments)
    }
  }
  if (navigator.sendBeacon) {
    var realBeacon = navigator.sendBeacon
    navigator.sendBeacon = function (url, data) {
      if (dropHit(String(url), data)) return true
      return realBeacon.apply(this, arguments)
    }
  }

  // Consent Mode v2 defaults: must precede any other gtag call.
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })
  gtag('set', 'ads_data_redaction', true)

  var saved = read()
  if (saved) apply(saved.analytics)

  var lastTitle = null
  var lastLocation = null
  var api = {
    // null = no choice yet (banner should show)
    getChoice: function () { var c = read(); return c ? c.analytics : null },
    setChoice: function (analytics) {
      var wasGranted = api.getChoice() === true
      write(!!analytics)
      apply(!!analytics)
      // Count the page the visitor is on now that they have opted in (but not
      // again if they were already opted in and just re-confirmed).
      if (analytics && !wasGranted) api.pageView(lastTitle)
    },
    // Called on every route change; no-op unless analytics consent is granted.
    pageView: function (title) {
      lastTitle = title || document.title
      if (api.getChoice() !== true) return
      var location_ = cleanUrl()
      var referrer = lastLocation || cleanReferrer()
      // Also set them globally: gtag's automatic events (scroll, click,
      // outbound click...) read the raw URL otherwise, query string included.
      gtag('set', { page_location: location_, page_referrer: referrer })
      gtag('event', 'page_view', {
        page_location: location_,
        page_referrer: referrer,
        page_title: lastTitle,
        mz_pv: 1,
      })
      lastLocation = location_
    },
  }
  window.mzobsAnalytics = api
})()
