import type { SectorKPI } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { fmtNL } from '@/components/charts/chart-config'

interface Props {
  data: SectorKPI[]
}

// Backward-compat: sommige JSONs gebruiken {naam, waarde, trend} i.p.v. {kpi_naam, waarden}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function kpiNaam(kpi: SectorKPI): string {
  return kpi.kpi_naam ?? (kpi as any).naam ?? ''
}

export function SectorKPIs({ data }: Props) {
  if (data.length === 0) return null

  const heeftJaarData = data.some((kpi) => kpi.waarden != null && kpi.waarden.length > 0)

  return (
    <div className="space-y-4">
      <SectionHeading title="Sector KPI's" />

      {heeftJaarData ? (
        <div className="space-y-3">
          {data.map((kpi) => {
            const naam = kpiNaam(kpi)
            if (!kpi.waarden || kpi.waarden.length === 0) return null
            return (
              <div key={naam} className="bg-bg-surface rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-bg-muted border-b border-border">
                  <p className="text-xs font-semibold text-text-primary font-sans">
                    {naam}
                    <span className="text-text-muted font-normal ml-1.5">({kpi.eenheid})</span>
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="border-b border-border">
                        {kpi.waarden.map((w) => (
                          <th key={w.jaar} className="text-center px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
                            {w.jaar}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {kpi.waarden.map((w) => (
                          <td key={w.jaar} className="text-center px-4 py-3 tabular-nums text-text-primary font-medium">
                            {fmtNL(w.waarde, 1)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                {kpi.toelichting && (
                  <div className="px-4 py-2 border-t border-border">
                    <p className="text-xs text-text-muted font-sans">{kpi.toelichting}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* Fallback voor oude JSONs met simpel {naam, waarde, trend} formaat */
        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">KPI</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Waarde</th>
                <th className="hidden sm:table-cell text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.map((kpi, i) => {
                const naam = kpiNaam(kpi)
                const raw = kpi as any
                return (
                  <tr key={naam} className={i < data.length - 1 ? 'border-b border-border' : ''}>
                    <td className="px-4 py-3 text-text-primary font-medium">{naam}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                      {raw.waarde != null ? `${raw.waarde} ${kpi.eenheid}` : '—'}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-right text-xs text-text-muted">
                      {raw.trend ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
