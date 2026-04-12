import type { Analyse, Risico, ESG, ESGFactor, Katalysator } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import { ShieldAlert } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectRisicos({ analyse }: Props) {
  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      description="Risicomatrix met kans en impact, ESG-factoren, these-invalidatiecriteria en katalysatoren."
    >
      <RisicosContent analyse={analyse} />
    </PaywallGate>
  )
}

function RisicosContent({ analyse }: Props) {
  const risicos = analyse.risicos ?? []
  const esg = analyse.esg
  const katalysatoren = analyse.katalysatoren ?? []
  const theseInvalide = analyse.these_invalide_bij

  return (
    <div className="space-y-8">
      {/* Risicomatrix */}
      {risicos.length > 0 && (
        <div>
          <SectionHeading title="Risico's" />
          <div className="space-y-3">
            {risicos.map((r, i) => (
              <RisicoKaart key={i} risico={r} />
            ))}
          </div>
        </div>
      )}

      {/* These invalidatie */}
      {theseInvalide != null && (
        <div className="bg-pass-bg border border-pass-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} className="text-pass shrink-0" />
            <p className="text-xs font-semibold text-pass font-sans uppercase tracking-wide">
              These ongeldig bij
            </p>
          </div>
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            {theseInvalide}
          </p>
        </div>
      )}

      {/* ESG */}
      {esg != null && <ESGBlok esg={esg} />}

      {/* Katalysatoren */}
      {katalysatoren.length > 0 && (
        <div>
          <SectionHeading title="Katalysatoren" />
          <div className="space-y-2">
            {katalysatoren.map((k, i) => (
              <KatalysatorRij key={i} katalysator={k} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Risico kaart ─────────────────────────────────────── */

function isHoog(val: string) {
  const v = val.toLowerCase()
  return v === 'hoog' || v === 'groot' || v === 'high'
}
function isMiddel(val: string) {
  const v = val.toLowerCase()
  return v === 'middel' || v === 'midden' || v === 'medium'
}

function RisicoKaart({ risico }: { risico: Risico }) {
  const impact = risico.impact ?? ''
  const kans = risico.kans ?? ''

  const impactConfig =
    isHoog(impact)
      ? { bg: 'bg-pass', text: 'text-white', border: 'border-pass' }
      : isMiddel(impact)
        ? { bg: 'bg-hold', text: 'text-white', border: 'border-hold' }
        : { bg: 'bg-bg-muted', text: 'text-text-secondary', border: 'border-border' }

  const kansBadge =
    isHoog(kans)
      ? 'bg-pass-bg text-pass border-pass-border'
      : isMiddel(kans)
        ? 'bg-hold-bg text-hold border-hold-border'
        : 'bg-bg-muted text-text-muted border-border'

  return (
    <div className="bg-bg-surface rounded-xl border border-border p-5">
      <p className="text-sm font-medium text-text-primary font-sans mb-3">
        {risico.omschrijving}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${impactConfig.bg} ${impactConfig.text}`}>
          Impact: {risico.impact}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${kansBadge}`}>
          Kans: {risico.kans}
        </span>
      </div>

      {risico.dcf_aanname_geraakt && (
        <p className="text-xs text-text-muted font-sans mb-2">
          DCF-aanname geraakt: {risico.dcf_aanname_geraakt}
        </p>
      )}

      {risico.toelichting && (
        <p className="text-xs text-text-secondary font-sans leading-relaxed">
          {risico.toelichting}
        </p>
      )}
    </div>
  )
}

/* ─── ESG ──────────────────────────────────────────────── */

function ESGBlok({ esg }: { esg: ESG }) {
  return (
    <div>
      <SectionHeading title="ESG" />
      <div className="bg-bg-surface rounded-xl border border-border p-5 mb-3">
        <p className="text-xs text-text-muted font-sans mb-1 uppercase tracking-wide">
          Eindoordeel
        </p>
        <p className="text-sm text-text-secondary font-sans leading-relaxed">
          {esg.eindoordeel}
        </p>
      </div>

      {esg.materiele_factoren.length > 0 && (
        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Factor
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Risico
                </th>
                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Financiële impact
                </th>
              </tr>
            </thead>
            <tbody>
              {esg.materiele_factoren.map((f, i) => (
                <ESGRij key={f.factor} factor={f} isLast={i === esg.materiele_factoren.length - 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ESGRij({ factor, isLast }: { factor: ESGFactor; isLast: boolean }) {
  const niveauKleur =
    isHoog(factor.risico_niveau ?? '')
      ? 'text-pass font-semibold'
      : isMiddel(factor.risico_niveau ?? '')
        ? 'text-hold font-semibold'
        : 'text-text-secondary'

  return (
    <tr className={!isLast ? 'border-b border-border' : ''}>
      <td className="px-4 py-3">
        <p className="font-medium text-text-primary text-xs">{factor.factor}</p>
        {factor.sasb_categorie && (
          <p className="text-xs text-text-muted mt-0.5">{factor.sasb_categorie}</p>
        )}
      </td>
      <td className={`px-4 py-3 text-xs ${niveauKleur}`}>
        {factor.risico_niveau}
      </td>
      <td className="hidden sm:table-cell px-4 py-3 text-xs text-text-secondary">
        {factor.financiele_impact}
        {factor.dcf_impact && (
          <span className="text-text-muted ml-1">({factor.dcf_impact})</span>
        )}
      </td>
    </tr>
  )
}

/* ─── Katalysatoren ────────────────────────────────────── */

function KatalysatorRij({ katalysator }: { katalysator: Katalysator }) {
  const richtingConfig =
    katalysator.richting === 'POSITIEF'
      ? { bg: 'bg-buy-bg', border: 'border-buy-border', text: 'text-buy', label: 'Positief' }
      : katalysator.richting === 'NEGATIEF'
        ? { bg: 'bg-pass-bg', border: 'border-pass-border', text: 'text-pass', label: 'Negatief' }
        : katalysator.richting === 'BINAIR'
          ? { bg: 'bg-hold-bg', border: 'border-hold-border', text: 'text-hold', label: 'Binair' }
          : { bg: 'bg-bg-muted', border: 'border-border', text: 'text-text-muted', label: 'Neutraal' }

  const impactBadge =
    katalysator.impact === 'GROOT'
      ? 'bg-pass text-white'
      : katalysator.impact === 'MIDDEL'
        ? 'bg-hold text-white'
        : 'bg-bg-muted text-text-muted'

  return (
    <div className={`rounded-xl border px-5 py-4 ${richtingConfig.bg} ${richtingConfig.border}`}>
      <p className="text-sm text-text-primary font-sans font-medium mb-2">
        {katalysator.omschrijving}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-semibold font-sans ${richtingConfig.text}`}>
          {richtingConfig.label}
        </span>
        <span className="text-xs text-text-muted font-sans">
          {katalysator.datum_ca}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${impactBadge}`}>
          {katalysator.impact}
        </span>
      </div>
    </div>
  )
}

/* ─── Helpers ──────────────────────────────────────────── */
