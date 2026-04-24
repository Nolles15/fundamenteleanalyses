# Pipeline: Twee-traps analyse-productie

Instructie-document voor toekomstige Claude Code sessies. Beschrijft hoe een
fundamentele aandelen-analyse van research tot gepusht-op-Vercel komt.

## Waarom twee stages

Claude cowork is sterk in diep onderzoek maar maakt
systematisch fouten op infra-niveau: Read-tool cache-divergentie, validator-
hallucinaties, enum-varianten, null-velden die UI crashen.

Claude Code is sterk in deterministisch schema-werk en git-operaties, maar is
minder geschikt voor uren research in jaarverslagen.

Oplossing: cowork = research-only markdown. Claude Code = JSON-injectie +
validatie + deploy.

---

## Stage 1 — Cowork (research-only)

**Input**: bedrijfsnaam + ticker + yahoo_symbol
**Output**: `research/[TICKER].md` — ingevuld volgens `research/TEMPLATE.md`

Prompt in `research/_PROMPT_COWORK.md`. Janco plakt die in cowork, vult
placeholders in. Cowork werkt tot voltooiing.

**Harde grens voor cowork**: alleen `research/[TICKER].md` wordt aangeraakt.
Geen JSON, geen platform-files, geen validator-scripts.

---

## Stage 2 — Claude Code (JSON-injectie + deploy)

### Stap 1: Lees research-MD
```
research/[TICKER].md
```
Scan eerst sectie `## Opmerkingen voor Claude Code` — eventuele twijfels of
ontbrekende data expliciet adresseren of overnemen in `databronnen.ontbrekende_data`.

### Stap 2: Bouw JSON (17 top-level keys)

Top-level keys IN DEZE VOLGORDE:
1. `meta`
2. `executive_summary`
3. `bedrijfsprofiel`
4. `financieel`
5. `moat`
6. `management`
7. `sector_concurrentie`
8. `analyseframeworks`
9. `risicos`
10. `these_invalide_bij`
11. `esg`
12. `katalysatoren`
13. `fair_value`
14. `scorekaart`
15. `databronnen`
16. `bronnen`
17. `update_historie`

Volledige schema-definitie: `platform/src/lib/types.ts`.
Referentie-JSON: `data/MIPS.json` (meest recente, eerste via deze pipeline).

### Stap 3: Mapping research-MD → JSON

De template mapt 1:1 (sectie-nummer = key-volgorde). Maar enkele mappings zijn
niet-triviaal:

- **Template sectie 1 "Executive summary"** → JSON `executive_summary`. Let op:
  `fair_value_basis` en `fair_value_kansgewogen` moeten consistent zijn met
  sectie 12 van de MD.
- **Template sectie 3 "Financieel"** bevat ook balans-ratio's, kapitaal-
  structuur en non-GAAP — die vallen allemaal onder JSON `financieel.*` sub-keys.
- **Template sectie 7 "Analyse-frameworks"** → JSON heeft `analyseframeworks`
  (zonder `e` — één woord) met sub-keys `graham`, `buffett_munger`, `lynch`,
  `fisher`, `greenblatt`. De score-data uit sectie 7 gaat NAAR `scorekaart.items`
  (die heeft de score/max-velden). `analyseframeworks` bevat alleen de
  kwalitatieve oordelen per framework.
- **Template sectie 13 "Databronnen"** → JSON `databronnen` heeft de
  `financieel` array met 10 entries — 5 recente HOOG verplicht.

### Stap 4: Schrijf via Python (niet Write-tool)

Write-tool truncates >45KB. Gebruik Python direct:

```python
import json, shutil, hashlib, os

with open('data/[TICKER].json', 'w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

shutil.copyfile('data/[TICKER].json',
                'platform/src/content/data/[TICKER].json')

# SHA256 check
for p in ['data/[TICKER].json', 'platform/src/content/data/[TICKER].json']:
    assert os.path.getsize(p) >= 20_000, f"TOO SMALL: {p}"
    d = json.load(open(p, encoding='utf-8'))
    assert len(d) == 17, f"missing keys: {p}"

a = open('data/[TICKER].json', 'rb').read()
b = open('platform/src/content/data/[TICKER].json', 'rb').read()
assert hashlib.sha256(a).digest() == hashlib.sha256(b).digest(), "differ"
```

### Stap 5: Validator-gates (0 FAIL verplicht)

```bash
python platform/scripts/validate_structure.py [TICKER]
python platform/scripts/verify_consistency.py [TICKER]
```

Beide moeten 0 FAIL geven.

### Stap 6: Build-gate (nieuw per 2026-04-23)

```bash
cd platform && npm run build
```

Moet 0 errors + 0 warnings geven. Vangt `null.toLocaleString()` crashes die
structure-validator niet ziet.

**Als build faalt op een null-field**: géén silencing in UI-component — fix de
data in het JSON-bestand (liever `0` of weglatbare `null` waar UI-component al
check heeft, dan silencing). Is UI-component kwetsbaar? Fix de component met
optional chaining (`??` fallback) — maar dat is geen stage-2-werk, dat is
apart platform-onderhoud.

### Stap 7: Commit + push

```bash
git add data/[TICKER].json platform/src/content/data/[TICKER].json research/[TICKER].md
git commit -m "feat: [TICKER] fundamentele analyse (stage-2 pipeline)"
git push origin main
```

Vercel deploy is auto via push naar `main`.

### Stap 8: Todo-item afvinken

Als meerdere tickers in een sessie: één voor één pushen, niet batch. Eén groene
build bewijst niks over de ander.

---

## Harde gates (NIET overslaan)

| Gate | Command | Moet |
|---|---|---|
| Disk-integriteit | SHA256 beide paden | Identiek |
| Schema | `validate_structure.py` | 0 FAIL |
| Consistency | `verify_consistency.py` | 0 FAIL |
| Render | `npm run build` | 0 errors |

Één faal = niet pushen. Terug naar cowork of zelf fix, afhankelijk van de aard:

- **Schema-FAIL**: waarschijnlijk missing field in research-MD. Cowork aanvullen.
- **Consistency-FAIL**: cijfer-tegenstrijdigheid tussen secties. Cowork fix.
- **Build-FAIL op null-field**: data-invulfout of UI-regressie. Beoordeel zelf.

---

## Schema-referentie

Ground truth: `platform/src/lib/types.ts` — TypeScript interfaces.
Uitgebreid commentaar: `docs/SCHEMA_GROUND_TRUTH.md`.
Voorbeeld-JSON (werkend, via deze pipeline gebouwd): `data/MIPS.json`.

---

## Wat te doen bij nieuwe schema-additie (zeldzaam)

1. Update `platform/src/lib/types.ts`
2. Update `platform/scripts/validate_structure.py` met nieuwe check
3. Update `research/TEMPLATE.md` met nieuwe sectie
4. Update `research/_PROMPT_COWORK.md` als enum/regel verandert
5. Backfill bestaande tickers in `data/*.json` en `platform/src/content/data/*.json`
6. Commit alles in één go met titel `feat: schema-additie <naam>`

Recente additie voor referentie: `databronnen.financieel` (commit `766a676`).

---

## Failure modes uit het verleden (vermijd)

1. **Cowork raakt validator-script aan** → cowork's A-H procedure zei "alleen
   data-files" maar cowork hallucineerde alsnog "kapotte" scripts. Fix: expliciet
   in prompt "ook research/ is exclusief, platform/ is verboden".
2. **Null-fields passeren validator, crashen UI** → `toLocaleString()` faalt op
   null. Fix: build-gate toegevoegd stage 2 (stap 6).
3. **Read-tool cache != disk** → na Write lijkt file dubbele regels te hebben
   terwijl disk clean is. Fix: altijd eerst `tail` of `python open().read()`
   vóór je begint te "repareren".
4. **Filename-conventie fout** → `AMBEA.ST.json` in plaats van `AMBEA.json`. Fix:
   template en prompt zeggen beide expliciet "bare ticker in filename".
5. **Enum-Nederlandstalige varianten** → "BEPERKTE MOAT" bestaat niet. Fix:
   enum-lijst in `_PROMPT_COWORK.md` sectie "ENUM-DISCIPLINE".

---

## Snelle checklist voor Claude Code (stage 2)

- [ ] `research/[TICKER].md` gelezen
- [ ] `## Opmerkingen voor Claude Code` expliciet geadresseerd
- [ ] JSON gebouwd met 17 top-level keys in juiste volgorde
- [ ] Beide paden geschreven via Python (niet Write-tool)
- [ ] SHA256 match
- [ ] `validate_structure.py [TICKER]` = 0 FAIL
- [ ] `verify_consistency.py [TICKER]` = 0 FAIL
- [ ] `npm run build` = 0 errors
- [ ] Git add beide JSONs + research-MD
- [ ] Commit + push
- [ ] Vercel deploy bevestigd (optioneel — stuur me link of screenshot bij twijfel)
