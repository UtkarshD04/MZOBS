import { useEffect } from 'react'
import { SITE_URL, DEFAULT_OG_IMAGE } from '../lib/seoData'

// Page-level SEO tags for client-side (SPA) navigation, applied imperatively
// in an effect rather than declaratively in JSX. The *initial* HTML sent to
// crawlers never depends on this component at all — server.js and
// scripts/prerender.js build the real tags as a literal string
// (renderHead.js) from the same seoData.js source and splice them straight
// into <head>. Doing it imperatively here (instead of relying on React 19's
// title/meta hoisting) means this component only ever updates those
// existing tags in place on hydration/navigation, rather than risking a
// second, React-managed copy sitting alongside the server-rendered ones.
function upsertMeta(attr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(data) {
  const existing = document.head.querySelector('script[data-seo-jsonld]')
  if (!data) {
    existing?.remove()
    return
  }
  const el = existing ?? document.head.appendChild(Object.assign(document.createElement('script'), { type: 'application/ld+json' }))
  el.setAttribute('data-seo-jsonld', '')
  el.textContent = JSON.stringify(data)
}

export default function Seo({ path, title, description, noindex = false, jsonLd = null, ogImage = DEFAULT_OG_IMAGE, type = 'website' }) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path}`
    document.title = title
    upsertMeta('name', 'description', description)
    upsertLink('canonical', canonical)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', 'MZOBS')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)
    upsertJsonLd(jsonLd)
  }, [path, title, description, noindex, jsonLd, ogImage, type])

  return null
}
