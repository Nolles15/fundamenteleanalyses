import type { Analyse, AnalyseFrameworks } from '@/lib/types'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import { formatGetal } from '@/lib/utils'
import { BookOpen } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectFrameworks({ analyse }: Props) {
  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      description="Graham, Buffett-Munger, Lynch, Fisher en Greenblatt — vijf frameworks beoordeeld en gecombineerd."
    >
      <FrameworksContent analyse={analyse} />
    </PaywallGate>
  )
}

function FrameworksContent({ analyse }: Props) {
  const fw = analyse.analyseframeworks

  if (!fw) {
    return (
      <div className="bg-bg-surface rounded-xl border border-border p-6">
        <p className="text-sm text-text-muted font-sans">
          Geen framework-analyses beschikbaar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {fw.graham && <GrahamKaart data={fw.graham} />}
      {fw.buffett_munger && <BuffettMungerKaart data={fw.buffett_munger} />}
      {fw.lynch && <LynchKaart data={fw.lynch} />}
      {fw.fisher && <FisherKaart data={fw.fisher} />}
      {fw.greenblatt && <GreenblattKaart data={fw.greenblatt} />}
    </div>
  )
}

function FrameworkHeader({
  naam,
  oordeel,
}: {
  naam: string
  oordeel: string
}) {
  const oordeelKleur = oordeel.toLowerCase().includes('positief') || oordeel.toLowerCase().includes('koop')
    ? 'text-buy'
    : oordeel.toLowerCase().includes('negatief') || oordeel.toLowerCase().includes('pass')
      ? 'text-pass'
      : 'text-hold'

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-accent" />
        <p className="text-sm font-semibold text-text-primary font-sans">
          {naam}
        </p>
      </div>
      <span className={`text-xs font-bold font-sans uppercase ${oordeelKleur}`}>
        {oordeel}
      </span>
    </div>
  )
}

function GrahamKaart({
  data,
}: {
  data: NonNullable<AnalyseFrameworks['graham']>
}) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border p-5">
      <FrameworkHeader naam="Benjamin Graham" oordeel={data.oordeel} />

      {(data.graham_number != null || data.margin_of_safety_pct != null) && (
        <div className="flex flex-wrap gap-4 mb-3">
          {data.graham_number != null && (
            <MiniStat label="Graham Number" waarde={formatGetal(data.graham_number, 2)} />
          )}
          {data.margin_of_safety_pct != null && (
            <MiniStat label="Margin of Safety" waarde={`${formatGetal(data.margin_of_safety_pct)}%`} />
          )}
        </div>
      )}

      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {data.toelichting}
      </p>
    </div>
  )
}

function BuffettMungerKaart({
  data,
}: {
  data: NonNullable<AnalyseFrameworks['buffett_munger']>
}) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border p-5">
      <FrameworkHeader naam="Buffett & Munger" oordeel={data.oordeel} />

      {data.roic_boven_wacc_structureel != null && (
        <div className="mb-3">
          <MiniStat
            label="ROIC > WACC structureel"
            waarde={data.roic_boven_wacc_structureel ? 'Ja' : 'Nee'}
          />
        </div>
      )}

      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {data.toelichting}
      </p>
    </div>
  )
}

function LynchKaart({
  data,
}: {
  data: NonNullable<AnalyseFrameworks['lynch']>
}) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border p-5">
      <FrameworkHeader naam="Peter Lynch" oordeel={data.oordeel} />

      <div className="flex flex-wrap gap-4 mb-3">
        <MiniStat label="Categorie" waarde={data.categorie} />
        {data.peg_ratio != null && (
          <MiniStat label="PEG ratio" waarde={formatGetal(data.peg_ratio, 2)} />
        )}
      </div>

      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {data.toelichting}
      </p>
    </div>
  )
}

function FisherKaart({
  data,
}: {
  data: NonNullable<AnalyseFrameworks['fisher']>
}) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border p-5">
      <FrameworkHeader naam="Philip Fisher" oordeel={data.oordeel} />
      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {data.toelichting}
      </p>
    </div>
  )
}

function GreenblattKaart({
  data,
}: {
  data: NonNullable<AnalyseFrameworks['greenblatt']>
}) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border p-5">
      <FrameworkHeader naam="Joel Greenblatt" oordeel={data.oordeel} />

      {(data.earnings_yield_pct != null || data.return_on_capital_pct != null) && (
        <div className="flex flex-wrap gap-4 mb-3">
          {data.earnings_yield_pct != null && (
            <MiniStat label="Earnings Yield" waarde={`${formatGetal(data.earnings_yield_pct)}%`} />
          )}
          {data.return_on_capital_pct != null && (
            <MiniStat label="Return on Capital" waarde={`${formatGetal(data.return_on_capital_pct)}%`} />
          )}
        </div>
      )}

      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {data.toelichting}
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
