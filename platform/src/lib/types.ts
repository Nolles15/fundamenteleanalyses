// ─── TOPLEVEL ─────────────────────────────────────────────

export interface Analyse {
  meta: Meta
  executive_summary: ExecutiveSummary
  bedrijfsprofiel: Bedrijfsprofiel
  financieel: Financieel
  moat: Moat
  management: Management
  sector_concurrentie?: SectorConcurrentie
  analyseframeworks?: AnalyseFrameworks
  risicos?: Risico[]
  these_invalide_bij?: string
  esg?: ESG
  katalysatoren?: Katalysator[]
  fair_value: FairValue
  scorekaart: Scorekaart
  databronnen?: Databronnen
  bronnen?: Bron[]
  update_historie?: UpdateHistorie[]
  data_kwaliteit?: DataKwaliteit
}

// ─── META ─────────────────────────────────────────────────

export interface Meta {
  ticker: string
  exchange: string
  naam: string
  sector: string
  industrie?: string
  land?: string
  koers: number
  valuta: string
  peildatum: string
  marktkapitalisatie?: string
  marktkapitalisatie_mln?: number | null
  free_float_pct?: number | null
  index_lidmaatschap?: string | null
  domein?: string
  yahoo_symbol?: string
}

// ─── EXECUTIVE SUMMARY ───────────────────────────────────

export interface ExecutiveSummary {
  kernthese: string
  oordeel: 'KOOP' | 'HOLD' | 'PASS'
  koers: number
  valuta: string
  fair_value_basis: number
  fair_value_kansgewogen?: number
  epv_per_aandeel?: number
  upside_pct: number
  fair_value_scenarios: Scenario[]
  reverse_dcf_impliciete_groei_pct?: number
  grootste_kans: string
  grootste_risico: string
}

export interface Scenario {
  scenario: string
  fair_value: number
  upside_pct: number
  fcf_groei_pct?: number
  wacc_pct?: number
  kans_pct?: number | null
}

// ─── BEDRIJFSPROFIEL ─────────────────────────────────────

export interface Bedrijfsprofiel {
  beschrijving: string
  geschiedenis?: string
  bedrijfsmodel?: string
  ipo_context?: string
  klantenprofiel?: string
  oprichtingsjaar?: number | null
  ipo_datum?: string | null
  ipo_koers?: number | null
  personeel?: number | null
  landen_actief?: number | null
  klantconcentratie?: string
  geografische_spreiding?: GeografischeSpreiding[]
  geografische_spreiding_toelichting?: string
  segmenten: Segment[]
  aandeelhouders: Aandeelhouder[]
  institutioneel_eigendom_trend?: string
}

export interface GeografischeSpreiding {
  regio: string
  omzet_pct: number
  valuta?: string
}

export interface Segment {
  naam: string
  omzet_pct: number
  beschrijving: string
}

export interface Aandeelhouder {
  naam: string
  pct: number
  type: string
}

// ─── FINANCIEEL ──────────────────────────────────────────

export interface Financieel {
  valuta_label: string
  resultatenrekening: JaarResultaat[]
  toelichting_resultaten?: string
  omzet_cagr_pct?: number | null
  omzet_cagr_periode?: string
  kasstromen: JaarKasstroom[]
  toelichting_kasstromen?: string
  balans: JaarBalans[]
  toelichting_balans?: string
  schuldvervaldatum?: string | null
  rendementsindicatoren: Rendement[]
  toelichting_rendement?: string
  accruals?: Accrual[]
  toelichting_earnings_quality?: string
  dividend?: Dividend
  waardering: Waardering
  toelichting_waardering?: string
  ipo_correctie?: string
  sector_kpis?: SectorKPI[]
  toelichting_sector_kpis?: string
}

export interface JaarResultaat {
  jaar: number
  omzet: number | null
  omzet_groei_pct: number | null
  brutowinst?: number | null
  brutomarge_pct?: number | null
  ebit?: number | null
  ebit_marge_pct?: number | null
  ebitda: number | null
  ebitda_marge_pct: number | null
  nettowinst: number | null
  nettomarge_pct: number | null
  eps: number | null
  eps_groei_pct?: number | null
  aandelen_uitstaand_mln?: number | null
}

export interface JaarKasstroom {
  jaar: number
  cfo?: number | null
  capex?: number | null
  fcf: number | null
  fcf_na_sbc?: number | null
  fcf_per_aandeel: number | null
  fcf_marge_pct?: number | null
  fcf_groei_pct?: number | null
  fcf_conversion?: number | null
  sbc?: number | null
  dividend_totaal?: number | null
  aandeleninkoop?: number | null
}

export interface JaarBalans {
  jaar: number
  totale_activa?: number | null
  eigen_vermogen: number
  bruto_schuld?: number | null
  nettoschuld: number
  debt_equity?: number | null
  debt_ebitda: number | null
  current_ratio?: number | null
  quick_ratio?: number | null
  goodwill_pct_activa?: number | null
  boekwaarde_per_aandeel?: number | null
}

export interface Rendement {
  jaar: number
  roce_pct: number | null
  roe_pct: number | null
  roic_pct: number | null
  roa_pct: number | null
  asset_turnover?: number | null
  wacc_pct?: number | null
  roic_wacc_spread?: number | null
}

export interface Accrual {
  jaar: number
  accruals_ratio?: number | null
  non_gaap_verschil_pct?: number | null
  sbc_pct_fcf?: number | null
}

export interface Dividend {
  betaalt_dividend: boolean
  huidig_dps?: number | null
  huidig_rendement_pct?: number | null
  gemiddeld_rendement_5j_pct?: number | null
  gemiddeld_rendement_10j_pct?: number | null
  cagr_dividend_pct?: number | null
  fcf_dekkingsratio?: number | null
  payout_ratio_fcf_pct?: number | null
  oordeel_houdbaarheid?: string
  progressief_beleid?: boolean
  eerstvolgende_ex_dividend?: string | null
  toelichting?: string
  historie?: DividendJaar[]
}

export interface DividendJaar {
  jaar: number
  dps?: number | null
  groei_pct?: number | null
  payout_ratio_pct?: number | null
  fcf_dekking?: number | null
  type?: string
  bijzonderheden?: string | null
}

export interface Waardering {
  pe: number | null
  pe_forward?: number | null
  pe_historisch_gem_10j?: number | null
  ev_ebitda: number | null
  ev_ebitda_historisch_gem_10j?: number | null
  p_fcf: number | null
  p_fcf_na_sbc?: number | null
  fcf_yield_pct: number | null
  p_b: number | null
  ev_omzet: number | null
  dividendrendement_pct: number | null
  peg?: number | null
}

export interface SectorKPI {
  kpi_naam: string
  eenheid: string
  waarden: { jaar: number; waarde: number | null }[]
  toelichting?: string
}

// ─── MOAT ────────────────────────────────────────────────

export interface Moat {
  oordeel: string
  duurzaamheid_horizon?: string
  toelichting: string
  duurzaamheid_toelichting?: string
  categorieen: MoatCategorie[]
}

export interface MoatCategorie {
  naam: string
  oordeel: string
  score: number
  toelichting: string
}

// ─── MANAGEMENT ──────────────────────────────────────────

export interface Management {
  oordeel: string
  personen: Persoon[]
  compensatie?: Compensatie
  insider_transactions?: InsiderTransaction[]
  insider_netto?: string
  owner_operator?: boolean
  eigenbelang_pct?: number | null
  capital_allocation: string
  capital_allocation_detail?: string
  integriteit?: string
  toelichting: string
}

export interface Persoon {
  functie: string
  naam: string
  achtergrond: string
}

export interface Compensatie {
  sbc_pct_marktkapitalisatie?: number | null
  verwateringsgraad_pct_jaar?: number | null
  ceo_pay_ratio?: number | null
  prikkels_aligned?: boolean
  toelichting?: string
}

export interface InsiderTransaction {
  datum: string
  naam: string
  functie: string
  type: string
  aandelen: number
  koers: number
}

// ─── SECTOR & CONCURRENTIE ──────────────────────────────

export interface SectorConcurrentie {
  sectorprofiel: {
    type: string
    kapitaalintensief: boolean
    consolidatiegraad: string
    sentiment: string
    trends: string
    toelichting?: string
  }
  porter: {
    dreiging_toetreders: PorterKracht
    macht_leveranciers: PorterKracht
    macht_klanten: PorterKracht
    dreiging_substituten: PorterKracht
    concurrentie_intensiteit: PorterKracht
    conclusie: string
  }
  concurrenten: Concurrent[]
  positie: string
  positie_toelichting?: string
  tam_sam_som?: TamSamSom
}

export interface TamSamSom {
  tam_mln?: number | null
  tam_groei_pct?: number | null
  sam_mln?: number | null
  sam_groei_pct?: number | null
  huidige_penetratie_pct?: number | null
  impliciete_penetratie_na_horizon_pct?: number | null
  groei_plausibel?: boolean
  bron?: string
  toelichting?: string
}

export interface PorterKracht {
  score: string
  toelichting: string
}

export interface Concurrent {
  naam: string
  ticker?: string | null
  omzet_groei_pct?: number | null
  ebit_marge_pct?: number | null
  roic_pct?: number | null
  nettoschuld_ebitda?: number | null
  ev_ebitda?: number | null
  p_fcf?: number | null
  marktaandeel_pct?: number | null
}

// ─── ANALYSEFRAMEWORKS ──────────────────────────────────

export interface AnalyseFrameworks {
  graham?: {
    oordeel: string
    graham_number?: number | null
    margin_of_safety_pct?: number | null
    toelichting: string
  }
  buffett_munger?: {
    oordeel: string
    roic_boven_wacc_structureel?: boolean
    toelichting: string
  }
  lynch?: {
    categorie: string
    oordeel: string
    peg_ratio?: number | null
    toelichting: string
  }
  fisher?: {
    oordeel: string
    toelichting: string
  }
  greenblatt?: {
    oordeel: string
    earnings_yield_pct?: number | null
    return_on_capital_pct?: number | null
    toelichting: string
  }
}

// ─── RISICO'S ───────────────────────────────────────────

export interface Risico {
  omschrijving: string
  kans: string
  impact: string
  dcf_aanname_geraakt?: string
  toelichting?: string
}

// ─── KATALYSATOREN ───────────────────────────────────────

export interface Katalysator {
  datum_ca: string
  omschrijving: string
  richting: 'POSITIEF' | 'NEGATIEF' | 'NEUTRAAL' | 'BINAIR'
  impact: 'GROOT' | 'MIDDEL' | 'KLEIN'
}

// ─── FAIR VALUE ──────────────────────────────────────────

export interface FairValue {
  methoden_toegepast?: string[]
  methoden_niet_toegepast?: { methode: string; reden: string | null }[]
  toelichting_methode?: string
  valuta_kasstromen?: string
  wacc?: WACCOpbouw
  dcf: DCFInputs
  dcf_toelichting?: string
  projectie?: DCFProjectieJaar[]
  scenarios: Scenario[]
  kansgewogen_fair_value?: number
  reverse_dcf?: ReverseDCF
  epv?: EPV
  ddm?: DDM
  sotp?: SOTP
  synthese?: FairValueSynthese
  synthese_toelichting?: string
  gevoeligheid_fcf_groei?: Gevoeligheid
  gevoeligheid_terminal?: Gevoeligheid
}

export interface DCFProjectieJaar {
  jaar: number
  omzet?: number
  omzet_groei_pct?: number
  ebit?: number
  ebit_marge_pct?: number
  nopat?: number
  capex?: number
  delta_nwc?: number
  sbc?: number
  fcf?: number
}

export interface WACCOpbouw {
  risicovrije_rente_pct: number
  risicovrije_rente_bron?: string
  risicovrije_rente_type?: 'spot' | 'genormaliseerd'
  erp_pct: number
  erp_bron?: string
  beta_adjusted: number
  beta_bron?: string
  beta_type?: 'regressie' | 'bottom_up'
  country_risk_premium_pct?: number | null
  size_premium_pct?: number | null
  cost_of_equity_pct: number
  schuldkosten_na_belasting_pct: number
  ev_gewicht_pct: number
  dv_gewicht_pct: number
  wacc_pct: number
  sector_wacc_pct?: number | null
  illiquiditeitskorting_pct?: number | null
}

export interface DCFInputs {
  model_type?: string
  basis_fcf: number
  basis_fcf_na_sbc?: number | null
  fcf_type?: string
  fcf_definitie?: 'FCFF' | 'FCFE'
  groei_fase1_pct: number
  groei_fase2_pct?: number | null
  terminal_groei_pct: number
  terminal_methode?: string
  exit_multiple_gebruikt?: number | null
  exit_multiple_bron?: string | null
  terminal_value_gordon_growth?: number | null
  terminal_value_exit_multiple?: number | null
  terminal_value_pct_van_totaal?: number
  terminal_implied_ev_ebitda?: number | null
  terminal_groei_consistentie?: string | null
  mid_year_convention?: boolean
  wacc_pct?: number
  shares_outstanding_mln?: number
  nettoschuld_huidig?: number
}

export interface Gevoeligheid {
  wacc_range: number[]
  groei_range?: number[]
  terminal_groei_range?: number[]
  matrix: number[][]
}

export interface ReverseDCF {
  impliciete_groei_pct: number
  historische_fcf_cagr_pct?: number
  consensus_groei_pct?: number | null
  interpretatie: string
}

export interface EPV {
  genormaliseerde_ebit_marge_pct: number
  genormaliseerde_nopat: number
  maintenance_capex: number
  adjusted_earnings_power: number
  epv_per_aandeel: number
  groeipremie_pct: number
}

export interface DDM {
  uitgevoerd: boolean
  model?: string | null
  dps_verwacht?: number | null
  cost_of_equity_pct?: number | null
  dividendgroei_pct?: number | null
  ddm_fair_value?: number | null
}

export interface SOTP {
  uitgevoerd: boolean
  segmenten?: { naam: string; methode: string; waarde: number }[]
  sotp_fair_value?: number | null
  conglomeraatkorting_pct?: number | null
}

export interface FairValueSynthese {
  fair_value_bandbreedte_laag: number
  fair_value_bandbreedte_centraal: number
  fair_value_bandbreedte_hoog: number
  methode_gewichten?: string
  margin_of_safety_vereist_pct: number
  koopniveau: number
}

// ─── SCOREKAART ──────────────────────────────────────────

export interface Scorekaart {
  items: ScorekaartItem[]
  totaal: number
  max: number
  eindoordeel: string
  samenvatting: string
}

export interface ScorekaartItem {
  framework: string
  score: number
  max: number
  oordeel?: string
}

// ─── ESG ─────────────────────────────────────────────────

export interface ESG {
  materiele_factoren: ESGFactor[]
  eindoordeel: string
  toelichting?: string
}

export interface ESGFactor {
  factor: string
  sasb_categorie?: string | null
  risico_niveau: string
  financiele_impact: string
  dcf_impact?: string
}

// ─── UPDATE HISTORIE ─────────────────────────────────────

export interface UpdateHistorie {
  datum: string
  type: string
  koers_bij_update: number
  fair_value_bij_update: number
  oordeel_bij_update: string
  samenvatting: string
}

// ─── DATABRONNEN ─────────────────────────────────────────

export interface Databronnen {
  bronnen_geraadpleegd: string[]
  pre_ipo_data_beschikbaar?: boolean
  ontbrekende_data?: string
  non_gaap_gebruikt?: boolean
  non_gaap_toelichting?: string | null
}

export interface Bron {
  url: string
  titel: string
  type: string
}

// ─── DATA KWALITEIT ─────────────────────────────────────

export interface DataKwaliteit {
  jaren_aanwezig: number[]
  jaren_volledig: number[]
  jaren_gedeeltelijk: number[]
  jaren_ontbrekend: number[]
  dekking_pct: number
  label: 'Volledige data' | 'Gedeeltelijke data' | 'Beperkte data'
  toelichting?: string
}

// ─── INDEX ───────────────────────────────────────────────

export interface AnalyseIndex {
  ticker: string
  naam: string
  sector: string
  exchange: string
  koers: number
  valuta: string
  fair_value_basis: number
  upside_pct: number
  oordeel: 'KOOP' | 'HOLD' | 'PASS'
  scorekaart_totaal: number
  scorekaart_max: number
  peildatum: string
  domein?: string
  yahoo_symbol?: string
  tags?: string[]
}
