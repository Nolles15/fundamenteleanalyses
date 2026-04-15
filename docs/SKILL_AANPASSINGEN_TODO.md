# Skill-aanpassingen — klaar om in Cowork uit te voeren

Gebruik deze prompt in Cowork met skill-creator om de fundamentele-analyse skill bij te werken.

---

```
Help me edit the "fundamentele-analyse" skill using skill-creator.

We moeten het onderstaande aanpassen in de skill, maar we moeten wel 
voorzichtig zijn om de link met het project niet te verstoren.

Pas de fundamentele-analyse skill aan op het volgende pad:
~\AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\local-agent-mode-sessions\skills-plugin\

Zoek de juiste subdirectory met fundamentele-analyse/SKILL.md daarin.

═══════════════════════════════════════════════
WIJZIGING 1 — CYCLICITEITSCHECK IN DCF-SECTIE
═══════════════════════════════════════════════

Zoek in SKILL.md de sectie "7.1 DCF-analyse (Discounted Cash Flow)" 
en specifiek "Stap 1 — Historische FCF als vertrekpunt". Voeg DIRECT NA de 
alinea die eindigt op "cost of equity — die combinaties zijn methodologisch fout."
de volgende tekst in (vóór de huidige "Gebruik FCF na SBC..." alinea):

---

*** VERPLICHTE CYCLICITEITSCHECK — VOER DIT UIT VÓÓR JE EEN FCF-GETAL KIEST ***

Beantwoord eerst expliciet: is dit bedrijf actief in een cyclische sector?

Cyclische sectoren (niet uitputtend):
  - Bouw en infra (aannemers, projectontwikkelaars)
  - Grondstoffen (staal, koper, aluminium, chemie)
  - Energie (olie & gas, raffinaderijen)
  - Scheepvaart en transport
  - Halfgeleiders (commodity chips)
  - Kapitaalgoederen en zware industrie
  - Auto-industrie en toeleveranciers

Als het antwoord JA is, gelden de volgende verplichte regels:

REGEL 1 — Gebruik NOOIT de meest recente FCF als DCF-startpunt als dat
  een piek- of dal-jaar is. FCF in een topjaar kan 2-3x het cyclisch
  gemiddelde zijn. Een DCF op piek-FCF leidt structureel tot te hoge
  fair values — dit is een van de meest voorkomende fouten in
  fundamentele analyse van cyclische bedrijven.

REGEL 2 — Bereken de genormaliseerde (mid-cycle) FCF:
  a. Verzamel FCF over minimaal een volledige cyclus (bij voorkeur 7-10 jaar)
  b. Bereken zowel het gemiddelde als de mediaan
  c. Als het bedrijf significant gegroeid is (omzet >30% hoger dan
     het historisch gemiddelde), converteer dan de historische FCF-marge
     naar de huidige omzetschaal:
       Genormaliseerde FCF = mediaan historische FCF-marge x huidige omzet
  d. Gebruik de genormaliseerde FCF als `basis_fcf` in de DCF
  e. Vul `fcf_type` in als: "Genormaliseerde FCF [X] mln (mid-cyclus)"
     met een expliciete onderbouwing (mediaan marge, omzetschaal)

REGEL 3 — Benoem het piek/dal verschil expliciet in `dcf_toelichting`:
  Rapporteer piek-FCF, dal-FCF, gemiddelde FCF en gekozen genormaliseerde FCF.
  Motiveer de keuze. Als de gekozen FCF meer dan 20% afwijkt van de
  meest recente FCF: verplichte rode-vlag melding in de toelichting.

REGEL 4 — Sanity check via marge:
  Historische mediaan FCF-marge x huidige omzet moet dicht bij de gekozen
  genormaliseerde FCF liggen. Als het meer dan 25% afwijkt: heroverweeg
  het startpunt en motiveer de afwijking expliciet.

Als het bedrijf NIET cyclisch is: gebruik FCF na SBC (zie H2.4) over
minimaal 8-10 jaar als vertrekpunt, bij voorkeur inclusief een volledige
economische cyclus.

---

Vervang daarna de huidige "Vermeld expliciet:" bullet-lijst door:

Vermeld in alle gevallen expliciet:
  - Of het bedrijf cyclisch is en hoe de FCF-normalisatie is toegepast
  - Welk tijdvenster, en of het pre-IPO data bevat
  - Of een IPO-correctie is toegepast (zie H2.3)
  - Welke eenmalige posten zijn genormaliseerd
  - Of SBC is verwerkt in de FCF (verplicht)
  - In welke valuta de kasstromen zijn gemodelleerd (vul `valuta_kasstromen` in)

═══════════════════════════════════════════════
WIJZIGING 2 — INDEX.JSON VERWIJDEREN UIT SKILL
═══════════════════════════════════════════════

Het platform genereert de index nu automatisch uit de analyse-JSONs.
De skill hoeft GEEN index.json meer aan te maken of bij te werken.

Zoek en VERWIJDER de volgende onderdelen uit SKILL.md:

a) In STAP 2 (rond regel 1045-1047), verwijder:
   "Werk ook het index-bestand bij:
     c:\Users\janco\aandelenanalyse\platform\src\content\data\index.json
   Voeg een entry toe (of update bestaande). Zet "laatste_update" op vandaag."

b) Verwijder de volledige sectie "## Pad: index.json entry" inclusief
   het JSON-codeblok eronder (de template met ticker, naam, sector, etc.)

c) Als er elders nog verwijzingen naar index.json staan: verwijder die ook.

De skill moet ALLEEN nog de analyse-JSON wegschrijven naar:
  c:\Users\janco\aandelenanalyse\platform\src\content\data\[TICKER].json

═══════════════════════════════════════════════
WIJZIGING 3 — VELDNAAM-FIXES (types.ts mismatch)
═══════════════════════════════════════════════

De DAN-analyse bevatte 4 veldnamen die niet matchen met types.ts.
Controleer en corrigeer in de JSON-template:

a) databronnen.bronnen → MOET databronnen.bronnen_geraadpleegd zijn (string[])
b) databronnen.ontbrekende_data → MOET een string zijn, GEEN array
c) databronnen.non_gaap_gebruik → MOET twee velden zijn:
   - non_gaap_gebruikt: boolean
   - non_gaap_toelichting: string | null
d) bronnen[] array MOET op top-level staan (naast databronnen),
   met objecten: { url, titel, type }. Het type-veld is verplicht.

═══════════════════════════════════════════════
WIJZIGING 4 — DATA_KWALITEIT OBJECT TOEVOEGEN
═══════════════════════════════════════════════

Het platform toont nu een datakwaliteitsbadge op elke analysepagina.
De badge werkt al op basis van dynamische berekening (null-telling in
de financiële tabellen), maar de skill kan een beter object leveren
met context-rijke toelichting.

Voeg aan het eind van STAP 2 (JSON genereren) de volgende instructie toe:

---

*** DATA_KWALITEIT — VERPLICHT VOOR ELKE ANALYSE ***

Na het invullen van de financiële tabellen, genereer een `data_kwaliteit`
object op top-level in de JSON. Dit object signaleert aan de gebruiker
hoe compleet de onderliggende data is.

Kernvelden per jaar om te tellen (9 totaal):
  omzet, ebit, nettowinst, eps (uit resultatenrekening)
  cfo, capex, fcf (uit kasstromen)
  nettoschuld (uit balans)
  roic_pct (uit rendementsindicatoren)

Bereken per jaar: gevulde kernvelden / 9.
  - Jaar is "volledig" als >= 8/9 velden gevuld
  - Jaar is "gedeeltelijk" als 1-7/9 velden gevuld
  - Jaar is "ontbrekend" als 0/9 velden gevuld

Bereken totaal dekking_pct = (alle gevulde kernvelden / alle kernvelden) × 100

Structuur:
```json
"data_kwaliteit": {
  "jaren_aanwezig": [2015, 2016, ..., 2025],
  "jaren_volledig": [2021, 2022, 2023, 2024, 2025],
  "jaren_gedeeltelijk": [2018, 2019, 2020],
  "jaren_ontbrekend": [2015, 2016, 2017],
  "dekking_pct": 74,
  "label": "Gedeeltelijke data",
  "toelichting": "Data voor 2015-2017 niet verifieerbaar via vrij toegankelijke bronnen. FCF-normalisatie gebaseerd op 2018-2025."
}
```

Label toekenning:
  - dekking_pct >= 90: "Volledige data"
  - dekking_pct 70-89: "Gedeeltelijke data"
  - dekking_pct < 70: "Beperkte data"

De toelichting moet vermelden:
  - Welke jaren ontbreken en waarom (databron niet beschikbaar, pre-IPO, etc.)
  - Welk effect dit heeft op de analyse (bijv. FCF-normalisatie, ROIC-trend)

---

Voeg ook `data_kwaliteit` toe aan de JSON-template op top-level,
na `update_historie` en voor de sluitende `}`.

═══════════════════════════════════════════════
WIJZIGING 5 — DATABRONNEN-HIERARCHIE PER REGIO
═══════════════════════════════════════════════

Voeg een sectie toe aan de ALGEMENE INSTRUCTIES die de skill vertelt
welke databronnen prioriteit hebben per regio. Dit voorkomt dat de
volledigheid van analyses afhankelijk is van welke site toevallig 
beschikbaar is.

Voeg de volgende tekst toe NA de "*** BRONVERIFICATIE" sectie:

---

*** DATABRONNEN-HIERARCHIE ***

Gebruik de volgende volgorde bij het opzoeken van financiële data:

VS-bedrijven:
  1. SEC EDGAR 10-K (HTML-versie, niet PDF) — meest betrouwbaar, 10+ jaar
  2. StockAnalysis.com — compact overzicht, slechts 5 jaar gratis
  3. IR-website van het bedrijf

EU-bedrijven:
  1. IR-website jaarverslag (meestal PDF) 
  2. StockAnalysis.com of MarketScreener
  3. Nationale toezichthouder (AFM, BaFin, AMF, etc.)

Scandinavische bedrijven:
  1. IR-website (vaak in het Engels beschikbaar)
  2. MarketScreener of Börsdata (Zweeds)

Probeer ALTIJD minimaal 8-10 jaar financiële data te verzamelen.
Als de primaire bron slechts 5 jaar toont: zoek een secundaire bron
voor de ontbrekende jaren. Vermeld in `databronnen.bronnen_geraadpleegd`
alle bronnen die je hebt gebruikt, en in `data_kwaliteit.toelichting`
waarom eventuele jaren ontbreken.

---

═══════════════════════════════════════════════
VALIDATIE
═══════════════════════════════════════════════

1. Controleer dat SKILL.md syntactisch correct is (geen gebroken secties)
2. Controleer dat er NERGENS meer naar index.json wordt verwezen in SKILL.md
3. Controleer dat de cycliciteitscheck correct is ingevoegd in de DCF-sectie
4. Controleer dat de veldnamen in de JSON-template matchen met bovenstaande fixes
5. Controleer dat data_kwaliteit in de JSON-template staat
6. Controleer dat de databronnen-hierarchie is toegevoegd na bronverificatie
7. Geef een samenvatting van alle wijzigingen die je hebt aangebracht
```
