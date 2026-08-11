import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-navy)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-navy)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 11.5, fill: 'var(--color-ink-tertiary)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11.5, fill: 'var(--color-ink-tertiary)' }} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12.5, boxShadow: 'var(--shadow-md)' }}
          labelStyle={{ color: 'var(--color-ink)', fontWeight: 600, marginBottom: 2 }}
          cursor={{ stroke: 'var(--color-border-strong)', strokeWidth: 1 }}
        />
        <Area type="monotone" dataKey="value" name="Hires" stroke="var(--color-navy)" strokeWidth={2.5} fill="url(#trendFill)" activeDot={{ r: 4.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
