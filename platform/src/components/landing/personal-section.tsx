'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { AnalyseIndex } from '@/lib/types'
import { AnalyseCard } from '@/components/cards/analyse-card'
import { useLivePrices } from '@/lib/use-live-prices'

interface Props {
  companies: AnalyseIndex[]
}

const PLAN_LABELS: Record<string, string> = {
  GRATIS: 'Gratis',
  PREMIUM_MAAND: 'Premium',
  PREMIUM_JAAR: 'Premium',
}

export function PersonalSection({ companies }: Props) {
  const { data: session, status } = useSession()

  if (status !== 'authenticated') return null

  const naam = session.user?.name ?? 'daar'
  const plan = session.user?.plan ?? 'GRATIS'
  const purchasedTickers = session.user?.purchasedTickers ?? []
  const isPremium = plan !== 'GRATIS'
  const planLabel = PLAN_LABELS[plan] ?? plan

  // Bepaal welke analyses "van jou" zijn
  const mijnAnalyses = isPremium
    ? companies
    : companies.filter((c) => purchasedTickers.includes(c.ticker))

  const heeftAnalyses = mijnAnalyses.length > 0
  const MAX_ZICHTBAAR = 3
  const zichtbaar = mijnAnalyses.slice(0, MAX_ZICHTBAAR)
  const overflow = mijnAnalyses.length > MAX_ZICHTBAAR

  // Live koersen voor de kaarten
  const symbols = zichtbaar
    .map((c) => c.yahoo_symbol)
    .filter((s): s is string => !!s)
  const { prices } = useLivePrices(symbols)

  return (
    <section className="bg-bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Welkomstbalk */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              Welkom terug, {naam}
            </h1>
            <span
              className={`text-[11px] font-semibold font-sans uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isPremium
                  ? 'bg-accent/10 text-accent'
                  : 'bg-bg-muted text-text-muted'
              }`}
            >
              {planLabel}
            </span>
          </div>
          <Link
            href="/account"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
          >
            Account beheren &rarr;
          </Link>
        </div>

        {heeftAnalyses ? (
          <>
            {/* Sectie: Mijn analyses */}
            <div className="mb-2">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary font-sans">
                    {isPremium ? 'Alle analyses' : 'Mijn analyses'}
                  </h2>
                  <p className="text-sm text-text-secondary font-sans mt-0.5">
                    {isPremium
                      ? `Je hebt toegang tot alle ${mijnAnalyses.length} analyses`
                      : `${mijnAnalyses.length} ${mijnAnalyses.length === 1 ? 'analyse' : 'analyses'} ontgrendeld`}
                  </p>
                </div>
                {!isPremium && (
                  <Link
                    href="/analyses"
                    className="text-sm font-medium text-accent hover:underline font-sans hidden sm:inline-flex"
                  >
                    Alle analyses &rarr;
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {zichtbaar.map((c) => (
                  <AnalyseCard
                    key={c.ticker}
                    analyse={c}
                    livePrice={
                      c.yahoo_symbol ? prices[c.yahoo_symbol]?.price : undefined
                    }
                  />
                ))}
              </div>

              {overflow && (
                <div className="mt-4 text-center">
                  <Link
                    href="/analyses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline font-sans"
                  >
                    Bekijk al je {mijnAnalyses.length} analyses &rarr;
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Gratis gebruiker zonder aankopen */
          <div
            className="bg-bg-primary border border-border rounded-xl p-6 sm:p-8 text-center"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <h2 className="text-lg font-semibold text-text-primary font-sans mb-2">
              Je hebt gratis toegang tot samenvattingen
            </h2>
            <p className="text-sm text-text-secondary font-sans mb-5 max-w-md mx-auto">
              Bekijk het oordeel, de kernthese en het bedrijfsprofiel van elke analyse.
              Ontgrendel de volledige analyse per stuk of met een abonnement.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/analyses"
                className="btn-cta px-5 py-2.5 rounded-lg text-sm font-semibold font-sans"
              >
                Bekijk alle analyses
              </Link>
              <Link
                href="/prijzen"
                className="text-sm font-semibold text-text-primary border border-border px-5 py-2.5 rounded-lg hover:bg-bg-muted transition-colors font-sans"
              >
                Bekijk prijzen
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
