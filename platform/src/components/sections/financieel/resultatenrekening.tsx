'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { JaarResultaat } from '@/lib/types'
import {
  COLORS,
  AXIS_COMMON,
  GRID_PROPS,
  CHART_MARGIN_DUAL,
  BAR_RADIUS,
  ANIM,
  fmtNL,
  fmtPct,
} from '@/components/charts/chart-config'
import { ChartTooltip, ChartLegend, type TooltipField } from '@/components/charts/chart-tooltip'
import { SectionHeading } from '@/components/ui/section-heading'

const TOOLTIP_FIELDS: TooltipField[] = [
  { key: 'omzet', label: 'Omzet', color: COLORS.navy },
  { key: 'nettowinst', label: 'Nettowinst', color: COLORS.blue },
  { key: 'nettomarge_pct', label: 'Nettomarge', color: COLORS.green, format: 'pct' },
  { key: 'omzet_groei_pct', label: 'Omzetgroei', color: COLORS.gray, format: 'pct' },
]

const LEGEND_ITEMS = [
  { label: 'Omzet', color: COLORS.navy },
  { label: 'Nettowinst', color: COLORS.blue },
  { label: 'Nettomarge %', color: COLORS.green },
]

interface Props {
  data: JaarResultaat[]
  valutaLabel: string
}

export function Resultatenrekening({ data, valutaLabel }: Props) {
  return (
    <div className="space-y-5">
      <SectionHeading title="Resultatenrekening" />

      {/* Chart */}
      <div className="bg-bg-surface rounded-xl border border-border p-4 pt-3">
        <div className="h-[220px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={CHART_MARGIN_DUAL} barCategoryGap="25%">
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="jaar" {...AXIS_COMMON} />
              <YAxis
                yAxisId="left"
                {...AXIS_COMMON}
                tickFormatter={(v: number) => fmtNL(v)}
                width={52}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                {...AXIS_COMMON}
                tickFormatter={(v: number) => `${v}%`}
                width={42}
                domain={[0, 'auto']}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip {...props} fields={TOOLTIP_FIELDS} />
                )}
              />
              <Bar
                yAxisId="left"
                dataKey="omzet"
                fill={COLORS.navy}
                radius={BAR_RADIUS}
                maxBarSize={28}
                animationDuration={ANIM.duration}
                animationEasing={ANIM.easing}
              />
              <Bar
                yAxisId="left"
                dataKey="nettowinst"
                fill={COLORS.blue}
                opacity={0.85}
                radius={BAR_RADIUS}
                maxBarSize={28}
                animationDuration={ANIM.duration}
                animationEasing={ANIM.easing}
                animationBegin={150}
              />
              <Line
                yAxisId="right"
                dataKey="nettomarge_pct"
                type="monotone"
                stroke={COLORS.green}
                strokeWidth={2.5}
                dot={{ r: 4, fill: COLORS.green, stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: COLORS.green, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={ANIM.duration}
                animationEasing={ANIM.easing}
                animationBegin={300}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <ChartLegend items={LEGEND_ITEMS} />
      </div>

      {/* Data tabel */}
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  ({valutaLabel})
                </th>
                {data.map((j) => (
                  <th
                    key={j.jaar}
                    className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide"
                  >
                    {j.jaar}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <TabelRij label="Omzet" data={data} getValue={(j) => j.omzet} />
              <TabelRij label="Omzetgroei" data={data} getValue={(j) => j.omzet_groei_pct} format="pct" colored />
              {hasField(data, (j) => j.brutowinst) && (
                <TabelRij label="Brutowinst" data={data} getValue={(j) => j.brutowinst} />
              )}
              {hasField(data, (j) => j.brutomarge_pct) && (
                <TabelRij label="Brutomarge" data={data} getValue={(j) => j.brutomarge_pct} format="pct" />
              )}
              {hasField(data, (j) => j.ebit) && (
                <TabelRij label="EBIT" data={data} getValue={(j) => j.ebit} />
              )}
              {hasField(data, (j) => j.ebit_marge_pct) && (
                <TabelRij label="EBIT-marge" data={data} getValue={(j) => j.ebit_marge_pct} format="pct" />
              )}
              <TabelRij label="EBITDA" data={data} getValue={(j) => j.ebitda} />
              <TabelRij label="EBITDA-marge" data={data} getValue={(j) => j.ebitda_marge_pct} format="pct" />
              <TabelRij label="Nettowinst" data={data} getValue={(j) => j.nettowinst} />
              <TabelRij label="Nettomarge" data={data} getValue={(j) => j.nettomarge_pct} format="pct" />
              <TabelRij label="EPS" data={data} getValue={(j) => j.eps} decimals={2} />
              {hasField(data, (j) => j.eps_groei_pct) && (
                <TabelRij label="EPS-groei" data={data} getValue={(j) => j.eps_groei_pct} format="pct" colored />
              )}
              {hasField(data, (j) => j.aandelen_uitstaand_mln) && (
                <TabelRij label="Aandelen uitst. (mln)" data={data} getValue={(j) => j.aandelen_uitstaand_mln} decimals={1} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────

function hasField(data: JaarResultaat[], getValue: (j: JaarResultaat) => number | null | undefined): boolean {
  return data.some((j) => getValue(j) != null)
}

function TabelRij({
  label,
  data,
  getValue,
  format,
  decimals = 0,
  colored,
  last,
}: {
  label: string
  data: JaarResultaat[]
  getValue: (j: JaarResultaat) => number | null | undefined
  format?: 'pct'
  decimals?: number
  colored?: boolean
  last?: boolean
}) {
  return (
    <tr className={last ? '' : 'border-b border-border'}>
      <td className="px-4 py-3 text-text-secondary">{label}</td>
      {data.map((j) => {
        const val = getValue(j)
        const colorClass = colored && val != null
          ? val > 0
            ? 'text-buy'
            : val < 0
              ? 'text-pass'
              : 'text-text-primary'
          : 'text-text-primary'

        return (
          <td key={j.jaar} className={`px-4 py-3 text-right tabular-nums ${colorClass}`}>
            {format === 'pct' ? fmtPct(val, decimals || 1) : fmtNL(val, decimals)}
          </td>
        )
      })}
    </tr>
  )
}

