import { DEFAULT_OG_IMAGE } from './seoData.js'

// Node-only: builds the literal <head> tag string injected into the served
// HTML shell (server.js, scripts/prerender.js). Deliberately not JSX/React —
// this is what a crawler's "view source" actually sees, so it's built as
// plain, deterministic markup rather than relying on how renderToString
// handles React 19's title/meta head-hoisting for a partial (non-<html>)
// render tree.
function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function buildHeadHtml({ title, description, canonical, noindex = false, jsonLd = null, ogImage = DEFAULT_OG_IMAGE, type = 'website' }) {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    description && `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:site_name" content="MZOBS" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    description && `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    description && `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    // JSON.stringify output never contains "</" from these fields in
    // practice, but escape defensively so a stray "</script>" in a job
    // description can't break out of the tag.
    // data-seo-jsonld lets the client Seo component (src/components/Seo.jsx)
    // find and update this exact node on hydration/navigation instead of
    // appending a second one.
    jsonLd && `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean)

  return tags.join('\n    ')
}
