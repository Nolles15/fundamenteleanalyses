# Aandelenanalyse Platform

## Projectstructuur

```
aandelenanalyse/
├── data/                    Analyse-output (JSON + .md) — gegenereerd door Janco's skill
├── docs/                    Plannen en documentatie
│   ├── BUILD_PLAN.md        Technisch bouwplan Next.js platform
│   ├── BUSINESS_PLAN.md     Businessmodel en prijsstrategie
│   └── SKILL_*.md           Skill-prompts (referentie, niet aanpassen)
├── platform/                Next.js 16 applicatie (het product)
│   └── src/
│       ├── content/data/    Kopie van data/ — SYNC HOUDEN
│       └── lib/types.ts     TypeScript schema — DE GOUDEN STANDAARD
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
- GEEN Python scripts, Flask apps, of andere tooling toevoegen
- docs/SKILL_*.md bestanden NIET wijzigen — dat is Janco's domein

### Tech stack
- Next.js 16 (App Router, Server Components, Turbopack)
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline {}`, GEEN tailwind.config.js)
- Recharts v3 voor grafieken
- TypeScript strict mode
- Deployment: Vercel (nog te configureren)
