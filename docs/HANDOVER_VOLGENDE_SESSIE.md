# Handover — Volgende sessie

**Geschreven:** 2026-04-23
**Status:** nieuwe pipeline ingevoerd. Alleen MIPS staat live (proof-of-concept).

---

## Startpunt morgen

**Alles wat je moet weten staat in één document:**
→ [`docs/PIPELINE_TWO_STAGE.md`](PIPELINE_TWO_STAGE.md)

**De cowork-prompt staat hier:**
→ [`research/_PROMPT_COWORK.md`](../research/_PROMPT_COWORK.md)

**Template die cowork invult:**
→ [`research/TEMPLATE.md`](../research/TEMPLATE.md)

---

## Volgorde voor morgen

### 1. Start cowork op VIT-B
Plak de prompt uit `research/_PROMPT_COWORK.md` met placeholders:
- `[TICKER]` = `VIT-B`
- `[YAHOO]` = `VIT-B.ST`
- `[BEDRIJF]` = `Vitec Software Group`

Wacht tot cowork `research/VIT-B.md` heeft afgeleverd.

### 2. Claude Code stage 2
Start een nieuwe Claude Code sessie met:
> "Lees `research/VIT-B.md` en doe stage 2 volgens `docs/PIPELINE_TWO_STAGE.md`."

Claude Code bouwt JSON, valideert, buildt, pusht.

### 3. Herhaal voor de volgende tickers

Queue (in volgorde van voorkeur):
1. VIT-B (Vitec Software Group) — yahoo: VIT-B.ST
2. ANOD-B (Addnode Group) — yahoo: ANOD-B.ST
3. BONAV-B (Bonava) — yahoo: BONAV-B.ST
4. ENEA (Enea AB) — yahoo: ENEA.ST
5. LOGI-B (Logistea) — yahoo: LOGI-B.ST

Eén tegelijk. Pas volgende starten zodra vorige gepusht is en op Vercel live staat.

---

## Huidige status op main

```
data/MIPS.json                               ✓ live
platform/src/content/data/MIPS.json          ✓ live
research/                                     ✓ pipeline-infra aanwezig
docs/PIPELINE_TWO_STAGE.md                    ✓ ground truth
```

Alle andere ticker-analyses zijn verwijderd in commit `6936664` (niet-vertrouwde
v1-analyses). Ze komen één voor één terug via de nieuwe pipeline.

---

## Waarom de nieuwe pipeline

Cowork's research-diepte = het product. Maar cowork liep systematisch stuk op
infra-werk (Read-cache, validator-hallucinaties, enum-varianten, null-velden).
Nu doet cowork alleen research → markdown. Claude Code doet JSON + schema +
build + deploy. Scheiding maakt schalen naar tientallen tickers haalbaar.

Volledig rationale + failure modes: `docs/PIPELINE_TWO_STAGE.md` sectie "Failure
modes uit het verleden".

---

## Relevante paden

```
Research output (stage 1):     research/[TICKER].md
JSON data (stage 2):           data/[TICKER].json
                               platform/src/content/data/[TICKER].json
Schema-definitie:              platform/src/lib/types.ts
Validators:                    platform/scripts/validate_structure.py
                               platform/scripts/verify_consistency.py
Pipeline-doc:                  docs/PIPELINE_TWO_STAGE.md
Oude handovers (archief):      docs/_archive/
```

---

## Niet meer doen

- Cowork laten schrijven naar `data/` of `platform/` (stap 1 = research-only)
- Validator-scripts laten aanraken door cowork (genoemd als "kapot" = cache-bug)
- Tickers parallel pushen (valideer elk individueel)
- Build-gate overslaan (validator 0 FAIL ≠ UI rendert correct)
