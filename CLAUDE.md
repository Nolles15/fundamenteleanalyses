# Aandelenanalyse Platform

## Projectstructuur

```
aandelenanalyse/
├── data/                    Analyse-output (JSON + .md) — gegenereerd door Janco's skill
├── docs/                    Plannen en documentatie
│   ├── BUILD_PLAN.md        Technisch bouwplan Next.js platform
│   ├── BUSINESS_PLAN.md     Businessmodel en prijsstrategie
│   ├── SCHEMA_GROUND_TRUTH.md  Wijst naar types.ts + cowork skill + ASML.json (enige geldige bronnen)
│   └── _archive/            Verouderde docs — NIET gebruiken
├── platform/                Next.js 16 applicatie (het product)
│   └── src/
│       ├── content/data/    Kopie van data/ — SYNC HOUDEN (cowork skill schrijft hier direct)
│       └── lib/types.ts     TypeScript schema — DE GOUDEN STANDAARD
│   └── scripts/             Validator-scripts (verify_consistency.py)
└── CLAUDE.md                Dit bestand
```

## Regels

### Data flow (KRITIEK)
1. Janco runt handmatig een skill die per ticker een JSON genereert
2. Die JSON's staan in `data/` en worden gekopieerd naar `platform/src/content/data/`
3. `platform/src/lib/types.ts` definieert het volledige schema
4. Het platform rendert conditioneel: tonen als data er is, verbergen als null

### Schema authority
- **types.ts is de ENIGE bron van waarheid** voor welke velden bestaan
- Bouw componenten ALTIJD tegen het volledige types.ts schema
- Gebruik NOOIT een bestaande JSON als referentie voor welke velden er zijn
- JSON's variëren in volledigheid — dat is OK, componenten moeten alles aankunnen

### Wat NIET te doen
- GEEN bestanden aanmaken in de root (scripts, pipelines, agents, etc.)
- GEEN nieuwe mappen aanmaken buiten data/, docs/, platform/
- GEEN schema-informatie afleiden uit JSON-bestanden — gebruik types.ts
- GEEN Flask apps of ad-hoc tooling. Validator-scripts mogen alleen in `platform/scripts/`.
- NOOIT bestanden in `docs/_archive/` als referentie gebruiken — die zijn outdated.
- Bij schema-wijzigingen: synchroniseer `types.ts` + cowork skill + `data/ASML.json` (de referentie).

### Tech stack
- Next.js 16 (App Router, Server Components, Turbopack)
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline {}`, GEEN tailwind.config.js)
- Recharts v3 voor grafieken
- TypeScript strict mode
- Deployment: Vercel (nog te configureren)
