# Bouwplan: Aandelenanalyse Platform

**Versie:** 1.0 — 9 april 2026
**Doel:** Werkdocument voor de technische bouw. Elke sectie bevat genoeg detail om direct te implementeren met een goedkoper model.
**Tijdlijn:** ~1 week als richtlijn — geen concessies op kwaliteit
**Principe:** Kies het juiste pad, niet het snelste

---

## Inhoudsopgave

1. Projectstructuur & stack
2. Design systeem
3. Datamodel & content-architectuur
4. Data-kwaliteit: kloof en oplossing
5. Pagina's & routes
6. Componenten-architectuur
7. Freemium & betaalmodel
8. SEO & meta
9. Deploy & infrastructuur
10. Bouwvolgorde (dag-voor-dag)
11. Wat NIET in scope is

---

## 1. Projectstructuur & stack

### Initialisatie

```bash
npx create-next-app@latest aandelenanalyse-platform \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"
```

### Stack (alleen wat nodig is)

| Onderdeel | Keuze | Waarom |
|-----------|-------|--------|
| Framework | Next.js 15 App Router | SSG, bekende stack, Vercel deploy |
| Styling | Tailwind CSS v4 | Snelheid, consistentie |
| UI-componenten | Eigen componenten | Geen shadcn — te veel overhead voor een content-site |
| Typografie | Lora (serif, analyses) + Inter (sans, UI) | Premium gevoel voor financiële content |
| Grafieken | Recharts | Lichtgewicht, React-native, goede SSR |
| Markdown | next-mdx-remote | Rendert .md analyses server-side |
| Icons | Lucide React | Klein, tree-shakeable |
| Deploy | Vercel | Gratis tier voldoende, bekende workflow |

### Mapstructuur

```
src/
├── app/
│   ├── layout.tsx                 Root layout (fonts, metadata, analytics)
│   ├── page.tsx                   Homepage — alle analyses als kaarten
│   ├── analyse/
│   │   └── [ticker]/
│   │       └── page.tsx           Individuele analyse-pagina (SSG)
│   ├── methode/
│   │   └── page.tsx               Methodologie-uitleg
│   ├── over/
│   │   └── page.tsx               Over ons + RA-profiel
│   └── not-found.tsx
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── nav.tsx
│   ├── analyse/
│   │   ├── tab-navigation.tsx     Tab-systeem voor analyse-pagina
│   │   ├── tab-samenvatting.tsx   H0: Executive Summary (GRATIS)
│   │   ├── tab-bedrijf.tsx        H1: Bedrijfsprofiel (GRATIS)
│   │   ├── tab-financieel.tsx     H2: Financiële tabellen + grafieken
│   │   ├── tab-moat.tsx           H3: Moat-analyse
│   │   ├── tab-management.tsx     H4: Management
│   │   ├── tab-sector.tsx         H5: Sector & concurrentie
│   │   ├── tab-frameworks.tsx     H6: Analyseframeworks
│   │   ├── tab-waardering.tsx     H7: DCF + scenario's + gevoeligheid
│   │   ├── tab-risicos.tsx        H8: Risico's
│   │   ├── tab-scorekaart.tsx     H9: Scorekaart (GRATIS — score zichtbaar, detail locked)
│   │   └── paywall-overlay.tsx    Blur + CTA voor locked content
│   ├── cards/
│   │   ├── analyse-card.tsx       Kaart op homepage
│   │   └── score-badge.tsx        KOOP/HOLD/PASS badge
│   ├── charts/
│   │   ├── omzet-chart.tsx        Omzet + groei staafgrafiek
│   │   ├── fcf-chart.tsx          Free cash flow trend
│   │   ├── scenario-chart.tsx     Fair value scenario's horizontale balk
│   │   ├── gevoeligheid-matrix.tsx DCF gevoeligheidsmatrix heatmap
│   │   └── moat-radar.tsx         Moat spider/radar chart
│   └── ui/
│       ├── badge.tsx
│       ├── table.tsx              Herbruikbare financiële tabel
│       ├── progress-bar.tsx       Scorekaart progressie
│       └── blur-lock.tsx          Blur-overlay component
├── lib/
│   ├── data.ts                    JSON + MD laden, typing
│   ├── types.ts                   TypeScript interfaces voor JSON-schema
│   └── utils.ts                   Formatters (valuta, percentages, datums)
├── content/
│   └── data/                      ← symlink of kopie van /data/
│       ├── ADYEN.json
│       ├── ADYEN.md               (alleen aanwezig als .md bestaat)
│       ├── index.json
│       └── ...
└── styles/
    └── globals.css                Tailwind base + custom prose styling
```

### Belangrijke architectuurbeslissing: data/

De bestaande `data/` directory is de single source of truth. Twee opties:

**Optie A (aanbevolen):** Kopieer `data/` naar `src/content/data/` in de Next.js repo. Bij elke nieuwe analyse: `python deploy.py` kopieert naar beide locaties.

**Optie B:** Symlink. Werkt lokaal maar niet op Vercel.

→ Kies **Optie A**. Schrijf een simpel script (`sync-data.sh`) dat `data/` synct naar de Next.js repo.

---

## 2. Design systeem

### Kleurpalet

```css
/* globals.css — CSS custom properties */

:root {
  /* Achtergronden */
  --bg-primary:    #FAFAF9;      /* Warm off-white, minder klinisch dan puur wit */
  --bg-surface:    #FFFFFF;
  --bg-muted:      #F5F5F4;      /* Kaartachtergrond, hover states */

  /* Tekst */
  --text-primary:  #1C1917;      /* Warm zwart */
  --text-secondary:#57534E;      /* Bijschriften, metadata */
  --text-muted:    #A8A29E;      /* Placeholder, disabled */

  /* Merk / accent */
  --accent:        #1E3A5F;      /* Donker marineblauw — vertrouwen, financieel */
  --accent-light:  #E8EEF4;      /* Accent achtergrond */

  /* Oordelen */
  --buy:           #166534;
  --buy-bg:        #F0FDF4;
  --buy-border:    #BBF7D0;
  --hold:          #854D0E;
  --hold-bg:       #FFFBEB;
  --hold-border:   #FDE68A;
  --pass:          #991B1B;
  --pass-bg:       #FEF2F2;
  --pass-border:   #FECACA;

  /* Grafieken */
  --chart-1:       #1E3A5F;
  --chart-2:       #4A7AB5;
  --chart-3:       #166534;
  --chart-4:       #A8A29E;

  /* Borders & shadows */
  --border:        #E7E5E4;
  --ring:          #1E3A5F;
  --shadow-sm:     0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:     0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg:     0 8px 32px rgba(0,0,0,0.08);

  /* Radius */
  --radius-sm:     8px;
  --radius-md:     12px;
  --radius-lg:     16px;
}
```

### Typografie

```css
/* Fonts laden in layout.tsx via next/font */

/* UI, navigatie, tabellen, badges */
--font-sans: 'Inter', system-ui, sans-serif;

/* Analysetekst, lange passages, executive summary */
--font-serif: 'Lora', Georgia, serif;
```

Regels:
- **Serif (Lora):** Alle lange-form analysetekst. H0-H9 body copy, kernthese, samenvattingen.
- **Sans (Inter):** Navigatie, tabelkoppen, badges, buttons, metadata, footer.
- **Tabellen:** Sans-serif, monospace cijfers (`font-variant-numeric: tabular-nums`).

### Spacing & layout

- Max-width content: `max-w-4xl` (896px) — optimaal voor leesbaarheid lange tekst.
- Max-width pagina: `max-w-7xl` (1280px) — voor homepage grid.
- Verticaal ritme: `space-y-6` als basis, `space-y-12` tussen secties.
- Pagina padding: `px-4 sm:px-6 lg:px-8`.

### Componenten — visuele specificaties

**Analyse-kaart (homepage)**
```
┌──────────────────────────────────────┐
│  [Logo]  ADYEN         HOLD  ●●●○○  │
│          Adyen N.V.                  │
│          Fintech · AEX               │
│                                      │
│  Koers    Fair Value    Upside       │
│  €863     €952          +10,2%       │
│                                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  33/45       │
│                                      │
│  Peildatum: 22 mrt 2026             │
└──────────────────────────────────────┘
```

- Witte kaart, `shadow-sm`, `hover:shadow-md` transitie.
- Logo: 40x40px, afgerond. Fallback: eerste letter ticker op gekleurde achtergrond.
- KOOP/HOLD/PASS badge: gekleurde pill (groen/oranje/rood).
- Progressiebalk scorekaart: dunne balk, kleur volgt oordeel.
- Hele kaart is klikbaar → `/analyse/[ticker]`.

**Tab-navigatie (analyse-pagina)**
```
  Samenvatting | Bedrijf | Financieel | Moat | Management | Sector | ...
  ─────────────────────────────────────────────────────────────────────
```

- Horizontaal scrollbaar op mobiel.
- Actieve tab: `border-bottom: 2px solid var(--accent)`.
- Locked tabs tonen een klein slot-icoontje (🔒) naast de naam.
- Tabs zijn URL-hashes (`/analyse/adyen#financieel`) voor deeplinking.

**Paywall-overlay (locked tabs)**
```
┌──────────────────────────────────────┐
│  [Eerste 3 regels content zichtbaar] │
│                                      │
│  ░░░░░░░░░  GEBLURRED  ░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🔒 Ontgrendel deze analyse   │  │
│  │                                │  │
│  │  Koop deze analyse — €X,XX    │  │
│  │  of                           │  │
│  │  Neem een abonnement →        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- Achterliggende content is echt gerenderd maar CSS `blur(8px)` + gradient fade.
- CTA-blok is gecentreerd over de blur.
- Twee buttons: "Koop deze analyse" (primair) + "Bekijk abonnementen" (secundair).

---

## 3. Datamodel & content-architectuur

### TypeScript types (lib/types.ts)

Deze types mappen op het **nieuwste JSON-schema** (april 2026 skill-update). Alle velden die niet in elke analyse voorkomen zijn optioneel (`?`). Componenten handelen ontbrekende data graceful af. De types zijn backward compatible met oude exports.

**Gouden regel:** Als de analyse-skill verandert, pas je `lib/types.ts` aan en het bijbehorende tab-component. Maximaal 2 bestanden per wijziging.

**Nieuw vs. oud schema:** Het nieuwste schema bevat o.a. `sector_concurrentie` (Porter, concurrenten), `analyseframeworks` (Graham/Buffett/Lynch/Fisher/Greenblatt), `risicos` (array), `fair_value.wacc` (volledige WACC-opbouw), `reverse_dcf`, `epv`, `ddm`, `sotp`, `synthese`, twee gevoeligheidsmatrices, `financieel.dividend` en `databronnen`. De actuele types staan in `platform/src/lib/types.ts`.

```typescript
// ─── TOPLEVEL ─────────────────────────────────────────────

export interface Analyse {
  meta: Meta
  executive_summary: ExecutiveSummary
  bedrijfsprofiel: Bedrijfsprofiel
  financieel: Financieel
  moat: Moat
  management: Management
  katalysatoren?: Katalysator[]
  fair_value: FairValue
  scorekaart: Scorekaart
  bronnen?: Bronnen
  thesis_tracker?: ThesisTracker
}

// ─── META ─────────────────────────────────────────────────

export interface Meta {
  ticker: string
  exchange: string
  naam: string
  sector: string
  segment?: string
  koers: number
  valuta: string
  peildatum: string
  marktkapitalisatie?: string
  domein?: string
}

// ─── EXECUTIVE SUMMARY ───────────────────────────────────

export interface ExecutiveSummary {
  kernthese: string
  kernthese_en?: string
  oordeel: 'KOOP' | 'HOLD' | 'PASS'
  koers: number
  valuta: string
  fair_value_basis: number
  upside_pct: number
  fair_value_scenarios: Scenario[]
  grootste_kans: string
  grootste_kans_en?: string
  grootste_risico: string
  grootste_risico_en?: string
}

export interface Scenario {
  scenario: string
  fair_value: number
  upside_pct: number
  fcf_groei_pct?: number
  wacc_pct?: number
}

// ─── BEDRIJFSPROFIEL ─────────────────────────────────────

export interface Bedrijfsprofiel {
  beschrijving: string
  beschrijving_en?: string
  personeel?: number
  landen?: number
  segmenten: Segment[]
  aandeelhouders: Aandeelhouder[]
}

export interface Segment {
  naam: string
  omzet_pct: number
  beschrijving: string
}

export interface Aandeelhouder {
  naam: string
  pct: number
  type: string
}

// ─── FINANCIEEL ──────────────────────────────────────────

export interface Financieel {
  valuta_label: string
  resultatenrekening: JaarResultaat[]
  kasstromen: JaarKasstroom[]
  balans: JaarBalans[]
  rendementsindicatoren: Rendement | Rendement[]
  accruals?: Accrual[]
  waardering: Waardering
}

export interface JaarResultaat {
  jaar: number
  omzet: number
  omzet_groei_pct: number | null
  ebitda: number | null
  ebitda_marge_pct: number | null
  nettowinst: number
  nettomarge_pct: number
  eps: number
  // Uitgebreider (nieuwere analyses):
  brutomarge_pct?: number
  ebit?: number
  ebit_marge_pct?: number
}

export interface JaarKasstroom {
  jaar: number
  fcf: number
  fcf_per_aandeel: number
  fcf_na_sbc?: number | null
  sbc?: number | null
}

export interface JaarBalans {
  jaar: number
  nettoschuld: number
  eigen_vermogen: number
  debt_ebitda: number | null
  // Uitgebreider:
  totale_activa?: number
  goodwill?: number
  current_ratio?: number
}

export interface Rendement {
  jaar: number
  roce_pct: number | null
  roe_pct: number | null
  roic_pct: number | null
  roa_pct: number | null
  wacc_pct?: number
  roic_wacc_spread?: number
}

export interface Accrual {
  jaar: number
  accrual_ratio_pct?: number | null
  accruals_ratio?: number | null
  non_gaap_verschil_pct?: number | null
}

export interface Waardering {
  pe: number
  pe_forward?: number
  ev_ebitda: number
  p_fcf: number
  p_fcf_na_sbc?: number | null
  fcf_yield_pct: number | null
  p_b: number
  ev_omzet: number
  dividendrendement_pct: number
  peg?: number
}

// ─── MOAT ────────────────────────────────────────────────

export interface Moat {
  oordeel: string    // "WIDE MOAT", "NARROW MOAT", "NO MOAT"
  toelichting: string
  categorieen: MoatCategorie[]
}

export interface MoatCategorie {
  naam: string       // "Immateriële activa", "Overstapkosten", etc.
  oordeel: string    // "STERK", "AANWEZIG", "BEPERKT", "AFWEZIG"
  score: number      // 1-5
  toelichting: string
}

// ─── MANAGEMENT ──────────────────────────────────────────

export interface Management {
  oordeel: string
  personen: Persoon[]
  capital_allocation: string
  toelichting: string
  compensatie?: Compensatie
  insider_transactions?: InsiderTransaction[]
}

export interface Persoon {
  functie: string
  naam: string
  achtergrond: string
}

export interface Compensatie {
  sbc_pct_marktkapitalisatie?: number | null
  verwateringsgraad_pct_jaar?: number | null
  prikkels_aligned?: boolean
  toelichting?: string
}

export interface InsiderTransaction {
  datum: string
  naam: string
  functie: string
  type: string       // "KOOP", "VERKOOP"
  aandelen: number
  koers: number
}

// ─── KATALYSATOREN ───────────────────────────────────────

export interface Katalysator {
  datum_ca: string         // "2026-Q1", "2026", etc.
  omschrijving: string
  richting: 'POSITIEF' | 'NEGATIEF'
  impact: 'GROOT' | 'MIDDEL' | 'KLEIN'
}

// ─── FAIR VALUE ──────────────────────────────────────────

export interface FairValue {
  dcf: DCFInputs
  scenarios: Scenario[]
  gevoeligheid: Gevoeligheid
}

export interface DCFInputs {
  basis_fcf: number
  basis_fcf_na_sbc?: number | null
  wacc_pct: number
  groei_fase1_pct: number
  fase1_jaren?: number             // default 5
  terminal_groei_pct: number
  shares_outstanding_mln?: number
  nettoschuld_huidig?: number
}

export interface Gevoeligheid {
  wacc_range: number[]
  groei_range: number[]
  matrix: number[][]               // matrix[groei_idx][wacc_idx] = fair value
}

// ─── SCOREKAART ──────────────────────────────────────────

export interface Scorekaart {
  items: ScorekaartItem[]
  totaal: number
  max: number
  eindoordeel: string
  samenvatting: string
  samenvatting_en?: string
}

export interface ScorekaartItem {
  framework: string
  score: number
  max: number        // altijd 5
  oordeel: string
}

// ─── BRONNEN (AUDIT TRAIL) ───────────────────────────────

export interface Bronnen {
  jaarverslag_jaar?: number
  jaarverslag_url?: string
  ir_pagina?: string
  claims: BronClaim[]
}

export interface BronClaim {
  sectie: string
  claim: string
  bron: string
  pagina: number | null
}

// ─── THESIS TRACKER ──────────────────────────────────────

export interface ThesisTracker {
  publicatiedatum: string
  oordeel_bij_publicatie: string
  koers_bij_publicatie: number
  checkpoints: ThesisCheckpoint[]
}

export interface ThesisCheckpoint {
  datum: string | null
  label: string                    // "6m", "12m", "24m"
  koers: number | null
  rendement_pct: number | null
  benchmark?: string               // "AEX", "S&P 500"
  benchmark_rendement_pct?: number | null
  oordeel_nog_geldig?: boolean | null
}

// ─── INDEX ───────────────────────────────────────────────

export interface AnalyseIndex {
  ticker: string
  naam: string
  sector: string
  exchange: string
  koers: number
  valuta: string
  fair_value_basis: number
  upside_pct: number
  oordeel: 'KOOP' | 'HOLD' | 'PASS'
  scorekaart_totaal: number
  scorekaart_max: number
  peildatum: string
  domein?: string
  tags?: string[]                  // voor categorie-abonnementen
}
```

### Data-laadlogica (lib/data.ts)

```typescript
import fs from 'fs'
import path from 'path'
import type { Analyse, AnalyseIndex } from './types'

const DATA_DIR = path.join(process.cwd(), 'src', 'content', 'data')

export function getAllTickers(): string[] {
  const index = getIndex()
  return index.companies.map(c => c.ticker)
}

export function getIndex(): { laatste_update: string; companies: AnalyseIndex[] } {
  const raw = fs.readFileSync(path.join(DATA_DIR, 'index.json'), 'utf-8')
  return JSON.parse(raw)
}

export function getAnalyse(ticker: string): Analyse {
  const raw = fs.readFileSync(path.join(DATA_DIR, `${ticker}.json`), 'utf-8')
  return JSON.parse(raw)
}

export function getAnalyseMd(ticker: string): string | null {
  const mdPath = path.join(DATA_DIR, `${ticker}.md`)
  if (fs.existsSync(mdPath)) {
    return fs.readFileSync(mdPath, 'utf-8')
  }
  return null
}
```

### Content uit .md-bestanden

Niet alle hoofdstukken zitten in de JSON. De .md-bestanden bevatten H5 (Sector), H6 (Frameworks), H8 (Risico's) als narratieve tekst. Strategie:

1. Laad de `.md` server-side.
2. Parse per hoofdstuk (split op `# Hoofdstuk X` headers).
3. Render als prose HTML in de bijbehorende tab.
4. Als er geen `.md` is: toon "Analyse beschikbaar als samenvatting" met alleen JSON-data.

Dit betekent: analyses met alleen een `.json` (16 van de 24) tonen de gestructureerde data maar geen narratieve hoofdstukken H5/H6/H8. Analyses met `.json` + `.md` (ASML, CRWD, DIS, MIPS, PNDORA, TMUS) tonen alles.

---

## 4. Data-kwaliteit: kloof en oplossing

### Het probleem

De 24 analyses hebben twee generaties JSON-schema:

| Kenmerk | Oud schema (18 analyses) | Nieuw schema (6 analyses) |
|---------|-------------------------|--------------------------|
| Voorbeeld | ADYEN, ALTR, ARP, EQNR... | ASML, CRWD, DIS, MIPS, PNDORA, TMUS |
| `.md` bestand | NEE | JA |
| `bronnen` (audit trail) | NEE | JA |
| `katalysatoren` | NEE | JA |
| `thesis_tracker` | NEE | JA |
| `compensatie` detail | NEE | JA |
| `pe_forward`, `peg` | NEE | JA |
| `accruals` | NEE | JA |
| `fcf_na_sbc` | NEE | JA |
| `roic_wacc_spread` | NEE | JA |
| DCF detail (shares, nettoschuld) | NEE | JA |
| `rendementsindicatoren` | Object | Array |

### Impact op het platform

1. **Visueel:** Oude analyses tonen lege plekken waar data ontbreekt — geen grafieken voor ontbrekende accruals, geen radar voor incomplete moat, geen bronnenlijst.
2. **Geloofwaardigheid:** De audit trail (`bronnen`) ontbreekt bij 18 van 24 analyses. Zonder bronvermelding is de RA-verificatie niet aantoonbaar.
3. **Narratief:** Zonder `.md` bestanden zijn H5 (Sector), H6 (Frameworks) en H8 (Risico's) niet beschikbaar als leesbare tekst — alleen de gestructureerde JSON-data.

### Oplossing

**Stap 1 (bij platform-bouw):** Alle TypeScript types zijn optioneel waar nodig. Componenten tonen data als die er is, verbergen secties als die er niet is. Geen errors, geen "N/A" spam. Een analyse met minder data toont minder tabs — dat is eerlijker dan lege tabellen.

**Stap 2 (parallel, via pipeline):** Herexporteer de 18 oude analyses met het nieuwste export-schema. Dit is een Agent 3 (export) taak: je stuurt de bestaande `.md` door de export-agent met het nieuwe schema. Voor analyses zonder `.md`: re-run Agent 2 + 3 (volledige heranalyse). Prioriteer op basis van wat op de site het meest wordt bezocht.

**Stap 3 (lopend):** Elke nieuwe analyse gebruikt automatisch het nieuwste schema. De analyse-skill is de single source of truth voor welke velden er zijn.

### Hoe het platform omgaat met ontbrekende data

Per tab, de fallback-strategie:

| Tab | Als data ontbreekt | Gedrag |
|-----|-------------------|--------|
| Samenvatting | `kernthese_en` | Toon alleen NL |
| Bedrijf | `personeel`, `landen` | Verberg die rij |
| Financieel | `ebitda` is null | Toon omzet + nettowinst, skip EBITDA-kolom |
| Financieel | `accruals` afwezig | Verberg accruals-sectie |
| Moat | Altijd aanwezig | — |
| Management | `compensatie` afwezig | Verberg compensatie-sectie |
| Management | `insider_transactions` leeg | Toon "Geen transacties gevonden" |
| Sector | Geen `.md` H5 | Tab niet tonen |
| Frameworks | Geen `.md` H6 | Tab niet tonen (scores staan wel in scorekaart) |
| Waardering | DCF altijd aanwezig | — |
| Waardering | `shares_outstanding` afwezig | Verberg per-aandeel berekening |
| Risico's | Geen `.md` H8 | Toon katalysatoren als die er zijn, anders tab niet tonen |
| Risico's | `katalysatoren` afwezig | Tab niet tonen |
| Scorekaart | Altijd aanwezig | — |
| Bronnen | `bronnen` afwezig | Verberg "Bronnen" sectie op de pagina |

**Regel:** Een tab die geen zinvolle content kan tonen, wordt niet getoond in de navigatie. Liever 6 rijke tabs dan 10 halfvolle.

---

## 5. Pagina's & routes

### Route-overzicht

| Route | Type | Inhoud |
|-------|------|--------|
| `/` | SSG | Homepage — kaarten grid, filters, zoek |
| `/analyse/[ticker]` | SSG (generateStaticParams) | Individuele analyse, tab-interface |
| `/methode` | SSG | Uitleg scorekaart, DCF, frameworks |
| `/over` | SSG | Over de auteur, RA-profiel, disclaimer |
| `/prijzen` | SSG | Abonnementen en losse analyse-prijzen |

Alle pagina's zijn statisch gegenereerd. Geen server-side rendering nodig in Fase 1.

### Homepage (/)

**Layout:**
```
┌─ Header ──────────────────────────────────────┐
│  [Logo] Aandelenanalyse     Methode  Over      │
├───────────────────────────────────────────────┤
│                                                │
│  Onafhankelijke fundamentele aandelenanalyses  │
│  RA-geverifieerd · 9 frameworks · DCF-model    │
│                                                │
│  [Filter: Alle / KOOP / HOLD / PASS]           │
│  [Filter: Sector ▾]  [Sorteer: Upside ▾]      │
│                                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  ASML   │ │  ADYEN  │ │  CRWD   │          │
│  │  KOOP   │ │  HOLD   │ │  HOLD   │          │
│  │  +20%   │ │  +10%   │ │  +15%   │          │
│  └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │   ...   │ │   ...   │ │   ...   │          │
│  └─────────┘ └─────────┘ └─────────┘          │
│                                                │
│  24 analyses · Laatst bijgewerkt: 26 mrt 2026  │
│                                                │
├─ Footer ──────────────────────────────────────┤
│  Disclaimer · Privacy · © 2026                 │
└───────────────────────────────────────────────┘
```

- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` met `gap-6`.
- Filters zijn client-side (useState) — geen route changes.
- Sorteeropties: upside %, scorekaart, alfabetisch, peildatum.

### Analyse-pagina (/analyse/[ticker])

**Layout:**
```
┌─ Header ──────────────────────────────────────┐
├───────────────────────────────────────────────┤
│                                                │
│  [← Terug]                                     │
│                                                │
│  [Logo]  ASML Holding N.V.                     │
│          ASML · Euronext Amsterdam / NASDAQ     │
│                                                │
│  Koers €1.128    Fair Value €1.410   KOOP      │
│  Upside +25,0%   Peildatum 22 mrt 2026        │
│                                                │
│  ─── Tabs ─────────────────────────────────── │
│  Samenvatting | Bedrijf | Financieel🔒 |       │
│  Moat🔒 | Management🔒 | Sector🔒 |           │
│  Frameworks🔒 | Waardering🔒 | Risico's🔒 |   │
│  Scorekaart                                    │
│  ─────────────────────────────────────────── │
│                                                │
│  [Tab content]                                 │
│                                                │
├─ Footer ──────────────────────────────────────┤
└───────────────────────────────────────────────┘
```

### Tab-inhoud per hoofdstuk

| Tab | Bron | Gratis? | Inhoud |
|-----|------|---------|--------|
| Samenvatting | JSON `executive_summary` | JA | Kernthese, oordeel, fair value scenario's, kans/risico |
| Bedrijf | JSON `bedrijfsprofiel` + MD H1 | JA | Beschrijving, segmenten (taart), aandeelhouders |
| Financieel | JSON `financieel` + MD H2 | NEE | Omzet/winst tabel + grafiek, balans, kasstromen, ratio's |
| Moat | JSON `moat` + MD H3 | NEE | Spider chart, categorie-uitleg |
| Management | JSON `management` + MD H4 | NEE | Personen, compensatie, insider transactions |
| Sector | MD H5 | NEE | Narratief (alleen als .md bestaat) |
| Frameworks | MD H6 | NEE | Graham, Buffett, Lynch, Fisher, Greenblatt |
| Waardering | JSON `fair_value` + MD H7 | NEE | DCF inputs, scenario bars, gevoeligheidsmatrix heatmap |
| Risico's | MD H8 | NEE | Narratief + katalysatoren |
| Scorekaart | JSON `scorekaart` | DEELS | Totaalscore + balk zichtbaar, individuele scores locked |

**Waarom Samenvatting + Bedrijf gratis:** Dit geeft genoeg context om interesse te wekken. De bezoeker ziet het oordeel, de kernthese en het bedrijfsprofiel. De diepte (financieel, DCF, moat) is de reden om te betalen.

**Waarom Scorekaart deels gratis:** De totaalscore (33/45) en het eindoordeel zijn zichtbaar op de kaart en homepage. De individuele framework-scores (Graham 2/5, Buffett 4/5 etc.) zijn premium — dit is precies het soort detail waar beleggers voor betalen.

---

## 6. Componenten-architectuur

### Principes

1. **Elk tab-component is zelfstandig.** Het ontvangt de `Analyse`-data als prop en rendert alles zelf. Als de JSON-structuur verandert, pas je alleen het type en het tab-component aan.
2. **Geen abstracties tenzij 3x hergebruikt.** Een `<FinancialTable>` component is zinvol (wordt in meerdere tabs gebruikt). Een `<DataCard>` wrapper niet.
3. **Server Components als default.** Alleen de tab-navigatie en filters zijn Client Components (interactief).
4. **Graceful handling van optionele velden.** Elk veld dat `null`, `undefined` of afwezig kan zijn, wordt netjes afgehandeld (niet getoond, geen error).

### Component-specificaties

**`<AnalyseCard>`** — Homepage kaart
- Props: `AnalyseIndex`
- Rendert: logo, ticker, naam, sector, exchange, oordeel badge, koers, fair value, upside, scorekaart balk, peildatum
- Logo: `https://logo.clearbit.com/{domein}` met fallback naar initial-letter avatar
- Link: hele kaart → `/analyse/{ticker.toLowerCase()}`

**`<TabNavigation>`** — Client Component
- Props: `tabs: { id: string, label: string, locked: boolean }[]`
- State: `activeTab` (default: 'samenvatting')
- URL sync: `window.location.hash` ↔ activeTab
- Horizontaal scrollbaar op mobiel (`overflow-x-auto`, `-webkit-overflow-scrolling: touch`)
- Locked tabs tonen `<Lock size={14} />` icoon

**`<PaywallOverlay>`**
- Props: `analyseNaam: string`, `ticker: string`
- Rendert: gradient-to-transparent overlay, blur backdrop, CTA card
- CTA: twee buttons — "Koop deze analyse" + "Bekijk abonnementen"
- In Fase 1 linken beide buttons naar `/prijzen` (geen echte betaling)

**`<OordeelBadge>`**
- Props: `oordeel: 'KOOP' | 'HOLD' | 'PASS'`
- KOOP: groene pill, HOLD: oranje pill, PASS: rode pill

**`<FinancialTable>`**
- Props: `headers: string[]`, `rows: Record<string, string | number>[]`, `highlight?: string`
- Automatische formatting: getallen met punt-scheiding, percentages met %-teken
- Sticky eerste kolom op mobiel
- Tabular nums font feature

**`<ScoreBar>`**
- Props: `score: number`, `max: number`, `oordeel: string`
- Horizontale progressiebalk, kleur volgt oordeel
- Label: `{score}/{max}`

### Grafiek-specificaties

Alle grafieken gebruiken Recharts met het kleurpalet uit het design systeem.

**Omzet & groei (tab-financieel)**
- Type: ComposedChart — bars (omzet) + line (groei %)
- X-as: jaren
- Linker Y-as: omzet in miljoenen
- Rechter Y-as: groei in %

**FCF trend (tab-financieel)**
- Type: AreaChart met gradient fill
- X-as: jaren
- Y-as: FCF in miljoenen

**Fair Value scenario's (tab-waardering)**
- Type: Horizontale BarChart
- Drie bars: Pessimistisch, Basis, Optimistisch
- Verticale lijn op huidige koers
- Kleur: rood → oranje → groen

**Gevoeligheidsmatrix (tab-waardering)**
- Type: Custom heatmap (HTML table met achtergrondkleuren)
- Rijen: terminal groei percentages
- Kolommen: WACC percentages
- Celkleur: rood (onder koers) → wit (rond koers) → groen (boven koers)
- Cel met huidige aannames gemarkeerd met border

**Moat radar (tab-moat)**
- Type: RadarChart
- 5 assen: Immateriële activa, Overstapkosten, Netwerkeffecten, Kostenvoordeel, Efficiënte schaal
- Scores 0-5 per as

---

## 7. Freemium & betaalmodel

### Fase 1 (deze week): Visueel voorbereid, nog geen echte betaling

- Gratis tabs werken volledig.
- Locked tabs tonen echte content met blur + overlay.
- CTA buttons linken naar `/prijzen` pagina met "Binnenkort beschikbaar" + email-aanmelding.
- Geen Auth.js, geen Stripe, geen database.

### Fase 2 (later): Echte betaling

**Prijsmodel (herzien):**

| Optie | Prijs | Toegang |
|-------|-------|---------|
| Losse analyse | €4,95 | Alle tabs van één analyse, permanent |
| Abonnement Basis | €9,95/mnd | Alle analyses in één categorie |
| Abonnement Premium | €14,95/mnd | Alle analyses, alle categorieën |
| Jaarlijks Premium | €129/jaar | Zelfde als Premium, ~28% korting |

**Categorieën voor abonnementen:**

Categorieën worden bepaald door `tags[]` in `index.json`. Voorbeelden:

| Categorie | Tags | Voorbeeldaandelen |
|-----------|------|-------------------|
| Nederlandse markt | `nl`, `aex`, `amx` | ADYEN, ASML, HEIJM |
| Europese small caps | `eu-smallcap` | ALTR, ARP, BETS-B, KPL, PZU, WAWI |
| Tech & groei | `tech`, `growth` | ASML, CRWD, ADYEN, MIPS |
| Scandinavië | `scandinavia` | ARP, BETS-B, HUSCO, PNDORA |
| Dividend & waarde | `value`, `dividend` | EQNR, TMUS, WIPRO |

Een analyse kan meerdere tags hebben. ASML is zowel `nl` als `tech`.

**Implementatie Fase 2 (niet nu bouwen, wel ontwerpen):**
- Auth.js v5 met Google + email magic link
- Stripe Checkout voor losse analyses (one-time payment)
- Stripe Subscriptions voor abonnementen
- Middleware checkt: heeft user toegang tot deze analyse? → toon content of paywall
- Database (Neon PostgreSQL): users, purchases, subscriptions

### Wat nu al in de code moet voor Fase 2 voorbereiding

```typescript
// lib/access.ts — later uitbreiden met echte auth-check

export type AccessLevel = 'free' | 'preview' | 'full'

export function getTabAccess(tabId: string): AccessLevel {
  const freeTabs = ['samenvatting', 'bedrijf']
  const previewTabs = ['scorekaart']  // deels zichtbaar

  if (freeTabs.includes(tabId)) return 'free'
  if (previewTabs.includes(tabId)) return 'preview'
  return 'full'  // In Fase 1: altijd 'full' tonen met blur
}

// Later wordt dit:
// export async function getUserAccess(userId: string, ticker: string): Promise<AccessLevel>
```

---

## 8. SEO & meta

### Per pagina

**Homepage:**
```
title: "Aandelenanalyse — Onafhankelijke fundamentele analyses"
description: "Diepgaande aandelenanalyses met DCF-waardering, scorekaart en RA-verificatie. Europese small & midcaps."
```

**Analyse-pagina:**
```
title: "{naam} ({ticker}) — Fundamentele Analyse | Aandelenanalyse"
description: "{oordeel}: {kernthese} Fair value €{fair_value}, upside {upside}%."
```

### Open Graph / Social sharing

Elke analyse-pagina krijgt:
- `og:title`, `og:description` (uit JSON)
- `og:image` — gegenereerde afbeelding via Next.js `opengraph-image.tsx`:
  - Donkere achtergrond
  - Logo + ticker + naam
  - Oordeel badge (KOOP/HOLD/PASS)
  - Fair value + upside
  - Scorekaart balk

### Structured data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Fundamentele Analyse: ASML Holding N.V.",
  "description": "...",
  "provider": {
    "@type": "Organization",
    "name": "Aandelenanalyse"
  }
}
```

### Sitemap

`app/sitemap.ts` — genereert automatisch uit `index.json`.

### robots.txt

Alles indexeerbaar. Geen restricties in Fase 1.

---

## 9. Deploy & infrastructuur

### Vercel

- Repo: nieuwe GitHub repo `aandelenanalyse-platform`
- Deploy: automatisch bij push naar `main`
- Domein: koppel eigen domein (nog te kopen) + `aandelenanalyse.vercel.app` als fallback
- Environment variables: geen in Fase 1

### Data-sync workflow

Na een nieuwe analyse of koersupdate:

```bash
# In de bestaande aandelenanalyse/ repo:
python prices.py          # koersen bijwerken
python deploy.py          # commit + push data/

# Sync naar platform repo:
./sync-data.sh            # kopieert data/ → platform/src/content/data/
cd ../aandelenanalyse-platform
git add src/content/data/
git commit -m "data: sync $(date +%Y-%m-%d)"
git push                  # Vercel rebuild triggert automatisch
```

Later te automatiseren via GitHub Action die luistert naar pushes in de data-repo.

---

## 10. Bouwvolgorde (dag-voor-dag)

### Dag 1: Fundament

**Ochtend:**
- [ ] Next.js project initialiseren met TypeScript + Tailwind
- [ ] Fonts instellen (Inter + Lora via next/font/google)
- [ ] CSS custom properties (kleurpalet) in globals.css
- [ ] `lib/types.ts` — alle TypeScript interfaces
- [ ] `lib/data.ts` — data-laadfuncties
- [ ] `lib/utils.ts` — formatters (valuta, percentage, datum)
- [ ] Data kopiëren naar `src/content/data/`

**Middag:**
- [ ] Root layout.tsx (fonts, metadata, body styling)
- [ ] `<Header>` component (logo, navigatie, responsive)
- [ ] `<Footer>` component (disclaimer, links, copyright)
- [ ] Homepage page.tsx — laadt index.json, rendert kaarten
- [ ] `<AnalyseCard>` component met alle visuele details
- [ ] `<OordeelBadge>` component
- [ ] `<ScoreBar>` component

**Eind dag 1:** Homepage staat, alle 24 kaarten zichtbaar, responsive, professioneel design.

### Dag 2: Analyse-pagina basis

**Ochtend:**
- [ ] `/analyse/[ticker]/page.tsx` met `generateStaticParams`
- [ ] Analyse header (logo, naam, koers, fair value, oordeel)
- [ ] `<TabNavigation>` Client Component
- [ ] `<PaywallOverlay>` component
- [ ] `lib/access.ts` — tab access logic

**Middag:**
- [ ] `<TabSamenvatting>` — kernthese, oordeel, scenario's, kans/risico
- [ ] `<TabBedrijf>` — beschrijving, segmenten, aandeelhouders
- [ ] `<TabScorekaart>` — totaalscore (gratis) + individuele scores (locked)

**Eind dag 2:** Analyse-pagina werkt met 3 tabs, navigatie, paywall overlay op locked tabs.

### Dag 3: Financiële data & grafieken

**Ochtend:**
- [ ] Recharts installeren en configureren
- [ ] `<FinancialTable>` herbruikbaar component
- [ ] `<TabFinancieel>` — resultatenrekening tabel
- [ ] Omzet + groei ComposedChart
- [ ] Kasstromen tabel + FCF AreaChart

**Middag:**
- [ ] Balans tabel
- [ ] Rendementsindicatoren
- [ ] Waarderingsratio's
- [ ] `<TabWaardering>` — DCF inputs, scenario BarChart, gevoeligheidsmatrix heatmap

**Eind dag 3:** Financiële tabs compleet met alle tabellen en grafieken.

### Dag 4: Overige tabs & Markdown rendering

**Ochtend:**
- [ ] `<TabMoat>` — RadarChart + categorie-uitleg
- [ ] `<TabManagement>` — personen, capital allocation, insider transactions
- [ ] Markdown parsing: split .md op hoofdstuk-headers

**Middag:**
- [ ] `<TabSector>` — rendert H5 uit .md
- [ ] `<TabFrameworks>` — rendert H6 uit .md
- [ ] `<TabRisicos>` — rendert H8 uit .md
- [ ] Prose styling voor Markdown content (tailwind typography plugin)

**Eind dag 4:** Alle 10 tabs werken. Analyses met .md tonen narratieve content, analyses zonder .md tonen JSON-data.

### Dag 5: Homepage filters, statische pagina's, SEO

**Ochtend:**
- [ ] Homepage filters (oordeel, sector) — Client Component
- [ ] Homepage sortering (upside, score, alfabet, datum)
- [ ] Zoekfunctie (client-side filter op naam/ticker)

**Middag:**
- [ ] `/methode` pagina — uitleg scorekaart, DCF, frameworks
- [ ] `/over` pagina — auteursprofiel, RA-profiel, contact
- [ ] `/prijzen` pagina — tiers + "binnenkort beschikbaar" + email CTA
- [ ] SEO: metadata per pagina, sitemap.ts, robots.txt
- [ ] OG image generatie (`opengraph-image.tsx`)

**Eind dag 5:** Complete site, alle pagina's, SEO-klaar.

### Dag 6: Polish, responsive, performance

- [ ] Mobile testing — alle pagina's, tabellen, grafieken
- [ ] Tabel horizontaal scrollen op mobiel
- [ ] Tab navigatie touch scrolling
- [ ] Lighthouse audit: performance, accessibility, SEO
- [ ] Loading states / skeleton screens
- [ ] 404 pagina
- [ ] Favicon + manifest
- [ ] Disclaimer tekst op elke analyse-pagina (footer)

### Dag 7: Deploy & data-sync

- [ ] GitHub repo aanmaken
- [ ] Vercel project koppelen
- [ ] Eigen domein configureren (als gekocht)
- [ ] `sync-data.sh` script schrijven
- [ ] Alle 24 analyses verifiëren op de live site
- [ ] Final check: links, images, responsive, performance
- [ ] Live!

---

## 11. Voortgangsstatus per feature

**Legenda:** LIVE = op productie, KLAAR = code af maar nog niet volledig geconfigureerd, OPEN = nog te bouwen

### Fase 1 (oorspronkelijk plan) — COMPLEET
- LIVE — Alle publieke pagina's (homepage, /analyses, /analyse/[ticker], /methode, /over, /prijzen, /disclaimer, /privacy)
- LIVE — Design systeem (Tailwind v4, kleuren, typografie, componenten)
- LIVE — SEO (sitemap, robots, structured data, FAQ schema)
- LIVE — Live koersen (Yahoo Finance)
- LIVE — Logo.dev integratie
- LIVE — 4 analyses (ADYEN, ASML, EDEN, SW) met hero images
- LIVE — Marktcategorie pagina's (/markt/[categorie])

### Fase 2 (accounts + betaling + admin) — GROTENDEELS COMPLEET
- LIVE — Auth.js v5 (inloggen/registreren/uitloggen, JWT, credentials provider)
- LIVE — Database (Prisma v7 + Neon PostgreSQL)
- LIVE — PaywallGate (blur + CTA, client-side, access levels per tab)
- LIVE — Account pagina (/account met profiel, plan, gekochte analyses)
- LIVE — Admin dashboard (/admin — KPI's, recente registraties, recente aankopen)
- LIVE — Admin gebruikers (/admin/gebruikers — volledige tabel met plan, status, aankopen)
- LIVE — Email-notificaties (Resend — admin krijgt mail bij registratie, aankoop, abonnement, opzegging)
- KLAAR — Stripe checkout, webhook, portal (code compleet, producten nog niet aangemaakt in Stripe Dashboard)
- OPEN — Custom domein (aandelenanalyse.nl nog niet gekoppeld aan Vercel)
- OPEN — Resend domein verificatie (emails komen nu van onboarding@resend.dev)

### Fase 3 (interactief + schaal) — OPEN
- OPEN — Interactieve DCF-calculator
- OPEN — Vergelijkingsfunctie
- OPEN — Nieuwsbrief (UI staat klaar, backend nog niet)
- OPEN — Analytics (Google Analytics / Plausible)
- OPEN — Portefeuille-pagina
- OPEN — Thesis tracker pagina
- OPEN — Server-side middleware (premium content nu alleen client-side geblurred)

### Bewust uitgesteld (geen prioriteit)
- Meertaligheid (next-intl) — pas als er Engelse content is
- Dark mode
- Animaties (Framer Motion)
- Analyses upload via admin (voorlopig handmatig via git push)

---

## Aanpasbaarheid analyse-structuur

De analyse-skill is in actieve ontwikkeling. Nieuwe velden of hoofdstukken kunnen worden toegevoegd. De architectuur handelt dit als volgt af:

1. **Nieuw veld in bestaand JSON-object:** Voeg toe aan het TypeScript type als optioneel (`?`). Component toont het als het er is, negeert het als het er niet is.

2. **Nieuw hoofdstuk:** Voeg een nieuwe tab toe in `tab-navigation.tsx` en maak een nieuw `tab-*.tsx` component. Bestaande analyses zonder dit hoofdstuk tonen de tab niet.

3. **Gewijzigde veldnamen:** Pas het type aan, zoek-en-vervang in het betreffende tab-component.

4. **Nieuwe grafiek:** Maak een nieuw component in `components/charts/`, importeer in de relevante tab.

De regel is: **één type-bestand + één component per tab.** Wijzigingen in de analyse-skill raken maximaal 2 bestanden.

---

*Dit document is het werkplan. Bij wijzigingen in scope of prioriteit: update dit bestand.*
