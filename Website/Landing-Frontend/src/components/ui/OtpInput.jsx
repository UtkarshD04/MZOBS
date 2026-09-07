import { useEffect, useRef } from 'react'

// Six separate boxes that behave as one OTP field — typing, pasting a full
// code, and backspacing all move focus sensibly. `value`/`onChange` carry
// the digits as a single string so the parent doesn't need to know about
// the per-box split.
export default function OtpInput({ length = 6, value, onChange, error, disabled, autoFocus }) {
  const inputsRef = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus()
  }, [autoFocus])

  function setDigitAt(index, char) {
    const next = digits.slice()
    next[index] = char
    onChange(next.join('').replace(/\s/g, ''))
  }

  function handleChange(index, e) {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) {
      setDigitAt(index, '')
      return
    }
    if (raw.length > 1) {
      // Pasted or autofilled: spread across boxes from this index onward.
      const next = digits.slice()
      raw
        .slice(0, length - index)
        .split('')
        .forEach((ch, i) => {
          next[index + i] = ch
        })
      onChange(next.join('').replace(/\s/g, ''))
      const lastFilled = Math.min(index + raw.length, length - 1)
      inputsRef.current[lastFilled]?.focus()
      return
    }
    setDigitAt(index, raw)
    if (index < length - 1) inputsRef.current[index + 1]?.focus()
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputsRef.current[index + 1]?.focus()
    }
  }

  return (
    <div>
      <div className="flex gap-2 sm:gap-2.5" role="group" aria-label="One-time password">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={`w-full aspect-square min-w-0 rounded-xl border text-center text-[18px] font-black text-(--jobs-navy) bg-white outline-none transition-all duration-150 disabled:opacity-50 disabled:bg-(--jobs-bg-subtle) ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15'
                : 'border-(--jobs-border) hover:border-(--jobs-navy)/25 focus:border-(--jobs-blue) focus:ring-[3px] focus:ring-(--jobs-blue)/15'
            }`}
          />
        ))}
      </div>
      {error && <span className="text-xs text-red-600 mt-2 block">{error}</span>}
    </div>
  )
}
