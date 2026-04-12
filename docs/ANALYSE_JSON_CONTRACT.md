# Analyse JSON Contract

**Dit document is de ENIGE referentie voor de JSON-structuur die de skill moet produceren.**
Afgeleid van `platform/src/lib/types.ts`. Bij twijfel: types.ts wint.

Laatste sync: 2026-04-12

## Regels

- Alle velden zijn **Nederlands** tenzij anders aangegeven
- `oordeel` (NIET `verdict`), `omschrijving` (NIET `naam` bij risico's)
- Framework keys: `graham`, `buffett_munger`, `lynch`, `fisher`, `greenblatt` (NIET `peter_lynch`, `phil_fisher`, `greenblatt_magic_formula`)
- Porter keys: `dreiging_toetreders`, `macht_leveranciers`, `macht_klanten`, `dreiging_substituten`, `concurrentie_intensiteit` (NIET Engelse vertalingen)
- Kans/impact waarden: `hoog`, `middel`, `laag` (lowercase)

## Top-level structuur

```
{
  "meta": { ... },                        // VERPLICHT
  "executive_summary": { ... },           // VERPLICHT
  "bedrijfsprofiel": { ... },             // VERPLICHT
  "financieel": { ... },                  // VERPLICHT
  "moat": { ... },                        // VERPLICHT
  "management": { ... },                  // VERPLICHT
  "sector_concurrentie": { ... },         // optioneel
  "analyseframeworks": { ... },           // optioneel
  "risicos": [ ... ],                     // optioneel
  "these_invalide_bij": "string",         // optioneel
  "esg": { ... },                         // optioneel
  "katalysatoren": [ ... ],               // optioneel
  "fair_value": { ... },                  // VERPLICHT
  "scorekaart": { ... },                  // VERPLICHT
  "databronnen": { ... },                 // optioneel
  "bronnen": [ ... ],                     // optioneel
  "update_historie": [ ... ]              // optioneel
}
```

## meta (VERPLICHT)

```json
{
  "ticker": "ADYEN",
  "exchange": "Euronext Amsterdam",
  "naam": "Adyen N.V.",
  "sector": "Technologie",
  "industrie": "Payment Processing",
  "land": "Nederland",
  "koers": 860,
  "valuta": "EUR",
  "peildatum": "2026-04-12",
  "marktkapitalisatie": "€24,6 mrd",
  "marktkapitalisatie_mln": 24600,
  "free_float_pct": 85,
  "index_lidmaatschap": "AEX",
  "domein": "adyen.com",
  "yahoo_symbol": "ADYEN.AS"
}
```

## executive_summary (VERPLICHT)

```json
{
  "kernthese": "Één zin die de kernthese beschrijft.",
  "oordeel": "KOOP",
  "koers": 860,
  "valuta": "EUR",
  "fair_value_basis": 1229,
  "fair_value_kansgewogen": 1280,
  "epv_per_aandeel": 486,
  "upside_pct": 43,
  "fair_value_scenarios": [
    {
      "scenario": "Bear",
      "fair_value": 900,
      "upside_pct": 5,
      "fcf_groei_pct": 12,
      "wacc_pct": 9.5,
      "kans_pct": 25
    }
  ],
  "reverse_dcf_impliciete_groei_pct": 8.1,
  "grootste_kans": "Beschrijving grootste kans",
  "grootste_risico": "Beschrijving grootste risico"
}
```

**Let op**: `oordeel` moet exact `"KOOP"`, `"HOLD"`, of `"PASS"` zijn.

## bedrijfsprofiel (VERPLICHT)

```json
{
  "beschrijving": "Uitgebreide beschrijving van het bedrijf.",
  "geschiedenis": "Korte historie.",
  "bedrijfsmodel": "Beschrijving businessmodel.",
  "klantenprofiel": "Wie zijn de klanten.",
  "oprichtingsjaar": 2006,
  "ipo_datum": "2018-06-13",
  "ipo_koers": 240,
  "personeel": 4500,
  "landen_actief": 30,
  "segmenten": [
    { "naam": "Digital", "omzet_pct": 55, "beschrijving": "Online betalingen" }
  ],
  "aandeelhouders": [
    { "naam": "Capital Group", "pct": 5.1, "type": "institutioneel" }
  ],
  "geografische_spreiding": [
    { "regio": "Europa", "omzet_pct": 52 }
  ]
}
```

## financieel (VERPLICHT)

```json
{
  "valuta_label": "EUR mln",
  "resultatenrekening": [
    {
      "jaar": 2024,
      "omzet": 1900,
      "omzet_groei_pct": 23,
      "brutowinst": 1400,
      "brutomarge_pct": 74,
      "ebit": 750,
      "ebit_marge_pct": 39,
      "ebitda": 850,
      "ebitda_marge_pct": 45,
      "nettowinst": 650,
      "nettomarge_pct": 34,
      "eps": 22.5,
      "eps_groei_pct": 28,
      "aandelen_uitstaand_mln": 28.9
    }
  ],
  "kasstromen": [
    {
      "jaar": 2024,
      "cfo": 800,
      "capex": -100,
      "fcf": 700,
      "fcf_na_sbc": 650,
      "fcf_per_aandeel": 24.2,
      "fcf_marge_pct": 37,
      "sbc": 50
    }
  ],
  "balans": [
    {
      "jaar": 2024,
      "totale_activa": 12000,
      "eigen_vermogen": 5000,
      "bruto_schuld": 0,
      "nettoschuld": -2000,
      "debt_equity": 0,
      "debt_ebitda": 0,
      "current_ratio": 1.5,
      "boekwaarde_per_aandeel": 173
    }
  ],
  "rendementsindicatoren": [
    {
      "jaar": 2024,
      "roce_pct": 30,
      "roe_pct": 25,
      "roic_pct": 35,
      "roa_pct": 12,
      "wacc_pct": 9,
      "roic_wacc_spread": 26
    }
  ],
  "waardering": {
    "pe": 25,
    "pe_forward": 22,
    "ev_ebitda": 20,
    "p_fcf": 28,
    "fcf_yield_pct": 3.6,
    "p_b": 9.6,
    "ev_omzet": 10,
    "dividendrendement_pct": 0
  }
}
```

## moat (VERPLICHT)

```json
{
  "oordeel": "Breed",
  "duurzaamheid_horizon": "10+ jaar",
  "toelichting": "Waarom de moat breed is.",
  "categorieen": [
    {
      "naam": "Switching costs",
      "oordeel": "Sterk",
      "score": 5,
      "toelichting": "Toelichting."
    }
  ]
}
```

**Let op**: `categorieen` met dubbel-e (Nederlands).

## management (VERPLICHT)

```json
{
  "oordeel": "Sterk",
  "personen": [
    { "functie": "CEO", "naam": "Pieter van der Does", "achtergrond": "Medeoprichter." }
  ],
  "compensatie": {
    "sbc_pct_marktkapitalisatie": 0.2,
    "prikkels_aligned": true,
    "toelichting": "Toelichting."
  },
  "capital_allocation": "Uitstekend",
  "capital_allocation_detail": "Details.",
  "owner_operator": true,
  "eigenbelang_pct": 5,
  "toelichting": "Samenvattende toelichting."
}
```

## sector_concurrentie (optioneel)

```json
{
  "sectorprofiel": {
    "type": "Oligopolie",
    "kapitaalintensief": false,
    "consolidatiegraad": "Hoog",
    "sentiment": "Positief",
    "trends": "Trends beschrijving."
  },
  "porter": {
    "dreiging_toetreders": { "score": "Middel", "toelichting": "..." },
    "macht_leveranciers": { "score": "Laag", "toelichting": "..." },
    "macht_klanten": { "score": "Middel", "toelichting": "..." },
    "dreiging_substituten": { "score": "Middel", "toelichting": "..." },
    "concurrentie_intensiteit": { "score": "Hoog", "toelichting": "..." },
    "conclusie": "Samenvattende conclusie."
  },
  "concurrenten": [
    {
      "naam": "Stripe",
      "omzet_groei_pct": 25,
      "ebit_marge_pct": 20,
      "roic_pct": null,
      "ev_ebitda": 35,
      "p_fcf": 40
    }
  ],
  "positie": "#2 mondiaal in enterprise-betalingen",
  "positie_toelichting": "Details."
}
```

**KRITIEK**: Porter keys zijn Nederlands. Elke kracht is een object `{ "score": "...", "toelichting": "..." }`, NIET een platte string.

## analyseframeworks (optioneel)

```json
{
  "graham": {
    "oordeel": "VOLDOET NIET",
    "graham_number": 58,
    "margin_of_safety_pct": -93,
    "toelichting": "Toelichting."
  },
  "buffett_munger": {
    "oordeel": "POSITIEF",
    "roic_boven_wacc_structureel": true,
    "toelichting": "Toelichting."
  },
  "lynch": {
    "categorie": "Fast Grower",
    "oordeel": "INTERESSANT",
    "peg_ratio": 1.1,
    "toelichting": "Toelichting."
  },
  "fisher": {
    "oordeel": "STERK",
    "toelichting": "Toelichting."
  },
  "greenblatt": {
    "oordeel": "GEMIDDELD",
    "earnings_yield_pct": 4.0,
    "return_on_capital_pct": 35,
    "toelichting": "Toelichting."
  }
}
```

**KRITIEK**: Keys zijn `lynch` (NIET `peter_lynch`), `fisher` (NIET `phil_fisher`), `greenblatt` (NIET `greenblatt_magic_formula`). Veld heet `oordeel` (NIET `verdict`).

## risicos (optioneel)

```json
[
  {
    "omschrijving": "Korte beschrijving van het risico",
    "kans": "hoog",
    "impact": "hoog",
    "dcf_aanname_geraakt": "Omzetgroei fase 1",
    "toelichting": "Uitgebreide toelichting."
  }
]
```

**KRITIEK**: Veld heet `omschrijving` (NIET `naam`). Waarden voor kans/impact: `hoog`, `middel`, `laag` (lowercase).

## fair_value (VERPLICHT)

```json
{
  "methoden_toegepast": ["DCF", "EPV", "Reverse DCF"],
  "dcf": {
    "basis_fcf": 700,
    "groei_fase1_pct": 18,
    "terminal_groei_pct": 3,
    "terminal_value_pct_van_totaal": 65,
    "wacc_pct": 9,
    "shares_outstanding_mln": 28.9,
    "nettoschuld_huidig": -2000
  },
  "scenarios": [
    { "scenario": "Bear", "fair_value": 900, "upside_pct": 5, "kans_pct": 25 },
    { "scenario": "Base", "fair_value": 1229, "upside_pct": 43, "kans_pct": 50 },
    { "scenario": "Bull", "fair_value": 1600, "upside_pct": 86, "kans_pct": 25 }
  ],
  "kansgewogen_fair_value": 1280,
  "reverse_dcf": {
    "impliciete_groei_pct": 8.1,
    "interpretatie": "Markt prijst slechts 8% groei in, terwijl 18-25% realistisch is."
  },
  "epv": {
    "genormaliseerde_ebit_marge_pct": 39,
    "genormaliseerde_nopat": 580,
    "maintenance_capex": 60,
    "adjusted_earnings_power": 520,
    "epv_per_aandeel": 486,
    "groeipremie_pct": 153
  },
  "synthese": {
    "fair_value_bandbreedte_laag": 900,
    "fair_value_bandbreedte_centraal": 1229,
    "fair_value_bandbreedte_hoog": 1600,
    "margin_of_safety_vereist_pct": 15,
    "koopniveau": 1045
  }
}
```

## scorekaart (VERPLICHT)

```json
{
  "items": [
    { "framework": "Winstgevendheid", "score": 4, "max": 5, "oordeel": "Sterk" }
  ],
  "totaal": 35,
  "max": 45,
  "eindoordeel": "KOOP",
  "samenvatting": "Samenvatting van de scorekaart."
}
```

**Let op**: `totaal` en `max` (NIET `totaal_score` en `max_score`).

## Veelgemaakte fouten

| Fout | Correct |
|------|---------|
| `"verdict": "STERK"` | `"oordeel": "STERK"` |
| `"naam": "Concurrentie"` (bij risico) | `"omschrijving": "Concurrentie"` |
| `"peter_lynch": { ... }` | `"lynch": { ... }` |
| `"phil_fisher": { ... }` | `"fisher": { ... }` |
| `"greenblatt_magic_formula": { ... }` | `"greenblatt": { ... }` |
| `"threat_new_entrants": "MIDDEL — ..."` | `"dreiging_toetreders": { "score": "Middel", "toelichting": "..." }` |
| `"kans": "MIDDEN"` | `"kans": "middel"` |
| `"impact": "GROOT"` | `"impact": "hoog"` |
| `"totaal_score": 35` | `"totaal": 35` |
| `"categorien": [...]` | `"categorieen": [...]` |
