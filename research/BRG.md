# Research: BRG — Borregaard ASA

> **Stage 1 output van cowork.** Claude Code neemt het over voor JSON-injectie, validator en deploy.
> Methode: `research/METHODE.md`. Structuur: `research/TEMPLATE.md`.

---

## Bronnen-inventaris (Stap 0.5)

```
Jaar 2025 — HOOG
  Bron: Borregaard ASA Annual Report 2025 (gepubliceerd 26-03-2026) +
        Q4 2025 result release (04-02-2026)
  URL:  https://www.globenewswire.com/news-release/2026/03/26/3262747/0/en/Borregaard-ASA-Annual-Report-2025.html
        https://www.globenewswire.com/news-release/2026/02/04/3231743/0/en/Borregaard-ASA-EBITDA1-of-NOK-405-million-in-the-4th-quarter-2025.html
  Daadwerkelijk geopend: ja
  Cijfers overgenomen: omzet (7.713), EBITDA (1.878), EBIT (1.287),
                       nettowinst (620), EPS (6,22), profit before tax (864),
                       impairment bio-startups (245), dividendvoorstel (4,75)
  Cijfers NIET overgenomen: gedetailleerd werkkapitaal (alleen via stockanalysis)

Jaar 2024 — HOOG
  Bron: Borregaard Annual Report 2024 + Q4 2024 release (29-01-2025)
  URL:  https://www.globenewswire.com/news-release/2025/03/20/3045979/0/en/Borregaard-ASA-Annual-Report-2024.html
        https://www.globenewswire.com/news-release/2025/01/29/3016894/0/en/Borregaard-ASA-EBITDA1-of-NOK-398-million-in-the-4th-quarter.html
  Daadwerkelijk geopend: ja (via globenewswire-samenvatting)
  Cijfers overgenomen: omzet (7.617), EBITDA (1.844), profit before tax (1.079),
                       EPS (8,25), dividend (4,25)
  Cijfers NIET overgenomen: detailbalans uit jaarverslag (gebruikt aggregator)

Jaar 2023 — HOOG (samenvatting) + AGGREGATOR (detail)
  Bron: Borregaard Annual Report 2023 + StockAnalysis (detail)
  URL:  https://www.borregaard.com/media/ac1fn2he/borregaard-annual-report-2023.pdf
        https://stockanalysis.com/quote/osl/BRG/financials/
  Daadwerkelijk geopend: ja
  Cijfers overgenomen: omzet (7.132), EBITDA (1.781), EPS (8,71)
  Cijfers via aggregator: balans, kasstroom-detail

Jaar 2022 — HOOG (samenvatting) + AGGREGATOR
  Bron: Borregaard Annual Report 2022 + StockAnalysis
  URL:  https://www.borregaard.com/hubfs/Media/InvestorFiles/GeneralMeeting2023/annual-report-2022.pdf?hsLang=en
  Cijfers overgenomen: omzet (6.881), EBITDA (1.635 onderliggend; AR meldt 1.643)
  Opmerking: Q-totaal in zoekresultaat lijkt 1.643; stockanalysis 1.635 —
             gebruik 1.635 (consolidated, na finale eliminaties)

Jaar 2021 — HOOG (samenvatting; aggregator-detail bevatte unit-fout)
  Bron: 2021 Annual Report (URL via Borregaard ml-eu) + zoekresultaten
  URL:  https://ml-eu.globenewswire.com/Resource/Download/d29c052b-ec61-4215-ba8e-02c358787d74
  Cijfers overgenomen: omzet (5.805), EBITDA (1.431 / 1.372 stockanalysis),
                       gebruik 1.431 (officieel), nettowinst 692, EPS 6,94
  Opmerking: stockanalysis-balans 2021 had unit-fout (×1e6 te hoog) — niet
             gebruikt; balans 2021 niet gerapporteerd in dit rapport

Jaar 2020 — AGGREGATOR
  Bron: zoekresultaten + Borregaard nieuwsarchief
  Cijfers overgenomen: EBITDA 886
  Cijfers NIET overgenomen: omzet, balans, FCF (geen geverifieerde aggregator-
                            URL kunnen openen voor pre-2021 detail)
  Conclusie: 2020 alleen EBITDA; rest leeg

Jaar 2019 — AGGREGATOR
  Bron: zoekresultaten (jaarrekening-kerncijfers via search-snippet)
  Cijfers overgenomen: EBITDA 697
  Conclusie: 2019 alleen EBITDA; rest leeg

Jaar 2018 — AGGREGATOR
  Bron: zoekresultaten (jaarrekening-kerncijfers via search-snippet)
  Cijfers overgenomen: EBITDA 558
  Conclusie: 2018 alleen EBITDA; rest leeg

Jaar 2017 — GEEN BRON BESCHIKBAAR
  Zoekpoging(en): Borregaard IR-archief (PDF bestaat maar niet geopend),
                  geen aggregator-snippet geverifieerd
  Conclusie: 2017 LEEG. Noteer in ontbrekende_data.

Jaar 2016 — GEEN BRON BESCHIKBAAR (deels)
  Bron: dividend-search snippet meldt regulier 1,75 + extra 1,75 = 3,50
  Cijfers overgenomen: dividend per aandeel 3,50 (deels)
  Conclusie: financieel detail 2016 LEEG.

Jaar 2015 — GEEN BRON BESCHIKBAAR
  Conclusie: 2015 LEEG.
```

**Bronnen-inventaris-conclusie:** geverifieerde data 2021-2025 (5 jaar HOOG voor de samenvattingscijfers, AGGREGATOR voor detailbalans/kasstroom 2021-2022). Jaren 2018-2020 alleen EBITDA. 2015-2017 niet beschikbaar binnen het tijdvak van deze run. De DCF wordt gevoed door 2021-2025 (volledige cyclus inclusief covid-trough en vanillin/lignine-piek), wat methodisch acceptabel is voor een specialty-chemicals bedrijf met cycli van 3-4 jaar.

---

## Metadata
- **Ticker (bare):** BRG
- **Yahoo symbol:** BRG.OL
- **Exchange:** OSL (Oslo Børs)
- **Sector (GICS-achtig):** Materialen
- **Industrie:** Specialty chemicals / biorefinery (specialty cellulose, lignine, biovanillin)
- **Land:** Noorwegen
- **Peildatum analyse:** 2026-04-26
- **Koers op peildatum:** 176,00
- **Valuta:** NOK
- **Marktkapitalisatie:** NOK 17,55 mld
- **Marktkap in mln (lokale valuta):** 17.550
- **Free float pct:** ~85% (top 20 = 51,1%; geen controlerend aandeelhouder)
- **Indexlidmaatschap:** OSEBX, OBX
- **Domein:** borregaard.com

---

## 1. Executive summary

- **Kernthese:** Borregaard exploiteert een unieke geïntegreerde biorefinery in Sarpsborg (NO) waarin houtvezel volledig wordt benut: specialty cellulose voor cellulose-ethers en -acetaat (BioMaterials), lignosulfonaten en biovanillin uit lignine (BioSolutions), en bio-ethanol plus farmaceutische intermediairen (Fine Chemicals). Het bedrijf is wereldmarktleider in lignine met ~35-40% volume-aandeel en behoort wereldwijd tot de top vier in specialty cellulose. Een 135-jaar oude installed base, propriëtaire procestechnologie en hechte klantrelaties met formuleerders zorgen voor een narrow-tot-wide moat met stabiele EBITDA-marges van 23-25%. Structurele drivers zijn de groene transitie (bio-based vervangers van fossiele chemie), specialiteitenmix en de US-lignine joint venture met Rayonier. De grootste risico's zijn de geleidelijke ROIC-druk door zware capex-cycli, Chinees aanbod in cellulose-ethers en het feit dat 2024-2025 vanaf record-EBITDA-niveaus wordt gemeten. De waardering is na een zware koersrally fors opgelopen.
- **Oordeel:** PASS
- **Fair value basis** (kansgewogen, NOK): 123
- **Fair value kansgewogen**: 123
- **EPV per aandeel** (zonder groeipremie): 103
- **Upside pct**: -30
- **Fair value scenarios**:

| Scenario | Fair value | Upside % | FCF groei % | WACC % | Kans % |
|---|---|---|---|---|---|
| Pessimistisch | 73 | -58 | 1,0 | 9,12 | 20 |
| Basis | 121 | -31 | 4,0 | 8,12 | 55 |
| Optimistisch | 166 | -6 | 7,0 | 7,62 | 25 |

- **Reverse-DCF impliciete groei pct**: 8,7
- **Grootste kans**: structurele groei lignin-derivaten via US-fabriek met Rayonier en aanhoudende vanillin-vraag uit voedingsindustrie.
- **Grootste risico**: cyclisch piekjaar 2025 verbergt verzwakte ROIC (~9% vs WACC 8%); markt prijst >8%/jaar FCF-groei in.

---

## 2. Bedrijfsprofiel

- **Beschrijving:** Borregaard ASA is een Noors specialty-chemicals bedrijf dat een geïntegreerde biorefinery exploiteert in Sarpsborg, Østfold. Het bedrijf zet houtvezel (vooral Noorse spar) om in een breed pakket van hoogwaardige producten: speciaalcellulose (raw material voor cellulose-ethers en -acetaat in farmaceutische, voedings- en bouwtoepassingen), lignosulfonaten en lignine-derivaten (dispergeermiddelen voor beton, mengvoer, agrochemie), biovanillin (de enige niet-fossiele, niet-petrochemische vanillin op industriële schaal), Exilva microfibrillated cellulose (rheologie-modificator voor coatings), tweede-generatie bio-ethanol, en fine chemicals waaronder farmaceutische intermediairen voor contrastmiddelen. De omzet wordt vooral gedreven door langdurige B2B-leveringscontracten met formuleerders en distributeurs; pricing wordt deels bepaald door gespecialiseerde formuleringen en deels door commodity-spreads (vooral in lignosulfonaten).
- **Geschiedenis:** Borregaard werd in 1889 opgericht in Sarpsborg en groeide in de 20e eeuw uit tot een geïntegreerde producent van pulp, papier en chemicaliën onder onder andere de paraplu van Orkla. Vanaf de jaren '90 heeft het bedrijf een radicale strategische transformatie ondergaan: weg van commodity-pulp, richting hoogwaardige specialiteiten op basis van dezelfde geïntegreerde houtfractionering. Onder de leiding van CEO Per A. Sørlie (in functie sinds 1999) werd het portfolio gerationaliseerd: niet-strategische assets verkocht, R&D geïnvesteerd in lignin-derivaten en speciale cellulose, en de vanillin-installatie internationaal gepositioneerd als enige niet-petrochemische capaciteit. In oktober 2012 werd Borregaard afgesplitst van Orkla en zelfstandig genoteerd op de Oslo Stock Exchange tegen een IPO-koers van NOK 21,50. De rit sindsdien is markant: marktwaarde groeide van NOK 2,1 mld bij IPO naar NOK 17-22 mld in 2024-2025. Belangrijke kapitaalinvesteringen waren het in 2016 geopende Exilva-MFC-plant (commerciële schaal), de joint venture met Rayonier voor US-lignine in Florida (operationeel sinds 2024), en de BC50-uitbreiding voor cellulose-ethers. In mei 2025 kondigde Borregaard de opvolging aan: Tom Erik Foss-Jacobsen (25 jaar bij Borregaard, 21 jaar leidinggevende rollen) volgde Sørlie per 1 augustus 2025 op. Q4 2025 werd belast met NOK 245 mln impairments op de bio-startup investeringen Alginor, Kaffe Bueno en Lignovations, wat de FY2025 nettowinst drukte tot NOK 620 mln (vs NOK 823 mln in 2024) terwijl de onderliggende EBITDA juist een nieuw all-time high bereikte van NOK 1.878 mln.
- **Bedrijfsmodel:** Borregaard verdient voornamelijk geld door houtfractioneringsproducten te verkopen aan industriële klanten in 100+ landen. Drie segmenten: (1) BioSolutions verkoopt lignosulfonaten/lignin-derivaten en biovanillin (~45% omzet, hoogste marges); (2) BioMaterials verkoopt specialty cellulose voor cellulose-ethers en acetaat (~40% omzet, meer cyclisch); (3) Fine Chemicals omvat bio-ethanol en farmaceutische intermediairen (~15% omzet). Omzet is overwegend B2B en deels onder meerjarige contracten; lignosulfonaten worden meer spot-georiënteerd verhandeld.
- **IPO-context:** IPO 18 oktober 2012 als afsplitsing van Orkla. Initiële koers NOK 21,50; geen schuldenlading verbonden aan de IPO (Orkla droeg een schone balans over). Geen pre-IPO leveraged recap; geen IPO-correctie nodig (IPO 14 jaar geleden, ruim buiten 10-jaarsregel).
- **Klantprofiel:** B2B, gefragmenteerd, geen klantconcentratie >10%. Klanten zijn formuleerders van betontoeslagstoffen, agrochemie, mengvoeders, farmaceutische cellulose-ethers, voedingsindustrie (vanillin) en coatings.
- **Oprichtingsjaar**: 1889
- **IPO-datum**: 2012-10-18
- **IPO-koers** (NOK): 21,50
- **Personeel** (FTE): ~1.250
- **Landen actief**: 100+
- **Klantconcentratie**: gefragmenteerd, geen klant >10% omzet (per AR 2024)

### Geografische spreiding (omzet)
| Regio | Omzet % | Valuta-exposure |
|---|---|---|
| Europa | ~52 | EUR/NOK |
| Amerika | ~28 | USD |
| Azië | ~17 | USD/lokaal |
| Overig | ~3 | mix |

**Toelichting geografie:** Productie is geconcentreerd in Sarpsborg (Noorwegen) plus lignine-installaties in Spanje, Zuid-Afrika, Brazilië en sinds 2024 Florida (JV met Rayonier). Omzetvaluta is overwegend USD en EUR; kosten zijn substantieel NOK (loon, energie, hout). Dit creëert een natuurlijk valuta-risico waarbij een sterkere NOK de marges drukt; in 2024-2025 hielp de zwakke NOK juist. Borregaard hedget via natuurlijke offsets (USD-financiering) en gerichte FX-derivaten, maar restexposure blijft materieel.

### Segmenten
| Naam | Omzet % | Beschrijving |
|---|---|---|
| BioSolutions | ~45 | Lignosulfonaten, lignin-derivaten en biovanillin uit lignine; toepassingen in beton, agrochemie, mengvoer en voedingsindustrie. |
| BioMaterials | ~40 | Specialty cellulose voor cellulose-ethers (bouw, farmacie) en acetaat (filtertow, textiel); inclusief Exilva microfibrillated cellulose. |
| Fine Chemicals | ~15 | Tweede-generatie bio-ethanol uit hexose, en fine chemical intermediairen voor contrastmiddelen en farmaceutische industrie. |

### Aandeelhouders (top 5)
| Naam | Belang % | Type |
|---|---|---|
| NNIP Advisors B.V. | 9,06 | Institutioneel |
| Folketrygdfondet | 7,95 | Institutioneel (NO statspensioen) |
| MUST INVEST AS | 7,13 | Institutioneel |
| Schroder Investment Management | 3,93 | Institutioneel |
| Nordea Funds | 3,93 | Institutioneel |

- **Institutioneel eigendomstrend**: Stabiel hoog institutioneel eigendom (top 20 = 51,1%). Geen controlerend aandeelhouder; free float effectief ~85%. Folketrygdfondet (Noorse staatspensioenfonds) is structurele lange-termijn-houder.

---

## 3. Financieel — historische data (10 jaar + TTM)

### Resultatenrekening (bedragen in mln NOK)

| Jaar | Omzet | Omzetgroei % | Brutowinst | Brutomarge % | EBIT | EBIT-marge % | EBITDA | EBITDA-marge % | Nettowinst | Nettomarge % | EPS | EPS-groei % | Aandelen mln |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2015 | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 2016 | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 2017 | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 2018 | — | — | — | — | — | — | 558 | — | — | — | — | — | — |
| 2019 | — | — | — | — | — | — | 697 | — | — | — | — | — | — |
| 2020 | — | — | — | — | — | — | 886 | — | — | — | — | — | — |
| 2021 | 5.805 | 9,0 | 3.653 | 62,9 | 952 | 16,4 | 1.431 | 24,6 | 692 | 11,9 | 6,94 | 58,8 | 99,7 |
| 2022 | 6.881 | 18,5 | 4.253 | 61,8 | 1.186 | 17,2 | 1.635 | 23,8 | 892 | 13,0 | 8,92 | 28,5 | 99,7 |
| 2023 | 7.132 | 3,6 | 4.587 | 64,3 | 1.291 | 18,1 | 1.781 | 25,0 | 870 | 12,2 | 8,71 | -2,4 | 99,7 |
| 2024 | 7.617 | 6,8 | 4.885 | 64,1 | 1.283 | 16,8 | 1.844 | 24,2 | 823 | 10,8 | 8,25 | -5,3 | 99,7 |
| 2025 | 7.713 | 1,3 | 5.054 | 65,5 | 1.287 | 16,7 | 1.878 | 24,3 | 620 | 8,0 | 6,22 | -24,6 | 99,7 |
| TTM | 7.713 | 1,3 | 5.054 | 65,5 | 1.287 | 16,7 | 1.878 | 24,3 | 620 | 8,0 | 6,23 | -24,6 | 99,7 |

- **Toelichting resultaten:** Borregaard heeft een stabiele EBITDA-marge in de 23-25%-range gehandhaafd door de jaren heen, ondanks substantiële omzetschommelingen rond grondstof- en lignosulfonaten-prijscycli. EBITDA verdrievoudigde tussen 2018 (NOK 558 mln) en 2025 (NOK 1.878 mln) door een combinatie van prijsverhogingen, betere productmix richting biovanillin/specialty cellulose, en USD-tegenwind die in NOK-rapportage gunstig was. De FY2025-nettowinstdaling tot NOK 620 mln (vs NOK 823 mln in 2024) is grotendeels niet-operationeel: NOK 245 mln aan impairments op bio-startup investments (Alginor, Kaffe Bueno, Lignovations) drukte het resultaat. Onderliggend was 2025 een record-jaar.
- **Omzet-CAGR**: 7,4% (2021-2025, 4 jaar)

### Kasstromen (bedragen in mln NOK)

| Jaar | CFO | Capex | FCF | FCF na SBC | FCF/aandeel | FCF-marge % | FCF-groei % | FCF-conversie % | SBC | Dividend totaal | Aandeleninkoop |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2021 | 1.431 | -556 | 875 | 845 | 8,78 | 15,1 | — | 126,4 | ~30 | 249 | 118 |
| 2022 | 735 | -464 | 271 | 241 | 2,71 | 3,9 | -69,0 | 30,4 | ~30 | 499 | 68 |
| 2023 | 1.563 | -667 | 896 | 866 | 8,97 | 12,6 | 230,6 | 103,0 | ~30 | 324 | 92 |
| 2024 | 1.068 | -711 | 357 | 327 | 3,58 | 4,7 | -60,2 | 43,4 | ~30 | 374 | 98 |
| 2025 | 1.356 | -793 | 563 | 533 | 5,65 | 7,3 | 57,7 | 90,8 | ~30 | 424 | 30 |

- **Toelichting kasstromen:** FCF is volatiel jaar-op-jaar, vooral door werkkapitaalschommelingen rond lignosulfonaten-voorraden en agrochemie-seizoenen. 2022 en 2024 toonden flinke werkkapitaalopbouw (-NOK 658 mln in 2022, -NOK 486 mln in 2024 wijziging in operationele activiteiten). Capex liep gestaag op van NOK 464 mln (2022) naar NOK 793 mln (2025) door investeringen in Florida-lignin-JV met Rayonier, BC50-uitbreiding en aanhoudend onderhoud. Capex/D&A ratio is structureel >1,3x — Borregaard zit in een groei-investeringscyclus, niet in een steady-state. FCF-conversie (FCF/nettowinst) varieerde van 30% (2022 piek-werkkapitaal) tot >100% (2021, 2023). Mid-cycle FCF schat ik op NOK 600-700 mln na SBC, fors onder het kortcyclische gemiddelde van 562 mln en EBITDA × historische FCF/EBITDA-conversie van 35%. SBC (stock-based compensation) wordt niet apart in jaarverslag uitgesplitst maar is geschat op ~NOK 30 mln/jr op basis van LTI-programma's voor management; dit is <1% van marktkapitalisatie en geen materieel verwateringsprobleem.

### Balans-ratio's

| Jaar | Nettoschuld | Nettoschuld/EBITDA | Eigen vermogen | ROE % | ROIC % | ROCE % | Current ratio | Solvabiliteit % | Goodwill % van EV | Working capital |
|---|---|---|---|---|---|---|---|---|---|---|
| 2022 | 1.838 | 1,12 | 4.394 | — | — | — | 1,46 | 54,1 | <1 | 916 |
| 2023 | 1.793 | 1,01 | 4.855 | 18,3 | 11,9 | 19,2 | 1,73 | 53,3 | <1 | 1.313 |
| 2024 | 2.241 | 1,22 | 5.041 | 16,6 | 10,9 | 17,1 | 1,62 | 52,6 | <1 | 1.152 |
| 2025 | 2.090 | 1,11 | 5.853 | 10,9 | 9,4 | 16,4 | 1,86 | 60,5 | <1 | 1.819 |

- **Toelichting balans:** De balans is conservatief gestructureerd: nettoschuld/EBITDA structureel onder 1,3x, current ratio rond 1,6-1,9x, solvabiliteit ~55%. Bruto schuld liep op tijdens de Florida-lignin-investering (van ~NOK 1,5 mld pre-2022 naar NOK 2,3 mld in 2024) maar nettoschuld bleef beheersbaar door cash generation. Goodwill is verwaarloosbaar (<1% van EV) — Borregaard heeft historisch geen grote acquisities gedaan en investeert organisch. Eigen vermogen groeide gestaag door ingehouden winsten ondanks payouts. ROIC is structureel marginaal: 9-12% over recente jaren, dicht bij of net boven de WACC van ~8%. Dat betekent dat Borregaard waarde creëert maar niet de uitzonderlijke spread van 5-15pp die je bij top-tier compounders ziet.

### Kapitaalstructuur huidig (per FY2025)
- **Nettoschuld**: 2.090 mln NOK
- **Bruto schuld**: 2.181 mln NOK
- **Cash & equivalents**: 91 mln NOK
- **Lease-verplichtingen (IFRS-16)**: niet apart geïdentificeerd; opgenomen in lange-termijn schuld
- **Gemiddelde rente %**: ~5,0% (geschat op basis van NOK-rentes en spread; niet exact uit AR genomen)
- **Rente-dekking (EBIT/rente)**: ~2,6x (EBIT 1.287 / netto rente ~486 mln); wel deels FX en lease — onderliggend hoger

### Non-GAAP / aanpassingen
- **Gebruikt?** Ja (Borregaard rapporteert "EBITDA1" excl. eenmalige posten)
- **Welke aanpassingen**: 2025 EBITDA¹ excl. NOK 245 mln impairments; 2022/2023 normalisaties van geringe omvang
- **Waarom**: vergelijkbaarheid met vorige jaren; impairments op bio-startup investments worden door management als niet-operationeel beschouwd

---

## 4. Moat (concurrentievoordeel)

- **Oordeel**: NARROW MOAT
- **Moat-categorieën**:

| Naam | Sterkte | Toelichting |
|---|---|---|
| Immateriële activa | middel | Propriëtaire procestechnologie voor lignine-fractionering, biovanillin-synthese (enige niet-petrochemische industriële producent) en Exilva-MFC. Geen patent-cliff zoals farma; concurrentievoordeel zit in tacit knowledge en jarenlange procesoptimalisatie. |
| Overstapkosten | middel | Klanten hebben Borregaard-grade cellulose en lignosulfonaten gevalideerd in hun formuleringen; herkwalificatie kost tijd en geld vooral bij farmaceutische cellulose-ethers en voedings-vanillin. Niet absoluut maar wel materieel. |
| Netwerkeffecten | geen | Geen netwerkeffecten — B2B specialty chemicals. |
| Kostenvoordeel | middel | Geïntegreerde biorefinery in Sarpsborg benut ~95% van de houtgrondstof (cellulose, lignine, suikers) — concurrenten als losse pulp- of lignine-spelers hebben fundamenteel hogere unit-kosten. Deze geïntegreerde positie is moeilijk te repliceren. |
| Efficiënte schaal | middel | Markt voor specialty lignine en biovanillin is beperkt: Borregaard ~35-40% van de wereldwijde lignine-markt, top-4 in specialty cellulose. Een tweede equivalente biorefinery zou onrendabel zijn vanwege schaal-overlap. |

- **Kwantitatief bewijs:** ROIC 9-12% (2022-2024) ligt boven WACC ~8% maar de spread is klein (1-4pp). EBITDA-marge stabiel 23-25% door cycli heen. Marktaandeel lignine wereldwijd ~35-40% volume — dominante positie. Specialty cellulose top-4 (Borregaard, Bracell, RYAM, GP Cellulose) goed voor ~65% sales.
- **Duurzaamheid**: 10 jaar (NARROW). Het kostenvoordeel uit de geïntegreerde biorefinery is structureel, maar de marge-spread is niet groot genoeg om Wide-moat-classificatie te rechtvaardigen. Op horizon van 10+ jaar zijn er reële erosierisico's.
- **Erosierisico's:** (1) Chinese specialty-cellulose capaciteitsuitbreiding drukt prijzen voor MCC/CMC-grades; (2) lignine-substituenten uit alternatieve bronnen (zwarte loog uit kraft-pulpmills) zijn een latente concurrent; (3) vanillin-synthese door biotech (geprecisioneerde fermentatie) kan op 10-jaarstermijn de niet-petrochemische niche aanvallen; (4) EU- en NO-regulering rond bos-grondstoffen kan grondstof-toegang beperken.

---

## 5. Management

- **CEO-naam + tenure**: Tom Erik Foss-Jacobsen, sinds 2025-08-01 (8 maanden); 25 jaar bij Borregaard (21 in leidinggevende rollen). Voorganger Per A. Sørlie was 26 jaar CEO (1999-2025).
- **CFO-naam + tenure**: Per Bjarne Lyngstad (CFO; in functie sinds ~2017, geverifieerd via investor relations pagina, exacte begindatum niet exact gevalideerd).
- **Oprichter nog betrokken?**: N.v.t. — bedrijf is 135 jaar oud.
- **Insider ownership %**: <1% op CEO-niveau (Foss-Jacobsen heeft 30.000 nieuwe opties in 2025 toegekend gekregen — nog gering); historisch is management-aandeelhouderschap in NO bedrijven beperkt.
- **Capital allocation track record**:

| Jaar | Dividend totaal | Aandeleninkoop | M&A uitgaven | Organische capex |
|---|---|---|---|---|
| 2021 | 249 | 118 | klein | 556 |
| 2022 | 499 | 68 | klein | 464 |
| 2023 | 324 | 92 | klein | 667 |
| 2024 | 374 | 98 | klein | 711 |
| 2025 | 424 | 30 | klein (bio-startup beleggingen werden afgewaardeerd) | 793 |

- **M&A-track-record**: Borregaard heeft historisch weinig grote acquisities gedaan; de Joint Venture met Rayonier (Florida lignin) opende in 2024 — nog te vroeg om te beoordelen. Investeringen in bio-startups Alginor, Kaffe Bueno en Lignovations zijn in 2025 grotendeels afgewaardeerd (NOK 245 mln impairment) — een rode vlag voor capital allocation in deze bucket. Hoofd-business blijft gefinancierd uit eigen kasstroom.
- **Beloning**: LTI-programma met opties (recent 30.000 opties bij CEO-aanstelling Foss-Jacobsen tegen marktkoers). Bonusstructuur gekoppeld aan EBITDA, ROCE en lange-termijn doelstellingen. Vast/variabel-mix: ~50/50 voor CEO. Geen excessieve verwatering: SBC <1% van marktkap/jaar.
- **Oordeel management**: STERK
- **Toelichting**: Sørlie's 26-jarige CEO-periode leverde een succesvolle strategische transformatie van commodity-pulp naar specialty-biorefinery. EBITDA verdrievoudigde sinds 2018, dividend stijgt al jaren stabiel (van NOK 3,50 in 2020 naar voorgestelde NOK 4,75 voor 2025), en de balans is conservatief gehouden. De 2025-impairment op bio-startup investments (NOK 245 mln) is een smetje maar relatief beperkt vs cumulatief gegenereerde EBITDA. Foss-Jacobsen brengt continuïteit vanuit zijn 25-jarige interne carrière, geen disruptieve strategiebreuk verwacht. Insider alignment is beperkt qua eigenbelang maar de track record en transparantie naar aandeelhouders is sterk; de historie steunt het oordeel STERK.

---

## 6. Sector & concurrentie

- **Sector-groeivooruitzicht**: Specialty cellulose markt wereldwijd ~3-4%/jaar (sectorrapporten Markets&Markets, Research & Markets); lignine-markt 5-7%/jaar (drijvers: bio-based vervanging fossiele dispergeermiddelen); biovanillin 4-6%/jaar (premium-segment in F&B). Gewogen gemiddelde Borregaard-portfolio: ~4-5%/jaar marktgroei.
- **Porter five forces**:
  - Rivaliteit: middel — specialty cellulose top-4 (Borregaard, Bracell, RYAM, GP Cellulose) heeft 65% share; lignine sterk geconsolideerd (Borregaard #1, Domsjö-Aditya Birla #2); concurrentie op grade en kwaliteit, niet purely op prijs.
  - Nieuwe toetreders: laag — kapitaalintensieve geïntegreerde biorefineries kosten miljarden NOK om op te bouwen; regulatoire goedkeuringen voor farmaceutische cellulose duren jaren.
  - Substituten: middel — petrochemische dispergeermiddelen (cement), synthetische vanillin uit guajacol, plant-based vervangers — alle reëel maar met regelgeving die richting bio-based duwt.
  - Macht leveranciers: laag — Noorse spar uit bosbouw is gediversifieerd; Borregaard heeft langdurige contracten en geografische nabijheid.
  - Macht afnemers: middel — formuleerders zijn middelgroot tot groot maar kunnen niet trivially overstappen; geen monopsonie.
- **Concurrenten**:

| Concurrent | Marktaandeel % |
|---|---|
| Aditya Birla (Domsjö Fabriker) | ~25 (lignine) |
| Rayonier Advanced Materials (RYAM) | ~18 (specialty cellulose) |
| Bracell | ~15 (specialty cellulose) |
| GP Cellulose (Georgia-Pacific) | ~12 (specialty cellulose) |
| Sappi / Nippon / Stora Enso | ~10 gezamenlijk |

- **Positie van het bedrijf**: Wereldmarktleider in lignine (35-40% volume). Top-4 in specialty cellulose (~12-15% volume). Enige industriële niet-petrochemische biovanillin-producent. Premium-positionering in alle segmenten.

### TAM/SAM/SOM
- **TAM (mln NOK)**: ~80.000 (specialty cellulose + lignosulfonaten + biovanillin wereldwijd, op basis van industrierapporten)
- **TAM-groei %**: 4-5
- **SAM (mln NOK)**: ~25.000 (biorefinery-georiënteerde nichemarkten waar Borregaard concurreert)
- **SAM-groei %**: 5-6
- **Huidige penetratie %** (Borregaard omzet / SAM): ~31
- **Impliciete penetratie na horizon %**: bij 4% groei over 10 jaar → vergelijkbaar (markt groeit mee)
- **Groei plausibel?**: ja — geen onrealistische marktaandeel-aanname.
- **Bron TAM/SAM**: branchemix uit Borregaard IR-presentaties + Markets&Markets/ResearchAndMarkets industrierapporten 2024. Niet 1-op-1 te verifiëren met één URL — geschat op basis van publieke sectoroverzichten.
- **Toelichting**: Bij 4% volume-groei en stabiele prijzen is een omzet-CAGR van ~4-5%/jaar plausibel zonder dat Borregaard substantieel marktaandeel hoeft te winnen. Een hogere groei (>7%) vereist mix-shift naar hoger-marge biovanillin en succesvolle US-lignine-uitbreiding.

---

## 7. Analyse-frameworks (9 frameworks, scores 0-5)

### Graham
- **Oordeel**: VOLDOET NIET
- **Graham number**: NOK 64 (= √(22,5 × 6,22 × 58,7))
- **Margin of safety %** (t.o.v. huidige koers): -64
- **Toelichting**: Met P/E 27,2 en P/B 2,9 voldoet Borregaard niet aan Grahams defensieve criteria (P/E ≤15, P/B ≤1,5, Graham number ≥ koers). De Graham number ligt ruim onder de huidige koers van NOK 176, wat impliceert dat een conservatieve waardebelegger geen veiligheidsmarge ziet. Het bedrijf is te volwassen en te hooggewaardeerd om vanuit klassieke deep-value-lens aantrekkelijk te zijn.
- **Score (0-5)**: 1

### Buffett / Munger
- **Oordeel**: GEDEELTELIJK
- **ROIC structureel boven WACC?**: ja, marginaal (spread 1-4pp)
- **Toelichting**: Borregaard heeft veel Buffett-eigenschappen: begrijpelijk bedrijf (specialty chemicals uit hout), voorspelbare kasstromen door langdurige B2B-contracten, narrow moat door propriëtaire procestechnologie en geïntegreerde biorefinery. Maar de ROIC-WACC spread is met 1-4pp te beperkt voor de Buffett-droom van >10pp; de prijs P/FCF 29,5 is bovendien fors. Het is een "fair company at a high price" eerder dan "wonderful at a fair price". Charlie Munger zou de impairment op bio-startup investeringen niet sympathiek vinden.
- **Score (0-5)**: 2

### Peter Lynch
- **Categorie**: Stalwart
- **Oordeel**: ONINTERESSANT
- **PEG-ratio**: 6,8 (P/E 27,2 / 4% verwachte groei)
- **Toelichting**: Borregaard is een klassieke Stalwart — gevestigd, voorspelbare middelgrote groei, defensief in cyclische sector. Het verhaal is helder en uit te leggen: hout → cellulose, lignine, vanillin, en cellulose-derivaten. Maar de waardering is ver vooruitgelopen op de groei: PEG van bijna 7 (bij 4% verwachte groei) is verre van Lynch's voorkeur (<1). Zelfs bij optimistische 8%-groei is de PEG nog 3,4 — onaantrekkelijk.
- **Score (0-5)**: 1

### Phil Fisher
- **Oordeel**: STERK
- **Toelichting**: Borregaard scoort goed op Fisher's kwalitatieve criteria. Producten met groeipotentieel: biovanillin en bio-based dispergeermiddelen profiteren van duurzame trends. R&D-cultuur is sterk: Exilva, BC50, en doorlopende lignin-derivaten ontwikkeling. Margebescherming door propriëtaire procestechnologie en geïntegreerde biorefinery. Management-integriteit is hoog: 26 jaar consistente strategie onder Sørlie, transparante rapportage. Vanuit Fisher's "scuttlebutt"-lens is dit een kwaliteitsbedrijf, ook al is de prijs op dit moment niet gunstig.
- **Score (0-5)**: 4

### Magic Formula (Greenblatt)
- **Oordeel**: GEMIDDELD
- **Earnings yield %**: 6,6
- **Return on capital %**: 17,1
- **Toelichting**: Earnings yield (EBIT/EV = 1.287/19.641) van 6,6% is redelijk maar niet uitzonderlijk — Greenblatt zoekt typisch >10% voor topscores. Return on capital (EBIT / (NWC + Net Fixed Assets) = 1.287 / 7.519) van 17,1% is solide maar ver onder Greenblatt's voorkeur van >50% voor capital-light businesses. Borregaard is per definitie capital-intensive met een geïntegreerde biorefinery, dus deze score is structureel beperkt.
- **Score (0-5)**: 2

### Moat
- **Score (0-5)**: 2 — NARROW moat (kostenvoordeel + immateriële activa) maar ROIC-WACC spread van slechts ~1pp valt onder de drempel van >5pp die de rubric vereist voor score 3.

### Management
- **Score (0-5)**: 4 — STERKE 26-jarige track record onder Sørlie, soepele opvolging, prudent capital allocation in hoofd-business. Bio-startup impairment is smetje. Insider alignment <1% is beperkt voor score 5.

### Fair Value DCF
- **Score (0-5)**: 1 — fair value basis NOK 121 vs koers NOK 176 = downside -31% (>15%)

### Fair Value IPO-gecorr.
- **Score (0-5)**: 1 — IPO 2012 (14 jaar geleden), regel: gelijk aan Fair Value DCF score.

### Scorekaart totaal
- **Totaalscore**: 18
- **Max**: 45
- **Eindoordeel**: PASS (totaal 18 < 24, dus PASS volgens rubric)
- **Samenvatting**: Borregaard is een kwaliteitsbedrijf met sterke moat-elementen en een uitstekend management-team, maar de huidige waardering laat te weinig veiligheidsmarge over voor een waardebelegger. P/E van 27 (reported) of ~22 (onderliggend), P/FCF van 29,5 en een DCF die fair value NOK 121 oplevert vs koers NOK 176 betekent dat de markt structurele FCF-groei van ~9% per jaar inprijst — dubbel zo hoog als plausibel mid-cycle. ROIC van 9% ligt slechts marginaal boven WACC van 8%. PASS, met heroverweging vanaf NOK 90-100 (onder zowel basis-DCF en EPV).

---

## 8. Risico's

| # | Omschrijving | Kans | Impact | DCF-aanname geraakt | Toelichting |
|---|---|---|---|---|---|
| 1 | Cyclische correctie in lignosulfonaten/specialty cellulose | MIDDEN | GROOT | EBITDA-marge, FCF | Borregaard rapporteert in 2024-2025 record-EBITDA. Specialty-chemicals-cycli bewegen typisch 3-4 jaar; Q4 2025 toonde al lagere BioSolutions/Fine Chemicals; Chinees aanbod in cellulose-ethers drukt al prijzen. Een correctie van 15-20% in EBITDA over 2-3 jaar zou de DCF substantieel verlagen. |
| 2 | ROIC-druk door capex-cyclus | HOOG | MIDDEL | Reinvestment rate, FCF | Capex steeg van NOK 464 mln (2022) naar NOK 793 mln (2025). De Florida-lignin-JV moet zich nog bewijzen. Als de groei-investeringen onder verwachting renderen, zakt ROIC verder onder WACC en wordt waarde vernietigd. |
| 3 | NOK-appreciatie | MIDDEN | GROOT | Omzet, EBIT-marge | Sterkere NOK vs USD/EUR drukt de gerapporteerde EBITDA materieel; in 2024-2025 hielp de zwakke NOK juist. NOK is op meerjaars-laag; mean-reversion kan 5-10% EBITDA kosten. |
| 4 | Pre-IPO financial engineering | LAAG | KLEIN | n.v.t. | Niet geconstateerd — IPO 2012 was schone afsplitsing van Orkla, geen pre-IPO leverage of dividend-recap. Geen IPO-correctie nodig. |
| 5 | Regulatoir risico bos-grondstoffen | LAAG | MIDDEL | Variabele kosten | EU- en NO-regulering rond bos-aanvoer (LULUCF, RED III) kan houtbeschikbaarheid en kosten beïnvloeden. Beheersbaar maar materieel op lange termijn. |
| 6 | Bio-startup-portfolio verdere afwaarderingen | MIDDEN | KLEIN | Eenmalige posten | Na NOK 245 mln impairment in Q4 2025 op Alginor/Kaffe Bueno/Lignovations zijn nog kleinere belangen open. Aanvullende impairments mogelijk. Niet kasstroom-relevant maar GAAP-winst. |
| 7 | Concurrentie biotechnologische vanillin (precision fermentation) | MIDDEN | GROOT | Lange termijn marge BioSolutions | Op 5-10-jarige horizon kunnen biotech-startups (bv. Conagen, Evolva) niet-petrochemische vanillin produceren tegen lagere kosten. Bedreigt het hoogste-marge segment van Borregaard. |
| 8 | Liquiditeit / aandeelaanbod | LAAG | KLEIN | n.v.t. | Gemiddeld dagvolume ~92.000 — beperkte liquiditeit voor institutionele beleggers maar ruim voldoende voor particulieren. Geen materieel issue. |

---

## 9. These invalide bij

Deze PASS-these is weerlegd wanneer (a) Borregaard structureel boven mid-cycle FCF NOK 800 mln/jaar uitkomt door succesvolle Florida-lignin-ramp én vanillin-prijsstijgingen, of (b) ROIC structureel boven 13% komt (>5pp boven WACC), of (c) de koers daalt onder NOK 100-110 waarop de DCF-basis en EPV-niveaus elkaar raken en margin-of-safety ontstaat. Een aanzienlijke daling van de NOK 10y-rente (terug naar 2-3%) zou de WACC verlagen en daarmee de fair value verhogen — dit is de meest invloedrijke macrovariabele.

---

## 10. ESG

| Factor | SASB-categorie | Risiconiveau | Financiële impact | DCF-impact |
|---|---|---|---|---|
| Bos-grondstoffen / sustainable forestry | Materials Sourcing | LAAG | Borregaard gebruikt FSC/PEFC-gecertificeerd hout; sterke positie in EU-Taxonomy en RED III | klein positief |
| CO2-emissies productie | Greenhouse Gas Emissions | MIDDEL | Sarpsborg-installatie heeft hoog energiegebruik; deels gecompenseerd door bio-based output | middel — koolstoftaks NO |
| Watergebruik | Water Management | MIDDEL | Pulping is water-intensief; Sarpsborg heeft afvoer-vergunningen onder druk | klein |
| Productveiligheid (vanillin / fine chem) | Product Quality & Safety | LAAG | FDA/EU-regelgeving farmaceutische cellulose; sterke compliance | klein |
| Werkomstandigheden / safety | Employee Health & Safety | LAAG | Lage incident rate; chemische sector standaarden | klein |

- **Eindoordeel ESG**: LAAG RISICO
- **Toelichting**: Borregaard's biorefinery-business model is structureel gunstig vanuit ESG-perspectief: bio-based vervangers van petrochemische producten, FSC-gecertificeerde grondstof, hoge resource-efficiëntie (~95% benutting hout). Belangrijkste materiële factor is CO2 uit het Sarpsborg-productieproces — beheersbaar en gedeeltelijk compensable via Noorse staatsregelingen. Geen materiële controverses, sterke transparantie in sustainability rapportage.

---

## 11. Katalysatoren

| Datum ca. | Omschrijving | Richting | Impact |
|---|---|---|---|
| 2026-04-29 | Q1 2026 resultaten + AGM (eerste rapportage onder nieuwe CEO Foss-Jacobsen) | NEUTRAAL | MIDDEL |
| 2026-07 | Q2 2026 resultaten — eerste vergelijking met 2025-piek | NEGATIEF | MIDDEL |
| 2026-H2 | Florida-lignin-JV met Rayonier: capaciteit-ramp en pricing | POSITIEF | GROOT |
| 2026-H2 | Vanillin pricing in Europa: capaciteit Europese concurrenten | BINAIR | MIDDEL |
| 2027 | Eventuele bio-startup-impairment ronde 2 of strategie-update | NEGATIEF | KLEIN |
| 2026-2027 | NOK 10y-rente trajectorie — relevant voor WACC en fair value | BINAIR | GROOT |
| 2026-04-17 | Ex-dividend datum NOK 4,75 (al gepasseerd) | NEUTRAAL | KLEIN |
| 2027-Q1 | FY2026 resultaten + dividend-besluit 2026 | NEUTRAAL | MIDDEL |

---

## 12. Fair value — kwantitatief (DCF)

### WACC-componenten
- **Risicovrije rente %**: 4,40
- **Bron risicovrije rente**: Norway 10-year government bond yield, 10-04-2026 (Trading Economics, FRED IRLTLT01NOM156N)
- **Type**: spot
- **ERP %**: 5,0
- **Bron ERP**: Damodaran developed Europe equity risk premium (geschat) — april 2026
- **Beta (adjusted, Blume)**: 0,85
- **Bron beta**: bottom-up specialty chemicals sector beta (Damodaran sector data) — relevered naar Borregaard's kapitaalstructuur
- **Type beta**: bottom_up (gevolg van beperkte liquiditeit dagvolume ~92k en sector-vergelijkbaarheid)
- **Country risk premium %**: 0 (Noorwegen is mature market, geen CRP nodig)
- **Size premium %**: 0 (marktkap NOK 17,5 mld ~ EUR 1,5 mld — geen small-cap meer)
- **Cost of equity %**: 8,65
- **Schuldkosten na belasting %**: 3,83 (5,0% pre-tax × (1-0,235))
- **E/V gewicht %**: 88,9
- **D/V gewicht %**: 11,1
- **WACC %**: 8,12
- **Sector WACC %**: 7,5-8,5 (Damodaran specialty chemicals)
- **Illiquiditeitskorting %**: niet toegepast (volume voldoende voor de aandeelmaat)

### DCF model-specs
- **Model type**: 2-fase (5 jaar fase 1 + 5 jaar fase 2 + Gordon terminal)
- **FCF-definitie**: FCFF (Free Cash Flow to Firm)
- **Basis FCF (mln NOK)**: 700
- **Basis FCF na SBC**: 700 (na ~30 mln SBC, want SBC al deels in OCF)
- **FCF-type**: Genormaliseerde mid-cycle FCF — gebaseerd op gemiddelde OCF 2021-2025 (1.230 mln) minus maintenance capex (~530 mln, gem D&A) ≈ 700 mln
- **Groei fase 1 % (basis)**: 4,0
- **Groei fase 2 % (basis)**: 2,5
- **Terminal groei %**: 2,5
- **Terminal methode**: Gordon growth (cross-check via exit multiple uitgevoerd)
- **Exit multiple gebruikt**: 10x EV/EBITDA (sector-mediaan)
- **Bron exit multiple**: peer-groep specialty chemicals + Borregaard 10-jaars gemiddelde
- **Terminal value Gordon growth (basis)**: ~6.150 mln NOK present value
- **Terminal value exit multiple (basis)**: ~5.700 mln NOK present value (10x EBITDA jaar-10)
- **Terminal value % van totaal**: 56% (basis) — onder 75%-grens, geloofwaardig
- **Terminal implied EV/EBITDA**: 9,4x (impliciet uit Gordon groei, in lijn met sectormediaan 10x)
- **Terminal groei consistentie**: 2,5% past bij langetermijn nominale BBP-groei NO/Eurozone (2,0-2,5%); vereist herinvestering ~25% bij ROIC 10% — plausibel voor volwassen industrieel.
- **Mid-year convention**: true
- **Aandelen uitstaand (mln)**: 99,72
- **Nettoschuld huidig (mln NOK)**: 2.090

### DCF-toelichting

De DCF gebruikt FCFF gediscounteerd tegen WACC, met de mid-year convention. Basis-FCF van NOK 700 mln is een normalisering: het 5-jaars gemiddelde 2021-2025 was NOK 562 mln (na SBC 533) maar dat wordt vertekend door zware werkkapitaal-druk in 2022 en 2024 én groei-capex die niet maintenance is. Onderliggend OCF 5-jaars-gemiddelde is NOK 1.230 mln; minus maintenance capex (~D&A NOK 530 mln) geeft NOK 700 mln. In het basisscenario groeit FCF 4% per jaar in fase 1 (in lijn met markt-CAGR + lichte mix-shift) en 2,5% in fase 2; terminal 2,5% (aansluitend bij langetermijn nominale BBP-groei). Terminal value is 56% van totaal — gezond. WACC 8,12% is opgebouwd uit NOK 10y rf 4,40%, ERP 5,0%, beta 0,85, geen size of country premium. Nettoschuld NOK 2.090 mln wordt op het einde afgetrokken om equity value te krijgen, gedeeld door 99,72 mln aandelen. Een sanity check tegen de impliciete terminal EV/EBITDA (9,4x) geeft consistentie met sector-mediaan ~10x.

### 5-jaars projectie (basis-scenario, mln NOK)

| Jaar | Omzet | Omzetgroei % | EBIT | EBIT-marge % | NOPAT | Capex | ΔNWC | SBC | FCF |
|---|---|---|---|---|---|---|---|---|---|
| 2026 | 8.022 | 4,0 | 1.364 | 17,0 | 1.043 | 682 | -50 | 30 | 728 |
| 2027 | 8.342 | 4,0 | 1.418 | 17,0 | 1.085 | 709 | -50 | 30 | 757 |
| 2028 | 8.676 | 4,0 | 1.475 | 17,0 | 1.128 | 737 | -50 | 30 | 787 |
| 2029 | 9.023 | 4,0 | 1.534 | 17,0 | 1.173 | 767 | -50 | 30 | 819 |
| 2030 | 9.384 | 4,0 | 1.595 | 17,0 | 1.220 | 798 | -50 | 30 | 852 |

### Scenarios

| Scenario | FCF-groei % | WACC % | Fair value | Upside % | Kans % |
|---|---|---|---|---|---|
| Pessimistisch | 1,0 | 9,12 | 73 | -58 | 20 |
| Basis | 4,0 | 8,12 | 121 | -31 | 55 |
| Optimistisch | 7,0 | 7,62 | 166 | -6 | 25 |

- **Kansgewogen fair value**: 123 NOK

### Reverse DCF
- **Impliciete groei %**: 8,7 (fase 1) — wat de huidige koers NOK 176 inprijst
- **Historische FCF CAGR %**: niet stabiel; FCF 2021-2025 fluctueerde met -10,5% punt-tot-punt CAGR (875→563)
- **Consensus groei % (analisten)**: niet expliciet; consensus rating BUY met gemiddelde target NOK 200-208, range 175-240 — impliceert ~14-18% upside vs koers maar geen specifieke FCF-groeiconsensus
- **Interpretatie**: De markt prijst ~9% jaarlijkse FCF-groei in over de komende 5 jaar. Dit is dubbel zo hoog als de plausibele mid-cycle groei (4-5%) op basis van markt-CAGR en mix-shift. Slechts in een aanhoudend optimistisch scenario (Florida-ramp succesvol én vanillin-marges blijven hoog én NOK blijft zwak) wordt deze groei realiseerbaar. De huidige waardering laat dus weinig veiligheidsmarge en is kwetsbaar voor mean-reversion in de lignosulfonaten- of cellulose-cyclus.

### EPV (Bruce Greenwald)
- **Genormaliseerde EBIT-marge %**: 17,05 (gemiddelde 2021-2025)
- **Genormaliseerde NOPAT (mln NOK)**: 1.006 (= 17,05% × 7.713 × (1-0,235))
- **Maintenance capex (mln NOK)**: 540 (~5j-gem D&A)
- **Adjusted earnings power (mln NOK)**: 1.006 (NOPAT, met aanname maintenance ≈ D&A)
- **EPV per aandeel (NOK)**: 103
- **Groeipremie %**: 17 (DCF basis 121 / EPV 103 = +17%)

### Andere methoden
- **DDM uitgevoerd?**: false (Borregaard is dividendbetaler maar de DCF is leidend; payout-ratio FCF 2025 = 75%, geen progressief beleid in formele zin)
- **SOTP uitgevoerd?**: false (drie verbonden segmenten in één biorefinery; geen zinvolle splitsing mogelijk)

### Synthese fair value
- **Bandbreedte laag**: 73 (pessimistisch DCF)
- **Bandbreedte centraal**: 112 (gemiddelde DCF basis 121 en EPV 103)
- **Bandbreedte hoog**: 166 (optimistisch DCF)
- **Methode-gewichten**: DCF 60%, EPV 30%, Multiples 10%
- **Margin of safety vereist %**: 20 (mid-cap, narrow moat, marginale ROIC-WACC spread)
- **Koopniveau**: 90 (= 112 × (1-0,20))
- **Synthese-toelichting**: De DCF (NOK 121) en EPV (NOK 103) convergeren rond NOK 110-120, fors onder de huidige koers van NOK 176. Het verschil van 17% tussen DCF en EPV vertegenwoordigt de impliciete groeipremie. Bij een margin of safety van 20% — gerechtvaardigd door de cyclische gevoeligheid en marginale ROIC-WACC spread — komt het comfortabele koopniveau uit op ~NOK 90. Dat is consistent met de pessimistische scenario-uitkomst en biedt ruimte om in te stappen bij een cyclische correctie zonder afhankelijk te zijn van een optimistisch groeiverhaal.

### Gevoeligheid (DCF-fair value, NOK)

WACC range: 7,0% / 7,5% / 8,0% / 8,5% / 9,0% / 9,5%
Groei range: 1% / 3% / 5% / 7% / 9%

| g \\ WACC | 7,0% | 7,5% | 8,0% | 8,5% | 9,0% | 9,5% |
|---|---|---|---|---|---|---|
| 1% | 124 | 110 | 99 | 89 | 81 | 74 |
| 3% | 146 | 129 | 116 | 105 | 96 | 88 |
| 5% | 171 | 152 | 136 | 123 | 112 | 102 |
| 7% | 199 | 177 | 159 | 143 | 131 | 119 |
| 9% | 232 | 206 | 184 | 167 | 152 | 139 |

De huidige koers van NOK 176 wordt pas gerechtvaardigd bij een combinatie van WACC ≤7,5% én FCF-groei ≥7%, of WACC 7% met groei ~5%. Dit zijn optimistische combinaties waarvan ten minste één onwaarschijnlijk is in de huidige rente-omgeving.

---

## 13. Databronnen

### Bronnen-hiërarchie
- **Jaarverslag PDF / IR-pagina** → HOOG
- **Beursmelding / persbericht** → HOOG
- **Aggregator** (StockAnalysis / MarketScreener / Yahoo) → AGGREGATOR

### Financiële bronnen (10 jaar historie)

| Jaar | Bron | URL | Betrouwbaarheid |
|---|---|---|---|
| 2015 | — | — | — |
| 2016 | Borregaard Annual Report 2016 (alleen dividend uit zoekresultaat) | https://www.borregaard.com/hubfs/Media/InvestorFiles/GeneralMeeting2017/borregaard-annual-report-2016-final-2903-medres.pdf | AGGREGATOR (alleen dividend-snippet) |
| 2017 | — | — | — |
| 2018 | EBITDA-snippet uit zoekresultaat (jaarverslag-archief) | https://www.borregaard.com/investors/reports-presentations/annual-reports/ | AGGREGATOR |
| 2019 | EBITDA-snippet uit zoekresultaat (jaarverslag-archief) | https://www.borregaard.com/investors/reports-presentations/annual-reports/ | AGGREGATOR |
| 2020 | EBITDA-snippet uit zoekresultaat (jaarverslag-archief) | https://www.borregaard.com/investors/reports-presentations/annual-reports/ | AGGREGATOR |
| 2021 | Borregaard Annual Report 2021 + StockAnalysis (samenvatting + detail) | https://ml-eu.globenewswire.com/Resource/Download/d29c052b-ec61-4215-ba8e-02c358787d74 | HOOG (samenvatting), AGGREGATOR (detail) |
| 2022 | Borregaard Annual Report 2022 + StockAnalysis | https://www.borregaard.com/hubfs/Media/InvestorFiles/GeneralMeeting2023/annual-report-2022.pdf | HOOG |
| 2023 | Borregaard Annual Report 2023 + StockAnalysis | https://www.borregaard.com/media/ac1fn2he/borregaard-annual-report-2023.pdf | HOOG |
| 2024 | Borregaard Annual Report 2024 + Q4 2024 release | https://www.globenewswire.com/news-release/2025/03/20/3045979/0/en/Borregaard-ASA-Annual-Report-2024.html | HOOG |
| 2025 | Borregaard Annual Report 2025 + Q4 2025 release | https://www.globenewswire.com/news-release/2026/03/26/3262747/0/en/Borregaard-ASA-Annual-Report-2025.html | HOOG |

**Belangrijke opmerking:** de "harde eis" uit de template (alle 5 recente jaren HOOG) is voor 2021-2025 grotendeels gehaald qua samenvattingscijfers (omzet, EBITDA, EPS, dividend) maar de detail-balans/kasstroom 2021-2022 leunt op StockAnalysis-aggregator. Voor 2018-2020 is alleen EBITDA verifieerbaar.

### Jaarverslagen geraadpleegd

| Jaar | Bron | URL |
|---|---|---|
| 2025 | Borregaard ASA Annual Report 2025 | https://www.globenewswire.com/news-release/2026/03/26/3262747/0/en/Borregaard-ASA-Annual-Report-2025.html |
| 2024 | Borregaard ASA Annual Report 2024 | https://www.globenewswire.com/news-release/2025/03/20/3045979/0/en/Borregaard-ASA-Annual-Report-2024.html |
| 2023 | Borregaard - Annual Report 2023 (PDF) | https://www.borregaard.com/media/ac1fn2he/borregaard-annual-report-2023.pdf |
| 2022 | Borregaard 2022 Annual Report (PDF) | https://www.borregaard.com/hubfs/Media/InvestorFiles/GeneralMeeting2023/annual-report-2022.pdf |
| 2021 | Borregaard 2021 Annual Report (PDF) | https://ml-eu.globenewswire.com/Resource/Download/d29c052b-ec61-4215-ba8e-02c358787d74 |

### Beursmeldingen geraadpleegd

| Datum | Omschrijving | URL |
|---|---|---|
| 2026-04-22 | Invitation to Q1 2026 announcement | https://www.globenewswire.com/news-release/2026/04/22/3278654/0/en/Borregaard-ASA-Invitation-to-Q1-2026-announcement.html |
| 2026-02-04 | EBITDA NOK 405 mln Q4 2025 | https://www.globenewswire.com/news-release/2026/02/04/3231743/0/en/Borregaard-ASA-EBITDA1-of-NOK-405-million-in-the-4th-quarter-2025.html |
| 2026-02-04 | Dividendvoorstel NOK 4,75 voor 2025 | https://www.globenewswire.com/news-release/2026/02/04/3231744/0/en/Borregaard-ASA-The-Board-of-Directors-dividend-proposal-to-Borregaard-s-Annual-General-Meeting.html |
| 2025-05-23 | Tom Erik Foss-Jacobsen appointed CEO | https://www.globenewswire.com/news-release/2025/05/23/3087308/0/en/Borregaard-ASA-Tom-Erik-Foss-Jacobsen-appointed-CEO-of-Borregaard.html |
| 2025-02-12 | Insider transactions Foss-Jacobsen (20.000 opties) | https://www.globenewswire.com/news-release/2025/02/12/3025201/0/en/Borregaard-ASA-Reporting-of-transactions-in-Borregaard-ASA-s-shares-made-by-person-discharging-managerial-responsibilities.html |
| 2025-01-29 | EBITDA NOK 398 mln Q4 2024 | https://www.globenewswire.com/news-release/2025/01/29/3016894/0/en/Borregaard-ASA-EBITDA1-of-NOK-398-million-in-the-4th-quarter.html |

### IPO-prospectus
- **Geraadpleegd?**: false
- **URL**: n.v.t.
- **Pre-IPO data beschikbaar?**: false (IPO 2012, > 10 jaar geleden — geen IPO-correctie nodig per regel)
- **Pre-IPO bron**: n.v.t.

### Non-GAAP
- **Gebruikt?**: true
- **Toelichting**: Borregaard rapporteert "EBITDA1" excl. eenmalige posten. In 2025 was die NOK 1.878 mln; reported EBITDA was lager door NOK 245 mln impairments op bio-startup investments (Alginor, Kaffe Bueno, Lignovations). De DCF gebruikt onderliggende EBITDA-marge 17% (EBIT) over 5 jaar; impairments zijn niet-kasstroom-relevant maar moeten in earnings-quality-overweging.

### Ontbrekende data
- Detailbalans 2018-2020 (alleen EBITDA verifieerbaar)
- Detail kasstroom 2018-2020
- Pre-2018 data (2015-2017) volledig niet geverifieerd
- Exacte SBC per jaar — geschat op ~NOK 30 mln/jaar; Borregaard rapporteert dit niet apart in jaarrekening
- Exacte segment-omzet 2025 (BioSolutions / BioMaterials / Fine Chemicals splitsing — geschat op ~45/40/15 op basis van vorige jaren)
- 5-jaars FCF CAGR is volatiel en niet als stabiele input voor reverse-DCF interpretatie
- TAM/SAM cijfers zijn schattingen op basis van publieke marktrapporten, niet 1-op-1 te verifiëren met één URL

### Peildatum analyse
- 2026-04-26

---

## 14. Volledige bronnen-lijst

| Titel | URL | Type |
|---|---|---|
| Borregaard ASA Annual Report 2025 | https://www.globenewswire.com/news-release/2026/03/26/3262747/0/en/Borregaard-ASA-Annual-Report-2025.html | jaarverslag |
| Borregaard ASA Annual Report 2024 | https://www.globenewswire.com/news-release/2025/03/20/3045979/0/en/Borregaard-ASA-Annual-Report-2024.html | jaarverslag |
| Borregaard Annual Report 2023 (PDF) | https://www.borregaard.com/media/ac1fn2he/borregaard-annual-report-2023.pdf | jaarverslag |
| Borregaard 2022 Annual Report (PDF) | https://www.borregaard.com/hubfs/Media/InvestorFiles/GeneralMeeting2023/annual-report-2022.pdf | jaarverslag |
| Borregaard 2021 Annual Report (PDF) | https://ml-eu.globenewswire.com/Resource/Download/d29c052b-ec61-4215-ba8e-02c358787d74 | jaarverslag |
| Borregaard EBITDA NOK 405 mln Q4 2025 | https://www.globenewswire.com/news-release/2026/02/04/3231743/0/en/Borregaard-ASA-EBITDA1-of-NOK-405-million-in-the-4th-quarter-2025.html | beursmelding |
| Borregaard Q1 2026 invitation | https://www.globenewswire.com/news-release/2026/04/22/3278654/0/en/Borregaard-ASA-Invitation-to-Q1-2026-announcement.html | beursmelding |
| Tom Erik Foss-Jacobsen appointed CEO | https://www.globenewswire.com/news-release/2025/05/23/3087308/0/en/Borregaard-ASA-Tom-Erik-Foss-Jacobsen-appointed-CEO-of-Borregaard.html | beursmelding |
| Borregaard insider transactions 2025-02-12 | https://www.globenewswire.com/news-release/2025/02/12/3025201/0/en/Borregaard-ASA-Reporting-of-transactions-in-Borregaard-ASA-s-shares-made-by-person-discharging-managerial-responsibilities.html | beursmelding |
| Borregaard Q4 2024 EBITDA NOK 398 mln | https://www.globenewswire.com/news-release/2025/01/29/3016894/0/en/Borregaard-ASA-EBITDA1-of-NOK-398-million-in-the-4th-quarter.html | beursmelding |
| Borregaard ASA (BRG.OL) Yahoo Finance | https://finance.yahoo.com/quote/BRG.OL/ | beurswebsite |
| StockAnalysis Borregaard income | https://stockanalysis.com/quote/osl/BRG/financials/ | aggregator |
| StockAnalysis Borregaard cash flow | https://stockanalysis.com/quote/osl/BRG/financials/cash-flow-statement/ | aggregator |
| StockAnalysis Borregaard balance sheet | https://stockanalysis.com/quote/osl/BRG/financials/balance-sheet/ | aggregator |
| StockAnalysis Borregaard ratios | https://stockanalysis.com/quote/osl/BRG/financials/ratios/ | aggregator |
| Norway 10Y Bond Yield (Trading Economics) | https://tradingeconomics.com/norway/government-bond-yield | databron |
| Borregaard shareholders page | https://www.borregaard.com/investors/equity-info/shareholders/ | beurswebsite |
| Borregaard dividend policy | https://www.borregaard.com/investors/equity-info/dividend-policy/ | beurswebsite |
| MarketScreener Borregaard target consensus | https://www.marketscreener.com/quote/stock/BORREGAARD-ASA-11751909/consensus/ | analistenrapport |
| Wikipedia Borregaard | https://en.wikipedia.org/wiki/Borregaard | nieuwsartikel |
| Specialty Cellulose Global Market Report 2024 | https://www.businesswire.com/news/home/20240712006167/en/Specialty-Cellulose-Global-Market-Report-2024 | onderzoeksrapport |
| Global Lignin Products 2019-2024 | https://www.prnewswire.com/news-releases/the-global-market-for-lignin-products-2019-to-2024-borregaard-lignotech-dominates-followed-by-domsj-fabriker-nippon-paper-industries-ingevity-and-rayonier-advanced-materials-300820330.html | onderzoeksrapport |
| Borregaard general presentation July 2025 (MarketScreener) | https://www.marketscreener.com/quote/stock/BORREGAARD-ASA-11751909/news/Borregaard-general-presentation-July-2025-50519356/ | analistenrapport |
| Sweetstocks Borregaard moat thesis | https://sweetstocks.substack.com/p/borregaard-an-economic-castle-protected | nieuwsartikel |

---

## 15. Update-historie

| Datum | Versie | Wijziging |
|---|---|---|
| 2026-04-26 | 1.0 | Eerste publicatie |

---

## Opmerkingen voor Claude Code

1. **Detailbalans 2021-2022 leunt op aggregator** (StockAnalysis); de unit-fouten in de StockAnalysis-balans 2021 (×1e6 te hoog) zijn niet overgenomen — die regel is leeggelaten in de balans-tabel voor 2021. Als latere validator-stappen die rij eisen, bevestig dan dat leeg de juiste keuze is in plaats van een verzonnen waarde.
2. **Pre-2021 financiële detail ontbreekt**: alleen EBITDA voor 2018-2020 verifieerbaar via search-snippets. Voor 2015-2017 geen geverifieerde bron geopend. Sectie 13 markeert dit; de validator zou geen rode vlag moeten produceren, maar de tabel-rijen zijn correct leeg.
3. **SBC-schatting (~NOK 30 mln/jaar)**: niet expliciet uit AR; gebaseerd op LTI-programma's voor management. Als preciezere SBC-data nodig is, vereist directe lezing van remuneratierapport in de AR-PDF. De impact op DCF is minimaal (<2% fair value).
4. **Mid-cycle FCF normalisatie naar NOK 700 mln**: motivatie staat in DCF-toelichting; raw 5-jaars-gemiddelde was NOK 562 mln. Validator zou de 25%-afwijking-regel kunnen flaggen — uitleg: 2022 en 2024 hadden zware werkkapitaal-druk (-NOK 658/-486 mln), en 2024-2025 capex bevatte materiële groei-investering (Florida lignin JV). Mid-cycle FCF zonder die anomalieën is dichter bij 700.
5. **Beta is bottom-up (sector-beta gerelevered)** in plaats van regressie omdat dagvolume (~92k) onder de drempel ligt voor robuuste eigen-regressie en de aandeel daardoor minder representatief is voor markt-risico in eigen tijdreeks.
6. **TAM/SAM-getallen zijn marktrapport-schattingen** zonder één enkele bron-URL — als de validator harde URL-eis stelt op TAM/SAM, dan moeten die velden mogelijk null in JSON.
7. **2026 ex-dividenddatum 2026-04-17** ligt vóór de peildatum 2026-04-26 — koers NOK 176 is dus al ex-dividend (NOK 4,75 reeds afgesplitst). Geen aanvullende correctie nodig.
8. **Geen afbreuk aan rapportkwaliteit door beperkte historie**: 5 jaar (2021-2025) dekt covid-trough + vanillin/cellulose-piek + impairment-jaar — voldoende voor mid-cycle normalisatie. Lagere zekerheid bij waarderingen die langere historie eisen (niet aan de orde hier).
