# Cowork Prompt: Skill JSON Export Updaten

Kopieer onderstaand prompt in zijn geheel naar een Cowork-sessie met Claude om de skill aan te passen.

---

## PROMPT START

Ik wil de JSON-export van mijn fundamentele analyse skill updaten. Het probleem: de JSON bevat nu alleen gestructureerde data (getallen, scores, korte oordelen), maar de narratieve tekst staat alleen in het Markdown-document. Mijn platform (Next.js) rendert uitsluitend vanuit de JSON — het .md bestand wordt NIET gelezen. Daardoor gaat alle rijke tekst verloren.

### Wat moet er veranderen

Open het bestand `docs/SKILL_FUNDAMENTELE_ANALYSE.md` en pas ALLEEN de JSON-export sectie aan (vanaf regel ~588 "JSON EXPORT — AUTOMATISCH NA HET DOCUMENT"). De rest van de skill (hoofdstukken 0-9, opmaak-instructies) blijft EXACT hetzelfde.

### De kernwijziging

Verwijder deze regel uit de skill:
> "De JSON bevat gestructureerde data (getallen, scores, oordelen). De narratieve tekst staat in het .md bestand — herhaal die NIET in JSON."

Vervang door:
> "De JSON bevat ZOWEL gestructureerde data (getallen, scores) ALS alle narratieve tekst uit het document. Het platform rendert uitsluitend vanuit de JSON. Alle tekst die je in het Markdown-document schrijft, MOET ook in de corresponderende JSON-velden staan. Korte samenvattingen zijn NIET acceptabel — gebruik de volledige tekst."

### KWALITEITSREGELS VOOR DE JSON

Voeg deze regels toe direct boven het JSON-template:

```
KWALITEITSREGELS:
1. ALLE tekst die je in het Markdown-document schrijft, MOET ook in de JSON staan
2. Tekstvelden bevatten de VOLLEDIGE tekst, NIET een samenvatting of verkorte versie
3. "kort" of "samenvatting" in een veld betekent MINIMAAL 3-5 volledige zinnen
4. Moat-categorie toelichtingen: minimaal 2-4 zinnen met concrete voorbeelden
5. Framework toelichtingen: minimaal 3-6 zinnen met onderbouwing
6. Financiële toelichtingen: minimaal 3-6 zinnen met trend-analyse
7. Risico toelichtingen: minimaal 2-4 zinnen met context en mechanisme
8. Als een veld null is, zet null — maar vul NOOIT een tekstveld met een lege string
9. De JSON is het ENIGE bestand dat het platform leest — als het niet in de JSON staat, bestaat het niet
10. Gebruik EXACT de veldnamen uit dit template — geen Engelse vertalingen, geen afkortingen, geen alternatieve namen
```

### VOLLEDIG JSON-TEMPLATE

Vervang het VOLLEDIGE bestaande JSON-template in de skill door onderstaand template. Dit is de **gouden standaard** — het platform is exact op deze veldnamen gebouwd. Afwijkingen breken de weergave.

```json
{
  "meta": {
    "ticker": "[TICKER]",
    "exchange": "[BEURS — bijv. Euronext Amsterdam, Euronext Paris, Nasdaq, NYSE]",
    "naam": "[VOLLEDIGE BEDRIJFSNAAM]",
    "sector": "[SECTOR]",
    "industrie": "[SUBSEGMENT/INDUSTRIE]",
    "land": "[LAND VAN VESTIGING]",
    "koers": "[KOERS ALS GETAL]",
    "valuta": "[VALUTA — EUR, USD, SEK, NOK, etc.]",
    "peildatum": "[YYYY-MM-DD]",
    "marktkapitalisatie": "[TEKST — bijv. EUR 4,1 mld]",
    "marktkapitalisatie_mln": "[GETAL OF null]",
    "free_float_pct": "[GETAL OF null]",
    "index_lidmaatschap": "[INDEX OF null — bijv. AEX, CAC 40, S&P 500]",
    "domein": "[WEBSITE DOMEIN zonder https:// — bijv. asml.com]",
    "yahoo_symbol": "[YAHOO FINANCE SYMBOL — bijv. ASML.AS, EDEN.PA, CRWD]"
  },

  "executive_summary": {
    "kernthese": "[3-5 zinnen kernthese — de volledige beleggingsthese in beknopte vorm]",
    "oordeel": "[KOOP|HOLD|PASS]",
    "koers": "[KOERS ALS GETAL]",
    "valuta": "[VALUTA]",
    "fair_value_basis": "[BASISSCENARIO FAIR VALUE]",
    "fair_value_kansgewogen": "[KANSGEWOGEN FAIR VALUE OF null — gewogen gemiddelde van scenario's]",
    "epv_per_aandeel": "[EPV PER AANDEEL OF null]",
    "upside_pct": "[UPSIDE % ALS GETAL ZONDER %]",
    "fair_value_scenarios": [
      { "scenario": "Pessimistisch", "fair_value": "[GETAL]", "upside_pct": "[GETAL]", "fcf_groei_pct": "[GETAL OF null]", "wacc_pct": "[GETAL OF null]", "kans_pct": "[GETAL OF null]" },
      { "scenario": "Basis",         "fair_value": "[GETAL]", "upside_pct": "[GETAL]", "fcf_groei_pct": "[GETAL OF null]", "wacc_pct": "[GETAL OF null]", "kans_pct": "[GETAL OF null]" },
      { "scenario": "Optimistisch",  "fair_value": "[GETAL]", "upside_pct": "[GETAL]", "fcf_groei_pct": "[GETAL OF null]", "wacc_pct": "[GETAL OF null]", "kans_pct": "[GETAL OF null]" }
    ],
    "reverse_dcf_impliciete_groei_pct": "[GETAL OF null — de FCF-groei die de markt momenteel inprijst]",
    "grootste_kans": "[één zin]",
    "grootste_risico": "[één zin]"
  },

  "bedrijfsprofiel": {
    "beschrijving": "[VOLLEDIGE bedrijfsbeschrijving uit H1 — wat doet het bedrijf, producten/diensten, klanten. Minimaal 4-6 zinnen]",
    "geschiedenis": "[VOLLEDIGE tekst uit H1.2 — oprichting, mijlpalen, overnames, crises. Minimaal 3-5 zinnen. Null als niet relevant]",
    "bedrijfsmodel": "[VOLLEDIGE tekst uit H1 over hoe het bedrijfsmodel werkt — revenue model, klantrelatie, waardeketen. Minimaal 3-5 zinnen]",
    "ipo_context": "[IPO-datum, -koers, wat is veranderd in kapitaalstructuur sindsdien. Null als niet relevant]",
    "klantenprofiel": "[Wie zijn de klanten, concentratie, type relatie. Minimaal 2-3 zinnen]",
    "oprichtingsjaar": "[GETAL OF null]",
    "ipo_datum": "[YYYY-MM-DD OF null]",
    "ipo_koers": "[GETAL OF null — IPO-koers in lokale valuta]",
    "personeel": "[GETAL OF null — aantal medewerkers]",
    "landen_actief": "[GETAL OF null]",
    "klantconcentratie": "[TEKST OF null — bijv. Top 10 klanten = 45% omzet]",
    "geografische_spreiding": [
      { "regio": "[NAAM — bijv. Europa, Noord-Amerika]", "omzet_pct": "[GETAL]", "valuta": "[VALUTA OF null]" }
    ],
    "geografische_spreiding_toelichting": "[Toelichting op geografische spreiding en valuta-exposure. Null als niet relevant]",
    "segmenten": [
      { "naam": "[SEGMENTNAAM]", "omzet_pct": "[GETAL]", "beschrijving": "[1-2 zinnen beschrijving van het segment]" }
    ],
    "aandeelhouders": [
      { "naam": "[NAAM]", "pct": "[GETAL]", "type": "[Controlerend|Institutioneel|Publiek]" }
    ],
    "institutioneel_eigendom_trend": "[Stijgend/dalend/stabiel + toelichting. Null als onbekend]"
  },

  "financieel": {
    "valuta_label": "[bijv. EUR mln of USD mln]",

    "resultatenrekening": [
      {
        "jaar": "[YYYY]",
        "omzet": "[GETAL OF null]",
        "omzet_groei_pct": "[GETAL OF null]",
        "brutowinst": "[GETAL OF null]",
        "brutomarge_pct": "[GETAL OF null]",
        "ebit": "[GETAL OF null]",
        "ebit_marge_pct": "[GETAL OF null]",
        "ebitda": "[GETAL OF null]",
        "ebitda_marge_pct": "[GETAL OF null]",
        "nettowinst": "[GETAL OF null]",
        "nettomarge_pct": "[GETAL OF null]",
        "eps": "[GETAL OF null]",
        "eps_groei_pct": "[GETAL OF null]",
        "aandelen_uitstaand_mln": "[GETAL OF null]"
      }
    ],
    "toelichting_resultaten": "[VOLLEDIGE interpretatie uit H2.1 — trends, bijzonderheden, CAGR-analyse. Minimaal 4-6 zinnen]",
    "omzet_cagr_pct": "[GETAL OF null]",
    "omzet_cagr_periode": "[bijv. 2015-2025]",

    "kasstromen": [
      {
        "jaar": "[YYYY]",
        "cfo": "[GETAL OF null — operationele kasstroom]",
        "capex": "[GETAL OF null — als negatief getal]",
        "fcf": "[GETAL OF null]",
        "fcf_na_sbc": "[GETAL OF null]",
        "fcf_per_aandeel": "[GETAL OF null]",
        "fcf_marge_pct": "[GETAL OF null]",
        "fcf_groei_pct": "[GETAL OF null]",
        "fcf_conversion": "[GETAL OF null — FCF / nettowinst als ratio]",
        "sbc": "[GETAL OF null — stock-based compensation]",
        "dividend_totaal": "[GETAL OF null]",
        "aandeleninkoop": "[GETAL OF null]"
      }
    ],
    "toelichting_kasstromen": "[VOLLEDIGE interpretatie uit H2.3 — FCF-trend, conversion, capital allocation, buyback-timing. Minimaal 4-6 zinnen]",

    "balans": [
      {
        "jaar": "[YYYY]",
        "totale_activa": "[GETAL OF null]",
        "eigen_vermogen": "[GETAL]",
        "bruto_schuld": "[GETAL OF null]",
        "nettoschuld": "[GETAL]",
        "debt_equity": "[GETAL OF null]",
        "debt_ebitda": "[GETAL OF null]",
        "current_ratio": "[GETAL OF null]",
        "quick_ratio": "[GETAL OF null]",
        "goodwill_pct_activa": "[GETAL OF null]",
        "boekwaarde_per_aandeel": "[GETAL OF null]"
      }
    ],
    "toelichting_balans": "[VOLLEDIGE interpretatie uit H2.2 — schuldpositie, herfinancieringsrisico, balanssterkte. Minimaal 3-5 zinnen]",
    "schuldvervaldatum": "[TEKST OF null — bijv. Geen leningen vervallend in 2026]",

    "rendementsindicatoren": [
      {
        "jaar": "[YYYY]",
        "roce_pct": "[GETAL OF null]",
        "roe_pct": "[GETAL OF null]",
        "roic_pct": "[GETAL OF null]",
        "roa_pct": "[GETAL OF null]",
        "asset_turnover": "[GETAL OF null]",
        "wacc_pct": "[GETAL OF null]",
        "roic_wacc_spread": "[GETAL OF null]"
      }
    ],
    "toelichting_rendement": "[VOLLEDIGE interpretatie uit H2.5 — ROIC vs WACC spread analyse, waardecreatie-oordeel. Minimaal 3-5 zinnen]",

    "accruals": [
      {
        "jaar": "[YYYY]",
        "accruals_ratio": "[GETAL OF null]",
        "non_gaap_verschil_pct": "[GETAL OF null]",
        "sbc_pct_fcf": "[GETAL OF null]"
      }
    ],
    "toelichting_earnings_quality": "[VOLLEDIGE earnings quality analyse uit H2.4 — accruals interpretatie, non-GAAP bridge, SBC-impact. Minimaal 4-6 zinnen]",

    "dividend": {
      "betaalt_dividend": "[true|false]",
      "huidig_dps": "[GETAL OF null — dividend per share huidig jaar]",
      "huidig_rendement_pct": "[GETAL OF null]",
      "gemiddeld_rendement_5j_pct": "[GETAL OF null]",
      "gemiddeld_rendement_10j_pct": "[GETAL OF null]",
      "cagr_dividend_pct": "[GETAL OF null — CAGR van DPS over beschikbare periode]",
      "fcf_dekkingsratio": "[GETAL OF null — FCF / totaal dividend]",
      "payout_ratio_fcf_pct": "[GETAL OF null — dividend / FCF als percentage]",
      "oordeel_houdbaarheid": "[conservatief|neutraal|kwetsbaar|onhoudbaar OF null]",
      "progressief_beleid": "[true|false OF null]",
      "eerstvolgende_ex_dividend": "[YYYY-MM-DD OF null]",
      "toelichting": "[VOLLEDIGE dividendanalyse — beleid, houdbaarheid, vergelijking met historisch rendement. Minimaal 3-5 zinnen]",
      "historie": [
        {
          "jaar": "[YYYY]",
          "dps": "[GETAL OF null]",
          "groei_pct": "[GETAL OF null]",
          "payout_ratio_pct": "[GETAL OF null]",
          "fcf_dekking": "[GETAL OF null]",
          "type": "[regulier|speciaal OF null]",
          "bijzonderheden": "[TEKST OF null]"
        }
      ]
    },

    "waardering": {
      "pe": "[GETAL OF null]",
      "pe_forward": "[GETAL OF null]",
      "pe_historisch_gem_10j": "[GETAL OF null]",
      "ev_ebitda": "[GETAL OF null]",
      "ev_ebitda_historisch_gem_10j": "[GETAL OF null]",
      "p_fcf": "[GETAL OF null]",
      "p_fcf_na_sbc": "[GETAL OF null]",
      "fcf_yield_pct": "[GETAL OF null]",
      "p_b": "[GETAL OF null]",
      "ev_omzet": "[GETAL OF null]",
      "dividendrendement_pct": "[GETAL OF null]",
      "peg": "[GETAL OF null]"
    },
    "toelichting_waardering": "[VOLLEDIGE interpretatie uit H2.6 — vergelijking met historisch gemiddelde, sector, conclusie. Minimaal 3-5 zinnen]",
    "ipo_correctie": "[IPO-correctiecheck uit H2.3 — pre-IPO schulden, IPO-opbrengsten gebruik, gecorrigeerde FCF. Null als niet van toepassing]",

    "sector_kpis": [
      {
        "kpi_naam": "[NAAM VAN DE KPI — bijv. Revenue per Employee]",
        "eenheid": "[EENHEID — bijv. EUR, %, x]",
        "waarden": [
          { "jaar": "[YYYY]", "waarde": "[GETAL OF null]" }
        ],
        "toelichting": "[Korte interpretatie van deze KPI. Null als niet nodig]"
      }
    ],
    "toelichting_sector_kpis": "[Interpretatie van sector-specifieke KPI's. Null als geen sector-KPIs]"
  },

  "moat": {
    "oordeel": "[WIDE MOAT|NARROW MOAT|NO MOAT]",
    "duurzaamheid_horizon": "[bijv. 7-10 jaar]",
    "toelichting": "[VOLLEDIGE moat-analyse — de complete tekst uit H3 met conclusie. Minimaal 4-6 zinnen]",
    "duurzaamheid_toelichting": "[Analyse van moat-duurzaamheid: welke trends/concurrenten kunnen de moat uithollen? Minimaal 2-3 zinnen]",
    "categorieen": [
      { "naam": "Immateriële activa",  "oordeel": "[STERK|AANWEZIG|BEPERKT|AFWEZIG]", "score": "[1-5]", "toelichting": "[2-4 zinnen met concrete voorbeelden]" },
      { "naam": "Overstapkosten",      "oordeel": "[STERK|AANWEZIG|BEPERKT|AFWEZIG]", "score": "[1-5]", "toelichting": "[2-4 zinnen]" },
      { "naam": "Netwerkeffecten",     "oordeel": "[STERK|AANWEZIG|BEPERKT|AFWEZIG]", "score": "[1-5]", "toelichting": "[2-4 zinnen]" },
      { "naam": "Kostenvoordeel",      "oordeel": "[STERK|AANWEZIG|BEPERKT|AFWEZIG]", "score": "[1-5]", "toelichting": "[2-4 zinnen]" },
      { "naam": "Efficiënte schaal",   "oordeel": "[STERK|AANWEZIG|BEPERKT|AFWEZIG]", "score": "[1-5]", "toelichting": "[2-4 zinnen]" }
    ]
  },

  "management": {
    "oordeel": "[STERK|NEUTRAAL|ZORGWEKKEND]",
    "personen": [
      {
        "functie": "[CEO/CFO/etc]",
        "naam": "[NAAM]",
        "achtergrond": "[2-3 zinnen over ervaring, track record, eerdere functies]"
      }
    ],
    "compensatie": {
      "sbc_pct_marktkapitalisatie": "[GETAL OF null]",
      "verwateringsgraad_pct_jaar": "[GETAL OF null]",
      "ceo_pay_ratio": "[GETAL OF null]",
      "prikkels_aligned": "[true|false]",
      "toelichting": "[VOLLEDIGE compensatie-analyse — samenstelling, bonusdoelstellingen, verhouding vast/variabel. Minimaal 3-5 zinnen]"
    },
    "insider_transactions": [
      {
        "datum": "[YYYY-MM-DD]",
        "naam": "[NAAM]",
        "functie": "[FUNCTIE]",
        "type": "[KOOP|VERKOOP]",
        "aandelen": "[GETAL]",
        "koers": "[GETAL]"
      }
    ],
    "insider_netto": "[NETTO KOPER|NETTO VERKOPER|NEUTRAAL]",
    "owner_operator": "[true|false]",
    "eigenbelang_pct": "[GETAL OF null — % aandelen in bezit van management/oprichter]",
    "capital_allocation": "[Samenvatting capital allocation in 2-3 zinnen]",
    "capital_allocation_detail": "[VOLLEDIGE capital allocation analyse uit H4.4 — organische groei, acquisities, synergieën, goodwill impairments, buyback-timing, dividend-consistentie. Minimaal 4-6 zinnen]",
    "integriteit": "[VOLLEDIGE integriteit & transparantie analyse uit H4.5 — pre-IPO gedrag, consistentie woord/daad, controverses, downside transparency. Minimaal 3-5 zinnen]",
    "toelichting": "[VOLLEDIGE management-eindoordeel met motivatie. Minimaal 3-5 zinnen]"
  },

  "sector_concurrentie": {
    "sectorprofiel": {
      "type": "[cyclisch|defensief|groei|etc]",
      "kapitaalintensief": "[true|false]",
      "consolidatiegraad": "[hoog|middel|laag]",
      "sentiment": "[positief|neutraal|negatief]",
      "trends": "[Belangrijkste trends in 2-3 zinnen]",
      "toelichting": "[VOLLEDIGE sectorprofiel-tekst uit H5.1 — structurele kenmerken, regelgeving, vooruitzichten. Minimaal 4-6 zinnen]"
    },
    "porter": {
      "dreiging_toetreders":      { "score": "[HOOG|MIDDEL|LAAG]", "toelichting": "[2-3 zinnen]" },
      "macht_leveranciers":       { "score": "[HOOG|MIDDEL|LAAG]", "toelichting": "[2-3 zinnen]" },
      "macht_klanten":            { "score": "[HOOG|MIDDEL|LAAG]", "toelichting": "[2-3 zinnen]" },
      "dreiging_substituten":     { "score": "[HOOG|MIDDEL|LAAG]", "toelichting": "[2-3 zinnen]" },
      "concurrentie_intensiteit": { "score": "[HOOG|MIDDEL|LAAG]", "toelichting": "[2-3 zinnen]" },
      "conclusie": "[Porter conclusie — minimaal 2-3 zinnen]"
    },
    "concurrenten": [
      {
        "naam": "[NAAM]",
        "ticker": "[TICKER OF null]",
        "omzet_groei_pct": "[GETAL OF null]",
        "ebit_marge_pct": "[GETAL OF null]",
        "roic_pct": "[GETAL OF null]",
        "nettoschuld_ebitda": "[GETAL OF null]",
        "ev_ebitda": "[GETAL OF null]",
        "p_fcf": "[GETAL OF null]",
        "marktaandeel_pct": "[GETAL OF null]"
      }
    ],
    "positie": "[Korte positiebepaling — bijv. #1 mondiaal in employee benefits]",
    "positie_toelichting": "[VOLLEDIGE concurrentiepositie-analyse uit H5.3. Minimaal 3-5 zinnen]",
    "tam_sam_som": {
      "tam_mln": "[GETAL OF null — Total Addressable Market in miljoenen]",
      "tam_groei_pct": "[GETAL OF null]",
      "sam_mln": "[GETAL OF null — Serviceable Addressable Market]",
      "sam_groei_pct": "[GETAL OF null]",
      "huidige_penetratie_pct": "[GETAL OF null]",
      "impliciete_penetratie_na_horizon_pct": "[GETAL OF null]",
      "groei_plausibel": "[true|false]",
      "bron": "[BRON OF null]",
      "toelichting": "[Toelichting op marktomvang en groeiprognose]"
    }
  },

  "analyseframeworks": {
    "graham": {
      "oordeel": "[VOLDOET|GEDEELTELIJK|VOLDOET NIET]",
      "graham_number": "[GETAL OF null]",
      "margin_of_safety_pct": "[GETAL OF null]",
      "toelichting": "[VOLLEDIGE Graham-analyse uit H6.1 — toets aan alle criteria, margin of safety, conclusie. Minimaal 4-6 zinnen]"
    },
    "buffett_munger": {
      "oordeel": "[VOLDOET|GEDEELTELIJK|VOLDOET NIET]",
      "roic_boven_wacc_structureel": "[true|false]",
      "toelichting": "[VOLLEDIGE Buffett/Munger-analyse uit H6.2 — begrijpelijkheid, voorspelbaarheid, moat, management, prijs. Minimaal 4-6 zinnen]"
    },
    "lynch": {
      "categorie": "[Slow Grower|Stalwart|Fast Grower|Cyclical|Turnaround|Asset Play]",
      "oordeel": "[INTERESSANT|NEUTRAAL|ONINTERESSANT]",
      "peg_ratio": "[GETAL OF null]",
      "toelichting": "[VOLLEDIGE Lynch-analyse uit H6.3. Minimaal 3-5 zinnen]"
    },
    "fisher": {
      "oordeel": "[STERK|GEMIDDELD|ZWAK]",
      "toelichting": "[VOLLEDIGE Fisher-analyse uit H6.4. Minimaal 3-5 zinnen]"
    },
    "greenblatt": {
      "oordeel": "[AANTREKKELIJK|GEMIDDELD|ONAANTREKKELIJK]",
      "earnings_yield_pct": "[GETAL OF null]",
      "return_on_capital_pct": "[GETAL OF null]",
      "toelichting": "[VOLLEDIGE Greenblatt-analyse uit H6.5. Minimaal 3-5 zinnen]"
    }
  },

  "risicos": [
    {
      "omschrijving": "[Risico-titel]",
      "kans": "[LAAG|MIDDEN|HOOG]",
      "impact": "[KLEIN|MIDDEL|GROOT]",
      "dcf_aanname_geraakt": "[Welke DCF-aanname wordt geraakt — bijv. FCF-groei fase 1]",
      "toelichting": "[2-4 zinnen met context, mechanisme, en mogelijke mitigatie]"
    }
  ],

  "these_invalide_bij": "[Bij welke koers of ontwikkeling klopt de investeringsthese niet meer? Concrete triggers noemen]",

  "esg": {
    "materiele_factoren": [
      {
        "factor": "[FACTOR]",
        "sasb_categorie": "[CATEGORIE OF null]",
        "risico_niveau": "[LAAG|MIDDEL|HOOG]",
        "financiele_impact": "[TEKST]",
        "dcf_impact": "[TEKST OF null]"
      }
    ],
    "eindoordeel": "[TEKST]",
    "toelichting": "[Overkoepelende ESG-beoordeling]"
  },

  "katalysatoren": [
    {
      "datum_ca": "[YYYY-MM]",
      "omschrijving": "[TEKST]",
      "richting": "[POSITIEF|NEGATIEF|NEUTRAAL|BINAIR]",
      "impact": "[GROOT|MIDDEL|KLEIN]"
    }
  ],

  "fair_value": {
    "methoden_toegepast": ["DCF", "Reverse DCF", "EPV", "etc — alleen methoden die daadwerkelijk zijn uitgevoerd"],
    "methoden_niet_toegepast": [
      { "methode": "[NAAM]", "reden": "[WAAROM NIET — bijv. Geen dividend, DDM niet toepasbaar]" }
    ],
    "toelichting_methode": "[Toelichting welke methoden zijn gebruikt en waarom, hoe ze zich tot elkaar verhouden]",

    "wacc": {
      "risicovrije_rente_pct": "[GETAL — 10-jaars staatsobligatie]",
      "risicovrije_rente_bron": "[BRON OF null — bijv. Duitse Bund, US Treasury]",
      "erp_pct": "[GETAL — Equity Risk Premium]",
      "erp_bron": "[BRON OF null — bijv. Damodaran]",
      "beta_adjusted": "[GETAL — adjusted beta]",
      "beta_bron": "[BRON OF null — bijv. Bloomberg, 5Y monthly]",
      "country_risk_premium_pct": "[GETAL OF null — alleen voor opkomende markten]",
      "cost_of_equity_pct": "[GETAL]",
      "schuldkosten_na_belasting_pct": "[GETAL]",
      "ev_gewicht_pct": "[GETAL — eigen vermogen gewicht in %]",
      "dv_gewicht_pct": "[GETAL — vreemd vermogen gewicht in %]",
      "wacc_pct": "[GETAL — resulterende WACC]",
      "sector_wacc_pct": "[GETAL OF null — WACC van vergelijkbare bedrijven]"
    },

    "dcf": {
      "model_type": "[TEKST OF null — bijv. 2-stage FCF-to-equity, 3-stage FCFF]",
      "basis_fcf": "[GETAL — vertrekpunt FCF voor het model]",
      "basis_fcf_na_sbc": "[GETAL OF null]",
      "fcf_type": "[TEKST OF null — bijv. FCFF, FCFE, owner earnings]",
      "groei_fase1_pct": "[GETAL — groeivoet fase 1 (jaren 1-5)]",
      "groei_fase2_pct": "[GETAL OF null — groeivoet fase 2 als 3-stage model]",
      "terminal_groei_pct": "[GETAL — terminale groeivoet]",
      "terminal_methode": "[TEKST OF null — Gordon Growth of Exit Multiple]",
      "exit_multiple_gebruikt": "[GETAL OF null]",
      "exit_multiple_bron": "[TEKST OF null]",
      "terminal_value_pct_van_totaal": "[GETAL OF null — terminal value als % van totale waarde]",
      "mid_year_convention": "[true|false OF null]",
      "wacc_pct": "[GETAL OF null]",
      "shares_outstanding_mln": "[GETAL OF null]",
      "nettoschuld_huidig": "[GETAL OF null]"
    },
    "dcf_toelichting": "[VOLLEDIGE DCF-methodologie uit H7.1 — welke FCF als basis, normalisaties, groeiaannames onderbouwing, terminal value keuze, margin of safety. Minimaal 6-8 zinnen]",

    "projectie": [
      {
        "jaar": "[YYYY]",
        "omzet": "[GETAL OF null]",
        "omzet_groei_pct": "[GETAL OF null]",
        "ebit": "[GETAL OF null]",
        "ebit_marge_pct": "[GETAL OF null]",
        "nopat": "[GETAL OF null]",
        "capex": "[GETAL OF null]",
        "delta_nwc": "[GETAL OF null]",
        "sbc": "[GETAL OF null]",
        "fcf": "[GETAL OF null]"
      }
    ],

    "scenarios": [
      { "scenario": "Pessimistisch",       "fcf_groei_pct": "[GETAL]", "wacc_pct": "[GETAL]", "fair_value": "[GETAL]", "upside_pct": "[GETAL]" },
      { "scenario": "Basis",               "fcf_groei_pct": "[GETAL]", "wacc_pct": "[GETAL]", "fair_value": "[GETAL]", "upside_pct": "[GETAL]" },
      { "scenario": "Optimistisch",        "fcf_groei_pct": "[GETAL]", "wacc_pct": "[GETAL]", "fair_value": "[GETAL]", "upside_pct": "[GETAL]" },
      { "scenario": "Basis (IPO-gecorr.)", "fcf_groei_pct": "[GETAL]", "wacc_pct": "[GETAL]", "fair_value": "[GETAL]", "upside_pct": "[GETAL]" }
    ],
    "kansgewogen_fair_value": "[GETAL OF null — kansgewogen fair value uit scenario's]",

    "reverse_dcf": {
      "impliciete_groei_pct": "[GETAL — de FCF-groei die de markt momenteel inprijst]",
      "historische_fcf_cagr_pct": "[GETAL OF null]",
      "consensus_groei_pct": "[GETAL OF null]",
      "interpretatie": "[VOLLEDIGE interpretatie — wat impliceert de huidige koers, is dat realistisch. Minimaal 2-3 zinnen]"
    },

    "epv": {
      "genormaliseerde_ebit_marge_pct": "[GETAL]",
      "genormaliseerde_nopat": "[GETAL]",
      "maintenance_capex": "[GETAL]",
      "adjusted_earnings_power": "[GETAL]",
      "epv_per_aandeel": "[GETAL]",
      "groeipremie_pct": "[GETAL — verschil EPV vs fair value in %]"
    },

    "ddm": {
      "uitgevoerd": "[true|false — false als bedrijf geen dividend betaalt]",
      "model": "[TEKST OF null — bijv. Gordon Growth, H-model]",
      "dps_verwacht": "[GETAL OF null]",
      "cost_of_equity_pct": "[GETAL OF null]",
      "dividendgroei_pct": "[GETAL OF null]",
      "ddm_fair_value": "[GETAL OF null]"
    },

    "sotp": {
      "uitgevoerd": "[true|false — false als bedrijf niet logisch opsplitsbaar is]",
      "segmenten": [
        { "naam": "[SEGMENTNAAM]", "methode": "[bijv. EV/EBITDA 12x]", "waarde": "[GETAL]" }
      ],
      "sotp_fair_value": "[GETAL OF null]",
      "conglomeraatkorting_pct": "[GETAL OF null]"
    },

    "synthese": {
      "fair_value_bandbreedte_laag": "[GETAL — pessimistisch scenario fair value]",
      "fair_value_bandbreedte_centraal": "[GETAL — kansgewogen/basis fair value]",
      "fair_value_bandbreedte_hoog": "[GETAL — optimistisch scenario fair value]",
      "methode_gewichten": "[TEKST OF null — bijv. DCF 70%, relatieve waardering 30%]",
      "margin_of_safety_vereist_pct": "[GETAL — vereiste MoS op basis van onzekerheid en datakwaliteit]",
      "koopniveau": "[GETAL — koers waaronder kopen aantrekkelijk is (fair_value_centraal × (1 - MoS))]"
    },
    "synthese_toelichting": "[VOLLEDIGE synthese uit H7.3 — relatieve waardering vs historisch en sector, sanity check DCF. Minimaal 3-5 zinnen]",

    "gevoeligheid_fcf_groei": {
      "wacc_range": "[ARRAY van 5-6 WACC-waarden — bijv. [7.0, 7.5, 8.0, 8.5, 9.0, 9.5]]",
      "groei_range": "[ARRAY van 5-6 FCF-groeiwaarden — bijv. [3.0, 5.0, 7.0, 9.0, 11.0]]",
      "matrix": "[2D ARRAY — elke rij correspondeert met een groei_range waarde, elke kolom met een wacc_range waarde. Waarden zijn fair value per aandeel]"
    },
    "gevoeligheid_terminal": "[OPTIONEEL — zelfde structuur als gevoeligheid_fcf_groei maar dan met terminal_groei_range i.p.v. groei_range. Null als niet apart berekend]"
  },

  "scorekaart": {
    "items": [
      { "framework": "Graham",                "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Buffett / Munger",       "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Peter Lynch",            "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Phil Fisher",            "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Magic Formula",          "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Moat",                   "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Management",             "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Fair Value DCF",         "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" },
      { "framework": "Fair Value IPO-gecorr.", "score": "[1-5]", "max": 5, "oordeel": "[korte motivatie]" }
    ],
    "totaal": "[SOM VAN SCORES]",
    "max": 45,
    "eindoordeel": "[KOOP|HOLD|PASS]",
    "samenvatting": "[VOLLEDIGE finale beleggingsoordeel uit H9 — minimaal 100-150 woorden, inclusief voornaamste onzekerheid, katalysator-effect op korte termijn, en minimale margin of safety. Dit is de VOLLEDIGE slotparagraaf]"
  },

  "databronnen": {
    "bronnen_geraadpleegd": ["[BRON 1]", "[BRON 2]"],
    "pre_ipo_data_beschikbaar": "[true|false]",
    "ontbrekende_data": "[TEKST OF null]",
    "non_gaap_gebruikt": "[true|false]",
    "non_gaap_toelichting": "[TEKST OF null]"
  }
}
```

### index.json entry (uitbreiden)

Voeg ook `domein` en `yahoo_symbol` toe aan de index.json entry:

```json
{
  "ticker": "[TICKER]",
  "naam": "[NAAM]",
  "sector": "[SECTOR]",
  "exchange": "[BEURS]",
  "koers": "[GETAL]",
  "valuta": "[VALUTA]",
  "fair_value_basis": "[GETAL]",
  "upside_pct": "[GETAL]",
  "oordeel": "[KOOP|HOLD|PASS]",
  "scorekaart_totaal": "[GETAL]",
  "scorekaart_max": 45,
  "peildatum": "[YYYY-MM-DD]",
  "domein": "[WEBSITE DOMEIN]",
  "yahoo_symbol": "[YAHOO FINANCE SYMBOL]"
}
```

### Samengevat

De wijzigingen zijn:
1. Verwijder de instructie "narratieve tekst staat in het .md — herhaal NIET in JSON"
2. Voeg de kwaliteitsregels toe (inclusief regel 10: EXACT dezelfde veldnamen)
3. Vervang het VOLLEDIGE JSON-template door bovenstaand template
4. De bestaande velden en structuur worden vervangen — dit template is de nieuwe gouden standaard
5. De rest van de skill (H0-H9, opmaak) blijft ONGEWIJZIGD

Het pad naar het bestand: `docs/SKILL_FUNDAMENTELE_ANALYSE.md`
Wijzig ALLEEN de sectie "JSON EXPORT — AUTOMATISCH NA HET DOCUMENT" (vanaf regel ~588).

## PROMPT EINDE
