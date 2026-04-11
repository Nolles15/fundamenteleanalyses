import type { Analyse, Segment } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { Users, Globe, Building2, Calendar } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectBedrijf({ analyse }: Props) {
  const bp = analyse.bedrijfsprofiel
  const { meta } = analyse

  return (
    <div className="space-y-8">
      {/* Beschrijving */}
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <p className="text-sm text-text-secondary font-sans leading-relaxed">
          {bp.beschrijving}
        </p>

        {/* Bedrijfsmodel */}
        {bp.bedrijfsmodel && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-text-muted font-sans mb-1.5 uppercase tracking-wide">
              Bedrijfsmodel
            </p>
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              {bp.bedrijfsmodel}
            </p>
          </div>
        )}

        {/* Bedrijfsfeiten */}
        {(bp.personeel != null ||
          bp.landen_actief != null ||
          bp.oprichtingsjaar != null ||
          meta.land != null) && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bp.personeel != null && (
              <Feit
                icon={<Users size={14} />}
                label="Medewerkers"
                waarde={bp.personeel.toLocaleString('nl-NL')}
              />
            )}
            {bp.landen_actief != null && (
              <Feit
                icon={<Globe size={14} />}
                label="Landen actief"
                waarde={String(bp.landen_actief)}
              />
            )}
            {bp.oprichtingsjaar != null && (
              <Feit
                icon={<Calendar size={14} />}
                label="Opgericht"
                waarde={String(bp.oprichtingsjaar)}
              />
            )}
            {bp.ipo_datum != null && (
              <Feit
                icon={<Calendar size={14} />}
                label="IPO"
                waarde={bp.ipo_koers != null ? `${bp.ipo_datum} (${bp.ipo_koers})` : bp.ipo_datum}
              />
            )}
            {meta.land != null && (
              <Feit
                icon={<Building2 size={14} />}
                label="Hoofdkantoor"
                waarde={meta.land}
              />
            )}
          </div>
        )}
      </div>

      {/* Bedrijfssegmenten — splits product vs. geo als ze gemengd zijn */}
      {bp.segmenten && bp.segmenten.length > 0 && (() => {
        const { product, geo } = splitSegmenten(bp.segmenten)
        return (
          <>
            {product.length > 0 && (
              <div>
                <SectionHeading title="Bedrijfssegmenten" />
                <SegmentTabel segmenten={product} />
              </div>
            )}
            {geo.length > 0 && (
              <div>
                <SectionHeading title="Geografische markten" />
                <SegmentTabel segmenten={geo} />
              </div>
            )}
          </>
        )
      })()}

      {/* Geografische spreiding */}
      {bp.geografische_spreiding && bp.geografische_spreiding.length > 0 && (
        <div>
          <SectionHeading title="Geografische spreiding" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bp.geografische_spreiding.map((g) => (
              <div
                key={g.regio}
                className="bg-bg-surface rounded-xl border border-border p-4"
              >
                <p className="text-xs text-text-muted font-sans mb-1">{g.regio}</p>
                <p className="text-lg font-bold text-text-primary font-sans tabular-nums">
                  {g.omzet_pct}%
                </p>
                {g.valuta && (
                  <p className="text-xs text-text-muted font-sans mt-0.5">{g.valuta}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Klantconcentratie */}
      {bp.klantconcentratie && (
        <div className="bg-hold-bg border border-hold-border rounded-xl p-4">
          <p className="text-xs font-semibold text-hold font-sans uppercase tracking-wide mb-1">
            Klantconcentratie
          </p>
          <p className="text-sm text-text-secondary font-sans">{bp.klantconcentratie}</p>
        </div>
      )}

      {/* Aandeelhouders */}
      {bp.aandeelhouders && bp.aandeelhouders.length > 0 && (
        <div>
          <SectionHeading title="Aandeelhoudersstructuur" />
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                    Aandeelhouder
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                    %
                  </th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {bp.aandeelhouders.map((a, i) => (
                  <tr
                    key={a.naam}
                    className={i < bp.aandeelhouders.length - 1 ? 'border-b border-border' : ''}
                  >
                    <td className="px-4 py-3 font-medium text-text-primary">{a.naam}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                      <div className="inline-flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-chart-1 opacity-70"
                          style={{ width: `${Math.max(a.pct * 1.2, 4)}px` }}
                        />
                        {a.pct}%
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-text-muted text-xs">
                      {a.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bp.institutioneel_eigendom_trend && (
            <p className="mt-2 text-xs text-text-muted font-sans">
              Trend: {bp.institutioneel_eigendom_trend}
            </p>
          )}
        </div>
      )}

      {/* Geschiedenis */}
      {bp.geschiedenis && (
        <div>
          <SectionHeading title="Geschiedenis" />
          <div className="bg-bg-surface rounded-xl border border-border p-5">
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              {bp.geschiedenis}
            </p>
          </div>
        </div>
      )}

      {/* Klantenprofiel */}
      {bp.klantenprofiel && (
        <div>
          <SectionHeading title="Klantenprofiel" />
          <div className="bg-bg-surface rounded-xl border border-border p-5">
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              {bp.klantenprofiel}
            </p>
          </div>
        </div>
      )}

      {/* IPO-context */}
      {bp.ipo_context && (
        <div>
          <SectionHeading title="IPO-context" />
          <div className="bg-bg-surface rounded-xl border border-border p-5">
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              {bp.ipo_context}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Segment helpers ─────────────────────────────────── */

const GEO_PATTERNS = [
  /europa/i, /amerika/i, /azi[eë]/i, /pacific/i, /africa/i, /afrika/i,
  /mea\b/i, /emea/i, /apac/i, /latam/i, /middle east/i, /midden.?oosten/i,
  /noorwegen/i, /internationaal/i, /global/i, /regio/i, /^us$/i, /^eu$/i,
]

function isGeoSegment(naam: string): boolean {
  return GEO_PATTERNS.some((p) => p.test(naam))
}

function splitSegmenten(segmenten: Segment[]): { product: Segment[]; geo: Segment[] } {
  const product: Segment[] = []
  const geo: Segment[] = []
  for (const s of segmenten) {
    if (isGeoSegment(s.naam)) {
      geo.push(s)
    } else {
      product.push(s)
    }
  }
  return { product, geo }
}

function SegmentTabel({ segmenten }: { segmenten: Segment[] }) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border bg-bg-muted">
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Segment
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Omzet %
            </th>
            <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Beschrijving
            </th>
          </tr>
        </thead>
        <tbody>
          {segmenten.map((s, i) => (
            <tr
              key={s.naam}
              className={i < segmenten.length - 1 ? 'border-b border-border' : ''}
            >
              <td className="px-4 py-3 font-medium text-text-primary">
                {s.naam}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                <div className="inline-flex items-center gap-2">
                  <div
                    className="h-1.5 rounded-full bg-accent opacity-60"
                    style={{ width: `${Math.max(s.omzet_pct * 0.6, 4)}px` }}
                  />
                  {s.omzet_pct}%
                </div>
              </td>
              <td className="hidden sm:table-cell px-4 py-3 text-text-secondary text-xs leading-relaxed">
                {s.beschrijving}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Helpers ─────────────────────────────────────────── */

function Feit({
  icon,
  label,
  waarde,
}: {
  icon: React.ReactNode
  label: string
  waarde: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-text-muted mb-0.5">
        {icon}
        <p className="text-xs font-sans">{label}</p>
      </div>
      <p className="text-sm font-semibold text-text-primary font-sans">{waarde}</p>
    </div>
  )
}
