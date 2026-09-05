import { MSG91_WIDGET_ID, MSG91_TOKEN_AUTH } from './config'

const SCRIPT_URLS = ['https://verify.msg91.com/otp-provider.js', 'https://verify.phone91.com/otp-provider.js']

// Loads MSG91's widget script once and calls initSendOTP with
// exposeMethods:true, which attaches sendOtp/verifyOtp/retryOtp onto
// `window` instead of showing MSG91's own popup — our own form UI drives
// the flow and just calls those.
let loadPromise = null
function loadWidget() {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    if (typeof window.sendOtp === 'function') return resolve()

    const configuration = {
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_TOKEN_AUTH,
      exposeMethods: true,
      success: () => {},
      failure: () => {},
    }

    let i = 0
    const attempt = () => {
      const script = document.createElement('script')
      script.src = SCRIPT_URLS[i]
      script.async = true
      script.onload = () => {
        if (typeof window.initSendOTP !== 'function') return reject(new Error('OTP widget failed to load'))
        window.initSendOTP(configuration)
        resolve()
      }
      script.onerror = () => {
        i += 1
        if (i < SCRIPT_URLS.length) attempt()
        else reject(new Error('Could not load OTP widget script'))
      }
      document.head.appendChild(script)
    }
    attempt()
  })

  return loadPromise
}

// `phone` is a bare 10-digit Indian mobile number; MSG91 wants it with the
// country code and no '+'.
export async function sendWidgetOtp(phone) {
  await loadWidget()
  return new Promise((resolve, reject) => {
    window.sendOtp(
      `91${phone}`,
      (data) => resolve(data),
      (error) => reject(new Error(error?.message || 'Could not send OTP. Please try again.'))
    )
  })
}

export async function retryWidgetOtp(channel = 'SMS') {
  await loadWidget()
  return new Promise((resolve, reject) => {
    window.retryOtp(
      channel,
      (data) => resolve(data),
      (error) => reject(new Error(error?.message || 'Could not resend OTP. Please try again.'))
    )
  })
}

// Resolves with the JWT access-token (in `data.message`) once MSG91
// confirms the code — that token still has to be checked server-side
// before it's trusted (see verifyEmployeePhoneWidget).
export async function verifyWidgetOtp(otp) {
  await loadWidget()
  return new Promise((resolve, reject) => {
    window.verifyOtp(
      Number(otp),
      (data) => resolve(data),
      (error) => reject(new Error(error?.message || 'Incorrect or expired OTP.'))
    )
  })
}
