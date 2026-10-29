import { useState } from 'react'
import { COUNTRIES, splitPhone, joinPhone, maxDigits } from '../lib/phone'

// Country-code dropdown + number box. `value` is the stored phone (see lib/phone.js):
// bare 10 digits for India, "+<code><number>" for anywhere else. The form styles both
// controls itself through `inputClassName` so this fits whichever form it sits in.
export default function PhoneInput({ id, value, onChange, inputClassName = '', placeholder = 'Mobile number', ...rest }) {
  const [picked, setPicked] = useState('91')
  const parsed = splitPhone(value)
  // A stored "+44…" decides the code; with nothing typed yet the dropdown's own choice stands.
  const cc = String(value ?? '').startsWith('+') ? parsed.cc : picked

  const pick = (e) => {
    setPicked(e.target.value)
    onChange(joinPhone(e.target.value, parsed.digits.slice(0, maxDigits(e.target.value))))
  }
  const type = (e) => onChange(joinPhone(cc, e.target.value.replace(/\D/g, '').slice(0, maxDigits(cc))))

  return (
    <div className="flex gap-2">
      <div className="w-[104px] shrink-0">
        <select aria-label="Country code" value={cc} onChange={pick} className={`${inputClassName} w-full`}>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
      </div>
      <div className="min-w-0 flex-1">
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={parsed.digits}
          onChange={type}
          maxLength={maxDigits(cc)}
          placeholder={placeholder}
          className={`${inputClassName} w-full`}
          {...rest}
        />
      </div>
    </div>
  )
}
