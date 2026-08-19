import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function FunnelChart({ data }) {
  const max = data[0]?.value || 1
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 4, bottom: 4 }} barCategoryGap={14}>
        <XAxis type="number" hide domain={[0, max]} />
        <YAxis type="category" dataKey="label" width={168} tick={{ fontSize: 12.5, fill: 'var(--color-ink)', fontWeight: 500 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12.5, boxShadow: 'var(--shadow-md)' }}
          cursor={{ fill: 'var(--color-surface-hover)' }}
          formatter={(value) => [`${value} candidates`, '']}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={26} label={{ position: 'right', fontSize: 12, fill: 'var(--color-ink-secondary)', fontWeight: 600 }}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === data.length - 1 ? 'var(--color-gold-dot)' : 'var(--color-navy)'} fillOpacity={1 - i * 0.11} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
