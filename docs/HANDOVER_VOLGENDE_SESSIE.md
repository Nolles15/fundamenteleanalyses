# Handover — aandelenanalyse pipeline

**Bijgewerkt:** 2026-04-24 (na pipeline-hardening)
**Status:** twee-traps flow met orchestrator-script. MIPS staat live.
**Plan dat hiertoe leidde:** `C:\Users\janco\.claude\plans\piped-squishing-turing.md`

---

## TL;DR — zo analyseer je een nieuwe ticker

**Eenmalige setup (pas doen als nog niet gebeurd):**
1. Blok 1 van `research/_PROMPT_COWORK.md` (**Project Instructions**)
   plakken in je Claude cowork project-settings
2. `.claude/settings.local.json` staat al in de repo — open deze repo
   vanaf nu altijd in Claude Code, dan zijn de permissions vast

**Per ticker:**
1. In cowork (binnen het ingerichte project):
   ```
   Doe fundamentele analyse van Vitec Software Group (VIT-B, VIT-B.ST).
   ```
2. Wacht tot `research/VIT-B.md` klaar is
3. Open een **verse Claude Code sessie** en typ:
   ```
   Run stage 2 voor VIT-B.
   ```
4. Weglopen. Claude Code doorloopt `scripts/stage2.py` met alle gates.
   Vercel-deploy is automatisch.

---

## Waarom deze flow

Stage 1 (cowork) en stage 2 (Claude Code) zijn strikt gescheiden omdat
ze verschillende sterke kanten hebben:

- **Cowork** = diep jaarverslag-onderzoek, 10-jaars tabellen, DCF/EPV, moat-
  narratief. Minder goed in deterministisch schema-werk of git-operaties.
- **Claude Code** = schema-validatie, SHA256, build-gates, git-push. Minder
  geschikt voor uren research.

Door de grens hard te trekken op `research/[TICKER].md` blijft elke sessie
bij wat hij goed kan.

---

## Wat `scripts/stage2.py` voor je doet

Eén entrypoint met vier subcommands:

```
python scripts/stage2.py VIT-B precheck          # drift + MD-check + opmerkingen
python scripts/stage2.py VIT-B write <src>       # JSON naar beide paden + SHA256
python scripts/stage2.py VIT-B verify            # structure + consistency + build
python scripts/stage2.py VIT-B publish           # git add + commit + push
python scripts/stage2.py VIT-B verify-and-publish   # combined
```

Claude Code's opdracht "Run stage 2 voor VIT-B" verloopt als:

1. `precheck` → print Opmerkingen-sectie uit MD, meld drift als die er is
2. Lees `research/VIT-B.md`, bouw JSON-dict, schrijf tmp-file
3. `write /tmp/VIT-B.json` → naar beide targets + SHA256
4. `verify-and-publish` → validators + build + commit + push

Als één van de gates faalt, stopt het script. Geen silencing, geen
bypass-flags. Fouten gaan of terug naar cowork (schema/consistency) of
naar platform-onderhoud (build-gate crash).

---

## Wat `scripts/check-drift.py` voor je doet

Korter script dat enum-drift tussen `types.ts`, `validate_structure.py`,
`TEMPLATE.md` en `_PROMPT_COWORK.md` detecteert. Draait als eerste stap van
elke precheck. Voorkomt dat cowork perfect werk levert dat de validator
alsnog afkeurt omdat de enum-lijsten uit sync raakten.

Handmatig draaien wanneer je iets aan het schema wijzigt:
```
python scripts/check-drift.py
```

---

## Queue

| # | Ticker | Bedrijf | yahoo_symbol | Status |
|---|---|---|---|---|
| – | MIPS | MIPS AB | `MIPS.ST` | ✓ live |
| 1 | **VIT-B** | Vitec Software Group | `VIT-B.ST` | next |
| 2 | ANOD-B | Addnode Group | `ANOD-B.ST` | wachtend |
| 3 | BONAV-B | Bonava | `BONAV-B.ST` | wachtend |
| 4 | ENEA | Enea AB | `ENEA.ST` | wachtend |
| 5 | LOGI-B | Logistea | `LOGI-B.ST` | wachtend |

**Eén tegelijk.** Elke ticker doorloopt zijn eigen gates — een groene
build voor VIT-B bewijst niks over ANOD-B.

---

## Harde gates (mogen niet worden overgeslagen)

| Gate | Commando | Moet |
|---|---|---|
| Drift-check | `scripts/check-drift.py` | exit 0 |
| Disk-integriteit | `stage2.py write` (SHA256 intern) | identiek |
| Schema | `validate_structure.py` | 0 FAIL |
| Consistency | `verify_consistency.py` | 0 FAIL |
| Render | `npm run build` | 0 errors |

Als een gate FAIL meldt:

- **Drift**: fix template/prompt/validator in sync voor je opnieuw start
- **SHA256 mismatch**: `stage2.py write` opnieuw draaien (bestandssysteem-race,
  zeldzaam)
- **Schema-FAIL**: waarschijnlijk missing field in research-MD → terug naar
  cowork om aan te vullen
- **Consistency-FAIL**: cijfer-tegenstrijdigheid tussen secties in de MD →
  terug naar cowork
- **Build-FAIL op null-field**: data-invulfout of UI-regressie. Beoordeel
  zelf — of data repareren, of het kwetsbare UI-component null-defensive
  maken (die laatste is platform-onderhoud, niet stage 2)

---

## Als cowork geen project-instructions ondersteunt

Dan plak je per ticker blok 1 uit `_PROMPT_COWORK.md` (FALLBACK in sectie 6
van dat bestand). Werkt ook, kost alleen meer tokens.

---

## Relevante paden

```
Stage 1 output:           research/[TICKER].md
Stage 2 JSON:             data/[TICKER].json
                          platform/src/content/data/[TICKER].json

Cowork-prompt:            research/_PROMPT_COWORK.md
Cowork-template:          research/TEMPLATE.md

Schema-waarheid:          platform/src/lib/types.ts
Structure validator:      platform/scripts/validate_structure.py
Consistency validator:    platform/scripts/verify_consistency.py

Orchestrator:             scripts/stage2.py
Drift-detector:           scripts/check-drift.py
Persistent permissions:   .claude/settings.local.json

Pipeline-doc:             docs/PIPELINE_TWO_STAGE.md
Toekomstige pipeline:     docs/FUTURE_PIPELINE_ULTRAPLAN.md (gearchiveerd)
```

---

## Bewuste beperkingen

- Cowork doet nog alle berekeningen in zijn hoofd (WACC, DCF, EPV,
  scorekaart). Geen deterministische herberekening. Dat is de volgende
  evolutie — zie Fase 1 in `C:\Users\janco\.claude\plans\piped-squishing-
  turing.md`. Pas inzetten na VIT-B en ANOD-B live staan.
- Git-driven automation (cowork pushes → GitHub Action doet stage 2)
  blijft gearchiveerd tot Fase 1 er ligt.
- API-pipeline (`FUTURE_PIPELINE_ULTRAPLAN.md`) blijft archief tot 20+
  tickers.

---

## Niet meer doen

- Cowork laten schrijven naar `data/` of `platform/` (stage 1 = research-only)
- Validator-scripts laten aanraken door cowork (cowork zegt soms "kapot" →
  het is cache-drift, niet de script)
- Oude enum-waarden gebruiken (HOUDEN / MIJDEN / UITSTEKEND / BEAR-BASE-BULL)
- Scorekaart op 0-10 scoren (schaal is 0-5, max 45)
- Tickers parallel pushen (valideer elk individueel)
- Build-gate overslaan (validator 0 FAIL ≠ UI rendert correct)
- Write-tool gebruiken voor JSON's >45KB (gebruik `scripts/stage2.py write`)
