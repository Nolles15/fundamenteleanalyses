# JSON Template — 1:1 match met types.ts

Dit is de exacte JSON-structuur die de skill moet produceren.
Elk veld correspondeert met `platform/src/lib/types.ts`.

**Regels:**
- Vul alles in wat je kunt vinden. Zet `null` voor wat niet verifieerbaar is.
- Arrays mogen leeg zijn `[]` als er geen data is, maar de key moet bestaan.
- Gebruik Nederlandse veldnamen (niet Engels) — zie WACC sectie.
- Sector KPIs: gebruik het `waarden`-formaat met jaarcijfers.
- Concurrenten: vul altijd kwantitatieve velden in (desnoods null).

---

## Pad: `./data/[TICKER].json`

```json
{
  "meta": {
    "ticker": "[TICKER]",
    "exchange": "[BEURS]",
    "naam": "[VOLLEDIGE BEDRIJFSNAAM]",
    "sector": "[SECTOR]",
    "industrie": "[SUBSEGMENT/INDUSTRIE]",
    "land": "[LAND VAN VESTIGING]",
    "koers": 0.00,
    "valuta": "[EUR|USD|SEK|etc]",
    "peildatum": "YYYY-MM-DD",
    "marktkapitalisatie": "[TEKST bijv. EUR 4,1 mld]",
    "marktkapitalisatie_mln": 0,
    "free_float_pct": null,
    "index_lidmaatschap": null,
    "domein": "[website.com]",
    "yahoo_symbol": "[TICKER.EXCHANGE bijv. EDEN.PA]"
  },

  "executive_summary": {
    "kernthese": "[3-5 zinnen kernthese]",
    "oordeel": "KOOP|HOLD|PASS",
    "koers": 0.00,
    "valuta": "[VALUTA]",
    "fair_value_basis": 0.00,
    "fair_value_kansgewogen": null,
    "epv_per_aandeel": null,
    "upside_pct": 0,
    "fair_value_scenarios": [
      { "scenario": "Pessimistisch", "fair_value": 0, "upside_pct": 0, "fcf_groei_pct": null, "wacc_pct": null, "kans_pct": null },
      { "scenario": "Basis",         "fair_value": 0, "upside_pct": 0, "fcf_groei_pct": null, "wacc_pct": null, "kans_pct": null },
      { "scenario": "Optimistisch",  "fair_value": 0, "upside_pct": 0, "fcf_groei_pct": null, "wacc_pct": null, "kans_pct": null }
    ],
    "reverse_dcf_impliciete_groei_pct": null,
    "grootste_kans": "[één zin]",
    "grootste_risico": "[één zin]"
  },

  "bedrijfsprofiel": {
    "beschrijving": "[Korte beschrijving wat het bedrijf doet]",
    "geschiedenis": "[Beknopte geschiedenis: oprichting, mijlpalen, overnames]",
    "bedrijfsmodel": "[Uitleg verdienmodel: hoe verdient het bedrijf geld?]",
    "ipo_context": "[Wanneer naar beurs, wat veranderde er in de kapitaalstructuur?]",
    "klantenprofiel": "[Wie zijn de klanten, hoe geconcentreerd?]",
    "oprichtingsjaar": null,
    "ipo_datum": null,
    "ipo_koers": null,
    "personeel": null,
    "landen_actief": null,
    "klantconcentratie": "[Tekst over klantconcentratie]",
    "geografische_spreiding": [
      { "regio": "[NAAM]", "omzet_pct": 0, "valuta": "[VALUTA]" }
    ],
    "geografische_spreiding_toelichting": null,
    "segmenten": [
      { "naam": "[SEGMENT]", "omzet_pct": 0, "beschrijving": "[KORT]" }
    ],
    "aandeelhouders": [
      { "naam": "[NAAM]", "pct": 0, "type": "Controlerend|Institutioneel|Publiek" }
    ],
    "institutioneel_eigendom_trend": null
  },

  "financieel": {
    "valuta_label": "[bijv. EUR mln]",
    "resultatenrekening": [
      {
        "jaar": 2020,
        "omzet": null,
        "omzet_groei_pct": null,
        "brutowinst": null,
        "brutomarge_pct": null,
        "ebit": null,
        "ebit_marge_pct": null,
        "ebitda": null,
        "ebitda_marge_pct": null,
        "nettowinst": null,
        "nettomarge_pct": null,
        "eps": null,
        "eps_groei_pct": null,
        "aandelen_uitstaand_mln": null
      }
    ],
    "toelichting_resultaten": "[Interpretatie van de resultatenrekening]",
    "omzet_cagr_pct": null,
    "omzet_cagr_periode": null,

    "kasstromen": [
      {
        "jaar": 2020,
        "cfo": null,
        "capex": null,
        "fcf": null,
        "fcf_na_sbc": null,
        "fcf_per_aandeel": null,
        "fcf_marge_pct": null,
        "fcf_groei_pct": null,
        "fcf_conversion": null,
        "sbc": null,
        "dividend_totaal": null,
        "aandeleninkoop": null
      }
    ],
    "toelichting_kasstromen": "[Interpretatie van de kasstromen]",

    "balans": [
      {
        "jaar": 2020,
        "totale_activa": null,
        "eigen_vermogen": 0,
        "bruto_schuld": null,
        "nettoschuld": 0,
        "debt_equity": null,
        "debt_ebitda": null,
        "current_ratio": null,
        "quick_ratio": null,
        "goodwill_pct_activa": null,
        "boekwaarde_per_aandeel": null
      }
    ],
    "toelichting_balans": "[Interpretatie van de balans]",
    "schuldvervaldatum": null,

    "rendementsindicatoren": [
      {
        "jaar": 2020,
        "roce_pct": null,
        "roe_pct": null,
        "roic_pct": null,
        "roa_pct": null,
        "asset_turnover": null,
        "wacc_pct": null,
        "roic_wacc_spread": null
      }
    ],
    "toelichting_rendement": "[Interpretatie van rendementsindicatoren]",

    "accruals": [
      {
        "jaar": 2020,
        "accruals_ratio": null,
        "non_gaap_verschil_pct": null,
        "sbc_pct_fcf": null
      }
    ],
    "toelichting_earnings_quality": "[Interpretatie van earnings quality]",

    "dividend": {
      "betaalt_dividend": false,
      "huidig_dps": null,
      "huidig_rendement_pct": null,
      "gemiddeld_rendement_5j_pct": null,
      "gemiddeld_rendement_10j_pct": null,
      "cagr_dividend_pct": null,
      "fcf_dekkingsratio": null,
      "payout_ratio_fcf_pct": null,
      "oordeel_houdbaarheid": null,
      "progressief_beleid": null,
      "eerstvolgende_ex_dividend": null,
      "toelichting": null,
      "historie": [
        {
          "jaar": 2020,
          "dps": null,
          "groei_pct": null,
          "payout_ratio_pct": null,
          "fcf_dekking": null,
          "type": null,
          "bijzonderheden": null
        }
      ]
    },

    "waardering": {
      "pe": null,
      "pe_forward": null,
      "pe_historisch_gem_10j": null,
      "ev_ebitda": null,
      "ev_ebitda_historisch_gem_10j": null,
      "p_fcf": null,
      "p_fcf_na_sbc": null,
      "fcf_yield_pct": null,
      "p_b": null,
      "ev_omzet": null,
      "dividendrendement_pct": null,
      "peg": null
    },
    "toelichting_waardering": "[Interpretatie van de waardering]",
    "ipo_correctie": null,

    "sector_kpis": [
      {
        "kpi_naam": "[NAAM VAN KPI]",
        "eenheid": "[%, x, EUR mln, etc]",
        "waarden": [
          { "jaar": 2020, "waarde": null },
          { "jaar": 2021, "waarde": null },
          { "jaar": 2022, "waarde": null },
          { "jaar": 2023, "waarde": null },
          { "jaar": 2024, "waarde": null }
        ],
        "toelichting": null
      }
    ],
    "toelichting_sector_kpis": null
  },

  "moat": {
    "oordeel": "WIDE MOAT|NARROW MOAT|NO MOAT",
    "duurzaamheid_horizon": "[bijv. 5-10 jaar]",
    "toelichting": "[2-3 zinnen moat-analyse]",
    "duurzaamheid_toelichting": "[Wat bedreigt de moat? Hoe duurzaam?]",
    "categorieen": [
      { "naam": "Immateriële activa",  "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": 0, "toelichting": "[kort]" },
      { "naam": "Overstapkosten",      "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": 0, "toelichting": "[kort]" },
      { "naam": "Netwerkeffecten",     "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": 0, "toelichting": "[kort]" },
      { "naam": "Kostenvoordeel",      "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": 0, "toelichting": "[kort]" },
      { "naam": "Efficiënte schaal",   "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": 0, "toelichting": "[kort]" }
    ]
  },

  "management": {
    "oordeel": "STERK|NEUTRAAL|ZORGWEKKEND",
    "personen": [
      { "functie": "[CEO/CFO/etc]", "naam": "[NAAM]", "achtergrond": "[KORT]" }
    ],
    "compensatie": {
      "sbc_pct_marktkapitalisatie": null,
      "verwateringsgraad_pct_jaar": null,
      "ceo_pay_ratio": null,
      "prikkels_aligned": null,
      "toelichting": "[Compensatie-analyse]"
    },
    "insider_transactions": [
      {
        "datum": "YYYY-MM-DD",
        "naam": "[NAAM]",
        "functie": "[FUNCTIE]",
        "type": "KOOP|VERKOOP",
        "aandelen": 0,
        "koers": 0.00
      }
    ],
    "insider_netto": "NETTO KOPER|NETTO VERKOPER|NEUTRAAL",
    "owner_operator": false,
    "eigenbelang_pct": null,
    "capital_allocation": "[Samenvatting capital allocation]",
    "capital_allocation_detail": "[Gedetailleerde analyse: organische groei, acquisities, buybacks, dividend]",
    "integriteit": "[Integriteit en transparantie beoordeling]",
    "toelichting": "[Eindoordeel management in 2-3 zinnen]"
  },

  "sector_concurrentie": {
    "sectorprofiel": {
      "type": "[cyclisch|defensief|groei|etc]",
      "kapitaalintensief": false,
      "consolidatiegraad": "[laag|middel|hoog]",
      "sentiment": "[positief|neutraal|negatief]",
      "trends": "[Belangrijkste sectortrends]",
      "toelichting": "[Uitgebreide toelichting sectorprofiel]"
    },
    "porter": {
      "dreiging_toetreders":       { "score": "LAAG|MIDDEL|HOOG", "toelichting": "[kort]" },
      "macht_leveranciers":        { "score": "LAAG|MIDDEL|HOOG", "toelichting": "[kort]" },
      "macht_klanten":             { "score": "LAAG|MIDDEL|HOOG", "toelichting": "[kort]" },
      "dreiging_substituten":      { "score": "LAAG|MIDDEL|HOOG", "toelichting": "[kort]" },
      "concurrentie_intensiteit":  { "score": "LAAG|MIDDEL|HOOG", "toelichting": "[kort]" },
      "conclusie": "[Conclusie Porter: aantrekkelijk/gemiddeld/onaantrekkelijk]"
    },
    "concurrenten": [
      {
        "naam": "[NAAM]",
        "ticker": null,
        "omzet_groei_pct": null,
        "ebit_marge_pct": null,
        "roic_pct": null,
        "nettoschuld_ebitda": null,
        "ev_ebitda": null,
        "p_fcf": null,
        "marktaandeel_pct": null
      }
    ],
    "positie": "[Korte positiebeschrijving]",
    "positie_toelichting": "[Gedetailleerde concurrentiepositie-analyse]",
    "tam_sam_som": {
      "tam_mln": null,
      "tam_groei_pct": null,
      "sam_mln": null,
      "sam_groei_pct": null,
      "huidige_penetratie_pct": null,
      "impliciete_penetratie_na_horizon_pct": null,
      "groei_plausibel": null,
      "bron": null,
      "toelichting": null
    }
  },

  "analyseframeworks": {
    "graham": {
      "oordeel": "VOLDOET|GEDEELTELIJK|VOLDOET NIET",
      "graham_number": null,
      "margin_of_safety_pct": null,
      "toelichting": "[Graham-analyse]"
    },
    "buffett_munger": {
      "oordeel": "VOLDOET|GEDEELTELIJK|VOLDOET NIET",
      "roic_boven_wacc_structureel": null,
      "toelichting": "[Buffett/Munger-analyse]"
    },
    "lynch": {
      "categorie": "Slow Grower|Stalwart|Fast Grower|Cyclical|Turnaround|Asset Play",
      "oordeel": "INTERESSANT|NEUTRAAL|ONINTERESSANT",
      "peg_ratio": null,
      "toelichting": "[Lynch-analyse]"
    },
    "fisher": {
      "oordeel": "STERK|GEMIDDELD|ZWAK",
      "toelichting": "[Fisher-analyse]"
    },
    "greenblatt": {
      "oordeel": "AANTREKKELIJK|GEMIDDELD|ONAANTREKKELIJK",
      "earnings_yield_pct": null,
      "return_on_capital_pct": null,
      "toelichting": "[Greenblatt-analyse]"
    }
  },

  "risicos": [
    {
      "omschrijving": "[Risico-omschrijving]",
      "kans": "LAAG|MIDDEN|HOOG",
      "impact": "KLEIN|MIDDEL|GROOT",
      "dcf_aanname_geraakt": "[Welke DCF-aanname is kwetsbaar?]",
      "toelichting": "[Uitgebreide toelichting]"
    }
  ],

  "these_invalide_bij": "[Bij welke koers/ontwikkeling klopt de these niet meer?]",

  "esg": {
    "materiele_factoren": [
      {
        "factor": "[ESG-factor]",
        "sasb_categorie": null,
        "risico_niveau": "LAAG|MIDDEL|HOOG",
        "financiele_impact": "[Wat is het financiële effect?]",
        "dcf_impact": null
      }
    ],
    "eindoordeel": "[ESG eindoordeel]",
    "toelichting": null
  },

  "katalysatoren": [
    {
      "datum_ca": "YYYY-MM",
      "omschrijving": "[Katalysator]",
      "richting": "POSITIEF|NEGATIEF|NEUTRAAL|BINAIR",
      "impact": "GROOT|MIDDEL|KLEIN"
    }
  ],

  "fair_value": {
    "methoden_toegepast": ["DCF", "Relatieve waardering"],
    "methoden_niet_toegepast": [
      { "methode": "[NAAM]", "reden": "[REDEN]" }
    ],
    "toelichting_methode": "[Waarom deze methoden?]",

    "valuta_kasstromen": "[EUR|USD|NOK|etc — valuta waarin kasstromen zijn gemodelleerd]",

    "wacc": {
      "risicovrije_rente_pct": 0,
      "risicovrije_rente_bron": null,
      "risicovrije_rente_type": "spot|genormaliseerd",
      "erp_pct": 0,
      "erp_bron": null,
      "beta_adjusted": 0,
      "beta_bron": null,
      "beta_type": "regressie|bottom_up",
      "country_risk_premium_pct": null,
      "size_premium_pct": null,
      "cost_of_equity_pct": 0,
      "schuldkosten_na_belasting_pct": 0,
      "ev_gewicht_pct": 0,
      "dv_gewicht_pct": 0,
      "wacc_pct": 0,
      "sector_wacc_pct": null,
      "illiquiditeitskorting_pct": null
    },

    "dcf": {
      "model_type": null,
      "basis_fcf": 0,
      "basis_fcf_na_sbc": null,
      "fcf_type": null,
      "fcf_definitie": "FCFF|FCFE",
      "groei_fase1_pct": 0,
      "groei_fase2_pct": null,
      "terminal_groei_pct": 0,
      "terminal_methode": null,
      "exit_multiple_gebruikt": null,
      "exit_multiple_bron": null,
      "terminal_value_gordon_growth": null,
      "terminal_value_exit_multiple": null,
      "terminal_value_pct_van_totaal": null,
      "terminal_implied_ev_ebitda": null,
      "terminal_groei_consistentie": "[bijv. Terminal groei 2.5% vereist 25% herinvestering bij 10% ROIC — plausibel]",
      "mid_year_convention": null,
      "wacc_pct": null,
      "shares_outstanding_mln": null,
      "nettoschuld_huidig": null
    },
    "dcf_toelichting": "[Toelichting op DCF-aannames en keuzes]",

    "projectie": [
      {
        "jaar": 2026,
        "omzet": null,
        "omzet_groei_pct": null,
        "ebit": null,
        "ebit_marge_pct": null,
        "nopat": null,
        "capex": null,
        "delta_nwc": null,
        "sbc": null,
        "fcf": null
      }
    ],

    "scenarios": [
      { "scenario": "Pessimistisch",       "fcf_groei_pct": 0, "wacc_pct": 0, "fair_value": 0, "upside_pct": 0 },
      { "scenario": "Basis",               "fcf_groei_pct": 0, "wacc_pct": 0, "fair_value": 0, "upside_pct": 0 },
      { "scenario": "Optimistisch",        "fcf_groei_pct": 0, "wacc_pct": 0, "fair_value": 0, "upside_pct": 0 },
      { "scenario": "Basis (IPO-gecorr.)", "fcf_groei_pct": 0, "wacc_pct": 0, "fair_value": 0, "upside_pct": 0 }
    ],

    "kansgewogen_fair_value": null,

    "reverse_dcf": {
      "impliciete_groei_pct": 0,
      "historische_fcf_cagr_pct": null,
      "consensus_groei_pct": null,
      "interpretatie": "[Interpretatie reverse DCF]"
    },

    "epv": {
      "genormaliseerde_ebit_marge_pct": 0,
      "genormaliseerde_nopat": 0,
      "maintenance_capex": 0,
      "adjusted_earnings_power": 0,
      "epv_per_aandeel": 0,
      "groeipremie_pct": 0
    },

    "ddm": {
      "uitgevoerd": false,
      "model": null,
      "dps_verwacht": null,
      "cost_of_equity_pct": null,
      "dividendgroei_pct": null,
      "ddm_fair_value": null
    },

    "sotp": {
      "uitgevoerd": false,
      "segmenten": null,
      "sotp_fair_value": null,
      "conglomeraatkorting_pct": null
    },

    "synthese": {
      "fair_value_bandbreedte_laag": 0,
      "fair_value_bandbreedte_centraal": 0,
      "fair_value_bandbreedte_hoog": 0,
      "methode_gewichten": null,
      "margin_of_safety_vereist_pct": 0,
      "koopniveau": 0
    },
    "synthese_toelichting": "[Uitleg synthese en samenvatting waardering]",

    "gevoeligheid_fcf_groei": {
      "wacc_range": [7.0, 7.5, 8.0, 8.5, 9.0, 9.5],
      "groei_range": [1.0, 3.0, 5.0, 7.0, 9.0],
      "matrix": [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    },
    "gevoeligheid_terminal": null
  },

  "scorekaart": {
    "items": [
      { "framework": "Graham",                "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Buffett / Munger",       "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Peter Lynch",            "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Phil Fisher",            "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Magic Formula",          "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Moat",                   "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Management",             "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Fair Value DCF",         "score": 0, "max": 5, "oordeel": "[tekst]" },
      { "framework": "Fair Value IPO-gecorr.", "score": 0, "max": 5, "oordeel": "[tekst]" }
    ],
    "totaal": 0,
    "max": 45,
    "eindoordeel": "KOOP|HOLD|PASS",
    "samenvatting": "[Max 150 woorden finale beleggingsoordeel]"
  },

  "databronnen": {
    "bronnen_geraadpleegd": [
      "[Bron 1]", "[Bron 2]"
    ],
    "pre_ipo_data_beschikbaar": false,
    "ontbrekende_data": "[Welke data ontbreekt of kon niet worden geverifieerd?]",
    "non_gaap_gebruikt": false,
    "non_gaap_toelichting": null
  },

  "bronnen": [
    {
      "url": "[URL]",
      "titel": "[Beschrijvende titel]",
      "type": "beurswebsite|jaarverslag|databron|nieuwsartikel|analistenrapport"
    }
  ],

  "update_historie": []
}
```

## Pad: index.json entry

Voeg na de JSON ook een entry toe aan `./data/index.json`:

```json
{
  "ticker": "[TICKER]",
  "naam": "[NAAM]",
  "sector": "[SECTOR]",
  "exchange": "[BEURS]",
  "koers": 0,
  "valuta": "[VALUTA]",
  "fair_value_basis": 0,
  "upside_pct": 0,
  "oordeel": "KOOP|HOLD|PASS",
  "scorekaart_totaal": 0,
  "scorekaart_max": 45,
  "peildatum": "YYYY-MM-DD",
  "domein": "[website.com]",
  "yahoo_symbol": "[TICKER.EX]",
  "tags": []
}
```

## Validatie

Na het opslaan: `cd platform && npx tsx src/lib/validate.ts [TICKER]`
Dit toont precies welke velden ontbreken of het verkeerde formaat hebben.
