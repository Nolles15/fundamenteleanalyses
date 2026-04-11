'use client'

import type { Analyse } from '@/lib/types'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import { fmtNL } from '@/components/charts/chart-config'
import { Resultatenrekening } from './financieel/resultatenrekening'
import { Kasstromen } from './financieel/kasstromen'
import { Rendementsindicatoren } from './financieel/rendementsindicatoren'
import { BalansTabel } from './financieel/balans-tabel'
import { WaarderingMultiples } from './financieel/waardering-multiples'
import { DividendSectie } from './financieel/dividend-sectie'
import { SectorKPIs } from './financieel/sector-kpis'
import { AccrualsSectie } from './financieel/accruals'

interface Props {
  analyse: Analyse
}

export function SectFinancieel({ analyse }: Props) {
  const fin = analyse.financieel
  const rendementen = Array.isArray(fin.rendementsindicatoren)
    ? fin.rendementsindicatoren
    : [fin.rendementsindicatoren]

  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      description="Resultatenrekening, kasstromen, balans, rendementen, dividend en waarderingsmultiples — beschikbaar met een abonnement of losse aankoop."
    >
      {/* Preview content (getoond achter blur) */}
      <FinancieelPreview analyse={analyse} />

      {/* Volledige content (zichtbaar na abonnement) */}
      <div className="space-y-10 mt-10">
        {/* Omzet CAGR */}
        {fin.omzet_cagr_pct != null && fin.omzet_cagr_periode && (
          <div className="bg-bg-muted rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-text-secondary font-sans">
              Omzet CAGR ({fin.omzet_cagr_periode})
            </p>
            <p className="text-sm font-bold text-text-primary font-sans tabular-nums">
              {fin.omzet_cagr_pct > 0 ? '+' : ''}{fin.omzet_cagr_pct.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
            </p>
          </div>
        )}

        <Resultatenrekening
          data={fin.resultatenrekening}
          valutaLabel={fin.valuta_label}
        />
        {fin.toelichting_resultaten && <Toelichting tekst={fin.toelichting_resultaten} />}

        <Kasstromen
          data={fin.kasstromen}
          valutaLabel={fin.valuta_label}
        />
        {fin.toelichting_kasstromen && <Toelichting tekst={fin.toelichting_kasstromen} />}

        {rendementen.length > 0 && (
          <Rendementsindicatoren data={rendementen} />
        )}
        {fin.toelichting_rendement && <Toelichting tekst={fin.toelichting_rendement} />}

        <BalansTabel
          data={fin.balans}
          valutaLabel={fin.valuta_label}
          schuldvervaldatum={fin.schuldvervaldatum}
        />
        {fin.toelichting_balans && <Toelichting tekst={fin.toelichting_balans} />}

        <WaarderingMultiples data={fin.waardering} />
        {fin.toelichting_waardering && <Toelichting tekst={fin.toelichting_waardering} />}

        {fin.dividend && <DividendSectie dividend={fin.dividend} />}

        {fin.accruals && fin.accruals.length > 0 && (
          <AccrualsSectie data={fin.accruals} />
        )}
        {fin.toelichting_earnings_quality && <Toelichting tekst={fin.toelichting_earnings_quality} />}

        {fin.sector_kpis && fin.sector_kpis.length > 0 && (
          <SectorKPIs data={fin.sector_kpis} />
        )}
        {fin.toelichting_sector_kpis && <Toelichting tekst={fin.toelichting_sector_kpis} />}

        {fin.ipo_correctie && <Toelichting tekst={fin.ipo_correctie} label="IPO-correctie" />}
      </div>
    </PaywallGate>
  )
}

/** Compacte preview tabel — dit is wat de gebruiker blurry ziet */
function FinancieelPreview({ analyse }: Props) {
  const fin = analyse.financieel
  const jaren = fin.resultatenrekening.slice(-3)

  return (
    <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border bg-bg-muted">
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              ({fin.valuta_label})
            </th>
            {jaren.map((j) => (
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
          <tr className="border-b border-border">
            <td className="px-4 py-3 text-text-secondary">Omzet</td>
            {jaren.map((j) => (
              <td key={j.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                {fmtNL(j.omzet)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border">
            <td className="px-4 py-3 text-text-secondary">Nettowinst</td>
            {jaren.map((j) => (
              <td key={j.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                {fmtNL(j.nettowinst)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-4 py-3 text-text-secondary">EPS</td>
            {jaren.map((j) => (
              <td key={j.jaar} className="px-4 py-3 text-right tabular-nums text-text-primary">
                {fmtNL(j.eps, 2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function Toelichting({ tekst, label }: { tekst: string; label?: string }) {
  return (
    <div className="bg-bg-muted rounded-lg px-4 py-3 -mt-6">
      {label && (
        <p className="text-xs font-semibold text-text-muted font-sans uppercase tracking-wide mb-1">
          {label}
        </p>
      )}
      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {tekst}
      </p>
    </div>
  )
}
