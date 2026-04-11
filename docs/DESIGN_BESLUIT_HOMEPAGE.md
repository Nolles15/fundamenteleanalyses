# Design Besluit Homepage — Aandelenanalyse.nl

**Datum:** 11 april 2026
**Status:** Goedgekeurd — basis voor implementatie
**Mockup bron:** `stitch (6).zip` — concept "final_refined" (desktop + mobiel)

---

## Gekozen ontwerp

Gebaseerd op **Concept 2 (action-oriented)** met minimale toevoegingen. De strakke, editoriale stijl is leidend.

## Design system

Vastgelegd in: `stitch (6).zip → amsterdam_editorial/DESIGN.md`

- **Kleuren:** primary #051125 (dark navy), surface #f8f9fa, cards #ffffff
- **Typografie:** Newsreader/Lora voor headlines, Inter voor data/UI
- **No-line rule:** tonal background shifts i.p.v. borders
- **Oordeel-badges:** KOOP (#aeeecb), HOLD (#ffdcc3), PASS (#ffdad6)
- **CTA-knoppen:** gradient #051125 → #1b263b op 135°
- **Geen:** fintech-neon, bubbly corners, stockfoto's van mensen

## Secties (volgorde)

1. **Header** — Logo + nav (Analyses, Methode, Over, Prijzen) + CTA "Toegang"
2. **Hero** — Headline links, featured analyse (ASML) rechts, zoekbalk + newsletter signup
3. **Social proof bar** — 40+ analyses · 9 frameworks · RA-geverifieerd · Europese focus
4. **Nieuwste Analyses** — 3-4 compacte kaarten met filters (Alle/AEX/Small Caps/Europees)
5. **Categorielinks** — Horizontale rij tekstlinks: Nederlandse markt → / Europese small caps → / Tech & groei → / Scandinavië →
6. **Portfolio Updates + Academy & Inzichten** — Twee compacte blokken naast elkaar
7. **Rapport van de Week** — Editoriale kaart met foto (gebouw/stad, geen personen) + serif headline
8. **FAQ** — Minimale accordion, 4 vragen
9. **Newsletter CTA** — Donker blok, "Nieuwe analyse? Jij weet het eerst."
10. **Footer** — Logo, categorielinks (SEO), nav, disclaimer, RA-geverifieerd badge

## Aandachtspunten bij implementatie

- **"Gecertificeerd Expert" badge** in footer → wijzigen naar "RA-geverifieerd proces"
- **Nav-items** "Portefeuille" en "Academie" → verbergen tot die features gebouwd zijn
- **Rapport van de Week** → op desktop iets meer ruimte geven
- **Mobiel:** Bottom nav (Home, Analyses, Zoeken, Meer), stacked layout, touch-friendly (min 44px targets)
- **Portfolio Updates / Academy:** conditioneel tonen — pas als er content voor is

## Gerelateerde documenten

| Document | Pad | Meenemen bij |
|----------|-----|-------------|
| SEO-richtlijnen | `docs/SEO_RICHTLIJNEN.md` | Title tags, meta descriptions, structured data, sitemap, FAQ schema, OG tags, zoekwoordstrategie |
| Product marketing context | `.agents/product-marketing-context.md` | Copy, tone of voice, woordkeuze, positionering, disclaimer-formulering |
| Launch strategie | `docs/LAUNCH_STRATEGIE.md` | Wanneer en hoe lanceren, kanalen, kritieke massa analyses |
| Business plan | `docs/BUSINESS_PLAN.md` | Pricing tiers, juridisch (Wft/KOOP-HOLD-PASS), RA-rol, concurrentieanalyse |
| Design system | Mockup zip `stitch (6).zip` → `DESIGN.md` | Kleuren, typografie, componenten, do's & don'ts |

---

*Bij het bouwen van de homepage: lees SEO_RICHTLIJNEN.md en product-marketing-context.md mee. De SEO-richtlijnen bevatten concrete implementatie-instructies voor structured data, sitemap, robots.txt, OG tags en zoekwoordstrategie per pagina.*
