# Skill toevoeging — kopieer dit blok en plak het onder aan je bestaande skill prompt

Plak de volgende tekst DIRECT onder het laatste blok (na de Disclaimer sectie) van je fundamentele analyse skill:

---

════════════════════════════════════════
JSON EXPORT — AUTOMATISCH NA HET DOCUMENT
════════════════════════════════════════

Na het genereren van het Word-document, schrijf ALTIJD automatisch ook
een JSON-bestand weg met het Write tool. Gebruik als pad:
  ./dashboard/data/[TICKER].json
(relatief aan de map waar je dit uitvoert, dus naast de bestaande .docx bestanden)

Gebruik EXACT de onderstaande JSON-structuur. Vul alle velden in op basis
van de analyse die je zojuist hebt uitgevoerd. Zet null voor velden die
je niet kon verifiëren.

```json
{
  "meta": {
    "ticker": "[TICKER]",
    "exchange": "[BEURS]",
    "naam": "[VOLLEDIGE BEDRIJFSNAAM]",
    "sector": "[SECTOR]",
    "segment": "[SUBSEGMENT]",
    "koers": [KOERS ALS GETAL],
    "valuta": "[VALUTA]",
    "peildatum": "[YYYY-MM-DD]",
    "marktkapitalisatie": "[TEKST]"
  },
  "executive_summary": {
    "kernthese": "[3-5 zinnen kernthese]",
    "oordeel": "[KOOP|HOLD|PASS]",
    "koers": [KOERS],
    "valuta": "[VALUTA]",
    "fair_value_basis": [BASISSCENARIO FAIR VALUE],
    "upside_pct": [UPSIDE % ALS GETAL ZONDER %],
    "fair_value_scenarios": [
      { "scenario": "Pessimistisch", "fair_value": [GETAL], "upside_pct": [GETAL] },
      { "scenario": "Basis",         "fair_value": [GETAL], "upside_pct": [GETAL] },
      { "scenario": "Optimistisch",  "fair_value": [GETAL], "upside_pct": [GETAL] }
    ],
    "grootste_kans": "[één zin]",
    "grootste_risico": "[één zin]"
  },
  "bedrijfsprofiel": {
    "beschrijving": "[kort bedrijfsmodel]",
    "personeel": [GETAL OF null],
    "landen": [GETAL OF null],
    "segmenten": [
      { "naam": "[NAAM]", "omzet_pct": [GETAL], "beschrijving": "[KORT]" }
    ],
    "aandeelhouders": [
      { "naam": "[NAAM]", "pct": [GETAL], "type": "Controlerend|Institutioneel|Publiek" }
    ]
  },
  "financieel": {
    "valuta_label": "[bijv. EUR mln of USD mln]",
    "resultatenrekening": [
      {
        "jaar": [YYYY],
        "omzet": [GETAL OF null],
        "omzet_groei_pct": [GETAL OF null],
        "ebitda": [GETAL OF null],
        "ebitda_marge_pct": [GETAL OF null],
        "nettowinst": [GETAL OF null],
        "nettomarge_pct": [GETAL OF null],
        "eps": [GETAL OF null]
      }
    ],
    "kasstromen": [
      { "jaar": [YYYY], "fcf": [GETAL OF null], "fcf_per_aandeel": [GETAL OF null] }
    ],
    "balans": [
      { "jaar": [YYYY], "nettoschuld": [GETAL], "eigen_vermogen": [GETAL], "debt_ebitda": [GETAL OF null] }
    ],
    "rendementsindicatoren": {
      "jaar": [YYYY],
      "roce_pct": [GETAL OF null],
      "roe_pct": [GETAL OF null],
      "roic_pct": [GETAL OF null],
      "roa_pct": [GETAL OF null]
    },
    "waardering": {
      "pe": [GETAL OF null],
      "ev_ebitda": [GETAL OF null],
      "p_fcf": [GETAL OF null],
      "fcf_yield_pct": [GETAL OF null],
      "p_b": [GETAL OF null],
      "ev_omzet": [GETAL OF null],
      "dividendrendement_pct": [GETAL OF null]
    }
  },
  "moat": {
    "oordeel": "[WIDE MOAT|NARROW MOAT|NO MOAT]",
    "toelichting": "[2-3 zinnen]",
    "categorieen": [
      { "naam": "Immateriële activa",  "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": [1-5], "toelichting": "[kort]" },
      { "naam": "Overstapkosten",      "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": [1-5], "toelichting": "[kort]" },
      { "naam": "Netwerkeffecten",     "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": [1-5], "toelichting": "[kort]" },
      { "naam": "Kostenvoordeel",      "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": [1-5], "toelichting": "[kort]" },
      { "naam": "Efficiënte schaal",   "oordeel": "STERK|AANWEZIG|BEPERKT|AFWEZIG", "score": [1-5], "toelichting": "[kort]" }
    ]
  },
  "management": {
    "oordeel": "[STERK|NEUTRAAL|ZORGWEKKEND]",
    "personen": [
      { "functie": "[CEO/CFO/etc]", "naam": "[NAAM]", "achtergrond": "[KORT]" }
    ],
    "capital_allocation": "[samenvatting capital allocation track record]",
    "toelichting": "[eindoordeel management in 2-3 zinnen]"
  },
  "fair_value": {
    "dcf": {
      "basis_fcf": [GETAL],
      "wacc_pct": [GETAL],
      "groei_fase1_pct": [GETAL],
      "terminal_groei_pct": [GETAL]
    },
    "scenarios": [
      { "scenario": "Pessimistisch",    "fcf_groei_pct": [GETAL], "wacc_pct": [GETAL], "fair_value": [GETAL], "upside_pct": [GETAL] },
      { "scenario": "Basis",            "fcf_groei_pct": [GETAL], "wacc_pct": [GETAL], "fair_value": [GETAL], "upside_pct": [GETAL] },
      { "scenario": "Optimistisch",     "fcf_groei_pct": [GETAL], "wacc_pct": [GETAL], "fair_value": [GETAL], "upside_pct": [GETAL] },
      { "scenario": "Basis (IPO-gecorr.)", "fcf_groei_pct": [GETAL], "wacc_pct": [GETAL], "fair_value": [GETAL], "upside_pct": [GETAL] }
    ],
    "gevoeligheid": {
      "wacc_range": [8.0, 8.5, 9.0, 9.5, 10.0, 10.5],
      "groei_range": [1.0, 2.0, 3.0, 4.0, 5.0],
      "matrix": [
        [RIJ VOOR groei=1%: 6 waarden],
        [RIJ VOOR groei=2%: 6 waarden],
        [RIJ VOOR groei=3%: 6 waarden],
        [RIJ VOOR groei=4%: 6 waarden],
        [RIJ VOOR groei=5%: 6 waarden]
      ]
    }
  },
  "scorekaart": {
    "items": [
      {
        "framework": "Graham",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "[bijv. DEFENSIVE INVESTOR]",
        "indicatoren": [
          { "naam": "[bijv. P/E ratio (TTM)]", "waarde": "[bijv. 12.5×]", "beoordeling": "[bijv. ✓ Voldoet (< 15)]" }
        ],
        "analyse": "[3-5 zinnen over waarom dit framework dit bedrijf zo beoordeelt. Verwijs naar specifieke cijfers.]"
      },
      {
        "framework": "Buffett / Munger",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "[bijv. WONDERFUL COMPANY AT FAIR PRICE]",
        "indicatoren": [
          { "naam": "[indicator]", "waarde": "[waarde]", "beoordeling": "[✓/~/✗ toelichting]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      },
      {
        "framework": "Peter Lynch",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "[bijv. STALWART / FAST GROWER / ASSET PLAY]",
        "indicatoren": [
          { "naam": "[indicator]", "waarde": "[waarde]", "beoordeling": "[✓/~/✗ toelichting]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      },
      {
        "framework": "Phil Fisher",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "[bijv. GROWTH COMPANY ANALYSIS]",
        "indicatoren": [
          { "naam": "[indicator]", "waarde": "[waarde]", "beoordeling": "[✓/~/✗ toelichting]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      },
      {
        "framework": "Magic Formula",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "EARNINGS YIELD + ROIC (GREENBLATT)",
        "indicatoren": [
          { "naam": "Earnings Yield (EBIT/EV)", "waarde": "[bijv. 18%]", "beoordeling": "[✓/~/✗ toelichting]" },
          { "naam": "ROIC", "waarde": "[bijv. 15%]", "beoordeling": "[✓/~/✗ toelichting]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      },
      {
        "framework": "Moat",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "ECONOMISCHE SLOTGRACHT",
        "indicatoren": [
          { "naam": "[bijv. Kostenvoordeel]", "waarde": "[beschrijving]", "beoordeling": "[✓/~/✗ toelichting]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      },
      {
        "framework": "Management",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "CAPITAL ALLOCATION & KWALITEIT",
        "indicatoren": [
          { "naam": "[bijv. Leverage-reductie]", "waarde": "[beschrijving]", "beoordeling": "[✓/~/✗ toelichting]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      },
      {
        "framework": "Fair Value DCF",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "DISCOUNTED CASH FLOW — BASISSCENARIO",
        "indicatoren": [
          { "naam": "Genormaliseerde FCF (basis)", "waarde": "[bijv. EUR 200M]", "beoordeling": "[toelichting]" },
          { "naam": "WACC", "waarde": "[bijv. 9.0%]", "beoordeling": "[toelichting]" },
          { "naam": "Fair Value (basis)", "waarde": "[bijv. EUR 45]", "beoordeling": "[✓ +XX% upside]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      },
      {
        "framework": "Fair Value IPO-gecorr.",
        "score": [1-5], "max": 5, "oordeel": "[tekst]",
        "categorie": "IPO-GECORRIGEERDE WAARDERING",
        "indicatoren": [
          { "naam": "IPO-koers", "waarde": "[bijv. EUR 12]", "beoordeling": "Historisch referentiepunt" },
          { "naam": "Fair Value (basis DCF)", "waarde": "[bijv. EUR 45]", "beoordeling": "[✓ upside]" }
        ],
        "analyse": "[3-5 zinnen analyse]"
      }
    ],
    "totaal": [SOM VAN SCORES],
    "max": 45,
    "eindoordeel": "[KOOP|HOLD|PASS]",
    "samenvatting": "[max 150 woorden finale beleggingsoordeel]"
  }
}
```

Na het schrijven van het JSON-bestand, update ook het index.json bestand in ./dashboard/data/index.json.
Voeg het bedrijf toe aan de "companies" array als het er nog niet in staat, of vervang de bestaande entry
als de ticker al bestaat. Gebruik voor index.json de volgende compacte structuur per bedrijf:

```json
{
  "ticker": "[TICKER]",
  "naam": "[NAAM]",
  "sector": "[SECTOR]",
  "exchange": "[BEURS]",
  "koers": [GETAL],
  "valuta": "[VALUTA]",
  "fair_value_basis": [GETAL],
  "upside_pct": [GETAL],
  "oordeel": "[KOOP|HOLD|PASS]",
  "scorekaart_totaal": [GETAL],
  "scorekaart_max": 45,
  "peildatum": "[YYYY-MM-DD]"
}
```

Zet "laatste_update" in index.json op de datum van vandaag (YYYY-MM-DD formaat).
