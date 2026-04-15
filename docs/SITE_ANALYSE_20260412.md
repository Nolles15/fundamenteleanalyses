# Site Analyse — fundamenteleanalyses.vercel.app

**Datum:** 12 april 2026
**URL:** https://fundamenteleanalyses.vercel.app/
**Status:** Pre-launch review
**Pagina's geanalyseerd:** Homepage, /analyse/asml, /analyses, /methode, /over, /prijzen, /disclaimer, /privacy

---

## Algehele beoordeling

Het platform maakt een **sterke eerste indruk**. De analyse-diepte (ASML als voorbeeld) is indrukwekkend — dit is institutionele kwaliteit. Design, copy en juridische pagina's zijn professioneel. Hieronder de bevindingen per categorie.

---

## 1. SEO — Technisch & On-Page

### Wat goed is
- Title tag homepage: "Fundamentele aandelenanalyses — RA-geverifieerd | Aandelenanalyse.nl" — sterk, keyword vooraan
- Meta description homepage: duidelijk, bevat keywords + CTA "gratis toegankelijk"
- Analyse-pagina title: "[Bedrijfsnaam] ([TICKER]) — Fundamentele Analyse" — goed
- H1 homepage: "Direct toegang tot diepgaande Europese aandelenanalyses." — bevat keywords
- `lang="nl"` aanwezig
- Breadcrumbs op analyse-pagina (Home > Analyses > ASML)
- Methode-pagina heeft goede meta description

### Wat ontbreekt of beter kan

| Issue | Impact | Actie |
|-------|--------|-------|
| **Geen sitemap.xml** (niet getest, maar waarschijnlijk ontbrekend) | HOOG | Maak `src/app/sitemap.ts` — essentieel voor Google indexering |
| **Geen robots.txt** (niet getest) | HOOG | Maak `src/app/robots.ts` — voorkom indexering van /api/ |
| **Geen structured data** (JSON-LD) | HOOG | Article schema op analyse-pagina's, BreadcrumbList, Organization op homepage, FAQPage |
| **Geen Open Graph tags** zichtbaar | HOOG | og:title, og:description, og:image per pagina — cruciaal voor social sharing bij launch |
| **Social proof bar zegt "2+ analyses"** | MEDIUM | Updaten zodra er meer analyses zijn — "2+" ondermijnt geloofwaardigheid |
| **Categoriepagina's (/markt/aex etc.) nog niet live** | MEDIUM | Linken bestaan op homepage maar pagina's ontbreken waarschijnlijk → 404-risico |
| **Canonical URL's** | MEDIUM | Controleer of Next.js canonical tags genereert (belangrijk bij Vercel preview URL's vs. definitief domein) |
| **Geen hreflang tags** | LAAG | Pas relevant bij EN-launch |

### Zoekwoord-dekking
- Homepage dekt: "fundamentele aandelenanalyses", "Europese aandelen", "RA-geverifieerd" — goed
- Analyse-pagina ASML dekt: "ASML analyse", "ASML fair value", "ASML fundamentele analyse" — goed
- Methode-pagina dekt: "hoe analyseren", "DCF waardering", "moat analyse" — goed
- **Ontbreekt:** pagina-specifieke content voor "AEX analyse", "Europese small caps" (categoriepagina's nodig)

---

## 2. Gebruiksvriendelijkheid (UX)

### Wat goed is
- Hero is duidelijk — headline, subtekst, twee CTA's, featured analyse rechts
- Analysekaarten zijn informatiedicht maar leesbaar (ticker, prijs, fair value, upside, score, oordeel-badge)
- Analyse-pagina tab-navigatie werkt logisch (10 secties + bronnen)
- FAQ is compact en beantwoordt de juiste vragen
- Disclaimer is duidelijk maar niet opdringerig
- Prijzenpagina is helder met drie tiers
- Breadcrumbs op analyse-pagina

### Aandachtspunten

| Issue | Impact | Actie |
|-------|--------|-------|
| **Maar 2 analyses zichtbaar** | HOOG | De site voelt leeg. Dit is de #1 prioriteit om op te lossen voor launch. Minimum 25 (AEX) voor geloofwaardigheid. |
| **Nieuwsbrief "Binnenkort beschikbaar"** | HOOG | De #1 conversieactie werkt niet. Dit moet functioneel zijn voor launch. Stel Resend/Buttondown in. |
| **Categorie-links leiden mogelijk naar 404** | HOOG | "Nederlandse markt →", "Europese small caps →" etc. staan op homepage maar pagina's bestaan waarschijnlijk niet. Check en maak aan of verberg tot ze klaar zijn. |
| **Zoekbalk op homepage** | MEDIUM | Staat er niet (was wel in mockup). Bij 2 analyses niet nodig, maar bij 25+ wel. Toevoegen voor launch. |
| **Geen "Vergelijkbare analyses" op analyse-pagina** | MEDIUM | Na het lezen van ASML is er geen pad naar de volgende analyse. Voeg 2-3 suggesties toe onderaan. |
| **Mobiele versie niet getest** | MEDIUM | Check of hero, kaarten, FAQ en tabs goed werken op mobiel. Bottom nav uit mockup ontbreekt waarschijnlijk. |
| **Nav-item "Toegang"** | LAAG | Gaat naar /prijzen? Of naar login? Onduidelijk. Bij klik moet helder zijn wat er gebeurt. |
| **Methode-pagina is compact** | LAAG | Functioneel maar zou meer diepte kunnen hebben (uitleg per framework). Goed genoeg voor launch. |

---

## 3. Conversie

### Wat goed is
- Hero heeft twee CTA's: "Bekijk alle analyses" (primair) + "Onze methode" (secundair)
- Featured "Rapport van de week" (ASML) met directe link naar analyse
- Pricing is helder: gratis → €4,95 los → €9,95/mnd premium
- FAQ beantwoordt "Wat kost het?" met concrete prijzen
- Newsletter CTA onderaan met sterk kopje: "Nieuwe analyse? Jij weet het eerst."

### Aandachtspunten

| Issue | Impact | Actie |
|-------|--------|-------|
| **Nieuwsbrief werkt niet** | KRITIEK | "Binnenkort beschikbaar" — dit is je primaire conversieactie. Moet werken voor launch. |
| **Geen nieuwsbrief-signup in hero** | HOOG | Was in mockup 2 wél aanwezig. Voeg toe — bezoekers die de hero zien en niet scrollen missen de CTA. |
| **Geen CTA op analyse-pagina** | HOOG | Na het lezen van een gratis samenvatting is er geen push naar nieuwsbrief of premium. Voeg toe bij/na de samenvatting-tab. |
| **Prijzenpagina: "Start Premium" knop** | MEDIUM | Waar leidt die naartoe? Als Stripe nog niet is geïntegreerd, moet er een duidelijke fallback zijn (bijv. "Binnenkort beschikbaar — meld je aan voor de nieuwsbrief"). |
| **Geen social proof** | MEDIUM | Geen testimonials, geen subscriber count, geen "X analyses gepubliceerd" (behalve "2+" in de stats bar). Begrijpelijk pre-launch, maar plan dit in. |

---

## 4. Content & Copy

### Wat goed is
- Homepage copy is professioneel en bondig
- Disclaimer is juridisch correct: Wft-formulering klopt, RA-rol goed afgebakend, KOOP/HOLD/PASS uitleg helder
- Privacy policy dekt AVG-vereisten: verwerkingsverantwoordelijke, rechten, verwerkers, bewaartermijnen
- "Over" pagina vertelt het verhaal: waarom, hoe, focus, transparantie
- ASML-analyse is uitzonderlijk diep — DCF, scenario's, moat, management, 5 frameworks, risico's
- Bronvermelding aanwezig op analyse-pagina (tab "Bronnen")

### Aandachtspunten

| Issue | Impact | Actie |
|-------|--------|-------|
| **Analyse-tekst deels Engels** | MEDIUM | ASML kernthese is in het Engels: "ASML is the absolute global leader..." — inconsistent met NL-site. Vertalen of bewust kiezen voor EN-analyses op NL-platform. |
| **Privacy: slechts 2 verwerkers** | LAAG | Vercel + Stripe — als je Resend/Buttondown toevoegt voor e-mail, moet die erbij. Updaten bij implementatie. |
| **Over-pagina: geen persoonlijk verhaal** | LAAG | "Wie zit erachter?" is niet beantwoord. Je businessplan noemde dit als vertrouwenssignaal. Overweeg naam/achtergrond toe te voegen. |
| **Methode-pagina: geen interactief voorbeeld** | LAAG | Een screenshot of voorbeeld van een scorekaart zou het concreter maken. Nice-to-have, niet essentieel. |

---

## 5. Juridisch & Compliance

### Wat goed is
- Wft-disclaimer is correct: "niet geregistreerd bij AFM", "geen beleggingsadvies", "informatie en educatief"
- KOOP/HOLD/PASS uitleg klopt: "gebaseerd op vaste analyseframeworks"
- RA-afbakening correct: verifieert cijfers, niet het oordeel
- Risicowaarschuwing aanwezig
- Aansprakelijkheidsbeperking aanwezig
- Privacy policy met bewaartermijnen, rechten, verwerkers
- Footer-disclaimer op elke pagina
- Analyse-pagina heeft inline disclaimer

### Aandachtspunten

| Issue | Impact | Actie |
|-------|--------|-------|
| **Geen Algemene Voorwaarden pagina** | MEDIUM | Nog niet nodig bij gratis, maar vóór eerste betaling moet `/voorwaarden` live zijn met herroepingsrecht, intellectueel eigendom, aansprakelijkheid. |
| **Privacy: contactgegevens incompleet** | MEDIUM | Alleen e-mail (privacy@aandelenanalyse.nl). Wettelijk verplicht voor commerciële sites: naam, adres, KvK-nummer. Toevoegen op /over of /privacy. |
| **Nieuwsbrief opt-in tekst ontbreekt** | MEDIUM | Zodra de nieuwsbrief werkt: "Door je aan te melden ga je akkoord met onze privacyverklaring" met link. |
| **Cookie-situatie onduidelijk** | LAAG | Privacy zegt "geen tracking cookies" — goed. Maar als je GA4 toevoegt (i.p.v. Plausible/Umami), heb je een cookiebanner nodig. Kies bewust. |

---

## 6. Performance & Technisch

### Wat goed is (aannames o.b.v. stack)
- Next.js 16 + Vercel = snelle hosting, edge caching
- Statische generatie voor analyse-pagina's (generateStaticParams) = snel
- Tailwind CSS = klein CSS-bestand
- Geen zware JavaScript-frameworks buiten React

### Te checken
| Issue | Impact | Actie |
|-------|--------|-------|
| **Lighthouse score** | HOOG | Run een Lighthouse audit (Performance, Accessibility, Best Practices, SEO). Dit geeft concrete scores. |
| **Afbeeldingen** | MEDIUM | Zijn er OG-images? Worden afbeeldingen geoptimaliseerd (next/image, WebP)? |
| **Core Web Vitals** | MEDIUM | LCP, FID, CLS — check via PageSpeed Insights zodra het definitieve domein live is. |
| **Mobiele responsive** | MEDIUM | Niet zelf getest — check op minimaal 375px, 768px, 1024px. |

---

## 7. Vergelijking met docs

Hoe verhoudt de live site zich tot de plannen in `docs/`?

| Document | Geïmplementeerd? |
|----------|-----------------|
| DESIGN_BESLUIT_HOMEPAGE.md — Hero met featured analyse | ✅ Ja |
| DESIGN_BESLUIT_HOMEPAGE.md — Categorielinks | ✅ Ja (links staan er, pagina's nog niet) |
| DESIGN_BESLUIT_HOMEPAGE.md — FAQ | ✅ Ja |
| DESIGN_BESLUIT_HOMEPAGE.md — Newsletter CTA | ⚠️ Deels (staat er, werkt niet) |
| DESIGN_BESLUIT_HOMEPAGE.md — Rapport van de Week | ✅ Ja (ASML) |
| COPY_HOMEPAGE.md — Alle copy | ✅ Grotendeels overgenomen |
| SEO_RICHTLIJNEN.md — Title tags | ✅ Ja |
| SEO_RICHTLIJNEN.md — Structured data | ❌ Ontbreekt |
| SEO_RICHTLIJNEN.md — Sitemap + robots.txt | ❌ Waarschijnlijk ontbreekt |
| SEO_RICHTLIJNEN.md — Open Graph tags | ❌ Niet zichtbaar |
| SEO_RICHTLIJNEN.md — Zoekbalk op homepage | ❌ Ontbreekt |
| JURIDISCH_KADER.md — Disclaimer | ✅ Ja |
| JURIDISCH_KADER.md — Privacy | ✅ Ja |
| JURIDISCH_KADER.md — Voorwaarden | ❌ Nog niet nodig |
| JURIDISCH_KADER.md — KvK/contactgegevens | ❌ Ontbreekt |
| USER_FLOW.md — Categoriepagina's | ❌ Niet live |
| USER_FLOW.md — Vergelijkbare analyses | ❌ Niet op analyse-pagina |
| USER_FLOW.md — Breadcrumbs | ✅ Ja |
| ACCOUNT_FLOW.md — Auth/paywall | ⚠️ Gebouwd maar Stripe ontbreekt |

---

## Top 10 prioriteiten voor launch

| # | Actie | Impact | Moeite |
|---|-------|--------|--------|
| 1 | **Meer analyses publiceren** (minimaal AEX = 25) | Kritiek | Hoog (2 weken) |
| 2 | **Nieuwsbrief-signup werkend maken** (Resend/Buttondown) | Kritiek | Laag |
| 3 | **Sitemap.ts + robots.ts toevoegen** | Hoog | Laag |
| 4 | **Structured data (JSON-LD) toevoegen** (Article, BreadcrumbList, FAQPage, Organization) | Hoog | Medium |
| 5 | **Open Graph tags toevoegen** (per pagina + per analyse) | Hoog | Medium |
| 6 | **Categoriepagina's bouwen** (/markt/aex, /markt/europese-small-caps, etc.) of links verbergen | Hoog | Medium |
| 7 | **Social proof bar updaten** ("2+" → actueel aantal) | Medium | Laag |
| 8 | **Zoekbalk toevoegen op homepage** | Medium | Medium |
| 9 | **"Vergelijkbare analyses" toevoegen op analyse-pagina's** | Medium | Medium |
| 10 | **KvK-nummer en contactgegevens toevoegen** | Medium | Laag |

### Quick wins (< 1 uur elk)
- Sitemap + robots.txt
- Social proof bar updaten
- KvK-gegevens toevoegen
- Newsletter opt-in tekst toevoegen (zodra werkend)

### Vóór launch essentieel
- Nieuwsbrief werkend
- 25+ analyses
- Structured data
- OG tags
- Categoriepagina's (of links verwijderen)

---

*Deze analyse is gebaseerd op de live site per 12 april 2026. Herhaal de analyse na implementatie van de wijzigingen en na koppeling van het definitieve domein.*
