'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Analyse } from '@/lib/types'
import { OordeelBadge } from '@/components/cards/oordeel-badge'
import { formatKoers, formatUpside, formatDatum } from '@/lib/utils'
import { ScoreRadar } from './score-radar'

interface TickerOption {
  ticker: string
  naam: string
}

interface Props {
  tickers: TickerOption[]
}

export function VergelijkClient({ tickers }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tickerA, setTickerA] = useState(searchParams.get('a') ?? '')
  const [tickerB, setTickerB] = useState(searchParams.get('b') ?? '')
  const [analyseA, setAnalyseA] = useState<Analyse | null>(null)
  const [analyseB, setAnalyseB] = useState<Analyse | null>(null)
  const [loading, setLoading] = useState(false)

  // URL synchroon houden
  useEffect(() => {
    if (!tickerA && !tickerB) return
    const params = new URLSearchParams()
    if (tickerA) params.set('a', tickerA)
    if (tickerB) params.set('b', tickerB)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [tickerA, tickerB, router])

  // Data laden
  const loadAnalyse = useCallback(async (ticker: string): Promise<Analyse | null> => {
    if (!ticker) return null
    try {
      const res = await fetch(`/api/analyse/${ticker}`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!tickerA && !tickerB) return
    let cancelled = false
    setLoading(true)

    Promise.all([loadAnalyse(tickerA), loadAnalyse(tickerB)]).then(([a, b]) => {
      if (cancelled) return
      setAnalyseA(a)
      setAnalyseB(b)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [tickerA, tickerB, loadAnalyse])

  return (
    <div>
      {/* Selectie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <TickerSelect
          label="Aandeel A"
          value={tickerA}
          onChange={setTickerA}
          options={tickers}
          exclude={tickerB}
        />
        <TickerSelect
          label="Aandeel B"
          value={tickerB}
          onChange={setTickerB}
          options={tickers}
          exclude={tickerA}
        />
      </div>

      {loading && (
        <p className="text-center text-text-muted font-sans py-12 text-sm">Laden...</p>
      )}

      {!loading && analyseA && analyseB && (
        <div className="space-y-8">
          <KerngegevensBlok a={analyseA} b={analyseB} />
          <ScorekaartBlok a={analyseA} b={analyseB} />
          <ScenariosBlok a={analyseA} b={analyseB} />
          <RisicosBlok a={analyseA} b={analyseB} />
        </div>
      )}

      {!loading && (!tickerA || !tickerB) && (
        <div className="text-center py-16">
          <p className="text-text-muted font-sans text-sm">
            Selecteer twee aandelen om de vergelijking te starten.
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Ticker Select ──────────────────────────────────────── */

function TickerSelect({
  label,
  value,
  onChange,
  options,
  exclude,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: TickerOption[]
  exclude: string
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted font-sans mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm font-sans bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent appearance-none cursor-pointer"
      >
        <option value="">Selecteer een aandeel...</option>
        {options
          .filter((o) => o.ticker !== exclude)
          .map((o) => (
            <option key={o.ticker} value={o.ticker}>
              {o.ticker} — {o.naam}
            </option>
          ))}
      </select>
    </div>
  )
}

/* ─── Kerngegevens ───────────────────────────────────────── */

function KerngegevensBlok({ a, b }: { a: Analyse; b: Analyse }) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-bg-muted">
        <h2 className="text-sm font-semibold text-text-primary font-sans">Kerngegevens</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium w-1/3" />
              <th className="text-right px-5 py-3 text-xs text-text-muted font-medium w-1/3">
                {a.meta.ticker}
              </th>
              <th className="text-right px-5 py-3 text-xs text-text-muted font-medium w-1/3">
                {b.meta.ticker}
              </th>
            </tr>
          </thead>
          <tbody>
            <VergelijkRij label="Naam" waarde_a={a.meta.naam} waarde_b={b.meta.naam} />
            <VergelijkRij label="Sector" waarde_a={a.meta.sector} waarde_b={b.meta.sector} />
            <VergelijkRij
              label="Oordeel"
              waarde_a={<OordeelBadge oordeel={a.executive_summary.oordeel} size="sm" />}
              waarde_b={<OordeelBadge oordeel={b.executive_summary.oordeel} size="sm" />}
            />
            <VergelijkRij
              label="Koers"
              waarde_a={formatKoers(a.meta.koers, a.meta.valuta)}
              waarde_b={formatKoers(b.meta.koers, b.meta.valuta)}
            />
            <VergelijkRij
              label="Fair value"
              waarde_a={formatKoers(a.executive_summary.fair_value_basis, a.meta.valuta)}
              waarde_b={formatKoers(b.executive_summary.fair_value_basis, b.meta.valuta)}
            />
            <VergelijkRij
              label="Upside"
              waarde_a={
                <span className={a.executive_summary.upside_pct >= 0 ? 'text-buy' : 'text-pass'}>
                  {formatUpside(a.executive_summary.upside_pct)}
                </span>
              }
              waarde_b={
                <span className={b.executive_summary.upside_pct >= 0 ? 'text-buy' : 'text-pass'}>
                  {formatUpside(b.executive_summary.upside_pct)}
                </span>
              }
            />
            <VergelijkRij
              label="Scorekaart"
              waarde_a={`${a.scorekaart.totaal}/${a.scorekaart.max}`}
              waarde_b={`${b.scorekaart.totaal}/${b.scorekaart.max}`}
            />
            <VergelijkRij
              label="Peildatum"
              waarde_a={formatDatum(a.meta.peildatum)}
              waarde_b={formatDatum(b.meta.peildatum)}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── Scorekaart per framework ───────────────────────────── */

function ScorekaartBlok({ a, b }: { a: Analyse; b: Analyse }) {
  const itemsA = a.scorekaart.items
  const itemsB = b.scorekaart.items

  // Verzamel alle unieke frameworks
  const frameworks = Array.from(
    new Set([...itemsA.map((i) => i.framework), ...itemsB.map((i) => i.framework)])
  )

  return (
    <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-bg-muted">
        <h2 className="text-sm font-semibold text-text-primary font-sans">Scorekaart</h2>
      </div>

      {/* Radar chart */}
      <div className="px-5 py-6">
        <ScoreRadar a={a} b={b} />
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto border-t border-border">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-2.5 text-xs text-text-muted font-medium">Framework</th>
              <th className="text-right px-5 py-2.5 text-xs text-text-muted font-medium">{a.meta.ticker}</th>
              <th className="text-right px-5 py-2.5 text-xs text-text-muted font-medium">{b.meta.ticker}</th>
            </tr>
          </thead>
          <tbody>
            {frameworks.map((fw) => {
              const scoreA = itemsA.find((i) => i.framework === fw)?.score
              const scoreB = itemsB.find((i) => i.framework === fw)?.score
              const max = itemsA.find((i) => i.framework === fw)?.max ?? itemsB.find((i) => i.framework === fw)?.max ?? 5
              return (
                <tr key={fw} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5 text-text-secondary text-xs">{fw}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">
                    <ScoreDot score={scoreA} max={max} />
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums">
                    <ScoreDot score={scoreB} max={max} />
                  </td>
                </tr>
              )
            })}
            <tr className="bg-bg-muted">
              <td className="px-5 py-2.5 text-text-primary text-xs font-semibold">Totaal</td>
              <td className="px-5 py-2.5 text-right text-xs font-semibold text-text-primary tabular-nums">
                {a.scorekaart.totaal}/{a.scorekaart.max}
              </td>
              <td className="px-5 py-2.5 text-right text-xs font-semibold text-text-primary tabular-nums">
                {b.scorekaart.totaal}/{b.scorekaart.max}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ScoreDot({ score, max }: { score?: number; max: number }) {
  if (score == null) return <span className="text-xs text-text-muted">—</span>
  const ratio = score / max
  const kleur = ratio >= 0.8 ? 'text-buy' : ratio >= 0.5 ? 'text-hold' : 'text-pass'
  return <span className={`text-xs font-semibold ${kleur}`}>{score}/{max}</span>
}

/* ─── Scenarios ──────────────────────────────────────────── */

function ScenariosBlok({ a, b }: { a: Analyse; b: Analyse }) {
  const scenariosA = a.executive_summary.fair_value_scenarios
  const scenariosB = b.executive_summary.fair_value_scenarios

  return (
    <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-bg-muted">
        <h2 className="text-sm font-semibold text-text-primary font-sans">Fair Value Scenarios</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <ScenarioKolom ticker={a.meta.ticker} valuta={a.meta.valuta} scenarios={scenariosA} />
        <ScenarioKolom ticker={b.meta.ticker} valuta={b.meta.valuta} scenarios={scenariosB} />
      </div>
    </div>
  )
}

function ScenarioKolom({
  ticker,
  valuta,
  scenarios,
}: {
  ticker: string
  valuta: string
  scenarios: { scenario: string; fair_value: number; upside_pct: number; kans_pct?: number | null }[]
}) {
  return (
    <div className="p-5">
      <p className="text-xs font-semibold text-text-muted font-sans mb-3">{ticker}</p>
      <div className="space-y-2">
        {scenarios.map((s) => (
          <div key={s.scenario} className="flex items-center justify-between text-xs font-sans">
            <span className="text-text-secondary">
              {s.scenario}
              {s.kans_pct != null && (
                <span className="text-text-muted ml-1">({s.kans_pct}%)</span>
              )}
            </span>
            <span className="tabular-nums font-medium text-text-primary">
              {formatKoers(s.fair_value, valuta)}{' '}
              <span className={s.upside_pct >= 0 ? 'text-buy' : 'text-pass'}>
                ({formatUpside(s.upside_pct)})
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Risico's & Kansen ──────────────────────────────────── */

function RisicosBlok({ a, b }: { a: Analyse; b: Analyse }) {
  return (
    <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-bg-muted">
        <h2 className="text-sm font-semibold text-text-primary font-sans">Grootste kans & risico</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <KansRisicoKolom
          ticker={a.meta.ticker}
          kans={a.executive_summary.grootste_kans}
          risico={a.executive_summary.grootste_risico}
        />
        <KansRisicoKolom
          ticker={b.meta.ticker}
          kans={b.executive_summary.grootste_kans}
          risico={b.executive_summary.grootste_risico}
        />
      </div>
    </div>
  )
}

function KansRisicoKolom({
  ticker,
  kans,
  risico,
}: {
  ticker: string
  kans: string
  risico: string
}) {
  return (
    <div className="p-5 space-y-4">
      <p className="text-xs font-semibold text-text-muted font-sans">{ticker}</p>
      <div>
        <p className="text-xs font-semibold text-buy font-sans mb-1">Grootste kans</p>
        <p className="text-xs text-text-secondary font-sans leading-relaxed">{kans}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-pass font-sans mb-1">Grootste risico</p>
        <p className="text-xs text-text-secondary font-sans leading-relaxed">{risico}</p>
      </div>
    </div>
  )
}

/* ─── Generieke vergelijkingsrij ─────────────────────────── */

function VergelijkRij({
  label,
  waarde_a,
  waarde_b,
}: {
  label: string
  waarde_a: React.ReactNode
  waarde_b: React.ReactNode
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-5 py-2.5 text-text-muted text-xs">{label}</td>
      <td className="px-5 py-2.5 text-right text-xs text-text-primary font-medium">{waarde_a}</td>
      <td className="px-5 py-2.5 text-right text-xs text-text-primary font-medium">{waarde_b}</td>
    </tr>
  )
}
