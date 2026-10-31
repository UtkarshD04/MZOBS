# Landing page sections

The home page (`src/pages/Home.jsx`) is built from the sections in this folder.
Order, top to bottom: hero, how it works (`NextMove`), audiences, companies,
candidate stories, rejection feedback, FAQ, footer.

## Rejection feedback (`RejectionFeedback.jsx`)

A teal panel with a sample application card: a four-stage tracker, a status
pill, three feedback categories and an improvement tip. Everything in the card
is illustrative sample content, not real employer feedback and not a Mzobs
statistic. Styles are in `rejectionFeedback.css`, scoped to `.rf`.

## FAQ (`Faq.jsx`)

Questions on the left, a chat-style reply on the right. To add a question, add
an entry to the `QA` list at the top of the file:

```js
{ q: 'Your question?', a: 'The answer.', link: { to: '/some-route', label: 'Link text' } }
```

`link` is optional. Keep each answer to something the site already says about
the product. The same list also feeds the FAQPage structured data, so the
visible questions and the search-engine copy cannot drift apart. Styles are in
`faq.css`, scoped to `.fq`.
