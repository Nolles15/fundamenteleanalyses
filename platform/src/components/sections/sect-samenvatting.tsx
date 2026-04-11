import Link from 'next/link'
import type { Analyse } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { formatKoers, formatUpside } from '@/lib/utils'
import { OordeelBadge } from '@/components/cards/oordeel-badge'
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectSamenvatting({ analyse }: Props) {
  const es = analyse.executive_summary

  return (
    <div className="space-y-8">
      {/* Inline disclaimer */}
      <p className="text-xs text-text-muted font-sans bg-bg-muted rounded-lg px-4 py-2.5">
        Dit oordeel is gebaseerd op vaste analyseframeworks en is geen persoonlijk beleggingsadvies.{' '}
        <Link href="/disclaimer" className="underline hover:text-text-secondary transition-colors">
          Meer informatie
        </Link>
      </p>

      {/* Kernthese */}
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <OordeelBadge oordeel={es.oordeel} />
          <span className="text-xs text-text-muted font-sans">Beleggingsthese</span>
        </div>
        <p className="text-text-secondary font-sans text-sm leading-relaxed">
          {es.kernthese}
        </p>
      </div>

      {/* Scenario's */}
      <div>
        <SectionHeading title="Scenario's" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {es.fair_value_scenarios.map((s) => {
            const positief = s.upside_pct >= 0
            return (
              <div
                key={s.scenario}
                className="bg-bg-surface rounded-xl border border-border p-4"
              >
                <p className="text-xs font-medium text-text-muted font-sans mb-2 uppercase tracking-wide">
                  {s.scenario}
                </p>
                <p className="text-xl font-bold text-text-primary font-sans tabular-nums mb-1">
                  {formatKoers(s.fair_value, es.valuta)}
                </p>
                <p
                  className={`text-sm font-semibold font-sans tabular-nums ${
                    positief ? 'text-buy' : 'text-pass'
                  }`}
                >
                  {formatUpside(s.upside_pct)}
                </p>
                {(s.fcf_groei_pct != null || s.wacc_pct != null) && (
                  <div className="flex flex-wrap gap-x-3 mt-2">
                    {s.fcf_groei_pct != null && (
                      <p className="text-xs text-text-muted font-sans">
                        FCF-groei: {s.fcf_groei_pct > 0 ? '+' : ''}{s.fcf_groei_pct}%
                      </p>
                    )}
                    {s.wacc_pct != null && (
                      <p className="text-xs text-text-muted font-sans">
                        WACC: {s.wacc_pct}%
                      </p>
                    )}
                  </div>
                )}
                {s.kans_pct != null && (
                  <p className="text-xs text-text-muted font-sans mt-1">
                    Kans: {s.kans_pct}%
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Kansgewogen fair value */}
        {es.fair_value_kansgewogen != null && (
          <div className="mt-3 bg-accent-light rounded-lg px-4 py-3 flex items-center justify-between">
            <p className="text-xs font-medium text-accent font-sans">
              Kansgewogen fair value
            </p>
            <p className="text-sm font-bold text-accent font-sans tabular-nums">
              {formatKoers(es.fair_value_kansgewogen, es.valuta)}
            </p>
          </div>
        )}
      </div>

      {/* Kans & Risico */}
      <div>
        <SectionHeading title="Kans & Risico" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-buy-bg border border-buy-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={15} className="text-buy shrink-0" />
              <p className="text-xs font-semibold text-buy font-sans uppercase tracking-wide">
                Grootste kans
              </p>
            </div>
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              {es.grootste_kans}
            </p>
          </div>
          <div className="bg-pass-bg border border-pass-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={15} className="text-pass shrink-0" />
              <p className="text-xs font-semibold text-pass font-sans uppercase tracking-wide">
                Grootste risico
              </p>
            </div>
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              {es.grootste_risico}
            </p>
          </div>
        </div>
      </div>

      {/* Reverse DCF */}
      {es.reverse_dcf_impliciete_groei_pct != null && (
        <div>
          <SectionHeading title="Reverse DCF" />
          <div className="bg-bg-surface rounded-xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted font-sans mb-0.5">
                Impliciete groei (verdisconteerd in huidige koers)
              </p>
              <p className="text-sm font-semibold text-text-primary font-sans">
                De markt prijst{' '}
                <span className="tabular-nums">
                  {es.reverse_dcf_impliciete_groei_pct > 0 ? '+' : ''}
                  {es.reverse_dcf_impliciete_groei_pct}%
                </span>{' '}
                jaarlijkse FCF-groei in.
              </p>
            </div>
            {es.reverse_dcf_impliciete_groei_pct >= 0 ? (
              <TrendingUp size={20} className="text-hold shrink-0 ml-4" />
            ) : (
              <TrendingDown size={20} className="text-pass shrink-0 ml-4" />
            )}
          </div>
        </div>
      )}

      {/* EPV */}
      {es.epv_per_aandeel != null && (
        <div className="bg-bg-muted rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-text-secondary font-sans">
            EPV (Earnings Power Value) per aandeel
          </p>
          <p className="text-sm font-bold text-text-primary font-sans tabular-nums">
            {formatKoers(es.epv_per_aandeel, es.valuta)}
          </p>
        </div>
      )}
    </div>
  )
}
