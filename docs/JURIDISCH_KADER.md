# Juridisch Kader — Aandelenanalyse.nl

**Datum:** 11 april 2026
**Status:** Concept — laat dit reviewen door een jurist voordat je live gaat
**Scope:** Welke juridische pagina's zijn nodig, wat moet erin, en waar moeten disclaimers geplaatst worden

---

## Overzicht benodigde juridische pagina's

| Pagina | URL | Verplicht | Waarom |
|--------|-----|-----------|--------|
| Disclaimer | `/disclaimer` | Ja | Wft-vrijstelling, geen beleggingsadvies |
| Privacyverklaring | `/privacy` | Ja | AVG/GDPR — zodra je e-mailadressen verzamelt |
| Algemene voorwaarden | `/voorwaarden` | Ja (bij betaling) | Consumentenrecht, abonnementen, herroeping |
| Cookiebeleid | `/cookies` of in privacy | Ja (bij analytics) | ePrivacy-richtlijn / Telecommunicatiewet |

---

## 1. Disclaimer (Wft-compliance)

### Kernformulering

Deze tekst moet op **elke pagina** zichtbaar of bereikbaar zijn:

> De informatie op aandelenanalyse.nl is uitsluitend bedoeld voor informatieve en educatieve doeleinden. De oordelen KOOP, HOLD en PASS zijn gebaseerd op vaste analyseframeworks en gestandaardiseerde criteria. Zij vormen geen persoonlijk beleggingsadvies in de zin van de Wet op het financieel toezicht (Wft). Aandelenanalyse.nl is niet geregistreerd als beleggingsonderneming bij de AFM en verricht geen beleggingsdiensten.
>
> Beleggen brengt risico's met zich mee. U kunt uw inleg geheel of gedeeltelijk verliezen. In het verleden behaalde resultaten bieden geen garantie voor de toekomst. Raadpleeg een erkend financieel adviseur voordat u beleggingsbeslissingen neemt.

### Over de RA-verificatie

> De financiële data in onze analyses wordt gecontroleerd via een vast controlesysteem dat is opgezet volgens de methodiek van een Register Accountant. Dit betreft uitsluitend verificatie van de juistheid van gepresenteerde cijfers (omzet, winst, schuldratio's) tegen primaire bronnen. De Register Accountant beoordeelt niet de beleggingsthese, DCF-aannames of het KOOP/HOLD/PASS-oordeel.

### Waar plaatsen

| Locatie | Type | Details |
|---------|------|---------|
| Footer (elke pagina) | Korte versie | "Geen beleggingsadvies. Oordelen zijn gebaseerd op vaste analyseframeworks." + link naar `/disclaimer` |
| Analyse-pagina's | Inline banner | Zichtbare disclaimer boven of onder de executive summary. Niet wegklikbaar. |
| Homepage | In footer | Korte versie + link |
| `/disclaimer` pagina | Volledige versie | Complete tekst met alle onderdelen |
| Nieuwsbrief-aanmelding | Onder het formulier | "Door je aan te melden ga je akkoord met onze [privacyverklaring]." |
| Bij checkout (fase 2) | Actief akkoord | Checkbox: "Ik heb de [disclaimer] en [algemene voorwaarden] gelezen en ga hiermee akkoord." |

### Geen actief akkoord nodig voor
- Het lezen van gratis analyses (disclaimer is informatief, geen contractuele verplichting)
- Het bezoeken van de site (cookiebanner is apart)

### Wel actief akkoord nodig voor
- **Nieuwsbrief:** opt-in voor e-mail (AVG vereist actieve toestemming)
- **Account aanmaken (fase 2):** akkoord met algemene voorwaarden + privacyverklaring
- **Betaling (fase 2):** akkoord met algemene voorwaarden + disclaimer + herroepingsrecht
- **Cookies (bij niet-essentiële cookies):** cookiebanner met keuze

---

## 2. Privacyverklaring (AVG/GDPR)

### Moet bevatten

**Identiteit verwerkingsverantwoordelijke:**
- Naam, adres, KvK-nummer, e-mailadres

**Welke gegevens verzamelen we:**

| Gegeven | Grondslag | Bewaartermijn |
|---------|-----------|---------------|
| E-mailadres (nieuwsbrief) | Toestemming (opt-in) | Tot uitschrijving + 30 dagen |
| Naam + e-mail (account, fase 2) | Uitvoering overeenkomst | Duur account + 2 jaar |
| Betalingsgegevens (fase 2) | Uitvoering overeenkomst | 7 jaar (fiscale bewaarplicht) |
| Analyticsdata (anoniem) | Gerechtvaardigd belang | 26 maanden |
| IP-adres (server logs) | Gerechtvaardigd belang | 90 dagen |

**Rechten van betrokkenen:**
- Recht op inzage, rectificatie, verwijdering, beperking, overdraagbaarheid, bezwaar
- Hoe uit te oefenen: e-mail naar privacy@aandelenanalyse.nl
- Klacht indienen bij Autoriteit Persoonsgegevens

**Verwerkers (sub-processors):**

| Dienst | Doel | Locatie | Verwerkersovereenkomst |
|--------|------|---------|----------------------|
| Vercel | Hosting | EU/VS (met SCC's) | Standaard in ToS |
| Resend of Buttondown | E-mail | VS (met SCC's) | Standaard in ToS |
| Plausible / Umami | Analytics | EU | Privacyvriendelijk, geen cookies |
| Stripe (fase 2) | Betalingen | VS (met SCC's) | Standaard in ToS |

**Cookies:**
- Bij Plausible/Umami: geen cookies nodig → geen cookiebanner nodig
- Bij GA4: wel cookies → cookiebanner met opt-in/opt-out verplicht
- Essentiële cookies (sessie, taalvoorkeur): altijd toegestaan

**Aanbeveling:** Gebruik Plausible of Umami. Dan heb je geen cookiebanner nodig — dat is beter voor UX én juridisch eenvoudiger.

---

## 3. Algemene voorwaarden

### Fase 1 (gratis, geen accounts)
Niet strikt nodig bij een gratis informatieve site. Maar het is verstandig om ze alvast te hebben voor:
- Intellectueel eigendom (analyses zijn auteursrechtelijk beschermd)
- Aansprakelijkheidsbeperking
- Basis voor fase 2

### Fase 2 (betaald, accounts)
Verplicht op grond van consumentenrecht. Moet bevatten:

**Identiteit aanbieder:**
- Naam, adres, KvK, BTW-nummer, e-mail

**Dienst:**
- Wat bieden we: toegang tot fundamentele aandelenanalyses
- Wat bieden we niet: beleggingsadvies, vermogensbeheer, persoonlijke aanbevelingen

**Prijzen en betaling:**
- Abonnementsprijzen (incl. BTW)
- Betalingswijze (Stripe)
- Automatische verlenging en opzegtermijn

**Herroepingsrecht (14 dagen bedenktijd):**
- Wettelijk verplicht voor online consumentenaankopen
- Uitzondering: als gebruiker expliciet akkoord gaat met directe levering van digitale content EN afziet van herroepingsrecht → checkbox bij checkout:
  "Ik verzoek om directe toegang tot de analyse en begrijp dat ik daarmee afzie van mijn herroepingsrecht."

**Intellectueel eigendom:**
- Analyses zijn auteursrechtelijk beschermd
- Geen reproductie zonder toestemming
- Persoonlijk gebruik, niet doorverkopen

**Aansprakelijkheid:**
- Verwijzing naar disclaimer
- Uitsluiting aansprakelijkheid voor beleggingsverliezen
- Maximale aansprakelijkheid beperkt tot bedrag betaalde abonnementskosten

**Wijzigingen:**
- Recht om voorwaarden te wijzigen
- Kennisgeving via e-mail bij materiële wijzigingen
- 30 dagen om op te zeggen na wijziging

**Toepasselijk recht:**
- Nederlands recht
- Geschillencommissie / rechtbank

---

## 4. Implementatie-checklist

### Fase 1 (launch, gratis)

- [ ] `/disclaimer` pagina met volledige Wft-disclaimer
- [ ] `/privacy` pagina met privacyverklaring
- [ ] Footer op elke pagina: korte disclaimer + links naar `/disclaimer` en `/privacy`
- [ ] Analyse-pagina's: inline disclaimer-banner bij executive summary
- [ ] Nieuwsbrief-formulier: tekst "Door je aan te melden ga je akkoord met onze [privacyverklaring]" met link
- [ ] Analytics: Plausible of Umami (geen cookiebanner nodig) OF GA4 + cookiebanner
- [ ] KvK-nummer en contactgegevens op de site (wettelijk verplicht voor commerciële sites)

### Fase 2 (betaald, accounts)

- [ ] `/voorwaarden` pagina met algemene voorwaarden
- [ ] Registratie: checkbox "Ik ga akkoord met de [algemene voorwaarden] en [privacyverklaring]"
- [ ] Checkout: checkbox disclaimer + voorwaarden + herroepingsrecht
- [ ] Stripe-integratie met correcte BTW-afhandeling
- [ ] Verwerkersovereenkomsten controleren (Stripe, Resend, Vercel)
- [ ] Bij >€20.000 omzet: BTW-registratie (of KOR-melding)

---

## 5. Formuleringen voor KOOP/HOLD/PASS

### Op de methode-pagina

> **Hoe komen onze oordelen tot stand?**
>
> Elk aandeel wordt beoordeeld via 9 gestandaardiseerde analyseframeworks, waaronder DCF-waardering, moat-analyse en de investeringscriteria van Graham, Buffett, Lynch, Fisher en Greenblatt. Op basis van deze analyse valt elk aandeel in één van drie categorieën:
>
> **KOOP** — Het aandeel scoort sterk op onze frameworks en wordt door onze DCF-analyse als ondergewaardeerd beoordeeld ten opzichte van de berekende fair value.
>
> **HOLD** — Het aandeel scoort gemengd op onze frameworks of wordt rond fair value gewaardeerd. Er is onvoldoende marge voor een KOOP-oordeel.
>
> **PASS** — Het aandeel scoort onvoldoende op onze frameworks of wordt als overgewaardeerd beoordeeld. Wij zien op dit moment onvoldoende aanleiding voor een positief oordeel.
>
> Deze oordelen zijn gebaseerd op vaste, reproduceerbare criteria. Ze zijn geen persoonlijke aanbevelingen en houden geen rekening met uw individuele financiële situatie, beleggingshorizon of risicoprofiel.

### Op analysekaarten (compact)

> Oordeel op basis van 9 analyseframeworks. Geen beleggingsadvies.

### In de FAQ

> **Zijn dit beleggingsadviezen?**
>
> Nee. Onze oordelen (KOOP, HOLD, PASS) zijn gebaseerd op vaste, gestandaardiseerde analyseframeworks. Ze geven aan hoe een aandeel scoort op onze criteria, niet wat u persoonlijk zou moeten doen. Wij kennen uw financiële situatie niet en geven geen persoonlijk advies. Raadpleeg altijd een erkend financieel adviseur voordat u beleggingsbeslissingen neemt.

---

*Dit document is een richtlijn, geen juridisch advies. Laat de definitieve teksten reviewen door een jurist met kennis van Wft en AVG voordat je live gaat.*
