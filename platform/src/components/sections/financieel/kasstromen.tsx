'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { JaarKasstroom } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import {
  COLORS,
  AXIS_COMMON,
  GRID_PROPS,
  CHART_MARGIN,
  AREA_GRADIENT,
  ANIM,
  fmtNL,
  fmtPct,
} from '@/components/charts/chart-config'
import { ChartTooltip, type TooltipField } from '@/components/charts/chart-tooltip'

interface Props {
  data: JaarKasstroom[]
  valutaLabel: string
}

function has(data: JaarKasstroom[], fn: (j: JaarKasstroom) => unknown): boolean {
  return data.some((j) => fn(j) != null)
}

export function Kasstromen({ data, valutaLabel }: Props) {
  const hasCfo = has(data, (j) => j.cfo)
  const hasCapex = has(data, (j) => j.capex)
  const hasFcfNaSbc = has(data, (j) => j.fcf_na_sbc)
  const hasFcfMarge = has(data, (j) => j.fcf_marge_pct)
  const hasFcfGroei = has(data, (j) => j.fcf_groei_pct)
  const hasFcfConversion = has(data, (j) => j.fcf_conversion)
  const hasSbc = has(data, (j) => j.sbc)
  const hasDividend = has(data, (j) => j.dividend_totaal)
  const hasInkoop = has(data, (j) => j.aandeleninkoop)

  const tooltipFields: TooltipField[] = [
    ...(hasCfo ? [{ key: 'cfo', label: 'Oper. kasstroom', color: COLORS.gray } satisfies TooltipField] : []),
    { key: 'fcf', label: 'FCF', color: COLORS.navy },
    { key: 'fcf_per_aandeel', label: 'FCF/aandeel', color: COLORS.blue, decimals: 2 },
    ...(hasFcfNaSbc
      ? [{ key: 'fcf_na_sbc', label: 'FCF na SBC', color: COLORS.gray } satisfies TooltipField]
      : []),
  ]

  return (
    <div className="space-y-4">
      <SectionHeading title="Kasstromen" />

      <div className="bg-bg-surface rounded-xl border border-border p-4 pt-3">
        <div className="h-[200px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id={AREA_GRADIENT.id} x1="0" y1="0" x2="0" y2="1">
                  {AREA_GRADIENT.stops.map((s, i) => (
                    <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
                  ))}
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="jaar" {...AXIS_COMMON} />
              <YAxis
                {...AXIS_COMMON}
                tickFormatter={(v: number) => fmtNL(v)}
                width={52}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip {...props} fields={tooltipFields} />
                )}
              />
              <Area
                dataKey="fcf"
                type="monotone"
                stroke={COLORS.navy}
                strokeWidth={2}
                fill={`url(#${AREA_GRADIENT.id})`}
                dot={{ r: 4, fill: COLORS.navy, stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: COLORS.navy, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={ANIM.duration + 200}
                animationEasing={ANIM.easing}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini tabel */}
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  ({valutaLabel})
                </th>
                {data.map((j) => (
                  <th key={j.jaar} className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                    {j.jaar}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasCfo && (
                <KsRij label="Oper. kasstroom" data={data} getValue={(j) => j.cfo} />
              )}
              {hasCapex && (
                <KsRij label="Capex" data={data} getValue={(j) => j.capex} />
              )}
              <KsRij label="FCF" data={data} getValue={(j) => j.fcf} bold />
              <KsRij label="FCF/aandeel" data={data} getValue={(j) => j.fcf_per_aandeel} decimals={2} />
              {hasFcfNaSbc && (
                <KsRij label="FCF na SBC" data={data} getValue={(j) => j.fcf_na_sbc} />
              )}
              {hasFcfMarge && (
                <KsRij label="FCF-marge" data={data} getValue={(j) => j.fcf_marge_pct} format="pct" />
              )}
              {hasFcfGroei && (
                <KsRij label="FCF-groei" data={data} getValue={(j) => j.fcf_groei_pct} format="pct" colored />
              )}
              {hasFcfConversion && (
                <KsRij label="FCF-conversie" data={data} getValue={(j) => j.fcf_conversion} format="pct" />
              )}
              {hasSbc && (
                <KsRij label="SBC" data={data} getValue={(j) => j.sbc} />
              )}
              {hasDividend && (
                <KsRij label="Dividend totaal" data={data} getValue={(j) => j.dividend_totaal} />
              )}
              {hasInkoop && (
                <KsRij label="Aandeleninkoop" data={data} getValue={(j) => j.aandeleninkoop} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KsRij({
  label,
  data,
  getValue,
  format,
  decimals = 0,
  colored,
  bold,
}: {
  label: string
  data: JaarKasstroom[]
  getValue: (j: JaarKasstroom) => number | null | undefined
  format?: 'pct'
  decimals?: number
  colored?: boolean
  bold?: boolean
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className={`px-4 py-3 text-text-secondary ${bold ? 'font-medium' : ''}`}>{label}</td>
      {data.map((j) => {
        const val = getValue(j)
        const colorClass = colored && val != null
          ? val > 0 ? 'text-buy' : val < 0 ? 'text-pass' : 'text-text-primary'
          : 'text-text-primary'
        return (
          <td key={j.jaar} className={`px-4 py-3 text-right tabular-nums ${colorClass} ${bold ? 'font-medium' : ''}`}>
            {format === 'pct' ? fmtPct(val) : fmtNL(val, decimals)}
          </td>
        )
      })}
    </tr>
  )
}
