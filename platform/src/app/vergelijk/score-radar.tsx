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

interface Props {
  a: Analyse
  b: Analyse
}

export function ScoreRadar({ a, b }: Props) {
  const itemsA = a.scorekaart.items
  const itemsB = b.scorekaart.items

  // Verzamel alle frameworks, kort genoeg voor het diagram
  const frameworks = Array.from(
    new Set([...itemsA.map((i) => i.framework), ...itemsB.map((i) => i.framework)])
  )

  const data = frameworks.map((fw) => {
    const scoreA = itemsA.find((i) => i.framework === fw)?.score ?? 0
    const scoreB = itemsB.find((i) => i.framework === fw)?.score ?? 0
    // Kort label voor de assen
    const label = fw.length > 14 ? fw.split(/[\s/]+/).slice(0, 2).join(' ') : fw
    return { framework: label, [a.meta.ticker]: scoreA, [b.meta.ticker]: scoreB }
  })

  return (
    <div className="w-full" style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#e2e8f0" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="framework"
            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'var(--font-inter)' }}
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
