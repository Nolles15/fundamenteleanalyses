# Cowork-prompt: research-only (copy-paste per ticker)

Vervang `[TICKER]`, `[YAHOO]`, `[BEDRIJF]` en plak de hele blok in cowork.

---

```
Doe fundamentele-analyse research voor [BEDRIJF] ([TICKER], yahoo_symbol [YAHOO]).

JOUW OUTPUT: precies één bestand.
  research/[TICKER].md

GEBRUIK ALS SJABLOON:
  research/TEMPLATE.md
Lees dat volledig, kopieer de structuur, vul elke sectie met jouw research.

STRIKTE GRENZEN — raak ALLEEN dit pad aan:
  research/[TICKER].md

RAAK NIET AAN (ook niet om te "verifieren" of "fixen"):
  data/
  platform/
  docs/
  .gitignore
  alles buiten research/

Als je denkt dat iets in platform/ of docs/ kapot is: NEGEER DAT. Meld het als
observatie in research/[TICKER].md onder een sectie "## Opmerkingen voor Claude
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
- Scorekaart: 9 frameworks, integer scores 0-10
- Minimaal 5-8 risico's met DCF-aanname-mapping
- Minimaal 5-8 katalysatoren, chronologisch
- Moat-analyse: kwantitatief onderbouwen met ROIC-historie

BRONNEN-REGIME:
- Recente 5 jaren financieel (laatst-gerapporteerd tot 4 jaar terug):
  betrouwbaarheid HOOG, uit jaarverslag-PDF of IR-pagina
- Jaren 6-10 geleden: mogen AGGREGATOR zijn (MacroTrends / StockAnalysis / Yahoo)
- Geef URL per jaar in sectie 13 van de template

ENUM-DISCIPLINE (alleen deze waarden — geen varianten, geen NL-synoniemen):
- Executive summary oordeel: KOOP | HOLD | PASS  (NIET HOUDEN/MIJDEN/KOPEN)
- Scorekaart eindoordeel: KOOP | HOLD | PASS  (zelfde lijst)
  Regel: totaal>=33 EN Fair Value DCF-score>=3 => KOOP; totaal<24 OF DCF==1 => PASS; anders HOLD
- Moat: WIDE MOAT | NARROW MOAT | NO MOAT  (NIET BEPERKTE MOAT o.i.d.)
- Moat-categorieen (exact deze 5 namen, alle 5 verplicht):
    Immateriële activa | Overstapkosten | Netwerkeffecten | Kostenvoordeel | Efficiënte schaal
- Management oordeel: STERK | NEUTRAAL | ZORGWEKKEND  (NIET UITSTEKEND/GOED/ZWAK)
- Risico kans: LAAG | MIDDEN | HOOG
- Risico impact: KLEIN | MIDDEL | GROOT
- Katalysator richting: POSITIEF | NEGATIEF | NEUTRAAL | BINAIR
- Katalysator impact: GROOT | MIDDEL | KLEIN
- Betrouwbaarheid bron: HOOG | AGGREGATOR
- Scenario-labels (exact): Pessimistisch | Basis | Optimistisch  (NIET BEAR/BASE/BULL)
- Framework-namen LETTERLIJK (incl. spaties en punt):
    Graham | Buffett / Munger | Peter Lynch | Phil Fisher | Magic Formula |
    Moat | Management | Fair Value DCF | Fair Value IPO-gecorr.
- Scorekaart-scores: integer 0-5 per framework (max 5, totaal max 45)

OPLEVERING:
- Eén Write-call met research/[TICKER].md volledig ingevuld
- Geen tweede file, geen JSON, geen script-wijzigingen
- Laatste sectie "## Opmerkingen voor Claude Code": vermeld eventuele
  inhoudelijke twijfels of ontbrekende data zodat CC weet waar onzekerheid zit

Claude Code neemt het vanaf hier: JSON-injectie, validator, build, commit, push.
```

---

## Checklist voor Janco vóór plakken

- [ ] `research/` folder bestaat in de repo-root ✓ (al aangemaakt)
- [ ] `research/TEMPLATE.md` is up-to-date ✓
- [ ] Ticker-placeholders vervangen: `[TICKER]`, `[YAHOO]`, `[BEDRIJF]`
- [ ] Cowork heeft mount op `C:\Users\janco\aandelenanalyse\`
- [ ] Vorige cowork-sessie afgesloten (geen stale state)

## Wat Claude Code daarna doet (volgorde)

1. Lees `research/[TICKER].md`
2. Check sectie "## Opmerkingen voor Claude Code" — openstaande twijfels adresseren of expliciet overnemen
3. Genereer JSON via Python script/handmatig volgens het 17-key schema
4. Schrijf naar `data/[TICKER].json` + `shutil.copyfile` naar `platform/src/content/data/[TICKER].json`
5. SHA256-check beide paden
6. `python platform/scripts/validate_structure.py [TICKER]` → 0 FAIL
7. `python platform/scripts/verify_consistency.py [TICKER]` → 0 FAIL
8. `cd platform && npm run build` → 0 errors
9. `git add` beide paden + `research/[TICKER].md` → commit → push
