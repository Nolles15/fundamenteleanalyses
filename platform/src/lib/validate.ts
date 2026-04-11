/**
 * Validate JSON-analyse tegen het types.ts schema.
 *
 * Gebruik:
 *   npx tsx src/lib/validate.ts            # valideert alle JSONs
 *   npx tsx src/lib/validate.ts EDEN       # valideert alleen EDEN
 *
 * Output: lijst van ontbrekende/null velden per categorie met ernst-niveau.
 */

import fs from 'fs'
import path from 'path'

// ─── Veld-definities per sectie ────────────────────────────
// Ernst: 'kritiek' = moet altijd gevuld zijn
//        'verwacht' = zou er moeten zijn tenzij goede reden
//        'optioneel' = fijn als het er is

type Ernst = 'kritiek' | 'verwacht' | 'optioneel'

interface VeldCheck {
  pad: string
  ernst: Ernst
  label: string
}

const CHECKS: VeldCheck[] = [
  // ─── META ───
  { pad: 'meta.ticker',              ernst: 'kritiek',  label: 'Ticker' },
  { pad: 'meta.exchange',            ernst: 'kritiek',  label: 'Beurs' },
  { pad: 'meta.naam',                ernst: 'kritiek',  label: 'Bedrijfsnaam' },
  { pad: 'meta.sector',              ernst: 'kritiek',  label: 'Sector' },
  { pad: 'meta.koers',               ernst: 'kritiek',  label: 'Koers' },
  { pad: 'meta.valuta',              ernst: 'kritiek',  label: 'Valuta' },
  { pad: 'meta.peildatum',           ernst: 'kritiek',  label: 'Peildatum' },
  { pad: 'meta.industrie',           ernst: 'verwacht', label: 'Industrie' },
  { pad: 'meta.land',                ernst: 'verwacht', label: 'Land' },
  { pad: 'meta.marktkapitalisatie',  ernst: 'verwacht', label: 'Marktkapitalisatie (tekst)' },
  { pad: 'meta.marktkapitalisatie_mln', ernst: 'verwacht', label: 'Marktkapitalisatie (mln)' },
  { pad: 'meta.domein',              ernst: 'verwacht', label: 'Website domein' },
  { pad: 'meta.yahoo_symbol',        ernst: 'verwacht', label: 'Yahoo symbol (live koers)' },

  // ─── EXECUTIVE SUMMARY ───
  { pad: 'executive_summary.kernthese',        ernst: 'kritiek', label: 'Kernthese' },
  { pad: 'executive_summary.oordeel',          ernst: 'kritiek', label: 'Oordeel (KOOP/HOLD/PASS)' },
  { pad: 'executive_summary.fair_value_basis',  ernst: 'kritiek', label: 'Fair value basis' },
  { pad: 'executive_summary.upside_pct',        ernst: 'kritiek', label: 'Upside %' },
  { pad: 'executive_summary.fair_value_scenarios', ernst: 'kritiek', label: 'Fair value scenarios' },
  { pad: 'executive_summary.grootste_kans',     ernst: 'kritiek', label: 'Grootste kans' },
  { pad: 'executive_summary.grootste_risico',   ernst: 'kritiek', label: 'Grootste risico' },

  // ─── BEDRIJFSPROFIEL ───
  { pad: 'bedrijfsprofiel.beschrijving',         ernst: 'kritiek',  label: 'Beschrijving bedrijf' },
  { pad: 'bedrijfsprofiel.bedrijfsmodel',        ernst: 'verwacht', label: 'Bedrijfsmodel uitleg' },
  { pad: 'bedrijfsprofiel.geschiedenis',         ernst: 'verwacht', label: 'Geschiedenis' },
  { pad: 'bedrijfsprofiel.klantenprofiel',       ernst: 'verwacht', label: 'Klantenprofiel' },
  { pad: 'bedrijfsprofiel.segmenten',            ernst: 'kritiek',  label: 'Segmenten' },
  { pad: 'bedrijfsprofiel.aandeelhouders',       ernst: 'kritiek',  label: 'Aandeelhouders' },
  { pad: 'bedrijfsprofiel.geografische_spreiding', ernst: 'verwacht', label: 'Geografische spreiding' },
  { pad: 'bedrijfsprofiel.personeel',            ernst: 'verwacht', label: 'Aantal medewerkers' },
  { pad: 'bedrijfsprofiel.oprichtingsjaar',      ernst: 'verwacht', label: 'Oprichtingsjaar' },

  // ─── FINANCIEEL ───
  { pad: 'financieel.valuta_label',             ernst: 'kritiek',  label: 'Valuta label' },
  { pad: 'financieel.resultatenrekening',       ernst: 'kritiek',  label: 'Resultatenrekening' },
  { pad: 'financieel.kasstromen',               ernst: 'kritiek',  label: 'Kasstromen' },
  { pad: 'financieel.balans',                   ernst: 'kritiek',  label: 'Balans' },
  { pad: 'financieel.rendementsindicatoren',    ernst: 'kritiek',  label: 'Rendementsindicatoren' },
  { pad: 'financieel.waardering',               ernst: 'kritiek',  label: 'Waardering multiples' },
  { pad: 'financieel.toelichting_resultaten',   ernst: 'verwacht', label: 'Toelichting resultaten' },
  { pad: 'financieel.toelichting_kasstromen',   ernst: 'verwacht', label: 'Toelichting kasstromen' },
  { pad: 'financieel.toelichting_balans',       ernst: 'verwacht', label: 'Toelichting balans' },
  { pad: 'financieel.toelichting_rendement',    ernst: 'verwacht', label: 'Toelichting rendement' },
  { pad: 'financieel.toelichting_earnings_quality', ernst: 'verwacht', label: 'Toelichting earnings quality' },
  { pad: 'financieel.toelichting_waardering',   ernst: 'verwacht', label: 'Toelichting waardering' },
  { pad: 'financieel.dividend',                 ernst: 'verwacht', label: 'Dividend sectie' },
  { pad: 'financieel.accruals',                 ernst: 'verwacht', label: 'Accruals' },
  { pad: 'financieel.sector_kpis',              ernst: 'verwacht', label: 'Sector KPIs' },
  { pad: 'financieel.omzet_cagr_pct',           ernst: 'verwacht', label: 'Omzet CAGR %' },

  // ─── MOAT ───
  { pad: 'moat.oordeel',             ernst: 'kritiek',  label: 'Moat oordeel' },
  { pad: 'moat.toelichting',         ernst: 'kritiek',  label: 'Moat toelichting' },
  { pad: 'moat.categorieen',         ernst: 'kritiek',  label: 'Moat categorieën' },
  { pad: 'moat.duurzaamheid_horizon', ernst: 'verwacht', label: 'Moat duurzaamheid horizon' },
  { pad: 'moat.duurzaamheid_toelichting', ernst: 'verwacht', label: 'Moat duurzaamheid toelichting' },

  // ─── MANAGEMENT ───
  { pad: 'management.oordeel',              ernst: 'kritiek',  label: 'Management oordeel' },
  { pad: 'management.toelichting',           ernst: 'kritiek',  label: 'Management toelichting' },
  { pad: 'management.personen',              ernst: 'kritiek',  label: 'Sleutelpersonen' },
  { pad: 'management.capital_allocation',    ernst: 'kritiek',  label: 'Capital allocation' },
  { pad: 'management.compensatie',           ernst: 'verwacht', label: 'Compensatie' },
  { pad: 'management.insider_transactions',  ernst: 'verwacht', label: 'Insider transactions' },
  { pad: 'management.insider_netto',         ernst: 'verwacht', label: 'Insider netto' },
  { pad: 'management.integriteit',           ernst: 'verwacht', label: 'Integriteit' },
  { pad: 'management.capital_allocation_detail', ernst: 'verwacht', label: 'Capital allocation detail' },

  // ─── SECTOR & CONCURRENTIE ───
  { pad: 'sector_concurrentie',                              ernst: 'verwacht', label: 'Sector & concurrentie (geheel)' },
  { pad: 'sector_concurrentie.sectorprofiel',                ernst: 'verwacht', label: 'Sectorprofiel' },
  { pad: 'sector_concurrentie.sectorprofiel.toelichting',    ernst: 'verwacht', label: 'Sectorprofiel toelichting' },
  { pad: 'sector_concurrentie.porter',                       ernst: 'verwacht', label: 'Porter Five Forces' },
  { pad: 'sector_concurrentie.concurrenten',                 ernst: 'verwacht', label: 'Concurrenten' },
  { pad: 'sector_concurrentie.positie',                      ernst: 'verwacht', label: 'Concurrentiepositie' },
  { pad: 'sector_concurrentie.positie_toelichting',          ernst: 'verwacht', label: 'Concurrentiepositie toelichting' },

  // ─── ANALYSEFRAMEWORKS ───
  { pad: 'analyseframeworks',             ernst: 'verwacht', label: 'Analyseframeworks (geheel)' },
  { pad: 'analyseframeworks.graham',      ernst: 'verwacht', label: 'Graham framework' },
  { pad: 'analyseframeworks.buffett_munger', ernst: 'verwacht', label: 'Buffett/Munger framework' },
  { pad: 'analyseframeworks.lynch',       ernst: 'verwacht', label: 'Lynch framework' },
  { pad: 'analyseframeworks.fisher',      ernst: 'verwacht', label: 'Fisher framework' },
  { pad: 'analyseframeworks.greenblatt',  ernst: 'verwacht', label: 'Greenblatt framework' },

  // ─── RISICO'S ───
  { pad: 'risicos',            ernst: 'verwacht', label: "Risico's" },
  { pad: 'these_invalide_bij', ernst: 'verwacht', label: 'These-invalidatiecriteria' },

  // ─── ESG ───
  { pad: 'esg',                ernst: 'optioneel', label: 'ESG-analyse' },

  // ─── KATALYSATOREN ───
  { pad: 'katalysatoren',      ernst: 'verwacht', label: 'Katalysatoren' },

  // ─── FAIR VALUE ───
  { pad: 'fair_value.dcf',                    ernst: 'kritiek',  label: 'DCF-model' },
  { pad: 'fair_value.scenarios',               ernst: 'kritiek',  label: 'Fair value scenarios' },
  { pad: 'fair_value.valuta_kasstromen',       ernst: 'verwacht', label: 'Valuta kasstromen' },
  { pad: 'fair_value.dcf_toelichting',         ernst: 'verwacht', label: 'DCF toelichting' },
  { pad: 'fair_value.wacc',                    ernst: 'verwacht', label: 'WACC-opbouw' },
  { pad: 'fair_value.wacc.risicovrije_rente_type', ernst: 'verwacht', label: 'WACC: risicovrije rente type (spot/genormaliseerd)' },
  { pad: 'fair_value.wacc.beta_type',          ernst: 'verwacht', label: 'WACC: beta type (regressie/bottom_up)' },
  { pad: 'fair_value.dcf.fcf_definitie',       ernst: 'verwacht', label: 'DCF: FCF-definitie (FCFF/FCFE)' },
  { pad: 'fair_value.dcf.terminal_groei_consistentie', ernst: 'verwacht', label: 'DCF: terminal groei consistentie-check' },
  { pad: 'fair_value.methoden_toegepast',      ernst: 'verwacht', label: 'Methoden toegepast' },
  { pad: 'fair_value.reverse_dcf',             ernst: 'verwacht', label: 'Reverse DCF' },
  { pad: 'fair_value.gevoeligheid_fcf_groei',  ernst: 'verwacht', label: 'Gevoeligheidsanalyse' },
  { pad: 'fair_value.synthese',                ernst: 'verwacht', label: 'Fair value synthese' },
  { pad: 'fair_value.synthese_toelichting',    ernst: 'verwacht', label: 'Synthese toelichting' },

  // ─── SCOREKAART ───
  { pad: 'scorekaart.items',        ernst: 'kritiek', label: 'Scorekaart items' },
  { pad: 'scorekaart.totaal',       ernst: 'kritiek', label: 'Scorekaart totaal' },
  { pad: 'scorekaart.eindoordeel',  ernst: 'kritiek', label: 'Eindoordeel' },
  { pad: 'scorekaart.samenvatting', ernst: 'kritiek', label: 'Scorekaart samenvatting' },

  // ─── DATABRONNEN ───
  { pad: 'databronnen',                            ernst: 'verwacht', label: 'Databronnen' },
  { pad: 'databronnen.bronnen_geraadpleegd',        ernst: 'verwacht', label: 'Bronnen geraadpleegd' },
  { pad: 'bronnen',                                 ernst: 'verwacht', label: 'Bronnen met URLs' },
]

// ─── Jaarlijn-checks ──────────────────────────────────────
// Check hoeveel jaar data aanwezig is en of er gaten zitten

interface JaarlijnCheck {
  pad: string
  label: string
  minimumJaren: number
  velden: string[]
}

const JAARLIJN_CHECKS: JaarlijnCheck[] = [
  {
    pad: 'financieel.resultatenrekening',
    label: 'Resultatenrekening',
    minimumJaren: 8,
    velden: ['omzet', 'ebitda', 'nettowinst', 'eps'],
  },
  {
    pad: 'financieel.kasstromen',
    label: 'Kasstromen',
    minimumJaren: 5,
    velden: ['fcf'],
  },
  {
    pad: 'financieel.balans',
    label: 'Balans',
    minimumJaren: 3,
    velden: ['nettoschuld', 'eigen_vermogen', 'debt_ebitda'],
  },
  {
    pad: 'financieel.rendementsindicatoren',
    label: 'Rendementsindicatoren',
    minimumJaren: 5,
    velden: ['roic_pct'],
  },
]

// ─── Helpers ──────────────────────────────────────────────

function getNestedValue(obj: any, pad: string): any {
  const delen = pad.split('.')
  let huidige = obj
  for (const deel of delen) {
    if (huidige == null) return undefined
    huidige = huidige[deel]
  }
  return huidige
}

function isEmpty(val: any): boolean {
  if (val == null) return true
  if (Array.isArray(val) && val.length === 0) return true
  if (typeof val === 'string' && val.trim() === '') return true
  return false
}

// ─── Validatie-logica ─────────────────────────────────────

interface Bevinding {
  ernst: Ernst
  label: string
  detail: string
}

function valideer(data: any): Bevinding[] {
  const bevindingen: Bevinding[] = []

  // Veld-checks
  for (const check of CHECKS) {
    const waarde = getNestedValue(data, check.pad)
    if (isEmpty(waarde)) {
      bevindingen.push({
        ernst: check.ernst,
        label: check.label,
        detail: `${check.pad} is ${waarde === null ? 'null' : waarde === undefined ? 'ontbreekt' : 'leeg'}`,
      })
    }
  }

  // Jaarlijn-checks
  for (const check of JAARLIJN_CHECKS) {
    const arr = getNestedValue(data, check.pad)
    if (!Array.isArray(arr)) continue

    // Aantal jaren
    if (arr.length < check.minimumJaren) {
      bevindingen.push({
        ernst: 'verwacht',
        label: `${check.label}: te weinig jaren`,
        detail: `${arr.length} jaar aanwezig, minimum ${check.minimumJaren} verwacht`,
      })
    }

    // Check per jaar of kernvelden gevuld zijn
    for (const jaar of arr) {
      for (const veld of check.velden) {
        if (jaar[veld] == null) {
          bevindingen.push({
            ernst: 'verwacht',
            label: `${check.label} ${jaar.jaar}: ${veld} ontbreekt`,
            detail: `${check.pad}[${jaar.jaar}].${veld} is null`,
          })
        }
      }
    }
  }

  // WACC veldnamen-check (structuurprobleem)
  const wacc = getNestedValue(data, 'fair_value.wacc')
  if (wacc != null) {
    // Check of het de NL-veldnamen gebruikt (types.ts) of de EN-veldnamen (oud)
    const engelse = ['risk_free_rate_pct', 'equity_risk_premium_pct', 'beta', 'cost_of_debt_pct', 'debt_weight_pct']
    const gevonden = engelse.filter((e) => wacc[e] != null)
    if (gevonden.length > 0) {
      bevindingen.push({
        ernst: 'verwacht',
        label: 'WACC: Engelse veldnamen',
        detail: `Gebruik NL-namen uit types.ts: ${gevonden.join(', ')} → risicovrije_rente_pct, erp_pct, beta_adjusted, schuldkosten_na_belasting_pct, dv_gewicht_pct`,
      })
    }
  }

  // Sector KPIs formaat-check
  const kpis = getNestedValue(data, 'financieel.sector_kpis')
  if (Array.isArray(kpis) && kpis.length > 0) {
    const eersteKpi = kpis[0]
    if (eersteKpi.naam != null && eersteKpi.kpi_naam == null) {
      bevindingen.push({
        ernst: 'verwacht',
        label: 'Sector KPIs: oud formaat',
        detail: 'Gebruikt {naam, waarde, trend} i.p.v. {kpi_naam, eenheid, waarden: [{jaar, waarde}]}',
      })
    }
  }

  // Fair value synthese-check
  const synthese = getNestedValue(data, 'fair_value.synthese')
  if (synthese != null) {
    if (synthese.fair_value_gewogen != null && synthese.fair_value_bandbreedte_centraal == null) {
      bevindingen.push({
        ernst: 'verwacht',
        label: 'Fair Value Synthese: oud formaat',
        detail: 'Heeft fair_value_gewogen maar mist fair_value_bandbreedte_laag/centraal/hoog, margin_of_safety_vereist_pct, koopniveau',
      })
    }
  }

  // Concurrenten kwantitatieve data
  const concurrenten = getNestedValue(data, 'sector_concurrentie.concurrenten')
  if (Array.isArray(concurrenten)) {
    for (const c of concurrenten) {
      const kwant = ['omzet_groei_pct', 'ebit_marge_pct', 'roic_pct', 'ev_ebitda', 'p_fcf']
      const ontbrekend = kwant.filter((v) => c[v] == null)
      if (ontbrekend.length >= 4) {
        bevindingen.push({
          ernst: 'verwacht',
          label: `Concurrent ${c.naam}: geen kwantitatieve data`,
          detail: `Ontbreekt: ${ontbrekend.join(', ')}`,
        })
      }
    }
  }

  return bevindingen
}

// ─── CLI ──────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'src', 'content', 'data')

function main() {
  const targetTicker = process.argv[2]?.toUpperCase()

  const files = fs.readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'index.json')
    .filter((f) => !targetTicker || f === `${targetTicker}.json`)

  if (files.length === 0) {
    console.log(targetTicker ? `Geen JSON gevonden voor ${targetTicker}` : 'Geen JSON bestanden gevonden')
    process.exit(1)
  }

  let totaalKritiek = 0
  let totaalVerwacht = 0

  for (const file of files) {
    const ticker = file.replace('.json', '')
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'))
    const bevindingen = valideer(data)

    const kritiek = bevindingen.filter((b) => b.ernst === 'kritiek')
    const verwacht = bevindingen.filter((b) => b.ernst === 'verwacht')
    const optioneel = bevindingen.filter((b) => b.ernst === 'optioneel')

    totaalKritiek += kritiek.length
    totaalVerwacht += verwacht.length

    if (bevindingen.length === 0) {
      console.log(`\n✅ ${ticker} — geen issues gevonden`)
      continue
    }

    console.log(`\n${'═'.repeat(60)}`)
    console.log(`  ${ticker} — ${kritiek.length} kritiek, ${verwacht.length} verwacht, ${optioneel.length} optioneel`)
    console.log(`${'═'.repeat(60)}`)

    if (kritiek.length > 0) {
      console.log('\n  🔴 KRITIEK (moet altijd gevuld zijn):')
      for (const b of kritiek) {
        console.log(`     • ${b.label}`)
        console.log(`       ${b.detail}`)
      }
    }

    if (verwacht.length > 0) {
      console.log('\n  🟡 VERWACHT (zou er moeten zijn):')
      for (const b of verwacht) {
        console.log(`     • ${b.label}`)
        console.log(`       ${b.detail}`)
      }
    }

    if (optioneel.length > 0) {
      console.log('\n  ⚪ OPTIONEEL:')
      for (const b of optioneel) {
        console.log(`     • ${b.label}`)
      }
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  TOTAAL: ${totaalKritiek} kritieke issues, ${totaalVerwacht} verwachte issues`)
  console.log(`${'─'.repeat(60)}\n`)

  if (totaalKritiek > 0) process.exit(1)
}

main()
