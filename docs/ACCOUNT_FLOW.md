# Account & Abonnement Flow — Aandelenanalyse.nl

**Datum:** 11 april 2026
**Status:** Concept — input voor bouw
**Principe:** Opzeggen moet net zo makkelijk zijn als aanmelden. Geen dark patterns.

---

## Kernprincipe

De account-ervaring moet dezelfde eerlijkheid uitstralen als de analyses. Als je PASS durft te zeggen over een aandeel, dan durf je ook een opzegknop prominent neer te zetten. Vertrouwen bouw je niet door mensen vast te houden, maar door ze te laten blijven omdat ze willen.

---

## Account-pagina (`/account`)

### Structuur

```
/account
├── Overzicht            ← Landingspagina van /account
├── /account/abonnement  ← Plan, wijzigen, opzeggen
├── /account/facturen    ← Factuurhistorie
└── /account/gegevens    ← Profiel, e-mail, wachtwoord
```

### Overzichtspagina (`/account`)

Eén scherm met alles in oogopslag:

```
┌─────────────────────────────────────────────────┐
│  Mijn account                                    │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │ Abonnement       │  │ Profiel               │ │
│  │ Premium · €14,95  │  │ jan@email.nl          │ │
│  │ Verlengt 11 mei   │  │ [Wijzigen →]          │ │
│  │                   │  │                       │ │
│  │ [Wijzigen]        │  └──────────────────────┘ │
│  │ [Opzeggen]        │                           │
│  └──────────────────┘  ┌──────────────────────┐ │
│                         │ Facturen              │ │
│  ┌──────────────────┐  │ Laatste: 11 apr €14,95│ │
│  │ Toegang           │  │ [Alle facturen →]     │ │
│  │ 12 analyses       │  │                       │ │
│  │ ontgrendeld       │  └──────────────────────┘ │
│  │ [Bekijken →]      │                           │
│  └──────────────────┘                            │
└─────────────────────────────────────────────────┘
```

**Opzeggen staat op dezelfde pagina als het abonnement.** Niet verstopt in een submenu.

---

## Abonnement-flow

### Aanmelden (upgrade)

```
Bezoeker klikt op premium tab of /prijzen
  → Kiest plan (losse analyse / categorie / premium)
    → Account aanmaken (als nog niet ingelogd)
      → E-mail + wachtwoord, of Google login
      → Checkbox: "Ik ga akkoord met de [voorwaarden] en [disclaimer]"
    → Stripe Checkout
      → Betaling
      → Redirect naar de analyse die ze wilden lezen
        → Alle tabs ontgrendeld, klaar
```

**UX-detail:** Na betaling NIET naar een "bedankt"-pagina. Breng ze terug naar de analyse waar ze mee bezig waren. Ze wilden lezen, niet een bedankje zien.

### Wijzigen (up/downgrade)

```
/account/abonnement
  → Huidig plan zichtbaar
  → "Wijzig abonnement" knop
    → Overzicht van plannen met huidige plan gemarkeerd
    → Upgrade: direct actief, verschil pro-rata verrekend
    → Downgrade: actief aan einde huidige periode
    → Bevestigingsscherm met duidelijke uitleg:
      "Je upgrade gaat direct in. Je betaalt vandaag €X (verschil huidige periode)."
      of
      "Je downgrade gaat in op [datum]. Tot die tijd behoud je Premium-toegang."
```

### Opzeggen

Dit is waar de meeste platforms falen. Onze aanpak:

```
/account/abonnement
  → "Opzeggen" knop — zichtbaar, niet verstopt
    → Eén bevestigingsscherm:
      ┌──────────────────────────────────────┐
      │ Abonnement opzeggen                   │
      │                                       │
      │ Je Premium-abonnement loopt door      │
      │ tot 11 mei 2026. Daarna verlies je    │
      │ toegang tot volledige analyses.       │
      │                                       │
      │ Je samenvattingen en scorekaarten     │
      │ blijven altijd gratis toegankelijk.   │
      │                                       │
      │ [Toch opzeggen]    [Abonnement houden]│
      └──────────────────────────────────────┘
    → Klik "Toch opzeggen"
      → Direct opgezegd. Geen retentie-funnel, geen "weet je het zeker?",
        geen "praat eerst met ons team", geen aanbiedingen.
      → Bevestigingsscherm:
        "Je abonnement is opgezegd. Je hebt toegang tot [datum].
         Je kunt op elk moment opnieuw abonneren."
      → Bevestigingsmail gestuurd
```

**Wat we NIET doen:**
- Geen 5-stappen opzegflow
- Geen "bel ons om op te zeggen"
- Geen verborgen opzegknop
- Geen schuldgevoel-teksten ("Je verliest 12 ontgrendelde analyses!")
- Geen last-minute kortingsaanbod (ondermijnt je pricing)
- Geen enquête verplicht stellen (optioneel mag)

**Wat we WEL doen:**
- Opzeggen in 2 klikken (knop → bevestiging → klaar)
- Duidelijk communiceren wat je houdt en wat je verliest
- Toegang tot einde betaalperiode
- Gratis content (samenvattingen) blijft altijd beschikbaar
- Makkelijk opnieuw abonneren als ze terugkomen

### Optioneel: korte feedback (niet verplicht)

Na opzegging, op de bevestigingspagina:

```
We vinden het jammer dat je gaat. Mogen we vragen waarom? (optioneel)

○ Te duur
○ Niet genoeg analyses
○ Gebruik het te weinig
○ Andere reden: [________]

[Verstuur]  [Overslaan]
```

Geen blokkade. Overslaan staat er prominent bij.

---

## Losse analyse-aankoop

```
Klik op premium tab
  → Paywall overlay:
    "Ontgrendel de volledige analyse van [Bedrijf]"
    
    ┌─────────────────────────────────────┐
    │ Losse analyse         €4,95 eenmalig│
    │ Permanent toegang tot deze analyse  │
    │ [Ontgrendel deze analyse]           │
    │                                     │
    │ ─── of ───                          │
    │                                     │
    │ Premium abonnement    €14,95/mnd    │
    │ Alle analyses, alle categorieën     │
    │ [Bekijk abonnementen]               │
    └─────────────────────────────────────┘
```

Bij losse aankoop:
- Account vereist (voor toegangsbeheer)
- Eenmalige Stripe betaling
- Analyse permanent ontgrendeld op account
- Geen abonnement, geen verlenging

---

## Facturen (`/account/facturen`)

```
┌──────────────────────────────────────────────┐
│ Facturen                                      │
│                                               │
│ Datum        Omschrijving          Bedrag      │
│ 11 apr 2026  Premium (maandelijks) €14,95  ↓  │
│ 11 mrt 2026  Premium (maandelijks) €14,95  ↓  │
│ 25 feb 2026  Losse analyse: ASML   €4,95  ↓  │
│                                               │
│ ↓ = Download PDF                              │
│                                               │
│ Factuurgegevens wijzigen:                     │
│ [Bedrijfsnaam]  [BTW-nummer]  [Opslaan]       │
└──────────────────────────────────────────────┘
```

**Stripe Customer Portal** afhandeling:
- Facturen automatisch beschikbaar via Stripe
- BTW-nummer toevoegen voor zakelijke klanten (reverse charge EU)
- PDF-download per factuur

---

## Profiel & gegevens (`/account/gegevens`)

Minimaal:

```
┌──────────────────────────────────────┐
│ Mijn gegevens                         │
│                                       │
│ E-mailadres                           │
│ [jan@email.nl         ] [Wijzigen]    │
│                                       │
│ Wachtwoord                            │
│ [••••••••             ] [Wijzigen]    │
│                                       │
│ Nieuwsbrief                           │
│ [✓] Wekelijkse analyse-update         │
│                                       │
│ ──────────────────────                │
│                                       │
│ [Account verwijderen]                 │
│ Al je gegevens worden permanent       │
│ verwijderd. Dit kan niet ongedaan     │
│ worden gemaakt.                       │
└──────────────────────────────────────┘
```

**Account verwijderen:** AVG-recht. Moet mogelijk zijn. Zelfde filosofie als opzeggen — geen drempels.

---

## E-mail communicatie

### Transactionele e-mails (altijd, niet uitschrijfbaar)

| Moment | E-mail |
|--------|--------|
| Account aangemaakt | Welkom + bevestig e-mail |
| Betaling geslaagd | Factuur + link naar analyse |
| Betaling mislukt | "Je betaling is niet gelukt" + link om bij te werken |
| Abonnement opgezegd | Bevestiging + einddatum |
| Abonnement verlengd | Factuur (automatisch via Stripe) |
| Account verwijderd | Bevestiging |

### Marketing e-mails (uitschrijfbaar)

| Type | Frequentie | Inhoud |
|------|-----------|--------|
| Nieuwsbrief | Wekelijks | Nieuwe analyses, markt-highlights |
| Analyse-update | Bij update | "ASML-analyse is bijgewerkt" (alleen voor ontgrendelde analyses) |

**Elke marketing-mail heeft een uitschrijflink onderaan.** Geen "beheer voorkeuren" als omweg — directe uitschrijflink.

---

## Samenvatting: de klantbelofte

| Actie | Stappen | Tijd |
|-------|---------|------|
| Account aanmaken | 2 (invullen → bevestigen) | <1 min |
| Analyse kopen | 3 (klik → betaal → lees) | <2 min |
| Abonnement nemen | 3 (kies plan → betaal → lees) | <2 min |
| Abonnement opzeggen | 2 (klik → bevestig) | <30 sec |
| Account verwijderen | 2 (klik → bevestig) | <30 sec |
| Factuur downloaden | 1 (klik) | <5 sec |

**De regel:** Opzeggen mag nooit meer stappen kosten dan aanmelden.

---

*Dit document beschrijft de account-flow en klantbeleving. Technische implementatie (Auth.js, Stripe) volgt in fase 2 van het BUILD_PLAN.*
