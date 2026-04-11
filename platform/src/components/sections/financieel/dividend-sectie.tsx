'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Dividend } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import {
  COLORS,
  AXIS_COMMON,
  GRID_PROPS,
  CHART_MARGIN,
  BAR_RADIUS,
  ANIM,
  fmtNL,
  fmtPct,
} from '@/components/charts/chart-config'
import { ChartTooltip, type TooltipField } from '@/components/charts/chart-tooltip'

const TOOLTIP_FIELDS: TooltipField[] = [
  { key: 'dps', label: 'DPS', color: COLORS.navy, decimals: 2 },
]

interface Props {
  dividend: Dividend
}

export function DividendSectie({ dividend }: Props) {
  if (!dividend.betaalt_dividend) return null

  const hasHistorie = dividend.historie && dividend.historie.length > 1

  const stats: { label: string; value: string }[] = [
    { label: 'DPS', value: dividend.huidig_dps != null ? fmtNL(dividend.huidig_dps, 2) : '—' },
    { label: 'Rendement', value: fmtPct(dividend.huidig_rendement_pct) },
    ...(dividend.gemiddeld_rendement_5j_pct != null
      ? [{ label: 'Gem. 5j', value: fmtPct(dividend.gemiddeld_rendement_5j_pct) }]
      : []),
    ...(dividend.gemiddeld_rendement_10j_pct != null
      ? [{ label: 'Gem. 10j', value: fmtPct(dividend.gemiddeld_rendement_10j_pct) }]
      : []),
    ...(dividend.cagr_dividend_pct != null
      ? [{ label: 'CAGR dividend', value: fmtPct(dividend.cagr_dividend_pct) }]
      : []),
    { label: 'Payout ratio', value: fmtPct(dividend.payout_ratio_fcf_pct) },
    { label: 'FCF dekking', value: dividend.fcf_dekkingsratio != null ? `${fmtNL(dividend.fcf_dekkingsratio, 1)}×` : '—' },
  ]

  return (
    <div className="space-y-4">
      <SectionHeading title="Dividend" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-bg-surface rounded-xl border border-border p-4">
            <p className="text-xs text-text-muted font-sans uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p className="text-xl font-bold text-text-primary font-sans tabular-nums">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Progressief beleid + ex-dividend */}
      {(dividend.progressief_beleid != null || dividend.eerstvolgende_ex_dividend) && (
        <div className="flex flex-wrap gap-3">
          {dividend.progressief_beleid != null && (
            <div className="bg-bg-muted rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-text-primary font-sans mb-0.5">Progressief beleid</p>
              <p className="text-sm text-text-secondary font-sans">{dividend.progressief_beleid ? 'Ja' : 'Nee'}</p>
            </div>
          )}
          {dividend.eerstvolgende_ex_dividend && (
            <div className="bg-bg-muted rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-text-primary font-sans mb-0.5">Eerstvolgende ex-dividend</p>
              <p className="text-sm text-text-secondary font-sans">{dividend.eerstvolgende_ex_dividend}</p>
            </div>
          )}
        </div>
      )}

      {/* Dividend historie chart */}
      {hasHistorie && (
        <div className="bg-bg-surface rounded-xl border border-border p-4 pt-3">
          <div className="h-[180px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dividend.historie} margin={CHART_MARGIN}>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis dataKey="jaar" {...AXIS_COMMON} />
                <YAxis
                  {...AXIS_COMMON}
                  tickFormatter={(v: number) => fmtNL(v, 2)}
                  width={48}
                />
                <Tooltip
                  content={(props) => (
                    <ChartTooltip {...props} fields={TOOLTIP_FIELDS} />
                  )}
                />
                <Bar
                  dataKey="dps"
                  fill={COLORS.navy}
                  radius={BAR_RADIUS}
                  maxBarSize={28}
                  animationDuration={ANIM.duration}
                  animationEasing={ANIM.easing}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Historie tabel met alle velden */}
      {hasHistorie && (
        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide" />
                  {dividend.historie!.map((h) => (
                    <th key={h.jaar} className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      {h.jaar}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-text-secondary font-medium">DPS</td>
                  {dividend.historie!.map((h) => (
                    <td key={h.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                      {h.dps != null ? fmtNL(h.dps, 2) : '—'}
                    </td>
                  ))}
                </tr>
                {dividend.historie!.some((h) => h.groei_pct != null) && (
                  <tr className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-secondary">Groei</td>
                    {dividend.historie!.map((h) => {
                      const v = h.groei_pct
                      const color = v != null ? (v > 0 ? 'text-buy' : v < 0 ? 'text-pass' : 'text-text-primary') : 'text-text-primary'
                      return (
                        <td key={h.jaar} className={`px-4 py-3 text-right tabular-nums ${color}`}>
                          {fmtPct(v)}
                        </td>
                      )
                    })}
                  </tr>
                )}
                {dividend.historie!.some((h) => h.payout_ratio_pct != null) && (
                  <tr className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-secondary">Payout ratio</td>
                    {dividend.historie!.map((h) => (
                      <td key={h.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                        {fmtPct(h.payout_ratio_pct)}
                      </td>
                    ))}
                  </tr>
                )}
                {dividend.historie!.some((h) => h.fcf_dekking != null) && (
                  <tr className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-secondary">FCF dekking</td>
                    {dividend.historie!.map((h) => (
                      <td key={h.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                        {h.fcf_dekking != null ? `${fmtNL(h.fcf_dekking, 1)}×` : '—'}
                      </td>
                    ))}
                  </tr>
                )}
                {dividend.historie!.some((h) => h.type != null) && (
                  <tr className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-secondary">Type</td>
                    {dividend.historie!.map((h) => (
                      <td key={h.jaar} className="px-4 py-3 text-right text-text-primary text-xs">
                        {h.type ?? '—'}
                      </td>
                    ))}
                  </tr>
                )}
                {dividend.historie!.some((h) => h.bijzonderheden != null) && (
                  <tr className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-secondary">Bijzonderheden</td>
                    {dividend.historie!.map((h) => (
                      <td key={h.jaar} className="px-4 py-3 text-right text-text-secondary text-xs">
                        {h.bijzonderheden ?? '—'}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toelichting */}
      {dividend.oordeel_houdbaarheid && (
        <div className="bg-bg-muted rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-text-primary font-sans mb-1">Houdbaarheid</p>
          <p className="text-sm text-text-secondary font-sans">{dividend.oordeel_houdbaarheid}</p>
        </div>
      )}
      {dividend.toelichting && (
        <p className="text-sm text-text-secondary font-sans">{dividend.toelichting}</p>
      )}
    </div>
  )
}
