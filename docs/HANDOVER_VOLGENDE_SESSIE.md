# Handover — verder met cowork (huidige pipeline)

**Geschreven:** 2026-04-23 (na doc-scan + alignment-fix + ULTRAPLAN-archief)
**Status:** handmatige twee-traps pipeline blijft actief. MIPS staat live.
**Ultiem plan (voor later):** [`FUTURE_PIPELINE_ULTRAPLAN.md`](FUTURE_PIPELINE_ULTRAPLAN.md) — pas invoeren bij 20+ tickers.

---

## Waarom we (nu nog) niet automatiseren

Productie is nog laag (1 live ticker). De handmatige cowork → Claude Code lus
is behapbaar zolang je onder ~20 live tickers zit. De volledig-automatische
Anthropic-API pipeline staat uitgewerkt in `FUTURE_PIPELINE_ULTRAPLAN.md` en
kost ~€1-1,50 per ticker aan API-credits; invoeren als het handwerk gaat knijpen.

---

## Wat er vandaag alignen is

Tussen gisteren en vandaag is één kritieke drift gevonden en gefixt:

| Plek | Oude (foute) waarde | Nieuwe (validator-aligned) waarde |
|---|---|---|
| `executive_summary.oordeel` | KOOP\|HOUDEN\|MIJDEN\|OVERWEEG BIJ DIP | **KOOP\|HOLD\|PASS** |
| `scorekaart.eindoordeel` | STERKE KOOP\|KOOP\|HOUDEN\|MIJDEN | **KOOP\|HOLD\|PASS** |
| `management.oordeel` | UITSTEKEND\|GOED\|GEMIDDELD\|ZWAK | **STERK\|NEUTRAAL\|ZORGWEKKEND** |
| Scenario-labels | BEAR\|BASE\|BULL | **Pessimistisch\|Basis\|Optimistisch** |
| Moat-categorieën | los lijstje van 6 | **exact 5 namen** (Immateriële activa / Overstapkosten / Netwerkeffecten / Kostenvoordeel / Efficiënte schaal) |
| Scorekaart-schaal | 0-10 per framework (max 90) | **0-5 per framework (max 45)** |

Gefixt in:
- `research/TEMPLATE.md`
- `research/_PROMPT_COWORK.md`

Als je cowork deze files als sjabloon gebruikt zit het goed. Geef **geen oude
prompt uit chat-history** — altijd vers plakken uit `research/_PROMPT_COWORK.md`.

---

## Startpunt nu meteen

### 1. Fresh cowork-sessie openen (sluit eerst de vorige)

Cowork sleept soms oude instructies uit zijn chat-history mee. Eén schone start
per ticker.

### 2. Cowork-prompt plakken (exacte tekst hieronder, VIT-B is ingevuld)

````
Doe fundamentele-analyse research voor Vitec Software Group (VIT-B, yahoo_symbol VIT-B.ST).

JOUW OUTPUT: precies één bestand.
  research/VIT-B.md

GEBRUIK ALS SJABLOON:
  research/TEMPLATE.md
Lees dat volledig, kopieer de structuur, vul elke sectie met jouw research.

STRIKTE GRENZEN — raak ALLEEN dit pad aan:
  research/VIT-B.md

RAAK NIET AAN (ook niet om te "verifieren" of "fixen"):
  data/
  platform/
  docs/
  .gitignore
  alles buiten research/

Als je denkt dat iets in platform/ of docs/ kapot is: NEGEER DAT. Meld het als
observatie in research/VIT-B.md onder een sectie "## Opmerkingen voor Claude
Code" — fix het nooit zelf.

DIEPTE-EISEN (dit is het product, niet onderhandelbaar):
- Lees de laatste 3 jaarverslagen + laatste 4 kwartaalcijfers
- Bouw je eigen 10-jaars financieel-tabel (niet plat overnemen van aggregator)
- Bereken WACC zelf: risicovrije rente (10y lokale overheid), ERP (Damodaran),
  beta (5y monthly of eigen regressie), size premium voor small-caps
- DCF: 2-fase of 3-fase, motiveer terminal groei, check terminal value % van
  totaal (moet < 75%), check impliciete EV/EBITDA op terminal
- EPV parallel uitvoeren (Greenwald): normaliseer marges, maintenance capex
- Reverse DCF: wat moet FCF groeien voor huidige koers?
- Scorekaart: 9 frameworks, integer scores 0-5
- Minimaal 5-8 risico's met DCF-aanname-mapping
- Minimaal 5-8 katalysatoren, chronologisch
- Moat-analyse: kwantitatief onderbouwen met ROIC-historie

BRONNEN-REGIME:
- Recente 5 jaren financieel (laatst-gerapporteerd tot 4 jaar terug):
  betrouwbaarheid HOOG, uit jaarverslag-PDF of IR-pagina
- Jaren 6-10 geleden: mogen AGGREGATOR zijn (MacroTrends / StockAnalysis / Yahoo)
- Geef URL per jaar in sectie 13 van de template

ENUM-DISCIPLINE (alleen deze waarden — geen varianten, geen NL-synoniemen):
- Executive summary oordeel: KOOP | HOLD | PASS
- Scorekaart eindoordeel: KOOP | HOLD | PASS
  Regel: totaal>=33 EN Fair Value DCF>=3 => KOOP; totaal<24 OF DCF==1 => PASS; anders HOLD
- Moat: WIDE MOAT | NARROW MOAT | NO MOAT
- Moat-categorieen (exact deze 5, alle 5 verplicht):
  Immateriële activa | Overstapkosten | Netwerkeffecten | Kostenvoordeel | Efficiënte schaal
- Management oordeel: STERK | NEUTRAAL | ZORGWEKKEND
- Risico kans: LAAG | MIDDEN | HOOG
- Risico impact: KLEIN | MIDDEL | GROOT
- Katalysator richting: POSITIEF | NEGATIEF | NEUTRAAL | BINAIR
- Katalysator impact: GROOT | MIDDEL | KLEIN
- Betrouwbaarheid bron: HOOG | AGGREGATOR
- Scenario-labels (exact): Pessimistisch | Basis | Optimistisch
- Framework-namen LETTERLIJK (incl. spaties en punt):
  Graham | Buffett / Munger | Peter Lynch | Phil Fisher | Magic Formula |
  Moat | Management | Fair Value DCF | Fair Value IPO-gecorr.
- Scorekaart-scores: integer 0-5 per framework (max 45)

OPLEVERING:
- Eén Write-call met research/VIT-B.md volledig ingevuld
- Geen tweede file, geen JSON, geen script-wijzigingen
- Laatste sectie "## Opmerkingen voor Claude Code": vermeld eventuele
  inhoudelijke twijfels of ontbrekende data zodat CC weet waar onzekerheid zit

Claude Code neemt het vanaf hier: JSON-injectie, validator, build, commit, push.
````

### 3. Wachten tot cowork `research/VIT-B.md` heeft afgeleverd

Eén Write-call, één bestand. Geen vragen tussendoor — als cowork twijfels heeft
horen die onderin de MD onder "## Opmerkingen voor Claude Code".

### 4. Nieuwe Claude Code sessie starten met deze opdracht

> "Lees `research/VIT-B.md` en doe stage 2 volgens `docs/PIPELINE_TWO_STAGE.md`."

Claude Code doet stap 1-8 (JSON bouwen, SHA256, 2× validator, build, commit, push).

### 5. Vercel-deploy controleren

Kijk op https://vercel.com/... of de build groen is voor de nieuwe commit. Als
ja: ticker is live. Als nee: deel de build-log met Claude Code, niet met cowork.

---

## Queue (na VIT-B in deze volgorde)

| # | Ticker | Bedrijf | yahoo_symbol |
|---|---|---|---|
| 1 | **VIT-B** | Vitec Software Group | `VIT-B.ST` |
| 2 | ANOD-B | Addnode Group | `ANOD-B.ST` |
| 3 | BONAV-B | Bonava | `BONAV-B.ST` |
| 4 | ENEA | Enea AB | `ENEA.ST` |
| 5 | LOGI-B | Logistea | `LOGI-B.ST` |

**Eén tegelijk. Pas volgende starten zodra vorige live staat.** Eén groene build
bewijst niks over de volgende — validator, build en deploy zijn per-ticker.

---

## Huidige status op main

```
data/MIPS.json                               ✓ live (eerste via nieuwe pipeline)
platform/src/content/data/MIPS.json          ✓ live
research/TEMPLATE.md                         ✓ aligned met validator (2026-04-23 fix)
research/_PROMPT_COWORK.md                   ✓ aligned met validator (2026-04-23 fix)
docs/PIPELINE_TWO_STAGE.md                   ✓ ground truth voor Claude Code
docs/FUTURE_PIPELINE_ULTRAPLAN.md            ✓ gearchiveerd voor later
```

---

## Niet meer doen

- Cowork laten schrijven naar `data/` of `platform/` (stage 1 = research-only)
- Validator-scripts laten aanraken door cowork (cowork zegt soms "kapot" → het
  is cache-drift, niet de script)
- Oude enum-waarden gebruiken (HOUDEN / MIJDEN / UITSTEKEND / BEAR-BASE-BULL)
- Scorekaart op 0-10 scoren (schaal is 0-5, max 45)
- Tickers parallel pushen (valideer elk individueel)
- Build-gate overslaan (validator 0 FAIL ≠ UI rendert correct)
- ULTRAPLAN nu implementeren (pas bij 20+ tickers — zie trigger in dat doc)

---

## Waarom het nu wél moet werken

De eerdere sessie crashte omdat `research/TEMPLATE.md` enums bevatte die de
validator niet accepteert — dus zelfs een perfect volgzame cowork-run werd
alsnog geweigerd door `validate_structure.py`. Dat gat is vandaag gedicht:
**template + prompt zijn beide 1-op-1 aligned met `validate_structure.py`**.

Als de eerste VIT-B-run toch faalt op iets anders (niet-enum), document dat in
deze handover onder "## Openstaand" en bepaal dan of het een template-gap is of
een eenmalige cowork-miss.

---

## Relevante paden

```
Research output (stage 1):     research/[TICKER].md
JSON data (stage 2):           data/[TICKER].json
                               platform/src/content/data/[TICKER].json
Schema-definitie:              platform/src/lib/types.ts
Validators:                    platform/scripts/validate_structure.py
                               platform/scripts/verify_consistency.py
Pipeline-doc (CC leest dit):   docs/PIPELINE_TWO_STAGE.md
Toekomstige pipeline:          docs/FUTURE_PIPELINE_ULTRAPLAN.md
Oude handovers (archief):      docs/_archive/
```
