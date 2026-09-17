import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Phone, ShieldCheck, Trash2 } from 'lucide-react'
import { Field, Input, SubmitButton } from '../ui/AuthField'
import OtpInput from '../ui/OtpInput'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'
import { verifyEmployeePhoneWidget } from '../../lib/employeeAuth'
import { requestAccountDeletion } from '../../lib/accountDeletion'
import { MSG91_WIDGET_ID, MSG91_TOKEN_AUTH } from '../../lib/config'

const OTP_CONFIGURED = Boolean(MSG91_WIDGET_ID && MSG91_TOKEN_AUTH)
const RESEND_COOLDOWN = 30

export default function DeleteAccountForm() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [phoneToken, setPhoneToken] = useState(null)
  const [resendIn, setResendIn] = useState(0)
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [done, setDone] = useState(false)

  const timerRef = useRef(null)
  useEffect(() => {
    if (resendIn <= 0) return
    timerRef.current = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [resendIn])

  function handleChangePhoneNumber() {
    setPhoneToken(null)
    setOtpSent(false)
    setOtp('')
    setOtpError('')
    setResendIn(0)
    setConfirmChecked(false)
  }

  async function handleSendOtp() {
    setOtpError('')
    setSendingOtp(true)
    try {
      if (otpSent) await retryWidgetOtp('SMS')
      else await sendWidgetOtp(phone)
      setOtpSent(true)
      setOtp('')
      setResendIn(RESEND_COOLDOWN)
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleVerifyOtp() {
    setOtpError('')
    setVerifyingOtp(true)
    try {
      const widgetResult = await verifyWidgetOtp(otp)
      const { phoneToken: token } = await verifyEmployeePhoneWidget({ phone, accessToken: widgetResult.message })
      setPhoneToken(token)
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setVerifyingOtp(false)
    }
  }

  async function handleDelete() {
    setDeleteError('')
    setDeleting(true)
    try {
      await requestAccountDeletion({ phone, phoneToken })
      setDone(true)
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-tint text-green flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-black text-black">Account deleted</h3>
        <p className="text-[13.5px] text-[#595959] mt-1.5 max-w-xs">
          Your MZOBS account and associated personal data have been permanently deleted.
        </p>
        <Link to="/" className="text-xs font-bold text-[#595959] hover:text-black transition-colors mt-6">
          Back to home
        </Link>
      </div>
    )
  }

  if (!OTP_CONFIGURED) {
    return <p className="text-[13.5px] text-[#595959]">Account deletion isn't available right now. Please contact support to request it.</p>
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-[#595959] mb-4">
        <Phone size={16} />
        <p className="text-[13px] font-medium">Verify your mobile number to request deletion.</p>
      </div>

      <Field label="Mobile number">
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <div className="h-11 px-3.5 flex items-center rounded-xl border border-[#C9C9C9] bg-[#F7F7F7] text-[13.5px] font-bold text-black shrink-0">+91</div>
          <div className="flex-1 min-w-40">
            <Input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                handleChangePhoneNumber()
              }}
              placeholder="98765 43210"
              disabled={Boolean(phoneToken)}
              autoComplete="tel-national"
            />
          </div>
          {!otpSent && !phoneToken && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || phone.length !== 10}
              className="shrink-0 whitespace-nowrap w-full sm:w-auto h-11 px-4 rounded-xl border border-[#C9C9C9] bg-white text-[13px] font-bold text-black hover:border-black transition-colors disabled:opacity-50"
            >
              {sendingOtp ? 'Sending...' : 'Send OTP'}
            </button>
          )}
        </div>
        {!otpSent && !phoneToken && otpError && <span className="text-xs text-red mt-2 block">{otpError}</span>}
      </Field>

      {phoneToken ? (
        <div className="flex items-center gap-2 mb-4 px-3.5 py-2.5 rounded-xl bg-green-tint text-[13px] font-bold text-green">
          <ShieldCheck size={16} className="shrink-0" />
          Mobile number verified
        </div>
      ) : otpSent ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12.5px] font-bold text-black tracking-tight">Enter the 6-digit code</label>
            <button type="button" onClick={handleChangePhoneNumber} className="text-[12px] font-bold text-[#595959] hover:text-black transition-colors">
              Change number
            </button>
          </div>
          <div className="max-w-72">
            <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={verifyingOtp} autoFocus />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otp.length !== 6}
              className="h-10 px-4 rounded-xl border border-[#C9C9C9] bg-white text-[13px] font-bold text-black hover:border-black transition-colors disabled:opacity-50"
            >
              {verifyingOtp ? 'Verifying...' : 'Verify code'}
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || resendIn > 0}
              className="text-[12.5px] font-bold text-black hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#9E9E9E]"
            >
              {sendingOtp ? 'Resending...' : resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend OTP'}
            </button>
          </div>
        </div>
      ) : null}

      {phoneToken && (
        <>
          <div className="flex items-start gap-2.5 rounded-xl border border-red/25 bg-red/5 px-3.5 py-3 mb-4">
            <AlertTriangle size={16} className="text-red shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-[#595959]">
              This permanently deletes your profile, resume, applications, and other personal data. Records an employer already holds
              because you were shared with them (or that we're required to keep for legal/tax reasons) are anonymized, not deleted. This
              cannot be undone.
            </p>
          </div>

          <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              className="mt-0.5 accent-black"
            />
            <span className="text-[12.5px] text-[#595959]">I understand this is permanent and I want to delete my account.</span>
          </label>

          {deleteError && <p className="text-xs text-red mb-4">{deleteError}</p>}

          <SubmitButton
            type="button"
            onClick={handleDelete}
            disabled={!confirmChecked || deleting}
            className="!bg-red hover:!bg-red/90 !shadow-none"
          >
            <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete my account and data'}
          </SubmitButton>
        </>
      )}
    </div>
  )
}
