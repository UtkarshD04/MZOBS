export function GreenField({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-[7px] mb-4">
      {label && <label className="text-[11px] font-bold uppercase tracking-wide text-[#595959]">{label}</label>}
      {children}
      {hint && <span className="text-xs text-[#666666]">{hint}</span>}
    </div>
  )
}

export const greenInputClass =
  'h-11 px-[13px] rounded-[10px] border border-[#e0e0e0] bg-white text-[#111827] text-[13.5px] w-full transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-[#9ca3af] focus:border-[#3d5c34] focus:shadow-[0_0_0_3.5px_rgba(61,92,52,0.14)]'
