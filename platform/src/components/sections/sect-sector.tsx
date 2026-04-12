import type { Analyse, Concurrent, PorterKracht, TamSamSom } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import { formatGetal } from '@/lib/utils'
import { Activity } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectSector({ analyse }: Props) {
  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      description="Sectorprofiel, Porter's Five Forces, concurrentenvergelijking en TAM/SAM/SOM-analyse."
    >
      <SectorContent analyse={analyse} />
    </PaywallGate>
  )
}

function SectorContent({ analyse }: Props) {
  const sc = analyse.sector_concurrentie

  if (!sc) {
    return (
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <p className="text-sm text-text-muted font-sans">
          Geen sector- en concurrentiedata beschikbaar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Sectorprofiel */}
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent-light rounded-lg">
            <Activity size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-sans uppercase tracking-wide">
              Sector
            </p>
            <p className="text-xl font-bold text-text-primary font-sans">
              {analyse.meta.sector}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <MiniStat label="Type" waarde={sc.sectorprofiel.type} />
          <MiniStat label="Kapitaalintensief" waarde={sc.sectorprofiel.kapitaalintensief ? 'Ja' : 'Nee'} />
          <MiniStat label="Consolidatiegraad" waarde={sc.sectorprofiel.consolidatiegraad} />
          <MiniStat label="Sentiment" waarde={sc.sectorprofiel.sentiment} />
        </div>

        {sc.sectorprofiel.trends && (
          <p className="text-xs text-text-secondary font-sans leading-relaxed mt-4 pt-4 border-t border-border">
            {sc.sectorprofiel.trends}
          </p>
        )}

        {sc.sectorprofiel.toelichting && (
          <p className="text-xs text-text-secondary font-sans leading-relaxed mt-3 pt-3 border-t border-border">
            {sc.sectorprofiel.toelichting}
          </p>
        )}
      </div>

      {/* Positie */}
      <div className="bg-bg-surface rounded-xl border border-border p-5">
        <p className="text-xs text-text-muted font-sans mb-2 uppercase tracking-wide">
          Competitieve positie
        </p>
        <p className="text-sm font-semibold text-text-primary font-sans mb-1">
          {sc.positie}
        </p>
        {sc.positie_toelichting && (
          <p className="text-xs text-text-secondary font-sans leading-relaxed mt-2">
            {sc.positie_toelichting}
          </p>
        )}
      </div>

      {/* Porter's Five Forces */}
      <div>
        <SectionHeading title="Porter's Five Forces" />
        <div className="space-y-2">
          <PorterRij label="Dreiging toetreders" kracht={sc.porter.dreiging_toetreders} />
          <PorterRij label="Macht leveranciers" kracht={sc.porter.macht_leveranciers} />
          <PorterRij label="Macht klanten" kracht={sc.porter.macht_klanten} />
          <PorterRij label="Dreiging substituten" kracht={sc.porter.dreiging_substituten} />
          <PorterRij label="Concurrentie-intensiteit" kracht={sc.porter.concurrentie_intensiteit} />
        </div>
        <div className="mt-3 bg-bg-muted rounded-lg px-4 py-3">
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            {sc.porter.conclusie}
          </p>
        </div>
      </div>

      {/* Concurrenten */}
      {sc.concurrenten.length > 0 && (
        <div>
          <SectionHeading title="Concurrenten" />
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-border bg-bg-muted">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Naam
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Omzet groei
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      EBIT marge
                    </th>
                    <th className="hidden sm:table-cell text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      ROIC
                    </th>
                    <th className="hidden sm:table-cell text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      EV/EBITDA
                    </th>
                    <th className="hidden md:table-cell text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      P/FCF
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sc.concurrenten.map((c, i) => (
                    <ConcurrentRij
                      key={c.naam}
                      concurrent={c}
                      isLast={i === sc.concurrenten.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAM/SAM/SOM */}
      {sc.tam_sam_som != null && <TamSamSomBlok data={sc.tam_sam_som} />}
    </div>
  )
}

function PorterRij({ label, kracht }: { label: string; kracht: PorterKracht }) {
  const scoreLower = (kracht?.score ?? '').toLowerCase()
  const kleur =
    scoreLower.includes('laag') || scoreLower.includes('low')
      ? 'bg-buy'
      : scoreLower.includes('hoog') || scoreLower.includes('high')
        ? 'bg-pass'
        : 'bg-hold'

  return (
    <div className="bg-bg-surface rounded-lg border border-border px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-medium text-text-primary font-sans">{label}</p>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${kleur}`}
        >
          {kracht.score}
        </span>
      </div>
      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {kracht.toelichting}
      </p>
    </div>
  )
}

function ConcurrentRij({
  concurrent,
  isLast,
}: {
  concurrent: Concurrent
  isLast: boolean
}) {
  return (
    <tr className={!isLast ? 'border-b border-border' : ''}>
      <td className="px-4 py-3 font-medium text-text-primary">
        {concurrent.naam}
        {concurrent.ticker && (
          <span className="text-xs text-text-muted ml-1">({concurrent.ticker})</span>
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
        {concurrent.omzet_groei_pct != null
          ? `${concurrent.omzet_groei_pct > 0 ? '+' : ''}${formatGetal(concurrent.omzet_groei_pct)}%`
          : '—'}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
        {concurrent.ebit_marge_pct != null ? `${formatGetal(concurrent.ebit_marge_pct)}%` : '—'}
      </td>
      <td className="hidden sm:table-cell px-4 py-3 text-right tabular-nums text-text-secondary">
        {concurrent.roic_pct != null ? `${formatGetal(concurrent.roic_pct)}%` : '—'}
      </td>
      <td className="hidden sm:table-cell px-4 py-3 text-right tabular-nums text-text-secondary">
        {concurrent.ev_ebitda != null ? `${formatGetal(concurrent.ev_ebitda)}x` : '—'}
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-right tabular-nums text-text-secondary">
        {concurrent.p_fcf != null ? `${formatGetal(concurrent.p_fcf)}x` : '—'}
      </td>
    </tr>
  )
}

function TamSamSomBlok({ data }: { data: TamSamSom }) {
  return (
    <div>
      <SectionHeading title="TAM / SAM / SOM" />
      <div className="bg-bg-surface rounded-xl border border-border p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.tam_mln != null && (
            <MiniStat
              label="TAM"
              waarde={`${data.tam_mln.toLocaleString('nl-NL')} mln`}
              sub={data.tam_groei_pct != null ? `groei ${formatGetal(data.tam_groei_pct)}%/jr` : undefined}
            />
          )}
          {data.sam_mln != null && (
            <MiniStat
              label="SAM"
              waarde={`${data.sam_mln.toLocaleString('nl-NL')} mln`}
              sub={data.sam_groei_pct != null ? `groei ${formatGetal(data.sam_groei_pct)}%/jr` : undefined}
            />
          )}
          {data.huidige_penetratie_pct != null && (
            <MiniStat label="Huidige penetratie" waarde={`${formatGetal(data.huidige_penetratie_pct)}%`} />
          )}
          {data.impliciete_penetratie_na_horizon_pct != null && (
            <MiniStat
              label="Impliciete penetratie (horizon)"
              waarde={`${formatGetal(data.impliciete_penetratie_na_horizon_pct)}%`}
            />
          )}
          {data.groei_plausibel != null && (
            <MiniStat label="Groei plausibel" waarde={data.groei_plausibel ? 'Ja' : 'Nee'} />
          )}
        </div>
        {data.toelichting && (
          <p className="text-xs text-text-secondary font-sans leading-relaxed mt-3 pt-3 border-t border-border">
            {data.toelichting}
          </p>
        )}
        {data.bron && (
          <p className="text-xs text-text-muted font-sans mt-2">
            Bron: {data.bron}
          </p>
        )}
      </div>
    </div>
  )
}

function MiniStat({ label, waarde, sub }: { label: string; waarde: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted font-sans mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-text-primary font-sans tabular-nums">
        {waarde}
      </p>
      {sub && <p className="text-xs text-text-muted font-sans">{sub}</p>}
    </div>
  )
}
