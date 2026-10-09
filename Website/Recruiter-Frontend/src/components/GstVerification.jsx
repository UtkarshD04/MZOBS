import { useState } from 'react'
import clsx from 'clsx'
import { AlertTriangle, BadgeCheck, Clock, Loader2, RotateCw, ShieldCheck } from 'lucide-react'
import { Button, Skeleton, StatusPill } from './ui'
import { IS_DEMO } from '../lib/config'
import { isValidGstin, normalizeGstin } from '../lib/gstin'
import { getSession } from '../services/liveApi'
import { useCompany, verifyGst, GST_STATUS_LABEL, GST_STATUS_PILL } from '../services/companyService'

// What the recruiter sees for each server code (Backend utils/gstVerification.js
// GST_MESSAGES carries the same meaning; these add the "what to do next").
const ERROR_HELP = {
  INVALID_GSTIN: 'Check the 15 characters against your GST certificate.',
  INVALID_LEGAL_NAME: 'Enter the legal name exactly as on your GST certificate.',
  NAME_MISMATCH: 'Enter the “Legal Name of Business” exactly as printed on your GST certificate, then try again.',
  INACTIVE_REGISTRATION: 'Only an active GST registration can be verified.',
  GSTIN_NOT_FOUND: 'Check the GSTIN for typos and try again.',
  PROVIDER_ERROR: 'This is on our side — please try again in a little while.',
  PROVIDER_TIMEOUT: 'This is on our side — please try again.',
  PROVIDER_RATE_LIMITED: 'Please wait a few minutes before trying again.',
  RATE_LIMITED: 'You’ve reached the hourly limit for verification attempts.',
  GST_NOT_CONFIGURED: 'GST verification is being set up. You can still use Mzobs as usual.',
  REJECTED_BY_REVIEW: 'Contact Mzobs support if you think this is a mistake.',
}

function Detail({ label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 border-b border-line-2 py-2.5 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="text-[14px] font-medium sm:text-right">{value}</dd>
    </div>
  )
}

function GstDetails({ gst }) {
  return (
    <dl className="mt-3">
      <Detail label="GSTIN" value={gst.gstin} />
      <Detail label="Legal name" value={gst.legalName} />
      <Detail label="Trade name" value={gst.tradeName} />
      <Detail label="Registration status" value={gst.registrationStatus && gst.registrationStatus[0] + gst.registrationStatus.slice(1).toLowerCase()} />
      <Detail label="Registered address" value={gst.registeredAddress} />
      <Detail label="Verified on" value={gst.verifiedAt && new Date(gst.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
    </dl>
  )
}

export default function GstVerification() {
  const { company, error, reload } = useCompany()
  const isAdmin = getSession()?.user?.role === 'Admin'
  const gst = company?.gstVerification ?? { status: 'NOT_SUBMITTED' }

  // null until the recruiter edits — until then the form shows the last
  // attempt's values (retry) or the company name.
  const [form, setForm] = useState(null)
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  // Last server answer for this session: { code, message } — shown until the next attempt.
  const [result, setResult] = useState(null)

  const values = form ?? { gstin: gst.gstin || '', legalName: gst.submittedLegalName || company?.name || '', companyName: company?.name || '' }
  const edit = (patch) => setForm({ ...values, ...patch })
  const gstinValue = values.gstin
  const legalNameValue = values.legalName
  const companyNameValue = values.companyName
  const formatOk = isValidGstin(gstinValue)
  const showFormatError = gstinValue.length > 0 && !formatOk && (touched || gstinValue.length === 15)

  async function submit(e) {
    e.preventDefault()
    setTouched(true)
    if (!formatOk || legalNameValue.trim().length < 2 || companyNameValue.trim().length < 2) return
    setBusy(true)
    setResult(null)
    try {
      // companyName is only applied server-side while the company has never been verified.
      const r = await verifyGst({ gstin: normalizeGstin(gstinValue), legalName: legalNameValue.trim(), companyName: companyNameValue.trim() })
      setResult({ code: r.code, message: r.message })
    } catch {
      setResult({ code: 'NETWORK', message: 'Couldn’t reach Mzobs. Check your connection and try again.' })
    } finally {
      setBusy(false)
    }
  }

  const card = 'rounded-2xl border border-line bg-white p-5 shadow-card'
  const heading = (
    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-[15px] font-semibold"><ShieldCheck size={15} className="text-muted" /> GST verification</h2>
      {company && <StatusPill status={GST_STATUS_PILL[gst.status] ?? 'none'} label={GST_STATUS_LABEL[gst.status]} />}
    </div>
  )

  if (IS_DEMO) return <section className={card}>{heading}<p className="py-3 text-[13px] text-muted">Demo mode has no company to verify.</p></section>
  if (error && !company) return <section className={card}>{heading}<p className="py-3 text-[13px] text-muted">Couldn’t load your company details.</p><Button size="sm" icon={RotateCw} onClick={reload}>Retry</Button></section>
  if (!company) return <section className={card}>{heading}<Skeleton className="mt-3 h-24 w-full" /></section>

  if (gst.status === 'VERIFIED') {
    return (
      <section className={card}>
        {heading}
        <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-[#1a8f5a]"><BadgeCheck size={15} /> Your GSTIN has been verified with the GST registry.</p>
        <GstDetails gst={gst} />
      </section>
    )
  }

  if (gst.status === 'UNDER_REVIEW') {
    return (
      <section className={card}>
        {heading}
        <p className="mt-1 flex items-start gap-1.5 rounded-xl bg-warn-soft p-3 text-[13.5px] text-warn"><Clock size={15} className="mt-0.5 shrink-0" /> We found an active GST registration, but the Mzobs team needs to confirm it belongs to your company. We’ll update this status once it’s reviewed — no action needed.</p>
        <GstDetails gst={gst} />
      </section>
    )
  }

  if (gst.status === 'PENDING' && !busy) {
    return (
      <section className={card}>
        {heading}
        <p className="mt-1 text-[13.5px] text-ink-2">A verification for <b>{gst.gstin}</b> is in progress.</p>
        <Button className="mt-3" size="sm" icon={RotateCw} onClick={reload}>Refresh status</Button>
      </section>
    )
  }

  // NOT_SUBMITTED / FAILED (retry) — the form.
  const failure = result && result.code !== 'VERIFIED' ? result : gst.status === 'FAILED' && gst.reason ? { code: gst.reason } : null
  const input = 'mt-1 h-10 w-full rounded-lg border bg-white px-3 text-[14px] outline-none focus:border-accent'
  return (
    <section className={card}>
      {heading}
      <p className="text-[13px] text-muted">GST verification is required for every company on Mzobs. Your account is activated once your GSTIN is verified.</p>

      {failure && (
        <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-[#fdecea] p-3 text-[13px] text-bad">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{failure.message ?? 'Verification failed.'}</p>
            {ERROR_HELP[failure.code] && <p className="mt-0.5 text-ink-2">{ERROR_HELP[failure.code]}</p>}
          </div>
        </div>
      )}

      {!isAdmin ? (
        <p className="mt-3 text-[13px] text-ink-2">Only your company’s Admin can submit the GSTIN for verification.</p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
          <label className="block text-[12.5px] font-medium text-ink-2">
            GSTIN
            <input
              value={gstinValue}
              onChange={(e) => edit({ gstin: normalizeGstin(e.target.value).slice(0, 15) })}
              onBlur={() => setTouched(true)}
              maxLength={15}
              autoComplete="off"
              spellCheck={false}
              placeholder="15-character GSTIN, e.g. 27AAPFU0939F1ZV"
              aria-invalid={showFormatError || undefined}
              aria-describedby="gstin-hint"
              className={clsx(input, 'font-mono uppercase tracking-wide', showFormatError ? 'border-bad' : 'border-line')}
            />
            <span id="gstin-hint" className={clsx('mt-1 block text-[12px]', showFormatError ? 'text-bad' : 'text-muted')}>
              {showFormatError ? 'That isn’t a valid GSTIN — check the characters and the last (check) digit.' : `${gstinValue.length}/15 characters`}
            </span>
          </label>
          <label className="block text-[12.5px] font-medium text-ink-2">
            Company name
            <input
              value={companyNameValue}
              onChange={(e) => edit({ companyName: e.target.value })}
              maxLength={200}
              placeholder="Your registered legal name or trade name"
              className={clsx(input, 'border-line')}
            />
            <span className="mt-1 block text-[12px] text-muted">Use your GST legal or trade name for instant activation. A different brand name is reviewed by the Mzobs team.</span>
          </label>
          <label className="block text-[12.5px] font-medium text-ink-2">
            Legal name of business
            <input
              value={legalNameValue}
              onChange={(e) => edit({ legalName: e.target.value })}
              maxLength={200}
              placeholder="As printed on your GST certificate"
              className={clsx(input, 'border-line')}
            />
          </label>
          <Button variant="primary" disabled={busy || !formatOk || legalNameValue.trim().length < 2 || companyNameValue.trim().length < 2}>
            {busy ? <><Loader2 size={15} className="animate-spin" /> Verifying…</> : gst.status === 'FAILED' ? 'Try again' : 'Verify GSTIN'}
          </Button>
        </form>
      )}
    </section>
  )
}
