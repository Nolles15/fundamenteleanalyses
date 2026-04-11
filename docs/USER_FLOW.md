# User Flow & Customer Journey — Aandelenanalyse.nl

**Datum:** 11 april 2026
**Status:** Concept — input voor bouw
**Doel:** Hoe beweegt een gebruiker door het platform, van ontdekking tot betaling?

---

## Sitemap

```
aandelenanalyse.nl/
├── /                           Homepage (publiek)
├── /analyse/[ticker]           Individuele analyse (deels publiek, deels premium)
├── /markt/[categorie]          Categoriepagina (publiek)
│   ├── /markt/aex
│   ├── /markt/europese-small-caps
│   ├── /markt/tech-en-groei
│   └── /markt/scandinavie
├── /zoeken                     Zoekresultaten (publiek)
├── /methode                    Methode-uitleg (publiek)
├── /over                       Over ons (publiek)
├── /prijzen                    Pricing (publiek)
├── /disclaimer                 Wft-disclaimer (publiek)
├── /privacy                    Privacyverklaring (publiek)
├── /voorwaarden                Algemene voorwaarden (publiek)
│
│  ── Fase 2: ingelogd ──
├── /dashboard                  Persoonlijk dashboard
├── /watchlist                  Opgeslagen analyses
├── /account                    Account & abonnement
└── /account/billing            Facturatie
```

---

## Customer Journey — Fase 1 (gratis, geen accounts)

### Flow 1: Organische bezoeker (SEO)

```
Google "ASML analyse"
  → /analyse/asml (direct op analyse-pagina)
    → Leest samenvatting + scorekaart (gratis)
    → Wil meer → scrolt door andere tabs
    → Ziet nieuwsbrief-CTA → meldt zich aan
    → Of: klikt naar homepage → ontdekt meer analyses
```

**Belangrijk:** Veel bezoekers landen NIET op de homepage maar op een analyse-pagina via Google. Elke analyse-pagina moet zelfstandig werken als landingspagina:
- Eigen hero/header met bedrijfsnaam + oordeel
- Navigatie terug naar homepage en andere analyses
- Nieuwsbrief-signup op de pagina zelf
- "Vergelijkbare analyses" onderaan

### Flow 2: Social media / nieuwsbrief bezoeker

```
Klikt op link in LinkedIn/X/nieuwsbrief
  → /analyse/[ticker] (specifieke analyse)
    → Leest analyse
    → Klikt "Meer analyses" → homepage of categoriepagina
    → Ontdekt het platform
```

### Flow 3: Directe bezoeker (homepage)

```
Typt aandelenanalyse.nl
  → / (homepage)
    → Zoekt op ticker in zoekbalk → /analyse/[ticker]
    → OF browst door "Nieuwste Analyses" kaarten → /analyse/[ticker]
    → OF klikt op categorie → /markt/aex
      → Ziet alle AEX-analyses gefilterd
      → Klikt op specifieke analyse → /analyse/[ticker]
```

---

## Pagina-voor-pagina flow

### Homepage → Analyse
De homepage is een **discovery engine**. De gebruiker heeft drie paden:

1. **Zoeken** (weet wat ze zoeken) → zoekbalk → analyse-pagina
2. **Browsen** (ontdekken) → kaarten-grid → analyse-pagina
3. **Filteren** (markt verkennen) → categorielink → categoriepagina → analyse

### Categoriepagina (`/markt/[categorie]`)

**Dit is de ontbrekende tussenpagina.** Niet een losse filterfunctie op de homepage, maar eigen pagina's per markt. Waarom:

- **SEO:** `/markt/aex` rankt op "AEX analyse", "AEX aandelen"
- **Diepte:** ruimte voor een intro over de markt, vergelijkingstabel, sector-inzichten
- **Navigatie:** logische tussenstap tussen homepage en individuele analyse

**Inhoud per categoriepagina:**
- H1: "AEX Aandelen — Fundamentele Analyses"
- Korte intro (2-3 zinnen over de markt/index)
- Volledige lijst van analyses in die categorie (kaarten of tabelweergave)
- Sorteer op: score, upside, oordeel, datum
- Vergelijkingstabel: alle tickers met key metrics naast elkaar
- Link naar gerelateerde categorieën

### Analyse-pagina (`/analyse/[ticker]`)

Dit heb je al gebouwd met 10 tabs. De flow-vraag: **hoe navigeert de gebruiker NA het lezen?**

**Onderaan elke analyse:**
- "Vergelijkbare analyses" — 3 kaarten van bedrijven in dezelfde sector/categorie
- "Meer in [categorie]" — link naar categoriepagina
- Nieuwsbrief-signup
- Breadcrumbs bovenaan: Home → AEX → ASML

**Zijbalk of sticky element (desktop):**
- Inhoudsopgave van de tabs (al aanwezig via AnalyseLayout)
- "Volgende analyse" / "Vorige analyse" navigatie binnen een categorie

---

## Customer Journey — Fase 2 (freemium, accounts)

### De paywall-flow

```
Bezoeker leest gratis tabs (Samenvatting + Bedrijf)
  → Klikt op premium tab (Financieel, Moat, DCF, etc.)
    → Ziet paywall-overlay:
      "Ontgrendel de volledige analyse"
      - Optie 1: Losse analyse €4,95
      - Optie 2: Abonnement vanaf €9,95/mnd
      [Maak account aan] [Ik heb al een account → inloggen]
        → /prijzen (of inline modal)
          → Account aanmaken (e-mail + wachtwoord, of Google)
            → Checkbox: akkoord voorwaarden + disclaimer
            → Betaling via Stripe
              → Redirect terug naar analyse → alle tabs ontgrendeld
```

**Cruciale UX-beslissing:** De paywall moet de gebruiker niet frustreren maar verleiden:
- Toon een **preview** van de premium content (eerste alinea blur, scorekaart deels zichtbaar)
- Laat de **tab-navigatie** zichtbaar — gebruiker ziet WAT er achter zit
- Toon de **fair value en upside** gratis (dat is de hook)
- Verberg de **onderbouwing** (DCF-details, moat-analyse, frameworks)

### Ingelogde homepage vs. publieke homepage

**Niet twee aparte homepage's bouwen.** In plaats daarvan:

```
Publieke homepage (niet ingelogd):
  [Hero + zoek + signup] → [Analyses] → [Categorieën] → [FAQ] → [Newsletter CTA]

Ingelogde homepage (zelfde pagina, subtiel anders):
  [Hero zonder signup, met "Welkom terug"] → [Analyses met unlock-status] → [Watchlist preview] → [Categorieën]
```

Verschil ingelogd:
- Hero: geen nieuwsbrief-signup, wel "Welkom terug, [naam]" + zoekbalk
- Analysekaarten: badge "Ontgrendeld" of "Premium" per analyse
- Extra sectie: "Jouw watchlist" (als ze analyses hebben opgeslagen)
- Nav: "Dashboard" link zichtbaar

### Dashboard (`/dashboard`)

Persoonlijke pagina voor ingelogde gebruikers. Geen complex dashboard — houd het simpel:

- **Jouw analyses** — lijst van ontgrendelde/gekochte analyses
- **Watchlist** — opgeslagen analyses die je wilt volgen
- **Recente updates** — als een analyse die je hebt gelezen is bijgewerkt
- **Abonnement** — huidige plan, facturen, opzeggen

### Account-flow

```
/account
  ├── Profiel (naam, e-mail)
  ├── Abonnement (huidig plan, upgrade/downgrade)
  ├── Facturatie (Stripe customer portal)
  └── Uitloggen
```

---

## Navigatie-structuur

### Publiek (fase 1)

```
Header: [Logo] [Analyses] [Methode] [Over] [Prijzen] [Toegang →]
```

### Ingelogd (fase 2)

```
Header: [Logo] [Analyses] [Methode] [Dashboard] [Account ▾]
                                                  ├── Mijn analyses
                                                  ├── Watchlist
                                                  ├── Abonnement
                                                  └── Uitloggen
```

### Mobiel (bottom nav)

**Fase 1:**
```
[Home] [Analyses] [Zoeken] [Meer]
                             ├── Methode
                             ├── Over
                             ├── Prijzen
                             └── Disclaimer
```

**Fase 2 (ingelogd):**
```
[Home] [Analyses] [Zoeken] [Account]
                             ├── Dashboard
                             ├── Watchlist
                             ├── Abonnement
                             └── Uitloggen
```

---

## Breadcrumbs

Op alle pagina's behalve de homepage:

| Pagina | Breadcrumb |
|--------|-----------|
| Analyse | Home → [Categorie] → [Bedrijfsnaam] |
| Categoriepagina | Home → [Categorienaam] |
| Methode | Home → Methode |
| Prijzen | Home → Prijzen |
| Dashboard | Home → Dashboard |

Breadcrumbs zijn ook SEO-waardevol (BreadcrumbList structured data — zie SEO_RICHTLIJNEN.md).

---

## Conversie-touchpoints

Elk moment waarop we de gebruiker richting een actie sturen:

### Fase 1: Nieuwsbrief

| Locatie | Type | Moment |
|---------|------|--------|
| Hero (homepage) | Inline formulier | Direct bij bezoek |
| Analyse-pagina (onderaan) | Inline formulier | Na het lezen |
| Categoriepagina (onderaan) | Inline formulier | Na het browsen |
| Footer (elke pagina) | Newsletter CTA blok | Altijd zichtbaar |
| Na zoeken zonder resultaat | "Meld je aan voor updates" | Bij lege zoekresultaten |

### Fase 2: Betaling

| Locatie | Type | Moment |
|---------|------|--------|
| Premium tab-klik | Paywall overlay | Bij interesse in diepte |
| Pricing-pagina | Prijstabel | Bij vergelijken |
| Analyse-header | "Ontgrendel" badge | Bij eerste bezoek |
| Categoriepagina | "X van Y analyses gratis" | Bij browsen |
| E-mail (nieuwsbrief) | "Upgrade voor volledige analyse" | Na engagement |

---

## Samenvatting: wat moet er gebouwd worden

### Launch (freemium vanaf dag 1)

| Pagina/Feature | Status | Prioriteit |
|----------------|--------|-----------|
| Homepage (landing page) | Mockup klaar, bouwen | Hoog |
| `/analyse/[ticker]` | Gebouwd | Klaar |
| Auth (login/register) | Gebouwd | Klaar |
| Paywall component | Gebouwd | Klaar |
| Stripe-integratie (checkout + webhook) | Nieuw | Hoog |
| `/prijzen` | Nieuw | Hoog |
| `/methode` | Nieuw — content schrijven | Hoog |
| `/disclaimer` | Nieuw — tekst klaar | Hoog |
| `/privacy` | Nieuw — tekst klaar | Hoog |
| `/over` | Nieuw — content schrijven | Medium |
| `/markt/[categorie]` | Nieuw — tussenpagina | Hoog |
| SEO (sitemap, robots, structured data) | Nieuw | Hoog |
| Nieuwsbrief-signup | Nieuw | Hoog |
| Breadcrumbs component | Nieuw | Medium |
| "Vergelijkbare analyses" op analyse-pagina | Nieuw | Medium |
| `/zoeken` | Nieuw — zoekresultaten | Medium |

### Na launch (optimalisatie)

| Pagina/Feature | Status | Prioriteit |
|----------------|--------|-----------|
| `/dashboard` | Nieuw | Medium |
| `/watchlist` | Nieuw | Medium |
| `/account` uitbreiden (facturen, gegevens) | Uitbreiden | Medium |
| Mobiele bottom nav | Nieuw | Medium |
| Categorie-abonnementen | Nieuw (bij 50+ analyses) | Laag |

---

*Dit document beschrijft de informatiearchitectuur en gebruikersflow. Visueel ontwerp volgt het DESIGN_BESLUIT_HOMEPAGE.md en het amsterdam_editorial design system.*
