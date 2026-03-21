# Fundamentele analyse — Export naar dashboard

## Workflow na een analyse

1. Skill exporteert JSON automatisch naar `C:\Users\janco\aandelenanalyse\data\{TICKER}.json`
2. Voer daarna één commando uit:

```
python C:\Users\janco\aandelenanalyse\deploy.py
```

Klaar. Het script werkt `index.json` bij, vraagt om het domein als dat ontbreekt, en pusht naar GitHub. Site is binnen 1-2 minuten live.

---

## Stap toevoegen aan je Cowork skill

Plak dit **helemaal aan het eind** van je fundamentele analyse skill:

```
Sla de volledige analyse op als JSON-bestand naar:
C:\Users\janco\aandelenanalyse\data\{TICKER}.json

Gebruik EXACT dit dashboard-schema (getallen als number, niet string):

{
  "meta": {
    "ticker": "<bijv. HEIJM>",
    "naam": "<Volledige bedrijfsnaam>",
    "exchange": "<Beurs, bijv. Euronext Amsterdam>",
    "sector": "<Sector>",
    "segment": "<Subsegment>",
    "koers": <getal>,
    "valuta": "<bijv. EUR>",
    "peildatum": "<YYYY-MM-DD>",
    "marktkapitalisatie": "<bijv. ~EUR 1.2 mld>"
  },
  "executive_summary": {
    "kernthese": "<1-2 zinnen>",
    "oordeel": "<KOOP | HOLD | PASS>",
    "koers": <getal>,
    "valuta": "<bijv. EUR>",
    "fair_value_basis": <getal>,
    "upside_pct": <getal>,
    "fair_value_scenarios": [
      {"scenario": "Pessimistisch", "fair_value": <getal>, "upside_pct": <getal>},
      {"scenario": "Basis",         "fair_value": <getal>, "upside_pct": <getal>},
      {"scenario": "Optimistisch",  "fair_value": <getal>, "upside_pct": <getal>}
    ],
    "grootste_kans": "<1-2 zinnen>",
    "grootste_risico": "<1-2 zinnen>"
  },
  "bedrijfsprofiel": {
    "beschrijving": "<kort profiel>",
    "segmenten": [{"naam": "<segment>", "omzet_pct": <getal>}],
    "aandeelhouders": [{"naam": "<naam>", "pct": <getal>}]
  },
  "financieel": {
    "valuta_label": "<bijv. EUR mln>",
    "resultatenrekening": [
      {"jaar": <getal>, "omzet": <getal>, "omzet_groei_pct": <getal|null>,
       "ebitda": <getal>, "ebitda_marge_pct": <getal>,
       "nettowinst": <getal>, "nettomarge_pct": <getal>, "eps": <getal|null>}
    ],
    "kasstromen": [
      {"jaar": <getal>, "cfo": <getal>, "capex": <getal>, "fcf": <getal>,
       "fcf_per_aandeel": <getal|null>, "dividend_uitbetaald": <getal|null>}
    ],
    "balans": [
      {"jaar": <getal>, "nettoschuld": <getal>, "eigen_vermogen": <getal>, "debt_ebitda": <getal|null>}
    ],
    "waardering": {
      "pe": <getal|null>, "ev_ebitda": <getal|null>, "p_fcf": <getal|null>,
      "fcf_yield_pct": <getal|null>, "p_b": <getal|null>, "dividendrendement_pct": <getal|null>
    },
    "rendementsindicatoren": {
      "jaar": <getal>, "roce_pct": <getal|null>, "roe_pct": <getal|null>,
      "roic_pct": <getal|null>, "roa_pct": <getal|null>
    }
  },
  "moat": {
    "oordeel": "<WIDE MOAT | NARROW MOAT | NO MOAT>",
    "toelichting": "<uitleg>",
    "categorieen": [
      {"naam": "<cat>", "oordeel": "<STERK|AANWEZIG|BEPERKT|AFWEZIG>", "toelichting": "<uitleg>"}
    ]
  },
  "management": {
    "personen": [{"functie": "<CEO etc>", "naam": "<naam>", "achtergrond": "<kort>"}],
    "capital_allocation": "<beoordeling>",
    "oordeel": "<STERK | NEUTRAAL | ZWAK>",
    "toelichting": "<uitleg>"
  },
  "fair_value": {
    "dcf": {
      "basis_fcf": <getal>, "valuta_label": "<bijv. EUR mln>",
      "wacc_pct": <getal>, "groei_fase1_pct": <getal>, "terminal_groei_pct": <getal>
    },
    "scenarios": [
      {"scenario": "Pessimistisch", "fcf_groei_pct": <getal>, "wacc_pct": <getal>, "fair_value": <getal>, "upside_pct": <getal>},
      {"scenario": "Basis",         "fcf_groei_pct": <getal>, "wacc_pct": <getal>, "fair_value": <getal>, "upside_pct": <getal>},
      {"scenario": "Optimistisch",  "fcf_groei_pct": <getal>, "wacc_pct": <getal>, "fair_value": <getal>, "upside_pct": <getal>}
    ],
    "gevoeligheid": {
      "wacc_range": [<getallen>],
      "groei_range": [<getallen>],
      "matrix": [[<getallen per rij>]]
    }
  },
  "scorekaart": {
    "eindoordeel": "<KOOP | HOLD | PASS>",
    "totaal": <getal>, "max": <getal>,
    "samenvatting": "<1-2 zinnen>",
    "items": [
      {"framework": "<Graham | Buffett / Munger | Peter Lynch | ...>",
       "score": <getal>, "max": <getal>, "oordeel": "<toelichting>"}
    ]
  }
}

Na het opslaan, voer dit uit in een terminal:
python C:\Users\janco\aandelenanalyse\deploy.py
```

---

## Logo

`deploy.py` vraagt automatisch het website-domein voor nieuwe bedrijven (bijv. `heijmans.nl`).
