import { cn } from '../../lib/utils'

export function TableWrap({ className, children }) {
  return <div className={cn('overflow-x-auto rounded-xl border border-border', className)}>{children}</div>
}

export function Table({ columns, children }) {
  return (
    <table className="w-full border-collapse min-w-[640px] bg-surface">
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} className="text-left text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary px-[18px] py-3 bg-surface-sunken border-b border-border whitespace-nowrap">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export function Tr({ children, onClick }) {
  return (
    <tr onClick={onClick} className={cn('transition-colors duration-150 hover:bg-surface-hover [&>td]:border-b [&>td]:border-border last:[&>td]:border-b-0', onClick && 'cursor-pointer')}>
      {children}
    </tr>
  )
}

export function Td({ children, className, onClick }) {
  return (
    <td onClick={onClick} className={cn('px-[18px] py-3.5 text-[13.5px] align-middle', className)}>
      {children}
    </td>
  )
}
