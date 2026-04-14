# Commercieel plan: Fundamentele Analyses Platform

**Datum:** 22 maart 2026
**Status:** Conceptanalyse — intern gebruik
**Versie:** 3.1 (bijgewerkt: DCF engine, thesis tracker, premium pricing, RA-verwijzingen verwijderd)

---

## Inhoudsopgave

1. Wat heb je nu?
2. Pipeline: AI-skill als schaalbaar model
3. Productanalyse — wat is er goed, wat mist er, hoe ziet het er professioneel uit?
4. Technisch voorstel: herbouwen van nul
5. Commercieel voorstel: van hobby naar product
6. Monetisatiestrategie
7. Juridische aandachtspunten
8. Rode vlaggen en beperkingen
9. Conclusie en routekaart

---

## 1. Wat heb je nu?

### Sterktes

**De analyses zelf** zijn het kernproduct. Het skill-framework is indrukwekkend: 9 hoofdstukken, DCF met vier scenario's, gevoeligheidsanalyse, 5 investeringsframeworks (Graham, Buffett, Lynch, Fisher, Greenblatt), moat-beoordeling, management-analyse, pre-IPO check. Dit is professioneler dan wat de meeste betaalde analystenbureaus publiceren.

De gestructureerde JSON-output (volledig gedocumenteerd in COWORK_EXPORT.md) maakt de data machineleesbaar — een cruciale eigenschap voor schaalbare productbouw.

**De technische infrastructuur** is solide voor een prototype: statische site op GitHub Pages, JSON-gedreven, interactieve viewer met tabs en scorekaart, geautomatiseerde deploy-pipeline.

**Het onderscheidend vermogen** zit in drie dingen:
1. Europeese small/midcap focus — vrijwel ungedekt terrein (Polen, Portugal, Scandinavie, Spanje)
2. Gestandaardiseerde scorekaart — reproduceerbaar, vergelijkbaar over bedrijven heen
3. AI-gegenereerd + menselijk gecheckt — optimale balans van snelheid en geloofwaardigheid

### Zwaktes van het huidige prototype

- Visueel ontwerp is functioneel maar niet commercieel — mist de uitstraling van een betaald product
- Geen gebruikersaccounts, geen betaalwall
- Statische koersen verouderen snel
- Geen SEO, geen vindbaarheid
- De hele stack is één HTML-bestand — niet schaalbaar

---

## 2. Pipeline: AI-skill als schaalbaar model

Dit is het centrale inzicht dat alles verandert. De Claude-skill lost het grootste probleem van elk analyses-platform op: kwaliteit vs. snelheid vs. kosten.

### Hoe de pipeline werkt

```
[Invoer: ticker, koers, horizon]
        ↓
[Claude skill: volledige analyse in ~15 min]
  - Web search voor actuele data
  - 9 hoofdstukken conform framework
  - DCF + scenario's + gevoeligheidsmatrix
  - JSON-output automatisch gegenereerd
        ↓
[Handmatige review door Janco]
  - Verificatie van financiële cijfers
  - Beoordeling DCF-aannames
  - Correctie eventuele fouten
        ↓
[Deploy: live in seconden]
```

### Wat dit betekent voor schaalbaarheid

Handmatig zou je 4-8 uur per analyse besteden. Met deze pipeline:
- **Jouw tijdsinvestering**: 30-60 minuten per analyse (invoer, review, eventuele correcties)
- **Totale tijd per analyse**: 1-2 uur (was: 4-8 uur)
- **Realistisch volume**: 3-5 analyses per week

### Audit trail voor kwaliteitsborging

De AI noteert bij elke financiële claim de bron en paginanummer. Dit is geïmplementeerd als een `bronnen[]` array in het JSON-schema en als inline-citaten in de Markdown-analyse.

Concreet:

```json
{ "sectie": "H2.1 Resultatenrekening", "claim": "Omzet FY2024: €1.792 mld",
  "bron": "Jaarverslag 2024", "pagina": 42 }
```

Spot-check in plaats van volledige verificatie. Bij 4 analyses/week zijn dat 200 analyses per jaar. Bij het huidige tempo (1-2/week) zijn het 50-100. Beide zijn enorme verbeteringen ten opzichte van handmatig schrijven.

### Pipeline automatisering (volgende stap)

Resterende handmatige stap: het pushen naar GitHub. Oplossingen in volgorde van eenvoud:
1. **Nu**: directe upload via admin-interface
2. **Korte termijn**: Automatisch domein invullen als onderdeel van JSON, geen interactieve prompt meer nodig
3. **Nieuwe platform**: Directe upload-functionaliteit in admin-interface — gecheckte JSON, auto-deploy

---

## 3. Productanalyse — goed, slecht, ontbreekt, en hoe ziet het er professioneel uit?

### Wat werkt

| Aspect | Huidig | Commercieel niveau |
|--------|--------|-------------------|
| Analyse-diepte | Uitstekend | Geen verbetering nodig |
| JSON-structuur | Goed | Kleine uitbreidingen voor nieuwe features |
| Scorekaart | Goed | Visueel verbeteren |
| Internationale scope | Onderscheidend | Behouden als USP |

### Wat ontbreekt voor een verkoopbaar product

**Vertrouwen**
- Auteursprofiel (wie ben jij? wat is je beleggingsachtergrond?)
- Methode-pagina: hoe werkt de scorekaart, hoe komt de DCF tot stand?
- Trackrecord-pagina: eerdere oordelen vs. werkelijk koersverloop
- Uitgebreide disclaimer en risicowaarschuwing

**Content**
- 12 analyses is te weinig — minimaal 30 voor geloofwaardigheid, 50+ voor betalers
- Watchlist-pagina (aankomende analyses)
- Sector-overzichtspagina

**Interactiviteit**
- Eigen DCF-calculator: gebruiker vult eigen groei-aannames in, ziet live fair value
- Vergelijkingsfunctie: twee aandelen naast elkaar
- Portefeuille-tracker (later)
- Alertfunctionaliteit (koers zakt onder/stijgt boven bepaalde drempel)

**Technisch**
- Eigen domein (stap 1, kost €10/jaar)
- SEO: statische pagina per analyse met meta-tags
- Nieuwsbrief-integratie
- Analytics

### Hoe ziet een professioneel design eruit?

Het huidige design is functioneel maar oogt als een hobbyproject. Voor een betalend publiek moet het design vertrouwen uitstralen. Referenties in het segment:

**Tikr.com** — Clean, data-dense, professioneel zonder overdaad
**Stratechery.com** — Minimalistisch, lange-form content, hoge prijs rechtvaardigt vertrouwen
**Koyfin.com** — Financieel dashboard, donkere UI, datafocus
**Morningstar.com** — Geloofwaardigheid door consistentie en diepte

**Designprincipes voor het nieuwe platform:**

1. **Typografie als fundament** — Gebruik een premium serif (bijv. Lora of Playfair Display) voor analyseteksten en een clean sans-serif (Inter, DM Sans) voor data. Dit onderscheidt zich onmiddellijk van standaard fintech-apps.

2. **Data-kaarten met karakter** — Bedrijfskaarten op de homepage tonen: logo, ticker, oordeel (gekleurde badge), scorekaart-progressiebalk, upside%, peildatum. Compact maar informatiedicht.

3. **Analyse-pagina in tijdschriftformat** — Elke analyse als een "artikel" met executive summary bovenaan, afbeeldingen en grafieken door de tekst heen, DCF-visualisaties (geen tabel maar interactieve grafiek), scorekaart als visual.

4. **Kleurpalet** — Donker blauw/slate als primaire kleur (vertrouwen, professionaliteit). Groene accenten voor KOOP, oranje voor HOLD, rood voor PASS. Geen "crypto-vibes" of fintech-neon.

5. **Mobiel-eerst** — Minimaal 40% van je lezers leest op telefoon. Kaarten, tabellen en grafieken moeten mobiel werken.

6. **Meertaligheid vanaf dag 1** — Nederlandse interface met Engels als optie. Technisch: next-intl (al gebruikt in striid-coaching).

---

## 4. Technisch voorstel: herbouwen van nul

De huidige stack (één HTML-bestand, GitHub Pages) is een goed prototype maar heeft plafond bereikt voor een commercieel product. Het nieuwe platform bouwen we met de stack die al bekend is.

### Stack

```
Next.js 16 (App Router) + TypeScript
├── Frontend
│   ├── Tailwind CSS v4 + shadcn/ui
│   ├── next-intl (NL + EN)
│   ├── Recharts of Tremor (grafieken)
│   └── Framer Motion (animaties, optioneel)
├── Data
│   ├── JSON-bestanden in /data/ (statisch, geen database nodig in fase 1)
│   ├── Later: PostgreSQL (Neon) voor gebruikersaccounts + alerts
│   └── Vercel Edge Config voor feature flags
├── Auth (fase 2)
│   └── Auth.js v5 (bestaande kennis)
├── Betalen (fase 2)
│   └── Stripe (abonnementen, meest gangbaar)
├── Email
│   └── Resend (bestaande kennis)
└── Deploy
    └── Vercel (bestaande kennis)
```

### Architectuur in fases

**Fase 1: Statische site met professioneel design (2-4 weken)**

Geen backend nodig. JSON-bestanden zijn de database. Doelen:
- Professioneel design met alle analyses
- SEO-vriendelijke pagina per analyse (`/analysis/adyen`, `/analysis/pzu`)
- Meertaligheid (NL/EN)
- Contactformulier / nieuwsbrief-aanmelding
- Geen login, geen betaalwall

Deploy: Vercel (gratis tier voldoende).

**Fase 2: Freemium + accounts (4-8 weken na Fase 1)**

- Auth.js v5 voor login (Google + email)
- Stripe voor abonnementsbeheer
- Middleware die premium-content afschermt
- Gratis tier: samenvatting + scorekaart zichtbaar, volledige analyse achter betaalwall
- Admin-interface: gecheckte JSON uploaden → auto-deploy

**Fase 2: Freemium + accounts (4-8 weken na Fase 1)**

- Auth.js v5 voor login (Google + email)
- Stripe voor abonnementsbeheer + pay-per-analysis
- Middleware die premium-content afschermt
- Gratis tier: samenvatting + scorekaart zichtbaar, volledige analyse achter betaalwall
- **Interactive DCF Engine**: JSON bevat alle ruwe variabelen (FCF, WACC, g, shares_outstanding, nettoschuld). De frontend doet live herberekeningen — geen API-aanroep nodig. Dit is pure wiskunde in de browser en past in Fase 2 (niet Fase 3 zoals eerder gedacht).
- Admin-interface: gecheckte JSON uploaden → auto-deploy

**Fase 3: Interactieve features (8-16 weken na Fase 2)**

- Vergelijkingsfunctie: twee aandelen naast elkaar
- Portefeuille-tracker
- Alertsysteem (koers-alert via e-mail)
- Thesis Tracker publieke pagina (aantoonbaar trackrecord van KOOP/HOLD/PASS-oordelen)
- API-tier voor power users

### Migratiepad voor bestaande data

De JSON-structuur is al goed. De 12 bestaande analyses hoeven niet over te worden geschreven — ze laden direct in het nieuwe platform. Eventuele ontbrekende velden worden `null` en visueel netjes afgehandeld.

### Engels-eerste benadering

De analyses zijn in het Nederlands geschreven maar de JSON-structuur is taalonafhankelijk. Voor de Engelse interface:
- `executive_summary.kernthese` → vertalen bij publicatie (Claude kan dit in seconden)
- `scorekaart.samenvatting` → idem
- Financiële data is universeel (getallen)
- `bedrijfsprofiel.beschrijving` → vertalen

Optie 1: Handmatig vertalen bij publicatie (goedkoop, traag).
Optie 2: Automatische vertaling via Claude API bij build-time (JSON bevat beide talen).
Optie 3: Analyses direct in het Engels schrijven — overwegen als Engelstalige markt het doel wordt.

**Aanbeveling: selectieve meertaligheid — geen volledige vertaling in JSON**

Het voorstel om alle tekstuele JSON-velden bilingual te maken (nl + en) is technisch aantrekkelijk maar praktisch te duur: het verdubbelt de output van Agent 3 (+~$0.03 per analyse) en voegt weinig waarde toe voor puur numerieke of structurele velden.

De pragmatische aanpak die wel in de code is doorgevoerd:
- **5 korte weergavevelden** krijgen een `_en` variant in het JSON-schema: `kernthese_en`, `grootste_kans_en`, `grootste_risico_en`, `samenvatting_en`, `beschrijving_en`. Dit zijn de velden die op platformkaarten en in de English interface zichtbaar zijn.
- **Financiële data** is taalonafhankelijk (getallen).
- **Volledige Markdown-analyse** (.md bestand) blijft Nederlands; vertaling bij build-time via Claude API indien EN-pagina nodig (eenmalige kosten, gecached).
- **Agent 3** vult de `_en` velden automatisch in bij export.

Dit levert een functioneel Engelstalig platform zonder structurele technische schuld in het JSON-schema.

---

## 5. Commercieel voorstel

### Marktpositie

**Doelgroep primair (NL):** Nederlandstalige retail-beleggers, 28-55 jaar, actief bezig met eigen aandelenresearch, bereid te betalen voor kwaliteit. Schatting betalende niche: 500-2.000 personen bij goede uitvoering.

**Doelgroep secundair (EN):** Europese retail-beleggers die Europese small/midcaps volgen. Weinig Engelstalige coverage van Europese small caps buiten de UK. Potentieel 10-20x groter publiek.

**Unieke waarde:**
1. Europese small/midcap focus (vrijwel ongedekt)
2. AI-gegenereerd + handmatig gecheckt (combinatie van snelheid en geloofwaardigheid)
3. Gestandaardiseerde scorekaart (vergelijkbaar over bedrijven)
4. Diepte: pre-IPO analyse, vijf investeringsframeworks, gevoeligheidsmatrix

### Concurrenten opnieuw bekeken

| Concurrent | Prijs | Sterk | Zwak |
|-----------|-------|-------|------|
| Seeking Alpha Premium | $239/jaar | Groot bereik, breed | Variabele kwaliteit, Amerikaans |
| Simply Wall St | $180/jaar | Mooi design, visueel | Oppervlakkig, geen diepte-analyses |
| Value Focus | ~€200/jaar | Nederlandstalig, diepte | Klein, gedateerd |
| Substack-analisten | $50-150/jaar | Persoonlijk | Geen structuur, geen vergelijking |
| Morningstar Premium | $199/jaar | Geloofwaardig, breed | Oud design, geen small caps |

**Gat in de markt:** Geen enkel platform combineert: (1) diepgaande analyses met DCF en scorekaart, (2) Europese small/midcap focus, (3) professioneel design, (4) redelijke prijs. Dit is de ruimte.

### Groeistrategie

**Fase 1 — Bereik opbouwen (0-6 maanden, gratis)**

- Platform lanceren op eigen domein
- 30+ analyses publiceren (al haalbaar met pipeline)
- Substack voor wekelijkse nieuwsbrief (gratis)
- LinkedIn: analysis-highlights in Engels en Nederlands
- Doel: 1.000+ maandelijkse bezoekers, 300+ nieuwsbriefabonnees

**Fase 2 — Eerste betalers (6-18 maanden)**

- Freemium: samenvatting + scorekaart gratis, volledige analyse betaald
- Prijs: €9,95/maand of €89/jaar
- Doel: 50-150 betalende abonnees = €4.450-€13.350/jaar
- Opvallend: bij hoge kwaliteit accepteren vroege adopters hogere prijzen

**Fase 3 — Schaal (18-36 maanden)**

- 100+ analyses beschikbaar
- Engelstalige markt actief benaderen
- Evt. tweede reviewer/analist
- Cursusproduct: "Fundamentele analyse voor retail-beleggers" (€97-€197)
- Community (Discord voor abonnees)

---

## 6. Monetisatiestrategie

### Primaire inkomstenstroom: Losse analyses + Categorie-abonnementen

**Model (herzien april 2026):**

| Tier | Prijs | Toegang |
|------|-------|---------|
| Gratis | €0 | Executive Summary + Bedrijfsprofiel + Totaalscore (2 van 10 tabs) |
| Losse analyse | €4,95 | Alle tabs van één analyse, permanent toegang |
| Categorie-abo | €9,95/mnd | Alle analyses binnen één categorie (bijv. "Nederlandse markt") |
| Premium | €14,95/mnd | Alle analyses, alle categorieën |
| Jaarlijks Premium | €129/jaar | Zelfde als Premium, ~28% korting |

**Freemium-strategie:** De gratis tabs (Samenvatting + Bedrijf) geven genoeg context om interesse te wekken — oordeel, kernthese, fair value, segmenten. De diepte (financiële analyse, DCF, moat, management) is de reden om te betalen. De scorekaart toont de totaalscore gratis maar lockt individuele framework-scores.

**Categorie-abonnementen** zijn het onderscheidende element:

| Categorie | Voorbeelden |
|-----------|-------------|
| Nederlandse markt | ADYEN, ASML, HEIJM |
| Europese small caps | ALTR, ARP, BETS-B, KPL, PZU, WAWI |
| Tech & groei | ASML, CRWD, ADYEN, MIPS |
| Scandinavië | ARP, BETS-B, HUSCO, PNDORA |
| Dividend & waarde | EQNR, TMUS, WIPRO |

Een analyse kan in meerdere categorieën vallen. Dit moedigt upgrade naar Premium aan.

**Losse analyse** is de laagste drempel: geen abonnement nodig, ideaal voor wie specifiek één bedrijf onderzoekt. Verwachting: 30-40% van eerste conversies.

**Realistische inkomsten bij 200 betalende klanten (jaar 2-3):**
- 60 losse analyses/mnd × €4,95 = €3.564/jaar
- 50 categorie-abonnees × €9,95/mnd = €5.970/jaar
- 50 premium-abonnees × €14,95/mnd = €8.970/jaar
- 40 premium-jaarlijks × €129 = €5.160/jaar
- **Totaal: ~€24.000/jaar**

Bij 400 klanten (jaar 3-4): **~€48.000/jaar**

### Aanvullende stromen

- **Cursus**: "Fundamentele analyse met AI" — €97-€197 eenmalig
- **B2B collectief**: beleggingsclubs (€49/mnd voor 5 users)
- **Affiliate**: broker-partnerships (MEXEM, IBKR) — €50-150 per nieuwe klant
- **API-toegang** (Fase 3): directe JSON-feed voor institutionele klanten

---

## 7. Juridische aandachtspunten

### Vergunningsplicht (Wft/MiFID II)

Gepersonaliseerd beleggingsadvies vereist een AFM-vergunning. Analyses als informatieve/educatieve content zijn **toegestaan zonder vergunning**, mits:
- Disclaimer duidelijk stelt dat het geen beleggingsadvies is
- Geen gepersonaliseerd advies ("jij moet dit kopen")
- Geen vermogensbeheer

**Standaard disclaimer (opnemen op elke pagina en analyse):**
> "De analyses op dit platform zijn uitsluitend bedoeld voor informatieve en educatieve doeleinden. Ze vormen geen beleggingsadvies in de zin van de Wet op het financieel toezicht (Wft). Beleggen brengt risico's met zich mee. U kunt uw inleg geheel of gedeeltelijk verliezen. Raadpleeg een erkend financieel adviseur voordat u beleggingsbeslissingen neemt."

### Aansprakelijkheid

Als een analyse een fout bevat die leidt tot beleggingsverlies, is aansprakelijkheid in principe beperkt door de disclaimer. Toch:
- Documenten bewaren (welke versie van de analyse stond live wanneer)
- Correcties van fouten snel publiceren en markeren als "bijgewerkt"
- Evt. beroepsaansprakelijkheidsverzekering overwegen bij schaal

### Fiscaal

- Inkomsten zijn belast (Box 1 bij structureel ondernemen)
- BTW bij > €20.000 omzet/jaar (of KOR-melding voor vrijstelling tot €20k)
- EU-klanten buiten NL: OSS-regeling voor BTW
- Bij groei: eenmanszaak of BV

### AVG/GDPR

Bij e-mailadressen en betalingsgegevens:
- Privacyverklaring verplicht
- Cookiebanner (bij analytics)
- Stripe en Resend leveren standaard verwerkersovereenkomsten

### Logo's en externe data

- Clearbit API: ToS staat gebruik toe voor identificatie, niet voor commercieel gebruik als brand identity — overweegen bij schaal: logo.dev (betaald) of favicon API
- Financiële data van externe bronnen (Macrotrends, Tikr): controleer ToS van elk platform — bij commercieel gebruik mogelijk betaald plan nodig

---

## 8. Rode vlaggen en beperkingen

### Rode vlag 1: Kwaliteitsborging bij schaal

Bij te hoog volume wordt de handmatige review oppervlakkig. De audit trail (`bronnen[]` array) helpt bij spot-checks, maar er is een limiet aan wat één persoon kan reviewen.

**Mitigatie**: Liever 3 kwalitatieve analyses per week dan 7 halfbakken.

### Rode vlag 2: AI-gegenereerde analyses als reputatierisico

Als het publiek ontdekt dat analyses primair AI-gegenereerd zijn, kan dit vertrouwen schaden. In de huidige markt is dit een genuanceerd punt.

**Mitigatie**: Volledige transparantie over het proces. "AI-geassisteerd, handmatig geverifieerd" is een sterkere propositie dan proberen dit te verbergen. De skill zelf is jouw intellectuele eigendom — het framework, de criteria, de vragen die gesteld worden. Dat is het product.

### Rode vlag 3: Trackrecord → opgelost via Thesis Tracker

Kloppen de oordelen achteraf? Dit is de grootste onbekende voor de 12 huidige analyses en een structureel reputatierisico als het niet proactief wordt aangepakt.

**Oplossing (geïmplementeerd in JSON-schema v3.0):** Elke analyse krijgt een `thesis_tracker` object:
```json
{
  "publicatiedatum": "2026-03-22",
  "oordeel_bij_publicatie": "KOOP",
  "koers_bij_publicatie": 22.90,
  "checkpoints": [
    { "datum": "2026-09-22", "koers": null, "rendement_pct": null, "benchmark_pct": null }
  ]
}
```

Werkwijze: `prices.py` vult checkpoints automatisch bij op 6m, 12m, 24m na publicatie. De publieke Thesis Tracker pagina toont het trackrecord eerlijk — inclusief missers. Eerlijkheid over missers wint structureel meer vertrouwen dan ze verbergen, en maakt de analyses geloofwaardiger voor betalers.

**Dit is een competitief voordeel**: geen enkel platform in het segment publiceert een eerlijk, geauditeerd trackrecord.

### Rode vlag 4: Afhankelijkheid van Claude

De hele pipeline staat of valt met Claude als AI-model. Als Anthropic de prijs verhoogt, de kwaliteit verandert, of de ToS aanpast, heeft dat directe impact.

**Mitigatie**: Het framework (het skill-document) is herbruikbaar met andere modellen. De JSON-structuur is modelonafhankelijk.

### Rode vlag 5: Engelstalige markt is veel competitiever

De stap naar Engels vergroot het publiek maar vergroot ook de concurrentie (Seeking Alpha, Substack-giganten). Differentiatie op Europese small caps blijft essentieel.

### Rode vlag 6: Technische schuld

Het huidige HTML-bestand schaalt niet. Maar: herbouwen kost tijd die anders in analyses gaat zitten. Volgorde is cruciaal: bereik eerst, bouwen daarna.

---

## 9. Conclusie en routekaart

### Samengevatte beoordeling

Dit heeft alle ingrediënten voor een succesvol niche-product:
- Onderscheidende content (Europese small caps, professioneel framework)
- Schaalbare pipeline (AI-skill + handmatige review)
- Herbruikbare technische kennis (Next.js, Vercel, Stripe, Resend)
- Realistisch marktgat (Nederlandstalig én Engelstalig)

De uitdaging is volgorde: bouwen kost tijd, maar zonder bereik heeft een betaald platform geen waarde. Begin met content en bereik. Bouw parallel.

### Aanbevolen routekaart

**Direct (week 1-2)**
- Eigen domein kopen en koppelen aan huidige site
- Google Analytics toevoegen
- Disclaimer toevoegen aan alle analysepagina's

**Fase 1: Platform bouwen (maand 1-2)**
- Next.js-platform bouwen met professioneel design
- NL + EN meteen ingebouwd (next-intl)
- Alle 12 bestaande analyses migreren
- Statisch, geen login — gewoon de beste gratis analysesite van Europa

**Fase 1b: Bereik (maand 1-6, parallel)**
- Substack starten (elke analyse als nieuwsbriefpost)
- LinkedIn actief (dagelijkse posts over analyses in het kort)
- Doel: 300 nieuwsbriefabonnees voor Phase 2

**Fase 2: Freemium (maand 4-8)**
- Auth.js + Stripe toevoegen
- Betaalwall voor volledige analyses
- Admin-interface voor analyse-upload
- Doel: 50 betalende abonnees

**Fase 3: Schaal (maand 8-24)**
- 100+ analyses
- DCF-calculator en vergelijkingsfunctie
- Engelstalige markt actief benaderen
- Cursusproduct

### Eerlijkheid

De techniek is het minste probleem — die kennis is al aanwezig. De grootste onzekerheid blijft: is er voldoende vraag? Dat weet je pas na 6-12 maanden actief publiceren. Begin gratis, meet, en schaal pas als de markt het vraagt.

---

*Dit document is een intern strategisch advies. Het bevat geen beleggingsadvies.*
