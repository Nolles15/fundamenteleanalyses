import { SectionHeading } from '@/components/ui/section-heading'
import type {
  Analyse,
  FairValue,
  WACCOpbouw,
  DCFInputs,
  DCFProjectieJaar,
  Gevoeligheid,
  ReverseDCF,
  EPV,
  DDM,
  SOTP,
  FairValueSynthese,
  Scenario,
} from '@/lib/types'
import { PaywallGate } from '@/components/analyse/paywall-gate'
import { formatKoers, formatGetal } from '@/lib/utils'
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  analyse: Analyse
}

export function SectWaardering({ analyse }: Props) {
  return (
    <PaywallGate
      access="full"
      ticker={analyse.meta.ticker}
      description="WACC-opbouw, DCF-model, scenariomatrix, gevoeligheidsanalyse en fair value synthese."
    >
      <WaarderingContent analyse={analyse} />
    </PaywallGate>
  )
}

function WaarderingContent({ analyse }: Props) {
  const fv = analyse.fair_value
  const es = analyse.executive_summary
  const valuta = es.valuta
  const koers = analyse.meta.koers
  const positief = es.upside_pct >= 0

  return (
    <div className="space-y-8">
      {/* Intro */}
      <p className="text-sm text-text-secondary font-sans leading-relaxed">
        Om de fair value te bepalen combineren we meerdere waarderingsmethoden. Het uitgangspunt is een{' '}
        <strong>DCF-model</strong> (Discounted Cash Flow): we schatten de toekomstige kasstromen en rekenen die
        terug naar wat ze vandaag waard zijn. Daarnaast gebruiken we onder andere scenario-analyse,
        gevoeligheidsanalyse en — waar relevant — een EPV (no-growth waardering) en reverse DCF.
        Hieronder vind je per stap de aannames en onderbouwing.
      </p>

      {/* Hero: Fair Value overzicht */}
      <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-text-muted font-sans mb-1 uppercase tracking-wide">
              Huidige koers
            </p>
            <p className="text-xl font-bold text-text-primary font-sans tabular-nums">
              {formatKoers(koers, valuta)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted font-sans mb-1 uppercase tracking-wide">
              Fair value (basis)
            </p>
            <p className="text-xl font-bold text-accent font-sans tabular-nums">
              {formatKoers(es.fair_value_basis, valuta)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted font-sans mb-1 uppercase tracking-wide">
              Upside / downside
            </p>
            <p className={`text-xl font-bold font-sans tabular-nums ${positief ? 'text-buy' : 'text-pass'}`}>
              {positief ? '+' : ''}{formatGetal(es.upside_pct)}%
            </p>
          </div>
        </div>

        {es.fair_value_kansgewogen != null && (
          <div className="flex items-center justify-between pt-3 border-t border-accent/10">
            <p className="text-xs text-text-secondary font-sans">Kansgewogen fair value</p>
            <p className="text-sm font-bold text-accent font-sans tabular-nums">
              {formatKoers(es.fair_value_kansgewogen, valuta)}
            </p>
          </div>
        )}
      </div>

      {/* Methoden overzicht */}
      {fv.methoden_toegepast != null && fv.methoden_toegepast.length > 0 && (
        <div className="bg-bg-surface rounded-xl border border-border p-5">
          <p className="text-xs text-text-muted font-sans mb-2 uppercase tracking-wide">
            Toegepaste methoden
          </p>
          <div className="flex flex-wrap gap-2">
            {fv.methoden_toegepast.map((m) => (
              <span
                key={m}
                className="text-xs font-medium bg-accent-light text-accent px-2.5 py-1 rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
          {fv.methoden_niet_toegepast != null && fv.methoden_niet_toegepast.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-text-muted font-sans mb-1">Niet toegepast:</p>
              {fv.methoden_niet_toegepast.map((m) => (
                <p key={m.methode} className="text-xs text-text-secondary font-sans">
                  {m.methode}{m.reden ? ` — ${m.reden}` : ''}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WACC */}
      {fv.wacc != null && <WACCBlok wacc={fv.wacc} />}

      {/* DCF Inputs */}
      <DCFBlok dcf={fv.dcf} valuta={valuta} valutaKasstromen={fv.valuta_kasstromen} toelichting={fv.dcf_toelichting} />

      {/* Illiquiditeitskorting */}
      {fv.wacc?.illiquiditeitskorting_pct != null && es.fair_value_basis != null && (
        <div className="bg-bg-surface rounded-xl border border-border p-5">
          <p className="text-xs text-text-muted font-sans mb-2 uppercase tracking-wide">
            Illiquiditeitskorting
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary font-sans">
              Korting: {formatGetal(fv.wacc.illiquiditeitskorting_pct)}%
            </p>
            <p className="text-sm font-bold text-accent font-sans tabular-nums">
              Fair value na korting: {formatKoers(es.fair_value_basis * (1 - fv.wacc.illiquiditeitskorting_pct / 100), valuta)}
            </p>
          </div>
        </div>
      )}

      {/* Projectie */}
      {fv.projectie != null && fv.projectie.length > 0 && (
        <ProjectieBlok projectie={fv.projectie} valuta={valuta} />
      )}

      {/* Scenarios */}
      {fv.scenarios.length > 0 && (
        <ScenariosBlok scenarios={fv.scenarios} valuta={valuta} kansgewogen={fv.kansgewogen_fair_value} />
      )}

      {/* Gevoeligheid FCF groei */}
      {(fv.gevoeligheid_fcf_groei ?? (fv as any).gevoeligheid) != null && (
        <GevoeligheidBlok
          titel="Gevoeligheid — FCF-groei vs WACC"
          data={(fv.gevoeligheid_fcf_groei ?? (fv as any).gevoeligheid)!}
          rijLabel="FCF groei"
          valuta={valuta}
        />
      )}

      {/* Gevoeligheid terminal */}
      {fv.gevoeligheid_terminal != null && (
        <GevoeligheidBlok
          titel="Gevoeligheid — Terminal groei vs WACC"
          data={fv.gevoeligheid_terminal}
          rijLabel="Terminal groei"
          valuta={valuta}
        />
      )}

      {/* Reverse DCF */}
      {fv.reverse_dcf != null && <ReverseDCFBlok data={fv.reverse_dcf} />}

      {/* EPV */}
      {fv.epv != null && <EPVBlok data={fv.epv} valuta={valuta} />}

      {/* DDM */}
      {fv.ddm != null && fv.ddm.uitgevoerd && <DDMBlok data={fv.ddm} valuta={valuta} />}

      {/* SOTP */}
      {fv.sotp != null && fv.sotp.uitgevoerd && <SOTPBlok data={fv.sotp} valuta={valuta} />}

      {/* Synthese */}
      {fv.synthese != null && <SyntheseBlok data={fv.synthese} valuta={valuta} koers={analyse.meta.koers} />}

      {/* Synthese toelichting */}
      {fv.synthese_toelichting && (
        <div className="bg-bg-muted rounded-lg px-4 py-3">
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            {fv.synthese_toelichting}
          </p>
        </div>
      )}

      {/* Methode toelichting */}
      {fv.toelichting_methode && (
        <div className="bg-bg-muted rounded-lg px-4 py-3">
          <p className="text-xs font-semibold text-text-muted font-sans uppercase tracking-wide mb-1">
            Toelichting methodologie
          </p>
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            {fv.toelichting_methode}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── WACC ─────────────────────────────────────────────── */

function WACCBlok({ wacc }: { wacc: WACCOpbouw }) {
  // Backward-compat: sommige JSONs gebruiken Engelse veldnamen
  const w = wacc as any
  const rfr = wacc.risicovrije_rente_pct ?? w.risk_free_rate_pct
  const erp = wacc.erp_pct ?? w.equity_risk_premium_pct
  const beta = wacc.beta_adjusted ?? w.beta
  const coe = wacc.cost_of_equity_pct ?? w.cost_of_equity_pct
  const cod = wacc.schuldkosten_na_belasting_pct ?? w.cost_of_debt_pct
  const evGewicht = wacc.ev_gewicht_pct ?? (w.debt_weight_pct != null ? 100 - w.debt_weight_pct : undefined)
  const dvGewicht = wacc.dv_gewicht_pct ?? w.debt_weight_pct

  const rijen: { label: string; waarde: string; bron?: string; badge?: string }[] = []
  if (rfr != null) rijen.push({ label: 'Risicovrije rente', waarde: `${formatGetal(rfr)}%`, bron: wacc.risicovrije_rente_bron, badge: wacc.risicovrije_rente_type ?? undefined })
  if (erp != null) rijen.push({ label: 'Equity Risk Premium', waarde: `${formatGetal(erp)}%`, bron: wacc.erp_bron })
  if (beta != null) rijen.push({ label: 'Beta (adjusted)', waarde: formatGetal(beta, 2), bron: wacc.beta_bron, badge: wacc.beta_type ?? undefined })
  if (wacc.country_risk_premium_pct != null) {
    rijen.push({ label: 'Country Risk Premium', waarde: `${formatGetal(wacc.country_risk_premium_pct)}%` })
  }
  if (wacc.size_premium_pct != null) {
    rijen.push({ label: 'Size Premium', waarde: `${formatGetal(wacc.size_premium_pct)}%` })
  }
  if (coe != null) rijen.push({ label: 'Cost of Equity', waarde: `${formatGetal(coe)}%` })
  if (cod != null) rijen.push({ label: 'Schuldkosten na belasting', waarde: `${formatGetal(cod)}%` })
  if (evGewicht != null) rijen.push({ label: 'EV-gewicht', waarde: `${formatGetal(evGewicht)}%` })
  if (dvGewicht != null) rijen.push({ label: 'DV-gewicht', waarde: `${formatGetal(dvGewicht)}%` })

  return (
    <div>
      <SectionHeading title="WACC-opbouw" />
      <p className="text-xs text-text-muted font-sans mb-3 -mt-1">
        De WACC (Weighted Average Cost of Capital) is de disconteringsvoet waarmee toekomstige kasstromen
        worden teruggerekend. Hoe hoger het risico, hoe hoger de WACC en hoe lager de berekende fair value.
      </p>
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm font-sans">
          <tbody>
            {rijen.map((r) => (
              <tr key={r.label} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2.5 text-text-secondary text-xs">
                  {r.label}
                  {r.bron && <span className="text-text-muted ml-1">({r.bron})</span>}
                  {r.badge && (
                    <span className="ml-1.5 text-[10px] font-medium bg-bg-muted text-text-muted px-1.5 py-0.5 rounded">
                      {r.badge}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-text-primary tabular-nums text-xs">
                  {r.waarde}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-bg-muted">
              <td className="px-4 py-3 font-semibold text-text-primary text-sm">WACC</td>
              <td className="px-4 py-3 text-right font-bold text-accent text-sm tabular-nums">
                {formatGetal(wacc.wacc_pct)}%
              </td>
            </tr>
          </tfoot>
        </table>
        {wacc.sector_wacc_pct != null && (
          <div className="px-4 py-2 border-t border-border">
            <p className="text-xs text-text-muted font-sans">
              Sector WACC: {formatGetal(wacc.sector_wacc_pct)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── DCF Inputs ───────────────────────────────────────── */

function DCFBlok({ dcf, valuta, valutaKasstromen, toelichting }: { dcf: DCFInputs; valuta: string; valutaKasstromen?: string; toelichting?: string }) {
  const nettoschuld = dcf.nettoschuld_huidig
  const nettokasLabel = nettoschuld != null && nettoschuld < 0 ? 'Nettokaspositie' : 'Nettoschuld'
  const nettokasHint = nettoschuld != null && nettoschuld < 0
    ? 'Meer kas dan schuld — wordt opgeteld bij de waarde'
    : 'Schuld minus kas — wordt afgetrokken van de ondernemingswaarde'

  return (
    <div>
      <SectionHeading title="DCF-model" />
      <p className="text-xs text-text-muted font-sans mb-3 -mt-1">
        Het DCF-model schat de toekomstige vrije kasstromen en rekent ze terug naar de waarde van vandaag
        met een disconteringsvoet (WACC). Hoe hoger de verwachte groei en hoe lager de WACC, hoe hoger de fair value.
      </p>
      <div className="bg-bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Calculator size={16} className="text-accent" />
          {dcf.model_type && (
            <span className="text-xs font-medium bg-bg-muted text-text-secondary px-2 py-0.5 rounded">
              {dcf.model_type}
            </span>
          )}
          {dcf.fcf_definitie && (
            <span className="text-xs font-medium bg-accent-light text-accent px-2 py-0.5 rounded">
              {dcf.fcf_definitie === 'FCFF' ? 'FCFF — kasstroom voor alle vermogensverschaffers' : dcf.fcf_definitie}
            </span>
          )}
          {valutaKasstromen && (
            <span className="text-xs font-medium bg-accent-light text-accent px-2 py-0.5 rounded">
              DCF in {valutaKasstromen}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
          <MiniStat
            label="Basis FCF"
            waarde={formatKoers(dcf.basis_fcf, valuta)}
            hint={dcf.fcf_type ?? 'Startpunt vrije kasstroom voor het model'}
          />
          {dcf.basis_fcf_na_sbc != null && (
            <MiniStat
              label="Basis FCF na SBC"
              waarde={formatKoers(dcf.basis_fcf_na_sbc, valuta)}
              hint="Gecorrigeerd voor aandelencompensatie"
            />
          )}
          <MiniStat
            label="Groei fase 1"
            waarde={`${formatGetal(dcf.groei_fase1_pct)}%`}
            hint="Verwachte jaarlijkse groei in de eerste 5 jaar"
          />
          {dcf.groei_fase2_pct != null && (
            <MiniStat
              label="Groei fase 2"
              waarde={`${formatGetal(dcf.groei_fase2_pct)}%`}
              hint="Vertragende groei in jaar 6-10"
            />
          )}
          <MiniStat
            label="Terminal groei"
            waarde={`${formatGetal(dcf.terminal_groei_pct)}%`}
            hint="Eeuwigdurende groei na de projectieperiode"
          />
          {dcf.wacc_pct != null && (
            <MiniStat
              label="WACC"
              waarde={`${formatGetal(dcf.wacc_pct)}%`}
              hint="Disconteringsvoet (zie WACC-opbouw hierboven)"
            />
          )}
          {dcf.shares_outstanding_mln != null && (
            <MiniStat
              label="Aandelen uitstaand"
              waarde={`${formatGetal(dcf.shares_outstanding_mln, 1)} mln`}
              hint="Totaal om van bedrijfswaarde naar waarde per aandeel te komen"
            />
          )}
          {nettoschuld != null && (
            <MiniStat
              label={nettokasLabel}
              waarde={formatKoers(Math.abs(nettoschuld), valuta)}
              hint={nettokasHint}
            />
          )}
        </div>

        {/* Terminal value details */}
        {(dcf.terminal_value_pct_van_totaal != null || dcf.terminal_methode != null) && (
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-text-muted font-sans mb-1 uppercase tracking-wide">
              Terminal Value
            </p>
            <p className="text-[11px] text-text-muted font-sans mb-3 leading-snug">
              De geschatte waarde van alle kasstromen na de projectieperiode. Vaak het grootste deel van de totale waarde.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
              {dcf.terminal_methode && (
                <MiniStat label="Methode" waarde={dcf.terminal_methode} />
              )}
              {dcf.terminal_value_pct_van_totaal != null && (
                <MiniStat
                  label="% van totale waarde"
                  waarde={`${formatGetal(dcf.terminal_value_pct_van_totaal)}%`}
                  hint={dcf.terminal_value_pct_van_totaal > 75 ? 'Relatief hoog — model is gevoelig voor terminal aannames' : undefined}
                />
              )}
              {dcf.exit_multiple_gebruikt != null && (
                <MiniStat
                  label="Exit multiple"
                  waarde={`${formatGetal(dcf.exit_multiple_gebruikt, 1)}x`}
                  hint={dcf.exit_multiple_bron ?? 'Veronderstelde waardering aan het einde van de projectieperiode'}
                />
              )}
              {dcf.mid_year_convention != null && (
                <MiniStat
                  label="Mid-year convention"
                  waarde={dcf.mid_year_convention ? 'Ja' : 'Nee'}
                  hint="Kasstromen vallen halverwege het jaar i.p.v. aan het einde"
                />
              )}
              {dcf.terminal_implied_ev_ebitda != null && (
                <MiniStat
                  label="Impliciete EV/EBITDA"
                  waarde={`${formatGetal(dcf.terminal_implied_ev_ebitda, 1)}x`}
                  hint="Waardering die de terminal value impliceert — sanity check"
                />
              )}
            </div>
            {dcf.terminal_groei_consistentie && (
              <p className="text-xs text-text-secondary font-sans leading-relaxed mt-3 pt-3 border-t border-border">
                {dcf.terminal_groei_consistentie}
              </p>
            )}
          </div>
        )}

        {/* DCF toelichting — onderbouwing van keuzes */}
        {toelichting && (
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-text-muted font-sans uppercase tracking-wide mb-1">
              Onderbouwing
            </p>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              {toelichting}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Projectie ────────────────────────────────────────── */

function ProjectieBlok({ projectie, valuta }: { projectie: DCFProjectieJaar[]; valuta: string }) {
  return (
    <div>
      <SectionHeading title="DCF-projectie" />
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">
                  Jaar
                </th>
                {projectie[0]?.omzet != null && (
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">
                    Omzet
                  </th>
                )}
                {projectie[0]?.omzet_groei_pct != null && (
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">
                    Groei %
                  </th>
                )}
                {projectie[0]?.ebit_marge_pct != null && (
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">
                    EBIT marge
                  </th>
                )}
                {projectie[0]?.fcf != null && (
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">
                    FCF
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {projectie.map((j, i) => (
                <tr key={j.jaar} className={i < projectie.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-3 py-2 font-medium text-text-primary">{j.jaar}</td>
                  {projectie[0]?.omzet != null && (
                    <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                      {j.omzet != null ? j.omzet.toLocaleString('nl-NL') : '—'}
                    </td>
                  )}
                  {projectie[0]?.omzet_groei_pct != null && (
                    <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                      {j.omzet_groei_pct != null ? `${formatGetal(j.omzet_groei_pct)}%` : '—'}
                    </td>
                  )}
                  {projectie[0]?.ebit_marge_pct != null && (
                    <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                      {j.ebit_marge_pct != null ? `${formatGetal(j.ebit_marge_pct)}%` : '—'}
                    </td>
                  )}
                  {projectie[0]?.fcf != null && (
                    <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                      {j.fcf != null ? j.fcf.toLocaleString('nl-NL') : '—'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Scenarios ────────────────────────────────────────── */

function ScenariosBlok({
  scenarios,
  valuta,
  kansgewogen,
}: {
  scenarios: Scenario[]
  valuta: string
  kansgewogen?: number
}) {
  return (
    <div>
      <SectionHeading title="Scenario's" />
      <p className="text-xs text-text-muted font-sans mb-3 -mt-1">
        Drie scenario's met verschillende groeiaannames laten zien hoe gevoelig de fair value is
        voor de toekomstverwachting. De kansweging bepaalt de gecombineerde fair value.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map((s) => {
          const positief = s.upside_pct >= 0
          return (
            <div key={s.scenario} className="bg-bg-surface rounded-xl border border-border p-4">
              <p className="text-xs font-medium text-text-muted font-sans mb-2 uppercase tracking-wide">
                {s.scenario}
              </p>
              <p className="text-xl font-bold text-text-primary font-sans tabular-nums mb-1">
                {formatKoers(s.fair_value, valuta)}
              </p>
              <p className={`text-sm font-semibold font-sans tabular-nums ${positief ? 'text-buy' : 'text-pass'}`}>
                {positief ? '+' : ''}{formatGetal(s.upside_pct)}%
              </p>
              {(s.fcf_groei_pct != null || s.wacc_pct != null || s.kans_pct != null) && (
                <div className="flex flex-wrap gap-x-3 mt-2 text-xs text-text-muted font-sans">
                  {s.fcf_groei_pct != null && <span>FCF-groei: {s.fcf_groei_pct > 0 ? '+' : ''}{s.fcf_groei_pct}%</span>}
                  {s.wacc_pct != null && <span>WACC: {s.wacc_pct}%</span>}
                  {s.kans_pct != null && <span>Kans: {s.kans_pct}%</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {kansgewogen != null && (
        <div className="mt-3 bg-accent-light rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-xs font-medium text-accent font-sans">Kansgewogen fair value</p>
          <p className="text-sm font-bold text-accent font-sans tabular-nums">
            {formatKoers(kansgewogen, valuta)}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Gevoeligheid ─────────────────────────────────────── */

function GevoeligheidBlok({
  titel,
  data,
  rijLabel,
  valuta,
}: {
  titel: string
  data: Gevoeligheid
  rijLabel: string
  valuta: string
}) {
  const rijWaarden = data.groei_range ?? data.terminal_groei_range ?? []

  if (rijWaarden.length === 0 || data.wacc_range.length === 0 || data.matrix.length === 0) {
    return null
  }

  return (
    <div>
      <SectionHeading title={titel} />
      <p className="text-xs text-text-muted font-sans mb-3 -mt-1">
        Elke cel toont de fair value bij een combinatie van groei en WACC. Zo zie je hoe gevoelig het resultaat is voor kleine veranderingen in de aannames.
      </p>
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="px-3 py-2.5 text-left font-semibold text-text-muted uppercase tracking-wide">
                  {rijLabel} \ WACC
                </th>
                {data.wacc_range.map((w) => (
                  <th key={w} className="px-3 py-2.5 text-right font-semibold text-text-muted tabular-nums">
                    {formatGetal(w)}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.matrix.map((rij, i) => (
                <tr key={i} className={i < data.matrix.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-3 py-2 font-medium text-text-primary tabular-nums">
                    {rijWaarden[i] != null ? `${formatGetal(rijWaarden[i])}%` : `Rij ${i + 1}`}
                  </td>
                  {rij.map((cel, j) => (
                    <td key={j} className="px-3 py-2 text-right tabular-nums text-text-secondary">
                      {formatKoers(cel, valuta)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Reverse DCF ──────────────────────────────────────── */

function ReverseDCFBlok({ data }: { data: ReverseDCF }) {
  return (
    <div>
      <SectionHeading title="Reverse DCF" />
      <p className="text-xs text-text-muted font-sans mb-3 -mt-1">
        In plaats van een fair value te berekenen, draait een reverse DCF de vraag om: welke groei verwacht de markt bij de huidige koers?
        Hoe lager de ingeprijsde groei ten opzichte van de werkelijke groei, hoe groter de mogelijke onderwaardering.
      </p>
      <div className="bg-bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-text-muted font-sans mb-0.5">
              Impliciete groei (ingeprijsd door markt)
            </p>
            <p className="text-lg font-bold text-text-primary font-sans tabular-nums">
              {data.impliciete_groei_pct > 0 ? '+' : ''}{formatGetal(data.impliciete_groei_pct)}%
            </p>
          </div>
          {data.impliciete_groei_pct >= 0 ? (
            <TrendingUp size={20} className="text-hold shrink-0" />
          ) : (
            <TrendingDown size={20} className="text-pass shrink-0" />
          )}
        </div>

        {(data.historische_fcf_cagr_pct != null || data.consensus_groei_pct != null) && (
          <div className="flex flex-wrap gap-4 mb-3">
            {data.historische_fcf_cagr_pct != null && (
              <MiniStat label="Historische FCF CAGR" waarde={`${formatGetal(data.historische_fcf_cagr_pct)}%`} />
            )}
            {data.consensus_groei_pct != null && (
              <MiniStat label="Consensus groei" waarde={`${formatGetal(data.consensus_groei_pct)}%`} />
            )}
          </div>
        )}

        <p className="text-xs text-text-secondary font-sans leading-relaxed">
          {data.interpretatie}
        </p>
      </div>
    </div>
  )
}

/* ─── EPV ──────────────────────────────────────────────── */

function EPVBlok({ data, valuta }: { data: EPV; valuta: string }) {
  return (
    <div>
      <SectionHeading title="Earnings Power Value (EPV)" />
      <p className="text-xs text-text-muted font-sans mb-3 -mt-1">
        EPV berekent wat het bedrijf waard is op basis van de huidige winstcapaciteit, zonder toekomstige groei mee te rekenen.
        Als de EPV al boven de koers ligt, betaal je effectief niets voor groei.
      </p>
      <div className="bg-bg-surface rounded-xl border border-border p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <MiniStat label="Genorm. EBIT-marge" waarde={`${formatGetal(data.genormaliseerde_ebit_marge_pct)}%`} />
          <MiniStat label="Genorm. NOPAT" waarde={formatKoers(data.genormaliseerde_nopat, valuta)} />
          <MiniStat label="Maintenance capex" waarde={formatKoers(data.maintenance_capex, valuta)} />
          <MiniStat label="Adj. Earnings Power" waarde={formatKoers(data.adjusted_earnings_power, valuta)} />
          <MiniStat label="EPV per aandeel" waarde={formatKoers(data.epv_per_aandeel, valuta)} />
          <MiniStat label="Groeipremie" waarde={`${formatGetal(data.groeipremie_pct)}%`} />
        </div>
      </div>
    </div>
  )
}

/* ─── DDM ──────────────────────────────────────────────── */

function DDMBlok({ data, valuta }: { data: DDM; valuta: string }) {
  return (
    <div>
      <SectionHeading title="Dividend Discount Model (DDM)" />
      <div className="bg-bg-surface rounded-xl border border-border p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.model && <MiniStat label="Model" waarde={data.model} />}
          {data.dps_verwacht != null && (
            <MiniStat label="DPS verwacht" waarde={formatKoers(data.dps_verwacht, valuta)} />
          )}
          {data.cost_of_equity_pct != null && (
            <MiniStat label="Cost of Equity" waarde={`${formatGetal(data.cost_of_equity_pct)}%`} />
          )}
          {data.dividendgroei_pct != null && (
            <MiniStat label="Dividendgroei" waarde={`${formatGetal(data.dividendgroei_pct)}%`} />
          )}
          {data.ddm_fair_value != null && (
            <MiniStat label="DDM Fair Value" waarde={formatKoers(data.ddm_fair_value, valuta)} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── SOTP ─────────────────────────────────────────────── */

function SOTPBlok({ data, valuta }: { data: SOTP; valuta: string }) {
  return (
    <div>
      <SectionHeading title="Sum-of-the-Parts (SOTP)" />
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        {data.segmenten != null && data.segmenten.length > 0 && (
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Segment
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Methode
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Waarde
                </th>
              </tr>
            </thead>
            <tbody>
              {data.segmenten.map((s, i) => (
                <tr key={s.naam} className={i < data.segmenten!.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-4 py-3 font-medium text-text-primary">{s.naam}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{s.methode}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                    {formatKoers(s.waarde, valuta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {(data.sotp_fair_value != null || data.conglomeraatkorting_pct != null) && (
          <div className="px-4 py-3 bg-bg-muted flex items-center justify-between border-t border-border">
            <div>
              {data.conglomeraatkorting_pct != null && (
                <p className="text-xs text-text-muted font-sans">
                  Conglomeraatkorting: {formatGetal(data.conglomeraatkorting_pct)}%
                </p>
              )}
            </div>
            {data.sotp_fair_value != null && (
              <p className="text-sm font-bold text-accent font-sans tabular-nums">
                SOTP: {formatKoers(data.sotp_fair_value, valuta)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Synthese ─────────────────────────────────────────── */

function SyntheseBlok({ data, valuta, koers }: { data: FairValueSynthese; valuta: string; koers: number }) {
  const heeftBandbreedte =
    data.fair_value_bandbreedte_laag != null &&
    data.fair_value_bandbreedte_centraal != null &&
    data.fair_value_bandbreedte_hoog != null

  return (
    <div>
      <SectionHeading title="Fair Value Synthese" />
      <p className="text-xs text-text-muted font-sans mb-3 -mt-1">
        De synthese combineert alle methoden tot een bandbreedte. Het koopniveau houdt rekening met
        een margin of safety — de buffer voor onzekerheid in de aannames.
      </p>
      <div className="bg-bg-surface rounded-xl border border-border p-5">
        {/* Bandbreedte visueel */}
        {heeftBandbreedte && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-text-muted font-sans mb-2">
              <span>{formatKoers(data.fair_value_bandbreedte_laag, valuta)}</span>
              <span className="font-semibold text-accent">
                {formatKoers(data.fair_value_bandbreedte_centraal, valuta)}
              </span>
              <span>{formatKoers(data.fair_value_bandbreedte_hoog, valuta)}</span>
            </div>
            <div className="relative h-3 bg-bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pass/30 via-hold/30 to-buy/30 rounded-full" />
              {/* Koers marker */}
              <div
                className="absolute top-0 h-full w-0.5 bg-text-primary"
                style={{
                  left: `${Math.min(Math.max(((koers - data.fair_value_bandbreedte_laag!) / (data.fair_value_bandbreedte_hoog! - data.fair_value_bandbreedte_laag!)) * 100, 0), 100)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-text-muted font-sans">Bear</span>
              <span className="text-xs text-text-muted font-sans">
                Koers: {formatKoers(koers, valuta)}
              </span>
              <span className="text-xs text-text-muted font-sans">Bull</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {data.margin_of_safety_vereist_pct != null && (
            <MiniStat label="Margin of Safety vereist" waarde={`${formatGetal(data.margin_of_safety_vereist_pct)}%`} />
          )}
          {data.koopniveau != null && (
            <MiniStat label="Koopniveau" waarde={formatKoers(data.koopniveau, valuta)} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Helpers ──────────────────────────────────────────── */

function MiniStat({ label, waarde, hint }: { label: string; waarde: string; hint?: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted font-sans mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-text-primary font-sans tabular-nums">
        {waarde}
      </p>
      {hint && (
        <p className="text-[11px] text-text-muted font-sans mt-0.5 leading-snug">{hint}</p>
      )}
    </div>
  )
}
