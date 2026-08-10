import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Calendar({
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  markedDates,
}: {
  month: Date
  onMonthChange: (d: Date) => void
  selectedDate: Date | null
  onSelectDate: (d: Date) => void
  markedDates: Set<string>
}) {
  const gridStart = startOfWeek(startOfMonth(month))
  const gridEnd = endOfWeek(endOfMonth(month))
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return (
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[13.5px] font-semibold">{format(month, 'MMMM yyyy')}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onMonthChange(subMonths(month, 1))} className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => onMonthChange(addMonths(month, 1))} className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[10.5px] font-semibold text-ink-tertiary py-1">{d}</div>
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const marked = markedDates.has(key)
          const selected = selectedDate && isSameDay(day, selectedDate)
          return (
            <button
              key={key}
              onClick={() => onSelectDate(day)}
              className={cn(
                'relative h-9 rounded-lg text-[12.5px] font-medium mx-auto w-9 flex items-center justify-center transition-colors',
                !isSameMonth(day, month) && 'text-ink-tertiary/50',
                isSameMonth(day, month) && !selected && 'text-ink hover:bg-surface-hover',
                selected && 'bg-navy text-white font-semibold',
                isToday(day) && !selected && 'ring-1 ring-navy text-navy font-semibold'
              )}
            >
              {format(day, 'd')}
              {marked && <span className={cn('absolute bottom-1 w-1 h-1 rounded-full', selected ? 'bg-white' : 'bg-gold-dot')} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
