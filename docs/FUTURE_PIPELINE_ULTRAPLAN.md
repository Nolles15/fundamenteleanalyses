# FUTURE — ULTRAPLAN: volledig geautomatiseerde pipeline

**Status:** gearchiveerd voor later. NIET implementeren zolang productie laag blijft
(handmatig cowork + Claude Code is behapbaar tot ~20-30 tickers).

**Waarom bewaren:** wanneer je naar tientallen of honderden analyses schaalt, wordt
de huidige twee-traps pipeline het knelpunt (Janco moet handmatig tussen cowork
en Claude Code wisselen per ticker). Dit document is het ontwerp voor de versie
die dan ingevoerd wordt.

**Trigger om te implementeren:**
- Je hebt 20+ live tickers en merkt dat de handmatige lus pijn doet, OF
- Twee+ opeenvolgende cowork-runs crashen op enum/validator-drift ondanks de
  aangescherpte prompt, OF
- Je wil een publieke "nieuwe ticker aanvragen" flow op de site.

---

## Kern-idee

Één Python-script op je laptop (of Vercel-cronjob):

```
input: ticker + yahoo_symbol + bedrijfsnaam
  → 1. Research-call (Anthropic API, Claude 4.X + web-tool) → markdown
  → 2. Schema-call (Anthropic API, tool-use met strict input_schema) → JSON
  → 3. Pydantic-validate (zelfde schema die de site gebruikt)
  → 4. Python `json.dump` + shutil.copyfile naar beide paden
  → 5. `npm run build` in platform/
  → 6. git commit + push
output: Vercel deploy live binnen 3-5 minuten
```

Geen cowork-sessie. Geen Claude Code sessie. Janco draait `python pipeline.py
VIT-B` en gaat koffie halen.

---

## Waarom NIET in de Claude MAX-subscription

Claude MAX (Pro / Team / Enterprise Pro) dekt sinds de ToS-update van begin 2026
alleen **interactieve chat** via claude.ai en Claude Code in de terminal — géén
programmatic / headless / SDK / MCP-server calls. Voor een automatische pipeline
die Claude zelf aanroept vanuit een script heb je een **Anthropic API-key** (met
tegoed) nodig.

Kosten-inschatting per ticker bij Opus 4.X + web-tool:
- Research-call: ~60k input + 20k output tokens ≈ **€0,80-1,20**
- Schema-call: ~15k input + 15k output tokens ≈ **€0,20-0,30**
- **Totaal: ~€1-1,50 per ticker** (MIPS-schaal analyse)

Bij 50 tickers per jaar = **€50-75/jaar**. Verwaarloosbaar.

---

## Technische pijlers

### 1. Pydantic als single source of truth

Vervang de drie losse bronnen van waarheid (`platform/src/lib/types.ts`,
`platform/scripts/validate_structure.py`, `research/TEMPLATE.md`) door één
Pydantic-model:

```
pipeline/
├── schema.py                  # Pydantic v2 models (één bestand, ~500 regels)
├── pipeline.py                # orchestrator (entrypoint)
├── research_prompt.py         # research-call builder
├── schema_prompt.py           # schema-call builder (gebruikt schema.py.schema_json())
├── validators.py              # extra consistency-checks bovenop Pydantic
└── writers.py                 # atomic write naar beide paden + SHA256
```

TypeScript-types worden **gegenereerd** uit Pydantic via `datamodel-code-generator`:

```bash
datamodel-codegen --input pipeline/schema.py --output platform/src/lib/types.ts \
                  --output-model-type typescript
```

Validator-script wordt ook gegenereerd (of verwijderd — Pydantic `.model_validate()`
vervangt `validate_structure.py` compleet).

### 2. Anthropic tool-use met strict input_schema

De schema-call geeft Claude **geen vrijheid** om verkeerde keys te bedenken:

```python
schema = AnalyseBedrijf.model_json_schema()  # Pydantic → JSON-schema

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=32000,
    tools=[{
        "name": "submit_analyse",
        "description": "Dien de 17-key analyse in, volledig gestructureerd.",
        "input_schema": schema,
    }],
    tool_choice={"type": "tool", "name": "submit_analyse"},
    messages=[{"role": "user", "content": f"""
Hier is de research-markdown. Converteer naar de JSON die submit_analyse verwacht.
Alle enum-waarden LETTERLIJK uit het schema. Geen extra keys.

{research_md}
    """}],
)

data = response.content[0].input  # dict, al gevalideerd tegen input_schema
analyse = AnalyseBedrijf.model_validate(data)  # dubbele check
```

Resultaat: enum-drift is fysiek onmogelijk. Claude kan geen "HOUDEN" insturen
als het schema `KOOP|HOLD|PASS` eist.

### 3. Research-call met web-tool

Claude krijgt web-search + web-fetch tools en werkt autonoom door jaarverslagen,
IR-pagina's en aggregators:

```python
research = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    tools=[
        {"type": "web_search_20250122", "name": "web_search"},
        {"type": "web_fetch_20250122", "name": "web_fetch"},
    ],
    messages=[{"role": "user", "content": research_prompt(ticker, yahoo, bedrijf)}],
)
```

Research-prompt = huidige `research/_PROMPT_COWORK.md` inhoud (diepte-eisen,
bronnen-regime, enum-discipline) maar zonder de "raak niets anders aan"-paragraaf
(want er is geen bestandssysteem-toegang in deze call).

### 4. Pre-commit + build-gate als harde failure

```python
# Nadat JSON geschreven is:
run("python platform/scripts/verify_consistency.py", ticker)  # cross-refs
run("npm run build", cwd="platform/")                          # catches null.toLocaleString
if any failed:
    rollback(ticker)   # git checkout data/ platform/src/content/data/
    raise PipelineFailed(ticker, stage, error)
```

### 5. Git-commit + push

```python
subprocess.run(["git", "add", f"data/{t}.json",
                f"platform/src/content/data/{t}.json",
                f"research/{t}.md"])
subprocess.run(["git", "commit", "-m",
                f"feat: {t} fundamentele analyse (pipeline v2)"])
subprocess.run(["git", "push", "origin", "main"])
```

Vercel deploy volgt auto.

---

## Migratie-pad (3 dagen werk wanneer je de trigger hitst)

**Dag 1 — Schema & generators:**
1. Schrijf `pipeline/schema.py` (Pydantic). Gebruik `data/MIPS.json` als
   referentie + alle enums uit `validate_structure.py`.
2. `datamodel-codegen` → `platform/src/lib/types.ts` genereren, check dat de
   bestaande UI-componenten nog compileren (`npm run build`).
3. Verwijder / depreceer `validate_structure.py` — Pydantic doet het werk.

**Dag 2 — Pipeline orchestrator:**
4. `pipeline/pipeline.py` + research + schema-call met Anthropic SDK.
5. Test op VIT-B (één ticker end-to-end, lokaal).
6. Vergelijk output met handmatig cowork-resultaat als sanity check.

**Dag 3 — Automation & monitoring:**
7. `pipeline/run_queue.py` die een `queue.txt` afwerkt (één ticker per commit,
   niet parallel).
8. Optioneel: Vercel-cronjob of GitHub Actions workflow voor scheduled refresh
   (bv. quarterly rerun per ticker voor update_historie).
9. Monitoring: fail-alert naar e-mail als pipeline op validator/build faalt.

---

## Open keuzes voor later

- **Research-call model**: Opus 4.X (duurder, beter research) of Sonnet 4.6
  (4× goedkoper, mogelijk iets oppervlakkiger). Start met Opus, degradeer pas
  als kosten pijnlijk worden.
- **Schema-call model**: bijna zeker Sonnet 4.6 is genoeg — schema-conversie is
  goedkope mechanische taak, geen diep nadenken.
- **Refresh-cadans**: quarterly per ticker? Half-jaarlijks? Pas beslissen als
  je meer dan 20 live hebt.
- **Queue + backoff**: bij 50+ tickers wil je throttling zodat je Anthropic-
  rate-limit niet raakt. `time.sleep(30)` tussen tickers is simpelste oplossing.

---

## Wat dit NIET is

- Geen MCP-server. De pipeline is standalone Python.
- Geen claude.ai / Claude Code in de runtime. Die zijn tools voor jou tijdens
  development; de pipeline zelf gebruikt alleen de Anthropic API.
- Geen vervanging voor jouw oordeel. Janco moet nog steeds beslissen welke
  tickers opgevoerd worden (queue) en gepubliceerd worden (commit-review).

---

## Referentie-architectuur (ASCII)

```
queue.txt       (VIT-B, ANOD-B, ...)
    │
    ▼
┌───────────────────────┐
│ pipeline.py           │
│ ┌───────────────────┐ │
│ │ research_call     │ │  → Anthropic API (Opus + web-tools)
│ │ → research/*.md   │ │
│ └────────┬──────────┘ │
│          ▼            │
│ ┌───────────────────┐ │
│ │ schema_call       │ │  → Anthropic API (Sonnet + tool-use)
│ │ → JSON (dict)     │ │
│ └────────┬──────────┘ │
│          ▼            │
│ ┌───────────────────┐ │
│ │ pydantic validate │ │  → AnalyseBedrijf.model_validate()
│ │ verify_consistency│ │  → cross-refs
│ └────────┬──────────┘ │
│          ▼            │
│ ┌───────────────────┐ │
│ │ atomic write      │ │  → data/ + platform/src/content/data/
│ │ SHA256 match      │ │
│ └────────┬──────────┘ │
│          ▼            │
│ ┌───────────────────┐ │
│ │ npm run build     │ │  → UI render-gate
│ └────────┬──────────┘ │
│          ▼            │
│ ┌───────────────────┐ │
│ │ git commit + push │ │  → Vercel auto-deploy
│ └───────────────────┘ │
└───────────────────────┘
```

---

**Eigenaar:** Janco
**Opgesteld:** 2026-04-23 (na ULTRAPLAN-sessie)
**Volgende review:** wanneer je 20+ live tickers hebt OF wanneer de handmatige
lus structureel pijn doet.
