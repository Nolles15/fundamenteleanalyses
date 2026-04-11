# SEO Richtlijnen — Aandelenanalyse.nl

**Datum:** 11 april 2026
**Status:** Advies voor implementatie bij bouw
**Scope:** Homepage + analyse-pagina's + technische SEO basics

---

## 1. Title tags & meta descriptions

### Homepage
- **Title:** `Fundamentele aandelenanalyses — RA-geverifieerd | Aandelenanalyse.nl`
  - Target keyword ("fundamentele aandelenanalyses") vooraan
  - RA-geverifieerd als vertrouwenssignaal
  - Brandnaam achteraan
- **Description:** `Diepgaande fundamentele analyses van Europese aandelen. DCF-waardering, scorekaarten en investeringsoordelen. RA-geverifieerd proces. Gratis toegankelijk.`
  - Bevat kernzoekwoorden + CTA ("gratis toegankelijk")
  - Max 155 karakters

### Analyse-pagina's (`/analyse/[ticker]`)
- **Title:** `[Bedrijfsnaam] ([TICKER]) — Fundamentele Analyse | Aandelenanalyse`
  - Huidige implementatie is goed, behouden
- **Description:** `[OORDEEL]: [kernthese, max 100 chars]. Fair value [bedrag], upside [%]. RA-geverifieerd.`
  - Dynamisch gegenereerd uit JSON — al geïmplementeerd, toevoegen: "RA-geverifieerd"

---

## 2. Heading-structuur

### Homepage
- **H1:** `Fundamentele analyses van Europese aandelen`
  - Specifieker dan het huidige "Fundamentele aandelenanalyses" — voegt "Europese" toe als differentiator + zoekterm
- **Subtekst (p):** `RA-geverifieerd · 9 frameworks · DCF-waardering · Scorekaart per analyse` — behouden, sterk

### Analyse-pagina's
- **H1:** `[Bedrijfsnaam] ([TICKER])` — al goed
- **H2's:** per sectie (Samenvatting, Bedrijf, Financieel, etc.) — al goed

---

## 3. Structured Data (Schema.org)

De grootste SEO-win die nog ontbreekt. Implementeer als JSON-LD in `<head>`.

### Homepage — WebSite + Organization

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aandelenanalyse",
  "url": "https://aandelenanalyse.nl",
  "description": "Fundamentele analyses van Europese aandelen",
  "publisher": {
    "@type": "Organization",
    "name": "Aandelenanalyse",
    "url": "https://aandelenanalyse.nl"
  }
}
```

### Analyse-pagina's — Article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Bedrijfsnaam] — Fundamentele Analyse",
  "datePublished": "[publicatiedatum uit JSON]",
  "dateModified": "[laatste update]",
  "author": {
    "@type": "Organization",
    "name": "Aandelenanalyse"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Aandelenanalyse"
  },
  "description": "[kernthese]"
}
```

### Analyse-pagina's — BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aandelenanalyse.nl" },
    { "@type": "ListItem", "position": 2, "name": "Analyses", "item": "https://aandelenanalyse.nl" },
    { "@type": "ListItem", "position": 3, "name": "[Bedrijfsnaam]", "item": "https://aandelenanalyse.nl/analyse/[ticker]" }
  ]
}
```

### Homepage — FAQ (als FAQ-sectie wordt toegevoegd)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wat is een fundamentele analyse?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

---

## 4. Homepage content voor SEO

De huidige homepage is een grid met analysekaarten. Google rankt pagina's met substantiële content hoger. Voeg de volgende secties toe (onder of rond het grid):

### a) Intro-paragraaf (boven het grid)
2-3 zinnen die natuurlijk keywords bevatten. Voorbeeld:
> Onafhankelijke fundamentele analyses van Europese aandelen. Elke analyse bevat een DCF-waardering, moat-beoordeling en scorekaart over 9 investeringsframeworks — gecontroleerd via een RA-geverifieerd proces.

### b) "Hoe werkt het" sectie
Drie stappen, visueel met iconen:
1. **Analyse** — AI-geassisteerd onderzoek volgens 9 frameworks
2. **Controle** — Cijfers gecontroleerd via RA-geverifieerd controlesysteem
3. **Oordeel** — KOOP, HOLD of PASS met DCF-onderbouwing

### c) Categorieën-sectie
Toon categorieën als klikbare blokken (worden later eigen landingspagina's):
- Nederlandse markt (ADYEN, ASML, HEIJM)
- Europese small caps (ALTR, ARP, BETS-B, KPL, PZU, WAWI)
- Tech & groei (ASML, CRWD, ADYEN, MIPS)
- Scandinavië (ARP, BETS-B, HUSCO, PNDORA)

Elke categorie is een toekomstige SEO-landingspagina.

### d) FAQ-sectie (onderaan)
FAQ's ranken goed in Google en leveren FAQPage structured data op. Suggesties:
- "Wat is een fundamentele analyse?"
- "Hoe komt het investeringsoordeel tot stand?"
- "Is dit beleggingsadvies?"
- "Hoe worden de analyses gecontroleerd?"
- "Welke aandelen worden geanalyseerd?"

---

## 5. Technische SEO

### Sitemap
Next.js kan automatisch een sitemap genereren. Maak een `src/app/sitemap.ts` die alle analyse-pagina's opneemt met `lastModified` datums.

### Robots.txt
Maak een `src/app/robots.ts` met:
- Allow: /
- Sitemap: https://aandelenanalyse.nl/sitemap.xml
- Disallow: /api/

### Canonical URLs
Stel canonical URLs in via Next.js metadata. Voorkomt duplicate content issues.

### Open Graph tags
Voor social sharing (LinkedIn, Twitter). Per pagina:
- `og:title` — paginatitel
- `og:description` — meta description
- `og:image` — genereer een OG-afbeelding per analyse (Next.js `ImageResponse` of statisch)
- `og:type` — "article" voor analyse-pagina's, "website" voor homepage

### Internationalisering (later)
Als de EN-versie komt:
- `hreflang` tags (`nl` + `en`)
- Aparte URLs per taal (`/nl/analyse/adyen` vs `/en/analysis/adyen`)
- Of subdomain: `en.aandelenanalyse.nl`

---

## 6. URL-structuur

Huidige structuur `/analyse/[ticker]` is goed. Aandachtspunten:
- Tickers lowercase in URL (`/analyse/adyen`, niet `/analyse/ADYEN`)
- Canonical URL altijd lowercase
- Overweeg later: `/analyse/adyen-nv` (met bedrijfsnaam) voor betere SEO — maar pas wijzigen als je redirects goed regelt

---

## 7. Zoekwoord-strategie

### Primaire zoektermen (target op analyse-pagina's)

| Zoekterm | Zoekintentie | Pagina |
|----------|-------------|--------|
| fundamentele analyse [ticker] | Informatief | /analyse/[ticker] |
| [bedrijfsnaam] aandeel analyse | Informatief | /analyse/[ticker] |
| [bedrijfsnaam] koersdoel | Informatief | /analyse/[ticker] |
| [ticker] fair value | Informatief | /analyse/[ticker] |

### Secundaire zoektermen (target op homepage/categoriepagina's)

| Zoekterm | Zoekintentie | Pagina |
|----------|-------------|--------|
| aandelenanalyse | Informatief/navigatie | Homepage |
| fundamentele analyse aandelen | Informatief | Homepage |
| Europese small cap aandelen | Informatief | Categoriepagina |
| beste Europese aandelen | Informatief | Blog (later) |

### Long-tail (target op /methode of blog)

| Zoekterm | Pagina |
|----------|--------|
| DCF waardering uitleg | /methode |
| moat analyse aandelen | /methode |
| hoe analyseer je een aandeel | Blog (later) |
| wat is een scorekaart aandelen | /methode |

---

## 8. Prioriteitsvolgorde bij implementatie

1. **Title tags + meta descriptions** — direct meenemen, minimale moeite
2. **H1 aanpassen** — één regel wijzigen
3. **Sitemap + robots.txt** — twee kleine bestanden
4. **Structured data** (Article + BreadcrumbList) — grootste SEO-impact
5. **Open Graph tags** — voor social sharing bij launch
6. **Homepage content-secties** (intro, hoe werkt het, FAQ) — SEO + conversie
7. **Categoriepagina's** — pas relevant bij 30+ analyses

---

*Dit document is een richtlijn voor de bouwfase. Implementeer per punt bij het bouwen van de betreffende pagina's.*
