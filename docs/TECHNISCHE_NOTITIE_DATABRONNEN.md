# Technische Notitie: Ontbrekende historische financiële data & signalering op de website

**Datum:** 15 april 2026  
**Context:** Fundamentele analyse platform (aandelenanalyse)  
**Aanleiding:** Analyse Dana Incorporated (DAN) — ontbrekende data voor jaren 2015–2020

---

## 1. Het probleem

Bij de analyse van Dana Incorporated bleek dat financiële data voor de jaren vóór 2021 grotendeels ontbreekt in de JSON-analysebestanden. Concreet ontbreken:

- Brutowinst en EBIT voor 2015–2020
- Operationele kasstroom en capex voor 2015–2020
- Balansdata (goodwill, current ratio) voor 2015–2020

**Oorzaak:** De primaire databron die de skill gebruikt (StockAnalysis.com) toont in de gratis versie standaard slechts de laatste 5 jaar. Macrotrends.net heeft langere historiek maar geeft een 402-betaalmuur. De SEC 10-K jaarverslagen (de gouden standaard voor Amerikaanse bedrijven) zijn wel gratis beschikbaar maar zijn grote PDF-bestanden die bij fetchen regelmatig timeout geven.

---

## 2. Structurele situatie per regio

| Regio | Ideale bron | Probleem |
|---|---|---|
| VS | SEC EDGAR 10-K (edgar.sec.gov) | PDF-timeout bij grote bestanden |
| Nederland / EU | IR-website jaarverslag | Wisselende kwaliteit, niet altijd fetchbaar |
| Fallback | StockAnalysis.com | Slechts 5 jaar gratis |

De skill heeft momenteel geen expliciete databronnen-hiërarchie per regio. Dit maakt de volledigheid van analyses afhankelijk van welke site toevallig goed reageert op het moment van de analyse.

---

## 3. Impact op de analyse

Ontbrekende historische data raakt direct de kwaliteit van:

- **ROIC-WACC spread tabel** (vereist 5–10 jaar voor structurele beoordeling)
- **FCF-normalisatie voor de DCF** (cycliciteitscheck vereist volledige cyclus)
- **Omzet CAGR** (onvolledig bij missende jaren)
- **Accruals ratio trend** (zinloos bij minder dan 5 jaar)

In de DAN-analyse zijn de velden voor 2015–2020 gevuld met `null`. De analyse is functioneel, maar minder onderbouwd dan bij bedrijven waarvoor volledige data beschikbaar was.

---

## 4. Voorstel: Signalering op de website

Voeg een **datakwaliteitsindicator** toe aan elke analysepagina op de website. Deze indicator toont de gebruiker direct hoe volledig de onderliggende data is.

### 4a. Wat berekenen

Tel per analyse het aantal `null`-waarden in de financiële tabellen (`resultatenrekening`, `kasstromen`, `balans`, `rendementsindicatoren`) voor de velden die ertoe doen:

```
Kernvelden per jaar: omzet, ebit, nettowinst, eps, cfo, capex, fcf, nettoschuld, roic
```

Bereken per jaar het dekkingspercentage:
```
dekking_pct = (gevulde kernvelden / totaal kernvelden) × 100
```

### 4b. Weergave op de website

Toon een badge of banner boven de financiële tabellen:

| Situatie | Badge | Kleur |
|---|---|---|
| ≥ 90% gevuld over 10 jaar | ✓ Volledige data | Groen |
| 70–89% gevuld | ⚠ Gedeeltelijke data | Oranje |
| < 70% gevuld | ✗ Beperkte data | Rood |

Optioneel: toon een tooltip of uitklapbaar paneel met welke jaren en velden ontbreken.

### 4c. JSON-structuur (toevoeging aan het analysebestand)

Voeg een `data_kwaliteit`-object toe aan de JSON, zodat de frontend dit direct kan uitlezen zonder zelf te hoeven tellen:

```json
"data_kwaliteit": {
  "jaren_aanwezig": [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  "jaren_volledig": [2021, 2022, 2023, 2024, 2025],
  "jaren_gedeeltelijk": [2018, 2019, 2020],
  "jaren_ontbrekend": [2015, 2016, 2017],
  "dekking_pct": 64,
  "label": "Beperkte data",
  "kleur": "rood",
  "toelichting": "Data voor 2015–2017 niet beschikbaar. DCF-normalisatie gebaseerd op 2018–2025."
}
```

### 4d. Berekening automatiseren

Dit object kan worden gegenereerd door het bestaande `verify_consistency.py`-script uit te breiden, of door een apart script `generate_data_quality.py` te schrijven dat over de JSON loopt en de dekking berekent. Dit script kan dan worden aangeroepen als onderdeel van de analyse-workflow (na Stap 2, voor Stap 3).

---

## 5. Directe oplossing voor DAN

Voor Dana specifiek: de SEC 10-K filings zijn beschikbaar als HTML-versie op EDGAR (niet alleen als PDF), wat fetchen eenvoudiger maakt:

```
https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000026780&type=10-K
```

De 10-K van 2020 bevat de cijfers voor 2018, 2019 en 2020. De 10-K van 2017 bevat 2015, 2016 en 2017. Door deze twee filings te fetchen als HTML kunnen de ontbrekende velden in DAN.json worden aangevuld.

---

## 6. Samenvatting actiepunten

| Actie | Prioriteit | Type |
|---|---|---|
| Voeg `data_kwaliteit`-object toe aan JSON-schema (types.ts) | Hoog | Frontend + backend |
| Toon datakwaliteitsbadge op analysepagina | Hoog | Frontend |
| Schrijf `generate_data_quality.py` script | Middel | Backend / skill |
| Voeg SEC EDGAR HTML-fetching toe aan skill voor VS-bedrijven | Middel | Skill verbetering |
| Vul DAN.json aan via SEC 10-K 2017 en 2020 | Laag | Data |
