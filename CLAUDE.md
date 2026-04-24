# Aandelenanalyse Platform

## Projectstructuur

```
aandelenanalyse/
├── data/                    Stage-2 output (JSON per ticker)
├── docs/                    Plannen + documentatie
│   ├── PIPELINE_TWO_STAGE.md     Ground truth voor stage 2 (Claude Code)
│   ├── HANDOVER_VOLGENDE_SESSIE.md   Per-ticker flow (start hier)
│   ├── BUILD_PLAN.md
│   ├── BUSINESS_PLAN.md
│   ├── SCHEMA_GROUND_TRUTH.md
│   ├── FUTURE_PIPELINE_ULTRAPLAN.md  Gearchiveerd — pas bij 20+ tickers
│   └── _archive/                 Verouderd, NIET gebruiken
├── platform/                Next.js 16 applicatie (het product)
│   └── src/
│       ├── content/data/    Kopie van data/ (wordt door stage2.py beheerd)
│       └── lib/types.ts     TypeScript schema — GOUDEN STANDAARD
│   └── scripts/             validate_structure.py + verify_consistency.py
├── research/                Stage-1 output (MD per ticker, geschreven door cowork)
│   ├── TEMPLATE.md
│   └── _PROMPT_COWORK.md
├── scripts/                 Orchestratie (niet-platform)
│   ├── stage2.py            Stage-2 orchestrator (precheck/write/verify/publish)
│   └── check-drift.py       Enum-drift detector (draait binnen precheck)
├── .claude/settings.local.json   Persistent permissions voor stage 2
└── CLAUDE.md                Dit bestand
```

## Regels

### Data flow (KRITIEK)
1. Stage 1 — Claude cowork schrijft `research/[TICKER].md` (research-only)
2. Stage 2 — Claude Code runt `python scripts/stage2.py [TICKER] …` om MD te
   converteren naar JSON, te valideren, te builden en te pushen
3. `platform/src/lib/types.ts` definieert het volledige schema
4. Het platform rendert conditioneel: tonen als data er is, verbergen als null

### Stage-2 shortcut
Als Janco zegt *"Run stage 2 voor [TICKER]"*:
1. `python scripts/stage2.py [TICKER] precheck` — drift + MD aanwezig
2. Lees `research/[TICKER].md`, bouw JSON-dict volgens 17-key schema, schrijf
   tmp-file via `python -c "json.dump(...)"` (géén Write-tool — kapt op 45KB)
3. `python scripts/stage2.py [TICKER] write <tmp-file>` — naar beide targets
4. `python scripts/stage2.py [TICKER] verify-and-publish`
Zie `docs/PIPELINE_TWO_STAGE.md` + `docs/HANDOVER_VOLGENDE_SESSIE.md`.

### Schema authority
- **types.ts is de ENIGE bron van waarheid** voor welke velden bestaan
- Bouw componenten ALTIJD tegen het volledige types.ts schema
- Gebruik NOOIT een bestaande JSON als referentie voor welke velden er zijn
- JSON's variëren in volledigheid — dat is OK, componenten moeten alles aankunnen

### Wat NIET te doen
- GEEN nieuwe ad-hoc mappen in de root. Alleen `data/`, `docs/`, `platform/`,
  `research/`, `scripts/` zijn officieel.
- GEEN schema-informatie afleiden uit JSON-bestanden — gebruik types.ts
- GEEN Flask apps of ad-hoc tooling. Platform-validators alleen in
  `platform/scripts/`; orchestratie alleen in `scripts/`.
- NOOIT bestanden in `docs/_archive/` als referentie gebruiken — die zijn outdated.
- Bij schema-wijzigingen: update `types.ts` + `platform/scripts/validate_structure.py`
  + `research/TEMPLATE.md` + `research/_PROMPT_COWORK.md` en draai
  `python scripts/check-drift.py` om drift te vangen voor je verder gaat.
  Referentie-ticker voor complete JSON: `data/MIPS.json`.

### Tech stack
- Next.js 16 (App Router, Server Components, Turbopack)
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline {}`, GEEN tailwind.config.js)
- Recharts v3 voor grafieken
- TypeScript strict mode
- Deployment: Vercel (nog te configureren)
