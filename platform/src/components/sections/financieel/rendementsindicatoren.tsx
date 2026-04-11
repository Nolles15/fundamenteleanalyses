'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { Rendement } from '@/lib/types'
import {
  COLORS,
  AXIS_COMMON,
  GRID_PROPS,
  CHART_MARGIN,
  BAR_RADIUS,
  ANIM,
  fmtPct,
  fmtNL,
} from '@/components/charts/chart-config'
import { ChartTooltip, ChartLegend, type TooltipField } from '@/components/charts/chart-tooltip'
import { SectionHeading } from '@/components/ui/section-heading'

// Extra kleur voor ROCE (als het bestaat)
const ROCE_COLOR = '#6B7280' // neutral-500, onderscheidbaar van de rest

interface Props {
  data: Rendement[]
}

export function Rendementsindicatoren({ data }: Props) {
  const isMultiYear = data.length > 1
  const hasRoce = data.some((d) => d.roce_pct != null)
  const hasAssetTurnover = data.some((d) => d.asset_turnover != null)
  const hasSpread = data.some((d) => d.roic_wacc_spread != null)

  // Gemiddelde WACC voor referentielijn
  const waccValues = data.map((d) => d.wacc_pct).filter((v): v is number => v != null)
  const avgWacc = waccValues.length > 0
    ? waccValues.reduce((a, b) => a + b, 0) / waccValues.length
    : null

  const tooltipFields: TooltipField[] = [
    ...(hasRoce ? [{ key: 'roce_pct', label: 'ROCE', color: ROCE_COLOR, format: 'pct' } satisfies TooltipField] : []),
    { key: 'roic_pct', label: 'ROIC', color: COLORS.navy, format: 'pct' },
    { key: 'roe_pct', label: 'ROE', color: COLORS.blue, format: 'pct' },
    { key: 'roa_pct', label: 'ROA', color: COLORS.gray, format: 'pct' },
    { key: 'wacc_pct', label: 'WACC', color: COLORS.green, format: 'pct' },
    ...(hasSpread ? [{ key: 'roic_wacc_spread', label: 'ROIC−WACC', color: COLORS.navy, format: 'pct' } satisfies TooltipField] : []),
  ]

  const legendItems = [
    ...(hasRoce ? [{ label: 'ROCE', color: ROCE_COLOR }] : []),
    { label: 'ROIC', color: COLORS.navy },
    { label: 'ROE', color: COLORS.blue },
    { label: 'ROA', color: COLORS.gray },
    { label: 'WACC', color: COLORS.green },
  ]

  return (
    <div className="space-y-4">
      <SectionHeading title="Rendementsindicatoren" />

      {isMultiYear ? (
        <>
          <div className="bg-bg-surface rounded-xl border border-border p-4 pt-3">
            <div className="h-[200px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={CHART_MARGIN} barCategoryGap="20%">
                  <CartesianGrid {...GRID_PROPS} />
                  <XAxis dataKey="jaar" {...AXIS_COMMON} />
                  <YAxis
                    {...AXIS_COMMON}
                    tickFormatter={(v: number) => `${v}%`}
                    width={42}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    content={(props) => (
                      <ChartTooltip {...props} fields={tooltipFields} />
                    )}
                  />
                  {hasRoce && (
                    <Bar
                      dataKey="roce_pct"
                      fill={ROCE_COLOR}
                      radius={BAR_RADIUS}
                      maxBarSize={24}
                      animationDuration={ANIM.duration}
                      animationEasing={ANIM.easing}
                    />
                  )}
                  <Bar
                    dataKey="roic_pct"
                    fill={COLORS.navy}
                    radius={BAR_RADIUS}
                    maxBarSize={24}
                    animationDuration={ANIM.duration}
                    animationEasing={ANIM.easing}
                  />
                  <Bar
                    dataKey="roe_pct"
                    fill={COLORS.blue}
                    radius={BAR_RADIUS}
                    maxBarSize={24}
                    animationDuration={ANIM.duration}
                    animationEasing={ANIM.easing}
                    animationBegin={150}
                  />
                  <Bar
                    dataKey="roa_pct"
                    fill={COLORS.gray}
                    radius={BAR_RADIUS}
                    maxBarSize={24}
                    animationDuration={ANIM.duration}
                    animationEasing={ANIM.easing}
                    animationBegin={300}
                  />
                  {avgWacc != null && (
                    <ReferenceLine
                      y={avgWacc}
                      stroke={COLORS.green}
                      strokeDasharray="8 4"
                      strokeWidth={1.5}
                      label={{
                        value: `WACC ${avgWacc.toFixed(1)}%`,
                        position: 'right',
                        fontSize: 10,
                        fill: COLORS.green,
                        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
                      }}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend items={legendItems} />
          </div>

          {/* ROIC-WACC spread + asset turnover als extra rij onder de grafiek */}
          {(hasSpread || hasAssetTurnover) && (
            <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="border-b border-border bg-bg-muted">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wide" />
                      {data.map((d) => (
                        <th key={d.jaar} className="text-right px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wide">
                          {d.jaar}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hasSpread && (
                      <tr className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-text-secondary">ROIC−WACC spread</td>
                        {data.map((d) => {
                          const v = d.roic_wacc_spread
                          const color = v != null ? (v > 0 ? 'text-buy' : v < 0 ? 'text-pass' : 'text-text-primary') : 'text-text-primary'
                          return (
                            <td key={d.jaar} className={`px-4 py-2.5 text-right tabular-nums ${color}`}>
                              {fmtPct(v)}
                            </td>
                          )
                        })}
                      </tr>
                    )}
                    {hasAssetTurnover && (
                      <tr className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-text-secondary">Asset turnover</td>
                        {data.map((d) => (
                          <td key={d.jaar} className="px-4 py-2.5 text-right tabular-nums text-text-primary">
                            {d.asset_turnover != null ? `${d.asset_turnover.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×` : '—'}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <SingleYearCards data={data[0]} />
      )}
    </div>
  )
}

function SingleYearCards({ data }: { data: Rendement }) {
  const items: { label: string; value: number | null | undefined; format?: 'pct' | 'x' }[] = [
    { label: 'ROCE', value: data.roce_pct, format: 'pct' },
    { label: 'ROIC', value: data.roic_pct, format: 'pct' },
    { label: 'ROE', value: data.roe_pct, format: 'pct' },
    { label: 'ROA', value: data.roa_pct, format: 'pct' },
    { label: 'WACC', value: data.wacc_pct, format: 'pct' },
    { label: 'ROIC−WACC', value: data.roic_wacc_spread, format: 'pct' },
    { label: 'Asset turnover', value: data.asset_turnover, format: 'x' },
  ]

  const visible = items.filter((i) => i.value != null)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {visible.map((item) => (
        <div key={item.label} className="bg-bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-text-muted font-sans uppercase tracking-wide mb-1">
            {item.label}
          </p>
          <p className="text-xl font-bold text-text-primary font-sans tabular-nums">
            {item.format === 'x'
              ? `${fmtNL(item.value, 2)}×`
              : fmtPct(item.value)}
          </p>
        </div>
      ))}
    </div>
  )
}
