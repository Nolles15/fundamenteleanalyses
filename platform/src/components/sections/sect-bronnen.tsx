import type { Analyse, Bron } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { ExternalLink, BookOpen, Database, Newspaper, FileText } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectBronnen({ analyse }: Props) {
  const databronnen = analyse.databronnen
  const bronnen = analyse.bronnen

  const heeftData = databronnen != null || (bronnen != null && bronnen.length > 0)
  if (!heeftData) return null

  return (
    <div className="space-y-8">
      {/* Databronnen metadata */}
      {databronnen != null && (
        <div className="space-y-4">
          {/* Geraadpleegde bronnen */}
          {databronnen.bronnen_geraadpleegd.length > 0 && (
            <div className="bg-bg-surface rounded-xl border border-border p-5">
              <p className="text-xs text-text-muted font-sans mb-3 uppercase tracking-wide">
                Geraadpleegde bronnen
              </p>
              <div className="flex flex-wrap gap-2">
                {databronnen.bronnen_geraadpleegd.map((b) => (
                  <span
                    key={b}
                    className="text-xs bg-bg-muted text-text-secondary px-2.5 py-1 rounded-full font-sans"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Data kwaliteit */}
          {(databronnen.ontbrekende_data != null ||
            databronnen.non_gaap_gebruikt != null ||
            databronnen.pre_ipo_data_beschikbaar != null) && (
            <div className="bg-bg-surface rounded-xl border border-border p-5">
              <p className="text-xs text-text-muted font-sans mb-3 uppercase tracking-wide">
                Datakwaliteit
              </p>
              <div className="space-y-2">
                {databronnen.pre_ipo_data_beschikbaar != null && (
                  <DataRij
                    label="Pre-IPO data beschikbaar"
                    waarde={databronnen.pre_ipo_data_beschikbaar ? 'Ja' : 'Nee'}
                  />
                )}
                {databronnen.non_gaap_gebruikt != null && (
                  <DataRij
                    label="Non-GAAP cijfers gebruikt"
                    waarde={databronnen.non_gaap_gebruikt ? 'Ja' : 'Nee'}
                  />
                )}
                {databronnen.non_gaap_toelichting && (
                  <p className="text-xs text-text-secondary font-sans leading-relaxed mt-2">
                    {databronnen.non_gaap_toelichting}
                  </p>
                )}
                {databronnen.ontbrekende_data && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-text-muted font-sans mb-1">
                      Ontbrekende data
                    </p>
                    <p className="text-xs text-text-secondary font-sans leading-relaxed">
                      {databronnen.ontbrekende_data}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bronnen met URLs */}
      {bronnen != null && bronnen.length > 0 && (
        <div>
          <SectionHeading title="Bronverwijzingen" />
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {bronnen.map((b, i) => (
                <BronRij key={`${b.url}-${i}`} bron={b} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BronRij({ bron }: { bron: Bron }) {
  const TypeIcon = bron.type.includes('jaarverslag')
    ? FileText
    : bron.type.includes('databron')
      ? Database
      : bron.type.includes('nieuws')
        ? Newspaper
        : bron.type.includes('analist')
          ? BookOpen
          : ExternalLink

  return (
    <a
      href={bron.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 px-4 py-3 hover:bg-bg-muted transition-colors group"
    >
      <TypeIcon
        size={14}
        className="text-text-muted mt-0.5 shrink-0 group-hover:text-accent transition-colors"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary font-sans group-hover:text-accent transition-colors truncate">
          {bron.titel}
        </p>
        <p className="text-xs text-text-muted font-sans truncate">
          {bron.url}
        </p>
      </div>
      <span className="text-xs text-text-muted font-sans shrink-0 capitalize">
        {bron.type}
      </span>
    </a>
  )
}

function DataRij({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-text-secondary font-sans">{label}</p>
      <p className="text-xs font-semibold text-text-primary font-sans">{waarde}</p>
    </div>
  )
}
