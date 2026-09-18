import { MSG91_WIDGET_ID, MSG91_TOKEN_AUTH } from './config'

const SCRIPT_URLS = ['https://verify.msg91.com/otp-provider.js', 'https://verify.phone91.com/otp-provider.js']

// With exposeMethods:true, MSG91 still needs a real DOM element to render
// its (invisible) reCAPTCHA into via captchaRenderId — without one, sendOtp
// fails server-side with "Invalid Captcha Token" since no captcha token was
// ever generated. It renders nothing visible in the normal case, so an
// off-screen div is enough.
const CAPTCHA_ELEMENT_ID = 'msg91-otp-captcha'

function ensureCaptchaElement() {
  if (document.getElementById(CAPTCHA_ELEMENT_ID)) return
  const el = document.createElement('div')
  el.id = CAPTCHA_ELEMENT_ID
  document.body.appendChild(el)
}

// Loads MSG91's widget script once and calls initSendOTP with
// exposeMethods:true, which attaches sendOtp/verifyOtp/retryOtp onto
// `window` instead of showing MSG91's own popup — our own form UI drives
// the flow and just calls those.
let loadPromise = null
function loadWidget() {
  if (loadPromise) return loadPromise

  // Without these, MSG91's widget either rejects silently or never calls
  // either callback — sendWidgetOtp would then hang forever with no error,
  // leaving the caller's "Sending..." state (and any button gated on OTP
  // verification, like Create account) stuck with no visible explanation.
  // Failing fast here turns that into a diagnosable error instead.
  if (!MSG91_WIDGET_ID || !MSG91_TOKEN_AUTH) {
    return (loadPromise = Promise.reject(
      new Error('OTP sign-in is not configured on this deployment. Please try again later or contact support.')
    ))
  }

  const promise = new Promise((resolve, reject) => {
    if (typeof window.sendOtp === 'function') return resolve()

    ensureCaptchaElement()

    // success/failure here fire when MSG91's own popup completes a flow —
    // irrelevant with exposeMethods:true since we never show that popup and
    // drive send/verify ourselves, so they're no-ops.
    const configuration = {
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_TOKEN_AUTH,
      exposeMethods: true,
      captchaRenderId: CAPTCHA_ELEMENT_ID,
      success: () => {},
      failure: () => {},
    }

    // exposeMethods attaches sendOtp/verifyOtp/retryOtp onto `window`
    // asynchronously (an internal widget config fetch) — poll for it rather
    // than assume it's synchronous once initSendOTP returns.
    function waitForExposedMethods() {
      const start = Date.now()
      const POLL_MS = 100
      const TIMEOUT_MS = 10000
      const poll = () => {
        if (typeof window.sendOtp === 'function') return resolve()
        if (Date.now() - start > TIMEOUT_MS) {
          return reject(new Error('OTP widget did not initialize in time. Check that this domain is whitelisted in the MSG91 widget settings.'))
        }
        setTimeout(poll, POLL_MS)
      }
      poll()
    }

    let i = 0
    const attempt = () => {
      const script = document.createElement('script')
      script.src = SCRIPT_URLS[i]
      script.async = true
      script.onload = () => {
        if (typeof window.initSendOTP !== 'function') return reject(new Error('OTP widget failed to load'))
        window.initSendOTP(configuration)
        waitForExposedMethods()
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

  // If loading/initializing ever fails (script blocked, domain not
  // whitelisted, timeout, ...), clear the cached promise so the next call
  // actually retries instead of replaying the same stale rejection forever
  // — otherwise one transient failure would permanently break OTP for the
  // rest of the page's lifetime with no way to recover short of a reload.
  loadPromise = promise.catch((err) => {
    loadPromise = null
    throw err
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
