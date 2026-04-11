import type { JaarBalans } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { fmtNL } from '@/components/charts/chart-config'

interface Props {
  data: JaarBalans[]
  valutaLabel: string
  schuldvervaldatum?: string | null
}

function has(data: JaarBalans[], fn: (j: JaarBalans) => unknown): boolean {
  return data.some((j) => fn(j) != null)
}

export function BalansTabel({ data, valutaLabel, schuldvervaldatum }: Props) {
  const hasTotaleActiva = has(data, (j) => j.totale_activa)
  const hasBrutoSchuld = has(data, (j) => j.bruto_schuld)
  const hasDebtEquity = has(data, (j) => j.debt_equity)
  const hasCurrentRatio = has(data, (j) => j.current_ratio)
  const hasQuickRatio = has(data, (j) => j.quick_ratio)
  const hasGoodwill = has(data, (j) => j.goodwill_pct_activa)
  const hasBoekwaarde = has(data, (j) => j.boekwaarde_per_aandeel)

  return (
    <div className="space-y-4">
      <SectionHeading title="Balans" />

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
              {hasTotaleActiva && (
                <BalansRij label="Totale activa" data={data} getValue={(j) => j.totale_activa} />
              )}
              <BalansRij label="Eigen vermogen" data={data} getValue={(j) => j.eigen_vermogen} />
              {hasBrutoSchuld && (
                <BalansRij label="Bruto schuld" data={data} getValue={(j) => j.bruto_schuld} />
              )}
              <BalansRij
                label="Nettoschuld"
                data={data}
                getValue={(j) => j.nettoschuld}
                colorFn={(v) => v < 0 ? 'text-buy' : undefined}
              />
              {hasDebtEquity && (
                <BalansRij label="Debt/equity" data={data} getValue={(j) => j.debt_equity} decimals={2} suffix="×" />
              )}
              <BalansRij
                label="Debt/EBITDA"
                data={data}
                getValue={(j) => j.debt_ebitda}
                decimals={1}
                suffix="×"
                colorFn={(v) => v < 1 ? 'text-buy' : v > 3 ? 'text-pass' : undefined}
              />
              {hasCurrentRatio && (
                <BalansRij label="Current ratio" data={data} getValue={(j) => j.current_ratio} decimals={2} suffix="×" />
              )}
              {hasQuickRatio && (
                <BalansRij label="Quick ratio" data={data} getValue={(j) => j.quick_ratio} decimals={2} suffix="×" />
              )}
              {hasGoodwill && (
                <BalansRij label="Goodwill % activa" data={data} getValue={(j) => j.goodwill_pct_activa} decimals={1} suffix="%" />
              )}
              {hasBoekwaarde && (
                <BalansRij label="Boekwaarde/aandeel" data={data} getValue={(j) => j.boekwaarde_per_aandeel} decimals={2} />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {schuldvervaldatum && (
        <div className="bg-bg-muted rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-text-primary font-sans mb-0.5">Schuldvervaldatum</p>
          <p className="text-sm text-text-secondary font-sans">{schuldvervaldatum}</p>
        </div>
      )}
    </div>
  )
}

function BalansRij({
  label,
  data,
  getValue,
  decimals = 0,
  suffix,
  colorFn,
}: {
  label: string
  data: JaarBalans[]
  getValue: (j: JaarBalans) => number | null | undefined
  decimals?: number
  suffix?: string
  colorFn?: (v: number) => string | undefined
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-text-secondary">{label}</td>
      {data.map((j) => {
        const val = getValue(j)
        const color = val != null && colorFn ? (colorFn(val) ?? 'text-text-primary') : 'text-text-primary'
        return (
          <td key={j.jaar} className={`px-4 py-3 text-right tabular-nums ${color}`}>
            {val != null ? `${fmtNL(val, decimals)}${suffix ?? ''}` : '—'}
          </td>
        )
      })}
    </tr>
  )
}
