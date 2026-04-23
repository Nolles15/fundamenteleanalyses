# Handover — Volgende Sessie

**Geschreven:** 2026-04-22 (einde van de dag)
**Doel:** Janco kan morgen direct verder zonder context te reconstrueren.

---

## 1. Waar staan we nu

### Afgerond vandaag
- `docs/_archive/` opgezet, 5 verouderde docs gearchiveerd (`ANALYSE_JSON_CONTRACT.md`, `JSON_TEMPLATE.md`, `SKILL_FUNDAMENTELE_ANALYSE.md`, `SKILL_fundamentele_analyse_UPDATED.md`, `COWORK_SKILL_UPDATE.md`).
- `docs/SCHEMA_GROUND_TRUTH.md` gemaakt als enige geldige wegwijzer naar `types.ts` + cowork skill + `ASML.json`.
- `CLAUDE.md` bijgewerkt (nieuwe docs-structuur, verwijzing naar `platform/scripts/`).
- Technische notitie `TECHNISCHE_NOTITIE_DATABRONNEN.md` verhuisd van content/data/ naar docs/.
- 3 Python-duplicaten uit `data/` verwijderd (`validate_schema.py`, `dcf_calculator.py`, `verify_consistency.py`) — die horen in de cowork skill, niet in de repo.
- **Twee validators in `platform/scripts/`:**
  - `validate_structure.py` — structuur, enums, truncation-detectie, 5-jaar financieel-historie, WACC-componenten, synthese-keys exact, filename-conventie
  - `verify_consistency.py` — cross-reference waarden (meta↔exec↔fair_value↔scorekaart)
- AMBEA v2 ontvangen en gevalideerd. Consistency 46/46 PASS, structure 96/118 met 22 FAILs (zie onder).

### Status per ticker (laatste validator-run)

| Ticker | consistency | structure | opmerking |
|---|---|---|---|
| ASML | 47/47 | 122/122 | referentie — volledig |
| ADYEN | 43/43 | 83/116 | oud, geen urgentie |
| DAN | 46/46 | 108/117 | oud, geen urgentie |
| EDEN | 31/45 | 103/118 | oud, 14 consistency-FAILs |
| HEIJM | 46/46 | 113/116 | oud |
| SW | 46/46 | 113/114 | oud |
| **MIPS** | 46/46 | 106/119 | v1 — niet aangeraakt |
| **VIT-B** | 46/46 | 110/113 | v1 — niet aangeraakt |
| **ANOD-B** | 34/34 | 81/99 | v1 truncated — opnieuw |
| **AMBEA** | 46/46 | 96/118 | **v2 — 22 FAILs, vanochtend fixen** |
| **BONAV-B** | 32/32 | 69/90 | v1 truncated + schema-fouten — opnieuw |

---

## 2. Eerste prioriteit morgenochtend

**Plak onderstaande prompt in cowork.** Die lijst van 22 patches fixt AMBEA zonder opnieuw te beginnen (inhoud is goud — WACC-recompute, IFRS-16 split en IPO-carve-out zijn inhoudelijk correct, alleen velden zijn verkeerd ingevuld).

### Cowork-prompt: AMBEA v2 patch

```
Fix AMBEA.json — 22 veld-patches, NIET opnieuw genereren. Inhoud is correct, velden zijn fout ingevuld.

Beide bestanden (HOUD IDENTIEK):
- C:\Users\janco\aandelenanalyse\platform\src\content\data\AMBEA.json
- C:\Users\janco\aandelenanalyse\data\AMBEA.json

PATCHES:

1. fair_value.wacc.beta_adjusted → 0.54
2. fair_value.wacc.risicovrije_rente_pct → 2.78
3. fair_value.wacc.erp_pct → 5.0
4. fair_value.dcf.basis_fcf → 800
5. financieel.kasstromen → controleer dat deze array ≥ 5 objecten bevat (mikken op 2017-2024 = 8 jaar per jouw eigen diagnose). Als array leeg/ontbreekt, vullen met {jaar, cfo, capex, fcf, fcf_na_sbc, fcf_per_aandeel, fcf_marge_pct, fcf_groei_pct, fcf_conversion, sbc, dividend_totaal, aandeleninkoop} — zie data/ASML.json financieel.kasstromen[0] voor exacte keys.
6. moat.oordeel: "BEPERKTE MOAT" → "NARROW MOAT" (enum is alleen WIDE MOAT | NARROW MOAT | NO MOAT, geen Nederlandstalige varianten)
7-16. katalysatoren[0..4] — elk object krijgt:
   - "richting": POSITIEF | NEGATIEF | NEUTRAAL | BINAIR (was null)
   - "impact": GROOT | MIDDEL | KLEIN (was een zin zoals "fair_value +10-15%")
   - De fair_value-impact-zin die nu in "impact" stond: verhuizen naar een nieuw veld "fv_impact_pct" of opnemen in de omschrijving/toelichting van die katalysator.
   Suggestie mapping:
     [0] impact="fair_value +10-15%"  → richting=POSITIEF, impact=MIDDEL
     [1] impact="fair_value +5-10%"   → richting=POSITIEF, impact=MIDDEL
     [2] impact="fair_value +3-5%"    → richting=POSITIEF, impact=KLEIN
     [3] impact="fair_value +30-50%"  → richting=BINAIR,  impact=GROOT
     [4] impact="fair_value -25-30%"  → richting=NEGATIEF, impact=GROOT
   Jij bepaalt welke richting klopt — gebruik je eigen diagnose.

17. scorekaart.items: framework "Buffett/Munger" → "Buffett / Munger" (MET spaties rondom de schuine streep — exact zo staat het in ASML.json)

18-22. databronnen object vullen (nu allemaal null):
   - bronnen_geraadpleegd: array van URLs die je gebruikte (jaarverslag PDFs, Nasdaq Nordic, Cision)
   - pre_ipo_data_beschikbaar: true (Ambea IPO was 2017, data 2015-2016 meestal uit prospectus)
   - ontbrekende_data: kort beschrijf wat niet gevonden is (of "" als alles compleet)
   - non_gaap_gebruikt: true (je past IFRS-16 aan, dat is non-GAAP)
   - non_gaap_toelichting: leg uit welke aanpassingen je deed (IFRS-16 lease adjustments, pre-IFRS-16 restatement etc)

VALIDATIE (harde gate — niet leveren zonder):
  python platform/scripts/validate_structure.py AMBEA
  python platform/scripts/verify_consistency.py AMBEA

Beide moeten 0 FAIL geven. Plak de volledige output van beide scripts in je eindrapportage — samenvatting "0 FAIL" zonder output niet acceptabel.
```

---

## 3. Na AMBEA-fix: de volgorde

1. **Valideren** met beide scripts → 0 FAIL bevestigen.
2. **Committen** ("feat: AMBEA v2 analyse + twee validators + docs-schoonmaak"). Push naar Vercel.
3. **Schema-additie `databronnen.financieel`** beslissen:
   - Cowork stelde voor: veld `databronnen.financieel` = lijst URLs naar officiële jaarverslagen, 1 per getal.
   - Dit vereist: `types.ts` update + `ASML.json` backfill + skill-aanpassing + validator-check (`databronnen.financieel` ≥ 1 URL eindigend op `.pdf` of 'jaarverslag').
   - Advies: nu pakken want cowork gaat toch de 4 resterende tickers opnieuw doen — gouden moment om de additie mee te nemen.
4. **Skill-update in cowork** (10 punten uit eerder gesprek, staan in conversatie-log):
   - Filename-conventie hard (bare ticker, suffix alleen in yahoo_symbol)
   - `fair_value.synthese_toelichting` positie expliciet
   - Databronnen-hiërarchie (jaarverslag PDF > beursmelding > aggregator)
   - Beide validators verplicht draaien voor oplevering
   - Agent-output: volledige validator-output tonen, geen samenvatting
   - Schema-additie `databronnen.financieel`
   - Enum `kans` = LAAG|MIDDEN|HOOG (niet MIDDEL — dat is impact)
   - Framework-namen EXACT (Buffett / Munger met spaties, Fair Value DCF zonder extra suffix)
   - Moat enum UITSLUITEND: WIDE MOAT | NARROW MOAT | NO MOAT
   - **Write-procedure voor grote JSONs** (>20KB): één `Write` met volledige inhoud, nooit een stapel `Edit`s. Read-tool na Write is niet de waarheid (cache divergeert van disk op Windows-sandbox).
     - **A. Compactheid bepalen vóór Write** (Write-tool truncated boven ~45KB):
       ```python
       import json
       payload = json.dumps(d, ensure_ascii=False, indent=2).encode('utf-8')
       if len(payload) > 30_000:
           payload = json.dumps(d, ensure_ascii=False, indent=1).encode('utf-8')
       if len(payload) > 45_000:
           payload = json.dumps(d, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
       ```
     - **B. Tweede file via OS-copy, NIET via tweede Write** (elimineert 2e truncation-risico):
       ```python
       import shutil
       shutil.copyfile('data/TICKER.json', 'platform/src/content/data/TICKER.json')
       ```
     - **C. Disk-check na elke Write (harde gate voor validators):**
       ```python
       import json, os, hashlib
       for p in ['data/TICKER.json','platform/src/content/data/TICKER.json']:
           assert os.path.getsize(p) >= 20000, f"TRUNCATED: {p}"
           d = json.load(open(p, encoding='utf-8'))
           assert len(d) == 17, f"missing top-level keys: {p}"
       a=open('data/TICKER.json','rb').read()
       b=open('platform/src/content/data/TICKER.json','rb').read()
       assert hashlib.sha256(a).digest()==hashlib.sha256(b).digest(), "files differ"
       ```
     - **D. Recovery bij truncation:** niet `Edit` de staart erbij (Edit werkt op cache). Volledig opnieuw `Write` met volgende compactheidsstap uit (A), daarna (B) copy, daarna (C) check.
     - **E. Eindrapportage:** validator-output + disk-check-output beide plakken. "Write succeeded" is geen bewijs.
5. **4 tickers opnieuw** in nieuwe cowork-runs: MIPS, VIT-B, ANOD-B, BONAV-B. Elk apart, elk door beide validators.

---

## 4. Open vragen / beslissingen die nog genomen moeten worden

- **Schema-additie `databronnen.financieel`**: wil Janco dit nu meenemen, of later? (Cowork zal zelf wachten op Janco's akkoord.)
- **Heeft cowork schrijftoegang tot `types.ts` en `data/ASML.json`?** Dit bepaalt wie de schema-additie mag doen:
  - Ja → spreek af: Claude Code doet types.ts + ASML.json, cowork doet alleen content/data/[TICKER].json.
  - Nee → Claude Code doet alle schema-wijzigingen.
- **EDEN (14 consistency-FAILs)** is oud en nog niet opgepakt. Laten staan tot de 5 nieuwe klaar zijn.

---

## 5. Relevante paden (copy-paste-baar)

```
Schema bron-van-waarheid:    platform/src/lib/types.ts
Referentie-analyse:          data/ASML.json  (of platform/src/content/data/ASML.json)
Outputlocatie nieuwe JSONs:  platform/src/content/data/[TICKER].json
Sync-kopie:                  data/[TICKER].json
Validators:                  platform/scripts/validate_structure.py
                             platform/scripts/verify_consistency.py
Ground truth doc:            docs/SCHEMA_GROUND_TRUTH.md
Cowork skill scripts:        /sessions/<session>/mnt/.claude/skills/fundamentele-analyse/scripts/
  - dcf_calculator.py
  - verify_consistency.py (synchroniseer met de platform/scripts/ versie)
```

Validator-aanroep voor één ticker:
```bash
python platform/scripts/validate_structure.py TICKER && python platform/scripts/verify_consistency.py TICKER
```

Zonder arg scannen beide scripts alle JSONs in `platform/src/content/data/`.

---

## 6. Wat NIET te doen

- `docs/_archive/` openen en inhoud als referentie gebruiken — die is besmet.
- Nieuwe `validate_schema.py` bouwen — die naam is uit de vorige iteratie. Gebruik `validate_structure.py`.
- Zonder validator-check een ticker als "af" beschouwen.
- Enum-waarden verzinnen ("BEPERKTE MOAT", "MIDDEL" voor kans, "Buffett/Munger" zonder spaties) — letterlijk kopieren uit ASML.json.

---

**Volgende sessie start:** prompt uit sectie 2 in cowork plakken → AMBEA gevalideerd → committen → schema-additie beslissen.
