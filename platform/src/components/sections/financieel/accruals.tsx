import type { Accrual } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { fmtPct } from '@/components/charts/chart-config'

interface Props {
  data: Accrual[]
}

export function AccrualsSectie({ data }: Props) {
  // Toon niets als er geen enkele waarde is
  const hasData = data.some(
    (a) => a.accruals_ratio != null || a.non_gaap_verschil_pct != null || a.sbc_pct_fcf != null
  )
  if (!hasData) return null

  const hasAccruals = data.some((a) => a.accruals_ratio != null)
  const hasNonGaap = data.some((a) => a.non_gaap_verschil_pct != null)
  const hasSbcPct = data.some((a) => a.sbc_pct_fcf != null)

  return (
    <div className="space-y-4">
      <SectionHeading title="Winstkwaliteit" />

      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide" />
                {data.map((a) => (
                  <th key={a.jaar} className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                    {a.jaar}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasAccruals && (
                <tr className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-text-secondary">Accruals ratio</td>
                  {data.map((a) => (
                    <td key={a.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                      {a.accruals_ratio != null
                        ? a.accruals_ratio.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                        : '—'}
                    </td>
                  ))}
                </tr>
              )}
              {hasNonGaap && (
                <tr className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-text-secondary">Non-GAAP verschil</td>
                  {data.map((a) => (
                    <td key={a.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                      {fmtPct(a.non_gaap_verschil_pct)}
                    </td>
                  ))}
                </tr>
              )}
              {hasSbcPct && (
                <tr className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-text-secondary">SBC % FCF</td>
                  {data.map((a) => (
                    <td key={a.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                      {fmtPct(a.sbc_pct_fcf)}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
