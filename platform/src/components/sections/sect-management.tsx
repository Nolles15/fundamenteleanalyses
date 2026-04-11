import type { Analyse, Persoon, InsiderTransaction } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import { formatGetal, formatDatum } from '@/lib/utils'
import { UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectManagement({ analyse }: Props) {
  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      description="Managementbeoordeling, personen, compensatie, insider transactions en capital allocation."
    >
      <ManagementContent analyse={analyse} />
    </PaywallGate>
  )
}

function ManagementContent({ analyse }: Props) {
  const mgmt = analyse.management

  return (
    <div className="space-y-8">
      {/* Oordeel + toelichting */}
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-accent-light rounded-lg">
            <UserCheck size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-sans uppercase tracking-wide">
              Management-oordeel
            </p>
            <p className="text-xl font-bold text-text-primary font-sans">
              {mgmt.oordeel}
            </p>
          </div>
        </div>
        <p className="text-sm text-text-secondary font-sans leading-relaxed mt-3">
          {mgmt.toelichting}
        </p>
      </div>

      {/* Kernfeiten */}
      {(mgmt.owner_operator != null || mgmt.eigenbelang_pct != null || mgmt.insider_netto != null) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mgmt.owner_operator != null && (
            <StatCard label="Owner-operator" waarde={mgmt.owner_operator ? 'Ja' : 'Nee'} />
          )}
          {mgmt.eigenbelang_pct != null && (
            <StatCard label="Eigenbelang" waarde={`${formatGetal(mgmt.eigenbelang_pct)}%`} />
          )}
          {mgmt.insider_netto != null && (
            <StatCard label="Insider netto" waarde={mgmt.insider_netto} />
          )}
        </div>
      )}

      {/* Capital allocation */}
      <div>
        <SectionHeading title="Capital allocation" />
        <div className="bg-bg-surface rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            {mgmt.capital_allocation}
          </p>
          {mgmt.capital_allocation_detail && (
            <p className="text-xs text-text-secondary font-sans leading-relaxed mt-3 pt-3 border-t border-border">
              {mgmt.capital_allocation_detail}
            </p>
          )}
        </div>
      </div>

      {/* Integriteit */}
      {mgmt.integriteit && (
        <div>
          <SectionHeading title="Integriteit & transparantie" />
          <div className="bg-bg-surface rounded-xl border border-border p-5">
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              {mgmt.integriteit}
            </p>
          </div>
        </div>
      )}

      {/* Personen */}
      {mgmt.personen.length > 0 && (
        <div>
          <SectionHeading title="Sleutelpersonen" />
          <div className="space-y-3">
            {mgmt.personen.map((p) => (
              <PersoonKaart key={`${p.naam}-${p.functie}`} persoon={p} />
            ))}
          </div>
        </div>
      )}

      {/* Compensatie */}
      {mgmt.compensatie != null && (
        <div>
          <SectionHeading title="Compensatie" />
          <div className="bg-bg-surface rounded-xl border border-border p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
              {mgmt.compensatie.sbc_pct_marktkapitalisatie != null && (
                <MiniStat
                  label="SBC / marktcap"
                  waarde={`${formatGetal(mgmt.compensatie.sbc_pct_marktkapitalisatie)}%`}
                />
              )}
              {mgmt.compensatie.verwateringsgraad_pct_jaar != null && (
                <MiniStat
                  label="Verwateringsgraad/jaar"
                  waarde={`${formatGetal(mgmt.compensatie.verwateringsgraad_pct_jaar)}%`}
                />
              )}
              {mgmt.compensatie.ceo_pay_ratio != null && (
                <MiniStat
                  label="CEO pay ratio"
                  waarde={`${mgmt.compensatie.ceo_pay_ratio}x`}
                />
              )}
              {mgmt.compensatie.prikkels_aligned != null && (
                <MiniStat
                  label="Prikkels aligned"
                  waarde={mgmt.compensatie.prikkels_aligned ? 'Ja' : 'Nee'}
                />
              )}
            </div>
            {mgmt.compensatie.toelichting && (
              <p className="text-sm text-text-secondary font-sans leading-relaxed border-t border-border pt-3">
                {mgmt.compensatie.toelichting}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Insider transactions */}
      {mgmt.insider_transactions != null && mgmt.insider_transactions.length > 0 && (
        <div>
          <SectionHeading title="Insider transactions" />
          <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-border bg-bg-muted">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Datum
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Naam
                    </th>
                    <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Functie
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Aandelen
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Koers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mgmt.insider_transactions
                    .filter((t) => t.type != null)
                    .map((t, i, arr) => (
                    <InsiderRij
                      key={`${t.datum}-${t.naam}-${i}`}
                      transaction={t}
                      isLast={i === arr.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PersoonKaart({ persoon }: { persoon: Persoon }) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border px-5 py-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <p className="text-sm font-semibold text-text-primary font-sans">
          {persoon.naam}
        </p>
        <span className="text-xs text-accent font-sans font-medium shrink-0">
          {persoon.functie}
        </span>
      </div>
      <p className="text-sm text-text-secondary font-sans leading-relaxed">
        {persoon.achtergrond}
      </p>
    </div>
  )
}

function InsiderRij({
  transaction,
  isLast,
}: {
  transaction: InsiderTransaction
  isLast: boolean
}) {
  const typeLower = (transaction.type ?? '').toLowerCase()
  const isKoop = typeLower.includes('koop') || typeLower.includes('buy')

  return (
    <tr className={!isLast ? 'border-b border-border' : ''}>
      <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">
        {transaction.datum ? formatDatum(transaction.datum) : '—'}
      </td>
      <td className="px-4 py-3 font-medium text-text-primary text-xs">
        {transaction.naam ?? '—'}
      </td>
      <td className="hidden sm:table-cell px-4 py-3 text-text-muted text-xs">
        {transaction.functie ?? '—'}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-xs font-medium">
          {isKoop ? (
            <ArrowUpRight size={12} className="text-buy" />
          ) : (
            <ArrowDownRight size={12} className="text-pass" />
          )}
          <span className={isKoop ? 'text-buy' : 'text-pass'}>
            {transaction.type}
          </span>
        </span>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-text-secondary text-xs">
        {transaction.aandelen != null ? transaction.aandelen.toLocaleString('nl-NL') : '—'}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-text-secondary text-xs">
        {transaction.koers != null ? transaction.koers.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) : '—'}
      </td>
    </tr>
  )
}

function StatCard({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border p-4">
      <p className="text-xs text-text-muted font-sans mb-1 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-lg font-bold text-text-primary font-sans tabular-nums">
        {waarde}
      </p>
    </div>
  )
}

function MiniStat({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted font-sans mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-text-primary font-sans tabular-nums">
        {waarde}
      </p>
    </div>
  )
}
