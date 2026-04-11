import type { Analyse, MoatCategorie } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import { Shield } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectMoat({ analyse }: Props) {
  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      description="Moat-oordeel, duurzaamheidsanalyse en beoordeling per categorie (netwerk, kosten, switching costs, intangibles, schaalvoordelen)."
    >
      <MoatContent analyse={analyse} />
    </PaywallGate>
  )
}

function MoatContent({ analyse }: Props) {
  const moat = analyse.moat

  return (
    <div className="space-y-8">
      {/* Oordeel + horizon */}
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-accent-light rounded-lg">
            <Shield size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-sans uppercase tracking-wide">
              Moat-oordeel
            </p>
            <p className="text-xl font-bold text-text-primary font-sans">
              {moat.oordeel}
            </p>
          </div>
        </div>
        {moat.duurzaamheid_horizon && (
          <p className="text-xs text-text-secondary font-sans">
            Verwachte duurzaamheid: {moat.duurzaamheid_horizon}
          </p>
        )}
      </div>

      {/* Toelichting */}
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <p className="text-sm text-text-secondary font-sans leading-relaxed">
          {moat.toelichting}
        </p>
        {moat.duurzaamheid_toelichting && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-semibold text-text-muted font-sans mb-1 uppercase tracking-wide">
              Duurzaamheid moat
            </p>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              {moat.duurzaamheid_toelichting}
            </p>
          </div>
        )}
      </div>

      {/* Categorieën */}
      {moat.categorieen.length > 0 && (
        <div>
          <SectionHeading title="Categorieën" />
          <div className="space-y-3">
            {moat.categorieen.map((c) => (
              <CategorieKaart key={c.naam} categorie={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CategorieKaart({ categorie }: { categorie: MoatCategorie }) {
  // Score max is dynamisch — gebruik max(score, 3) als plafond zodat bar altijd klopt
  const maxScore = Math.max(categorie.score, 3)
  const scoreBreedte = (categorie.score / 5) * 100 // Altijd relatief aan 5 als standaard max
  const scoreKleur =
    categorie.score >= 4
      ? 'bg-buy'
      : categorie.score >= 2
        ? 'bg-hold'
        : 'bg-pass'

  const oordeelKleur =
    categorie.oordeel?.toLowerCase().includes('sterk')
      ? 'text-buy'
      : categorie.oordeel?.toLowerCase().includes('afwezig')
        ? 'text-pass'
        : 'text-hold'

  return (
    <div className="bg-bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-text-primary font-sans">
          {categorie.naam}
        </p>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold font-sans ${oordeelKleur}`}>
            {categorie.oordeel}
          </span>
          <span className="text-sm font-bold text-text-primary font-sans tabular-nums">
            {categorie.score}/5
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 bg-bg-muted rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all ${scoreKleur}`}
          style={{ width: `${scoreBreedte}%` }}
        />
      </div>

      <p className="text-sm text-text-secondary font-sans leading-relaxed">
        {categorie.toelichting}
      </p>
    </div>
  )
}
