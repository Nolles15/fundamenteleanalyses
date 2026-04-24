# Research: [TICKER] — [Bedrijfsnaam]

> **DIT BESTAND IS HET ENIGE OUTPUT-ARTEFACT VAN JE WERK.**
> Geen JSON. Geen platform-files. Geen validator-scripts. Alleen deze markdown.
> Claude Code leest dit, converteert het naar JSON, valideert en pusht.
>
> **Vóór invullen: lees `research/METHODE.md`.** Die bevat de scoring-rubrics,
> WACC-regels, cyclus-normalisatie, pre-IPO checks, management-analyse-rubrics,
> woordentellingen per sectie en bronverificatie-eisen. Dit template is alleen
> de structuur — METHODE.md bepaalt HOE je elke sectie invult.
>
> **Daarvóór: lever de VERPLICHTE bronnen-inventaris op volgens METHODE.md
> Stap 0.5.** Pas als die inventaris er ligt mag je tabellen invullen.

---

## HOE OM TE GAAN MET ONTBREKENDE DATA (BELANGRIJK — LEES VOOR JE BEGINT)

Dit template bevat tabellen die suggereren dat je elke cel moet invullen.
Dat is **uitdrukkelijk niet het geval**. Een cel blijft leeg wanneer je
geen geverifieerde bron hebt. Een halfvolle tabel met bronvermelding is
beter dan een volle tabel met verzonnen getallen. Die laatste veroorzaakt
direct een hard fail in stage 2.

**Correcte conventie bij ontbrekende data:**

1. **Numerieke cel zonder bron** → laat leeg of zet `—`. Niet "circa X",
   niet "~Y", niet een range ("25-35%"). Die vormen zijn allemaal
   verzinnen tenzij je een bron met exact die range kunt overleggen.
2. **Hele rij zonder bron** (bv een jaar waarvoor geen jaarverslag
   beschikbaar is) → laat de hele rij leeg EN noteer het jaar in
   de ontbrekende_data-sectie van Hoofdstuk 13.
3. **Kwalitatief veld zonder bron** (bv "marktaandeel top-3 concurrenten")
   → laat weg uit het rapport. Niet vervangen door een gokje.

**Voorbeeld van een CORRECTE halfvolle tabel** (jaren 2015-2017 geen PDF
beschikbaar, aggregators hebben geen pre-2018 data voor deze ticker):

| Jaar | Omzet | EBIT | EBITDA | Nettowinst | FCF | Bron |
|---|---|---|---|---|---|---|
| 2015 | — | — | — | — | — | — |
| 2016 | — | — | — | — | — | — |
| 2017 | — | — | — | — | — | — |
| 2018 | 3.158 | 145 | 260 | 67 | 84 | AR 2018 (URL) |
| ... | | | | | | |
| 2024 | 3.434 | 210 | 298 | 132 | 155 | AR 2024 (URL) |
| TTM | 3.197 | 45 | 28 | -12 | -85 | FY2025 preliminary (URL) |

Drie lege rijen boven is methodisch correct. Een analyse van 8 jaar met
bronnen is een volwaardige analyse; een analyse van 10 jaar waarvan 3
verzonnen is geen analyse.

---

## Metadata
- **Ticker (bare):** [bv MIPS, niet MIPS.ST]
- **Yahoo symbol:** [MIPS.ST]
- **Exchange:** [STO / AEX / ENXTAM / HEX / OSL / CPH]
- **Sector (GICS-achtig):** [bv Gezondheidszorg, Technologie, Industrie, Consumentengoederen, Energie, Materialen, Vastgoed, Nuts, Financieel, Communicatie]
- **Industrie:** [specifieker, bv Medische hulpmiddelen, Industriële software]
- **Land:** [bv Zweden]
- **Peildatum analyse:** [YYYY-MM-DD, koersdatum]
- **Koers op peildatum:** [getal]
- **Valuta:** [SEK / EUR / NOK / DKK / USD]
- **Marktkapitalisatie:** [leesbare vorm, bv "SEK 7,1 mld"]
- **Marktkap in mln (lokale valuta):** [integer]
- **Free float pct:** [%]
- **Indexlidmaatschap:** [bv OMX Stockholm Mid Cap, of "Geen"]
- **Domein:** [bedrijfswebsite]

---

## 1. Executive summary

- **Kernthese** (2-3 zinnen, waarom dit interessant of niet):
- **Oordeel** (enum **UITSLUITEND**: **KOOP** | **HOLD** | **PASS** — geen NL-varianten zoals HOUDEN/MIJDEN):
- **Fair value basis** (kansgewogen, lokale valuta): [getal]
- **Fair value kansgewogen**: [getal]
- **EPV per aandeel** (Earnings Power Value, zonder groeipremie): [getal]
- **Upside pct**: [%]
- **Fair value scenarios** (3 stuks — **Pessimistisch / Basis / Optimistisch** — exact deze labels, met kans_pct die optelt tot 100):

| Scenario | Fair value | Upside % | FCF groei % | WACC % | Kans % |
|---|---|---|---|---|---|
| Pessimistisch | | | | | |
| Basis | | | | | |
| Optimistisch | | | | | |

- **Reverse-DCF impliciete groei pct** (wat moet FCF groeien om huidige koers te rechtvaardigen):
- **Grootste kans** (1 zin):
- **Grootste risico** (1 zin):

---

## 2. Bedrijfsprofiel

- **Beschrijving** (wat doet het bedrijf, 3-5 zinnen):
- **Geschiedenis** (oprichting, IPO, kernmomenten):
- **Bedrijfsmodel** (hoe verdient het geld, recurring / eenmalig):
- **IPO-context** (datum, koers, reden IPO, waardering bij IPO):
- **Klantprofiel** (B2B/B2C, concentratie, retention):
- **Oprichtingsjaar**:
- **IPO-datum**:
- **IPO-koers** (lokale valuta):
- **Personeel** (FTE):
- **Landen actief**:
- **Klantconcentratie** (bv "Top 5 klanten = 35% omzet"):

### Geografische spreiding (omzet)
| Regio | Omzet % | Valuta-exposure |
|---|---|---|
| | | |

**Toelichting geografie** (FX-risico, transfer pricing, natural hedge):

### Segmenten
| Naam | Omzet % | Beschrijving |
|---|---|---|
| | | |

### Aandeelhouders (top 5)
| Naam | Belang % | Type (oprichter / PE / institutioneel / retail) |
|---|---|---|
| | | |

- **Institutioneel eigendomstrend** (stijgend / stabiel / dalend + toelichting):

---

## 3. Financieel — historische data (10 jaar + TTM)

### Resultatenrekening (bedragen in mln lokale valuta)

Bron-eis: **recente 5 jaren moeten uit jaarverslagen/IR komen** (betrouwbaarheid HOOG). Jaren 6-10 mogen uit aggregators (MacroTrends / StockAnalysis / Yahoo — betrouwbaarheid AGGREGATOR).

| Jaar | Omzet | Omzetgroei % | Brutowinst | Brutomarge % | EBIT | EBIT-marge % | EBITDA | EBITDA-marge % | Nettowinst | Nettomarge % | EPS | EPS-groei % | Aandelen mln |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2015 | | | | | | | | | | | | | |
| ... | | | | | | | | | | | | | |
| 2024 | | | | | | | | | | | | | |
| TTM | | | | | | | | | | | | | |

- **Toelichting resultaten** (uitschieters, IFRS-overgang, one-offs):
- **Omzet-CAGR** (periode benoemen, bv "2015-2024"):

### Kasstromen

| Jaar | CFO | Capex | FCF | FCF na SBC | FCF/aandeel | FCF-marge % | FCF-groei % | FCF-conversie % | SBC | Dividend totaal | Aandeleninkoop |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |

- **Toelichting kasstromen** (capex-cyclus, leasing, werkkapitaal-druk):

### Balans-ratio's (10 jaar)

| Jaar | Nettoschuld | Nettoschuld/EBITDA | Eigen vermogen | ROE % | ROIC % | ROCE % | Current ratio | Solvabiliteit % | Goodwill % van EV | Working capital |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

- **Toelichting balans** (schuldpositie, covenants, IFRS-16 impact):

### Kapitaalstructuur huidig
- **Nettoschuld (huidig)**:
- **Bruto schuld**:
- **Cash & equivalents**:
- **Lease-verplichtingen (IFRS-16)**:
- **Gemiddelde rente %**:
- **Rente-dekking (EBIT/rente)**:

### Non-GAAP / aanpassingen
- **Gebruikt?** (true/false):
- **Welke aanpassingen** (bv IFRS-16 strip, SBC toerekening, earn-outs):
- **Waarom** (vergelijkbaarheid, management-communicatie):

---

## 4. Moat (concurrentievoordeel)

- **Oordeel** (enum **UITSLUITEND**: **WIDE MOAT** | **NARROW MOAT** | **NO MOAT** — geen Nederlandstalige varianten):
- **Moat-categorieën** (PRECIES deze 5 namen letterlijk, één rij per categorie — ook "GEEN" is een geldig sterkte-antwoord):

| Naam | Sterkte (sterk/middel/zwak/geen) | Toelichting |
|---|---|---|
| Immateriële activa | | |
| Overstapkosten | | |
| Netwerkeffecten | | |
| Kostenvoordeel | | |
| Efficiënte schaal | | |

- **Kwantitatief bewijs** (ROIC-historie, marge-stabiliteit, marktaandeel-ontwikkeling):
- **Duurzaamheid** (5 jaar / 10 jaar / 20 jaar + waarom):
- **Erosierisico's** (wat kan de moat uithollen):

---

## 5. Management

- **CEO-naam + tenure**:
- **CFO-naam + tenure**:
- **Oprichter nog betrokken?**:
- **Insider ownership %**:
- **Capital allocation track record** (dividenden / inkoop / M&A / organisch):

| Jaar | Dividend totaal | Aandeleninkoop | M&A uitgaven | Organische capex |
|---|---|---|---|---|
| | | | | |

- **M&A-track-record** (aantal deals, belangrijkste, succes/mislukking):
- **Beloning** (bonus-KPIs, LTI-structuur, alignement met aandeelhouders):
- **Oordeel management** (enum **UITSLUITEND**: **STERK** | **NEUTRAAL** | **ZORGWEKKEND** — geen andere varianten):
- **Toelichting**:

---

## 6. Sector & concurrentie

- **Sector-groeivooruitzicht** (pct per jaar + bron):
- **Porter five forces** (per kracht: hoog/middel/laag + toelichting):
  - Rivaliteit:
  - Nieuwe toetreders:
  - Substituten:
  - Macht leveranciers:
  - Macht afnemers:
- **Concurrenten** (3-5 belangrijkste, met marktaandeel indien bekend):

| Concurrent | Marktaandeel % |
|---|---|
| | |

- **Positie van het bedrijf** (leider / challenger / nichespeler + toelichting):

### TAM/SAM/SOM
- **TAM (mln lokale valuta)**:
- **TAM-groei %**:
- **SAM (mln)**:
- **SAM-groei %**:
- **Huidige penetratie %** (omzet / SAM):
- **Impliciete penetratie na horizon %** (bij aangenomen groei):
- **Groei plausibel?** (true/false):
- **Bron TAM/SAM**:
- **Toelichting** (plausibiliteitscheck):

---

## 7. Analyse-frameworks (9 frameworks, SCORES 0-5)

Scores zijn integer **0-5** per framework (max per framework = 5, totaal max = 45). Framework-namen moeten LETTERLIJK zo staan (incl. spaties en punt):

### Graham
- **Oordeel**: [tekst]
- **Graham number**: [getal]
- **Margin of safety %** (t.o.v. huidige koers):
- **Toelichting**:
- **Score (0-5)**:

### Buffett / Munger  *(let op: spaties rond de schuine streep)*
- **Oordeel**:
- **ROIC structureel boven WACC?** (true/false):
- **Toelichting**:
- **Score (0-5)**:

### Peter Lynch
- **Categorie** (Slow grower / Stalwart / Fast grower / Cyclical / Turnaround / Asset play):
- **Oordeel**:
- **PEG-ratio**:
- **Toelichting**:
- **Score (0-5)**:

### Phil Fisher
- **Oordeel**:
- **Toelichting** (kwalitatief, 15 punten Fisher):
- **Score (0-5)**:

### Magic Formula (Greenblatt)
- **Oordeel**:
- **Earnings yield %**:
- **Return on capital %**:
- **Toelichting**:
- **Score (0-5)**:

### Moat
- **Score (0-5)** — zelfde oordeel als sectie 4 maar gescoord:

### Management
- **Score (0-5)** — zelfde oordeel als sectie 5 maar gescoord:

### Fair Value DCF
- **Score (0-5)** — hoeveel MOS heeft het aandeel op de DCF-basis?:

### Fair Value IPO-gecorr.
- **Score (0-5)** — specifiek voor post-IPO bedrijven met beperkte historie:

### Scorekaart totaal
- **Totaalscore**: [som, integer]
- **Max**: 45 (9 × 5)
- **Eindoordeel** (enum **UITSLUITEND**: **KOOP** | **HOLD** | **PASS** — volgt deze deterministische regel):
  - `totaal >= 33` EN `Fair Value DCF-score >= 3` → **KOOP**
  - `totaal < 24` OF `Fair Value DCF-score == 1` → **PASS**
  - anders → **HOLD**
- **Samenvatting** (2-3 zinnen):

---

## 8. Risico's (minimaal 5-8 stuks)

Per risico: kans (enum **LAAG** | **MIDDEN** | **HOOG**), impact (enum **KLEIN** | **MIDDEL** | **GROOT**), welke DCF-aanname geraakt.

| # | Omschrijving | Kans | Impact | DCF-aanname geraakt | Toelichting |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| ... | | | | | |

---

## 9. These invalide bij

Eén tekstblok, 2-4 zinnen. "Deze these is weerlegd wanneer X, Y of Z gebeurt." Concrete observeerbare triggers.

---

## 10. ESG

### Materiële factoren (SASB-gebaseerd)

| Factor | SASB-categorie | Risiconiveau (Laag/Midden/Hoog) | Financiële impact | DCF-impact |
|---|---|---|---|---|
| | | | | |

- **Eindoordeel ESG** (enum: **LAAG RISICO** | **GEMIDDELD RISICO** | **HOOG RISICO**):
- **Toelichting**:

---

## 11. Katalysatoren (5-8 stuks, chronologisch)

Per katalysator: datum circa, omschrijving, richting (**POSITIEF** | **NEGATIEF** | **NEUTRAAL** | **BINAIR**), impact (**GROOT** | **MIDDEL** | **KLEIN**).

| Datum ca. | Omschrijving | Richting | Impact |
|---|---|---|---|
| | | | |

---

## 12. Fair value — kwantitatief (DCF)

### WACC-componenten
- **Risicovrije rente %**: [bv 2,78]
- **Bron risicovrije rente** (welke staatsobligatie, welke looptijd):
- **Type** (nominal / real):
- **ERP (equity risk premium) %**: [Damodaran-database = standaard]
- **Bron ERP**:
- **Beta (adjusted, Blume)**: [2 decimalen]
- **Bron beta** (Bloomberg / Refinitiv / eigen regressie):
- **Type beta** (5y monthly / 2y weekly / eigen):
- **Country risk premium %** (indien niet-thuismarkt):
- **Size premium %** (indien small-cap):
- **Cost of equity %**:
- **Schuldkosten na belasting %**:
- **E/V gewicht %** (equity fractie van enterprise value):
- **D/V gewicht %** (debt fractie):
- **WACC %**: [berekend]
- **Sector WACC % (referentie Damodaran)**:
- **Illiquiditeitskorting %** (indien relevant, anders null):

### DCF model-specs
- **Model type** (2-fase / 3-fase / H-model):
- **FCF-definitie** (FCF to firm / to equity / owner earnings):
- **Basis FCF** (startjaar, genormaliseerd):
- **Basis FCF na SBC** (SBC behandeld als kosten):
- **FCF-type** (stated / adjusted — benoem welk):
- **Groei fase 1 %** (jaar 1-5):
- **Groei fase 2 %** (jaar 6-10):
- **Terminal groei %**:
- **Terminal methode** (Gordon growth / exit multiple):
- **Exit multiple gebruikt** (EV/EBITDA):
- **Bron exit multiple** (sector-mediaan / peer-groep):
- **Terminal value Gordon growth**:
- **Terminal value exit multiple**:
- **Terminal value % van totaal**: (moet < 75% zijn voor geloofwaardigheid)
- **Terminal implied EV/EBITDA** (consistentie-check):
- **Terminal groei consistentie** (past bij GDP-groei thuismarkt? toelichting):
- **Mid-year convention** (true/false):
- **Aandelen uitstaand (mln)**:
- **Nettoschuld huidig**:

### DCF-toelichting
(5-8 zinnen: waarom deze groeiaannames, waarom dit terminal, welke checks gedaan)

### 5-jaars projectie

| Jaar | Omzet | Omzetgroei % | EBIT | EBIT-marge % | NOPAT | Capex | ΔNWC | SBC | FCF |
|---|---|---|---|---|---|---|---|---|---|
| 2025 | | | | | | | | | |
| 2026 | | | | | | | | | |
| 2027 | | | | | | | | | |
| 2028 | | | | | | | | | |
| 2029 | | | | | | | | | |

### Scenarios (3 stuks — exact deze labels)

| Scenario | FCF-groei % | WACC % | Fair value | Upside % | Kans % |
|---|---|---|---|---|---|
| Pessimistisch | | | | | |
| Basis | | | | | |
| Optimistisch | | | | | |

- **Kansgewogen fair value** (kans_pct moet optellen tot 100):

### Reverse DCF
- **Impliciete groei %** (wat moet FCF groeien voor huidige koers):
- **Historische FCF CAGR %**:
- **Consensus groei % (analisten)**:
- **Interpretatie** (is de impliciete groei realistisch?):

### EPV (Bruce Greenwald)
- **Genormaliseerde EBIT-marge %**:
- **Genormaliseerde NOPAT**:
- **Maintenance capex**:
- **Adjusted earnings power**:
- **EPV per aandeel**:
- **Groeipremie %** (koers t.o.v. EPV):

### Andere methoden
- **DDM uitgevoerd?** (alleen voor dividend-aandelen — true/false):
- **SOTP uitgevoerd?** (alleen voor conglomeraten — true/false):

### Synthese fair value
- **Bandbreedte laag**:
- **Bandbreedte centraal**:
- **Bandbreedte hoog**:
- **Methode-gewichten** (som = 100%):
  - DCF %:
  - EPV %:
  - Multiples %:
- **Margin of safety vereist %** (typisch 20-30% voor small-cap):
- **Koopniveau** (fair value × (1 − MOS)):
- **Synthese-toelichting** (waarom deze gewichten, waarom deze MOS):

### Gevoeligheid (DCF)
- **FCF-groei ↔ WACC matrix** (5 × 6 waarden, geef ranges die je hebt gebruikt + resulterende fair value matrix):
  - WACC range: [bv 7%, 8%, 9%, 10%, 11%, 12%]
  - Groei range: [bv 4%, 6%, 8%, 10%, 12%]
  - Matrix (5 rijen × 6 kolommen met fair values):

---

## 13. Databronnen

### Bronnen-hiërarchie
- **Jaarverslag PDF / IR-pagina** → betrouwbaarheid **HOOG**
- **Beursmelding / prospectus** → betrouwbaarheid **HOOG**
- **Aggregator** (MacroTrends / StockAnalysis / Yahoo / TIKR / SimplyWall) → betrouwbaarheid **AGGREGATOR**

### Financiële bronnen (10 jaar historie — VERPLICHT)

| Jaar | Bron | URL | Betrouwbaarheid (HOOG/AGGREGATOR) |
|---|---|---|---|
| 2015 | | | |
| 2016 | | | |
| 2017 | | | |
| 2018 | | | |
| 2019 | | | |
| 2020 | | | |
| 2021 | | | |
| 2022 | | | |
| 2023 | | | |
| 2024 | | | |

**Harde eis:** de 5 meest recente jaren (2020-2024) moeten ALLEMAAL HOOG zijn. URL bevat "jaarverslag" / "annual" / "investor" of eindigt op `.pdf`.

### Jaarverslagen geraadpleegd

| Jaar | Bron | URL |
|---|---|---|
| | | |

### Beursmeldingen geraadpleegd (kwartaalupdates, winstwaarschuwingen, M&A)

| Datum | Omschrijving | URL |
|---|---|---|
| | | |

### IPO-prospectus
- **Geraadpleegd?** (true/false):
- **URL**:
- **Pre-IPO data beschikbaar?** (true/false):
- **Pre-IPO bron**:

### Non-GAAP
- **Gebruikt?** (true/false):
- **Toelichting** (welke adjustments, waarom):

### Ontbrekende data (eerlijke lijst)
- [wat je niet kon vinden of inschatten]

### Peildatum analyse
- [YYYY-MM-DD, consistent met koersdatum]

---

## 14. Volledige bronnen-lijst (voor sectie `bronnen` in JSON)

Platte lijst van alle geraadpleegde bronnen met titel + URL + type (jaarverslag / beursmelding / aggregator / nieuwsartikel / onderzoeksrapport).

| Titel | URL | Type |
|---|---|---|
| | | |

---

## 15. Update-historie (voor eerste analyse: 1 entry)

| Datum | Versie | Wijziging |
|---|---|---|
| YYYY-MM-DD | 1.0 | Eerste publicatie |

---

## Afronding (check voor je oplevert)

- [ ] Elk cijfer in de tabellen heeft een bron-voetnoot of staat in de bronnen-tabel
- [ ] De recente 5 jaren in sectie 13 zijn allemaal HOOG
- [ ] Geen enum-variant verzonnen — alleen waarden uit deze template
- [ ] Scorekaart heeft 9 frameworks, totaal/max kloppen
- [ ] Synthese-toelichting aanwezig (sectie 12)
- [ ] Non-GAAP adjustments expliciet toegelicht
- [ ] IPO-carve-out: als bedrijf < 10 jaar beursgenoteerd, leg in sectie 13 uit hoe je met ontbrekende data omgaat
