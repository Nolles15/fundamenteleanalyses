'use client'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { Analyse } from '@/lib/types'
import { COLORS, ANIM } from '@/components/charts/chart-config'

const FRAMEWORKS = [
  { key: 'Graham', label: 'Graham' },
  { key: 'Buffett / Munger', label: 'Buffett' },
  { key: 'Peter Lynch', label: 'Lynch' },
  { key: 'Phil Fisher', label: 'Fisher' },
  { key: 'Magic Formula', label: 'Magic F.' },
  { key: 'Moat', label: 'Moat' },
  { key: 'Management', label: 'Mgmt' },
] as const

interface Props {
  a: Analyse
  b: Analyse
}

export function ScoreRadar({ a, b }: Props) {
  const itemsA = a.scorekaart.items
  const itemsB = b.scorekaart.items

  if (itemsA.length === 0 && itemsB.length === 0) return null

  const data = FRAMEWORKS.map(({ key, label }) => ({
    framework: label,
    [a.meta.ticker]: itemsA.find((i) => i.framework === key)?.score ?? 0,
    [b.meta.ticker]: itemsB.find((i) => i.framework === key)?.score ?? 0,
  }))

  return (
    <div className="w-full" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#e2e8f0" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="framework"
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'var(--font-inter)' }}
          />
          <PolarRadiusAxis
            domain={[0, 5]}
            tickCount={6}
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            axisLine={false}
          />
          <Radar
            name={a.meta.ticker}
            dataKey={a.meta.ticker}
            stroke={COLORS.navy}
            fill={COLORS.navy}
            fillOpacity={0.15}
            strokeWidth={2}
            animationDuration={ANIM.duration}
          />
          <Radar
            name={b.meta.ticker}
            dataKey={b.meta.ticker}
            stroke={COLORS.blue}
            fill={COLORS.blue}
            fillOpacity={0.15}
            strokeWidth={2}
            animationDuration={ANIM.duration}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-inter)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
