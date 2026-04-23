# Schema Ground Truth — Fundamentele Analyse

**Dit bestand wijst naar de enige betrouwbare bronnen. Gebruik NIETS anders.**

## Hiërarchie van waarheid (in volgorde)

1. **`platform/src/lib/types.ts`** — TypeScript schema = DE gouden standaard voor velden en types.
2. **Cowork skill `fundamentele-analyse`** — proces, drempels, rubric, woordtellingen, tone-of-voice. Staat in cowork, niet in deze repo.
3. **`data/ASML.json`** — werkende referentie-analyse die 1-op-1 matcht met (1) en (2). Gebruik dit als voorbeeld, NIET ADYEN.json (die is deels incompleet).

> Alles in `docs/_archive/` is verouderd en moet genegeerd worden.

## Data flow

```
cowork skill                         platform
─────────────────                    ──────────────
  genereert JSON                     leest JSON
        │                                 ▲
        ▼                                 │
  platform/src/content/data/ <── sync ── data/
  [schrijft direct hier]                  │
                                     ook hier kopie
```

- De cowork skill **schrijft rechtstreeks** naar `platform/src/content/data/[TICKER].json`.
- Volgens `CLAUDE.md` moet `data/` en `platform/src/content/data/` gesynchroniseerd blijven (voor de handmatige generatie-workflow).
- `platform/src/lib/data.ts` bouwt de index live op uit `platform/src/content/data/`, dus GEEN `index.json` meer nodig.

## Validators (rollen)

| Tool | Rol | Wanneer draaien |
|---|---|---|
| `platform/src/lib/validate.ts` | struct + severity (kritiek/verwacht/optioneel) op render-tijd | automatisch bij build/dev |
| `platform/scripts/validate_structure.py` | **positieve** structuurchecks: verplichte velden, exacte synthese-keys, enum-waarden, truncation-detectie | na elke nieuwe/gewijzigde JSON |
| `platform/scripts/verify_consistency.py` | cross-reference waarden (meta↔exec↔fair_value↔scorekaart) | na elke nieuwe/gewijzigde JSON |
| cowork `dcf_calculator.py` | genereert mechanisch de cijfers (WACC, DCF, EPV, scorekaart) | als onderdeel van de skill |

**Beide Python-validators draaien altijd samen.** Eén alleen is niet genoeg:
- `validate_structure.py` vangt: lege arrays, verkeerde keys (bv. `laagste` ipv `fair_value_bandbreedte_laag`), truncated bestanden, enum-fouten.
- `verify_consistency.py` vangt: waarde-drift tussen secties (bv. synthese.laag != pessimistisch.fair_value).

Aanroep voor één ticker:
```
python platform/scripts/validate_structure.py TICKER && python platform/scripts/verify_consistency.py TICKER
```

Zonder arg: scant alle JSONs in `platform/src/content/data/`.

## Harde enum-regels (vaakst fout)

| Veld | Geldige waarden |
|---|---|
| `risicos[].kans` | `LAAG` \| `MIDDEN` \| `HOOG` |
| `risicos[].impact` | `KLEIN` \| `MIDDEL` \| `GROOT` |
| `katalysatoren[].richting` | `POSITIEF` \| `NEGATIEF` \| `NEUTRAAL` \| `BINAIR` |
| `katalysatoren[].impact` | `GROOT` \| `MIDDEL` \| `KLEIN` |
| `fair_value.scenarios[].scenario` | `Pessimistisch` \| `Basis` \| `Optimistisch` \| `Basis (IPO-gecorr.)` |
| `scorekaart.eindoordeel` | `KOOP` (≥33 & DCF≥3) \| `HOLD` \| `PASS` (<24 of DCF=1) |

## 17 top-level keys

`meta`, `executive_summary`, `bedrijfsprofiel`, `financieel`, `moat`, `management`, `sector_concurrentie`, `analyseframeworks`, `risicos`, `these_invalide_bij`, `esg`, `katalysatoren`, `fair_value`, `scorekaart`, `databronnen`, `bronnen`, `update_historie`.
