# research/

Stage 1-output van de twee-traps analyse-pipeline.

## Doel van deze folder

Cowork produceert hier markdown-rapporten per ticker. Claude Code leest die en
injecteert ze in de JSON-structuur die de Next.js-site rendert.

## Waarom gescheiden?

Voorheen probeerde cowork in één run research + JSON + validator-check te doen.
Dat liep stuk op:
- Read-tool cache-divergentie op Windows (80KB+ files)
- Enum-hallucinaties (BEPERKTE MOAT / Buffett/Munger zonder spaties)
- Cowork dat validator-scripts probeerde te "repareren"
- Null-velden die validator passeren maar UI crashen (toLocaleString)

Oplossing: cowork doet wat cowork goed kan (diepe research), Claude Code doet
wat deterministisch moet (JSON + schema-compliance + build-gate).

## Folderstructuur

```
research/
├── README.md              (dit bestand)
├── TEMPLATE.md            (cowork-sjabloon — 17 secties mappend op JSON)
├── _PROMPT_COWORK.md      (copy-paste cowork-prompt per ticker)
└── [TICKER].md            (cowork-output per ticker)
```

## Pipeline

### Stage 1 — Cowork
1. Janco plakt prompt uit `_PROMPT_COWORK.md` (met ticker-placeholders ingevuld)
2. Cowork leest `TEMPLATE.md` + researcht + vult `[TICKER].md`
3. Eén Write-call met volledige MD. Geen JSON. Geen platform-aanpassingen.

### Stage 2 — Claude Code
1. Leest `research/[TICKER].md`
2. Bouwt JSON volgens 17-key schema
3. Schrijft beide paden: `data/[TICKER].json` + `platform/src/content/data/[TICKER].json`
4. SHA256-check → validator structure → validator consistency → build-gate
5. Git commit + push (alleen bij alle groen)

## Harde regel voor cowork

> Cowork raakt NIETS aan buiten `research/[TICKER].md`. Ook niet om te
> "verifiëren" of te "fixen". Twijfels gaan in de MD zelf onder
> `## Opmerkingen voor Claude Code`.

## Voor Claude Code sessies

Zie `docs/PIPELINE_TWO_STAGE.md` voor de volledige stage-2-procedure.

## Status

Zie `data/` en `platform/src/content/data/` voor tickers die volledig door de
pipeline zijn. Een `.md` in deze folder zonder bijbehorende `.json` betekent:
stage 1 klaar, stage 2 nog te doen.
