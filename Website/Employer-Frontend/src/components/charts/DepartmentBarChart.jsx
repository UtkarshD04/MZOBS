import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLORS = ['var(--color-navy)', 'var(--color-navy-700)', 'var(--color-gold-dot)', 'var(--color-teal-dot)', 'var(--color-violet-dot)']

export default function DepartmentBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-ink-tertiary)' }} axisLine={false} tickLine={false} interval={0} angle={-12} textAnchor="end" height={38} />
        <YAxis tick={{ fontSize: 11.5, fill: 'var(--color-ink-tertiary)' }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12.5, boxShadow: 'var(--shadow-md)' }}
          cursor={{ fill: 'var(--color-surface-hover)' }}
        />
        <Bar dataKey="value" name="Open roles" radius={[6, 6, 0, 0]} maxBarSize={38}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
