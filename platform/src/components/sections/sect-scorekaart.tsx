'use client'

import type { Analyse } from '@/lib/types'
import { scoreKleur } from '@/lib/utils'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { COLORS } from '@/components/charts/chart-config'

interface Props {
  analyse: Analyse
}

export function SectScorekaart({ analyse }: Props) {
  const sk = analyse.scorekaart

  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      label="Scorekaart"
      description="Totaalscore, scoreverdeling per framework en radarchart — beschikbaar met een abonnement of losse aankoop."
    >
      <ScorekaartContent analyse={analyse} />
    </PaywallGate>
  )
}

function ScorekaartContent({ analyse }: Props) {
  const sk = analyse.scorekaart
  const ratio = sk.totaal / sk.max
  const kleur = scoreKleur(sk.totaal, sk.max)

  return (
    <div className="space-y-6">
      {/* Totaalscore */}
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-text-muted font-sans mb-1 uppercase tracking-wide">
              Totaalscore
            </p>
            <p className="text-3xl font-bold text-text-primary font-sans tabular-nums">
              {sk.totaal}
              <span className="text-lg font-normal text-text-muted">
                /{sk.max}
              </span>
            </p>
          </div>
          <p className="text-sm font-semibold text-text-secondary font-sans pb-1">
            {sk.eindoordeel}
          </p>
        </div>

        {/* Totaalbalk */}
        <div className="h-3 bg-bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${kleur}`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-text-secondary font-sans leading-relaxed">
          {sk.samenvatting}
        </p>
      </div>

      {/* Scoreverdeling + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {sk.items.map((item) => (
            <ScoreRij key={item.framework} item={item} />
          ))}
        </div>

        {sk.items.length >= 3 && (
          <div className="bg-bg-surface rounded-xl border border-border p-4">
            <p className="text-xs text-text-muted font-sans mb-2 uppercase tracking-wide text-center">
              Overzicht
            </p>
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={sk.items.map((item) => ({
                    framework: item.framework.length > 16
                      ? item.framework.slice(0, 14) + '…'
                      : item.framework,
                    score: item.score,
                    max: item.max,
                    pct: (item.score / item.max) * 100,
                  }))}
                >
                  <PolarGrid stroke="#E7E5E4" />
                  <PolarAngleAxis
                    dataKey="framework"
                    tick={{
                      fontSize: 10,
                      fill: '#57534E',
                      fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    dataKey="pct"
                    stroke={COLORS.navy}
                    fill={COLORS.navy}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreRij({
  item,
}: {
  item: { framework: string; score: number; max: number; oordeel?: string }
}) {
  const pct = (item.score / item.max) * 100
  const kleur = scoreKleur(item.score, item.max)

  return (
    <div className="bg-bg-surface rounded-lg border border-border px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-text-primary font-sans">
            {item.framework}
          </p>
          {item.oordeel && (
            <p className="text-xs text-text-muted font-sans">
              {item.oordeel}
            </p>
          )}
        </div>
        <span className="text-sm font-bold text-text-primary font-sans tabular-nums">
          {item.score}/{item.max}
        </span>
      </div>
      <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${kleur}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
