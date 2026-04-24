#!/usr/bin/env python3
"""
Structure Validator voor Fundamentele Analyse JSON's
====================================================
Controleert OF de verplichte velden, subvelden en enum-waarden aanwezig zijn.
Complementair aan verify_consistency.py (die cross-references controleert).

Filosofie:
- POSITIEVE checks: "dit moet er zijn", niet "dit mag niet".
- Onbekende extra keys zijn OK (geen forbidden-list).
- Structuur gebaseerd op data/ASML.json (enige betrouwbare referentie).

Gebruik:
  python validate_structure.py                       # alle JSON's in content/data/
  python validate_structure.py TICKER                # enkel ticker
  python validate_structure.py /pad/TICKER.json      # vrij pad
"""

import json
import re
import sys
import os
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DATA_DIR = SCRIPT_DIR.parent / "src" / "content" / "data"

# --- Constantes uit de skill & ASML.json ---

TOP_LEVEL_KEYS = [
    "meta", "executive_summary", "bedrijfsprofiel", "financieel",
    "moat", "management", "sector_concurrentie", "analyseframeworks",
    "risicos", "these_invalide_bij", "esg", "katalysatoren",
    "fair_value", "scorekaart", "databronnen", "bronnen", "update_historie",
]

META_REQUIRED = ["ticker", "naam", "koers", "valuta", "peildatum", "yahoo_symbol", "exchange", "sector"]

EXEC_SUMMARY_REQUIRED = [
    "kernthese", "oordeel", "koers", "valuta",
    "fair_value_basis", "fair_value_kansgewogen", "epv_per_aandeel",
    "upside_pct", "fair_value_scenarios",
    "reverse_dcf_impliciete_groei_pct", "grootste_kans", "grootste_risico",
]

SCENARIOS_REQUIRED = ["Pessimistisch", "Basis", "Optimistisch"]

FAIR_VALUE_SYNTHESE_KEYS = {
    "fair_value_bandbreedte_laag",
    "fair_value_bandbreedte_centraal",
    "fair_value_bandbreedte_hoog",
    "methode_gewichten",
    "margin_of_safety_vereist_pct",
    "koopniveau",
}

FAIR_VALUE_EPV_KEYS = [
    "genormaliseerde_ebit_marge_pct", "genormaliseerde_nopat",
    "maintenance_capex", "adjusted_earnings_power",
    "epv_per_aandeel", "groeipremie_pct",
]

FAIR_VALUE_REVERSE_DCF_KEYS = ["impliciete_groei_pct"]
FAIR_VALUE_WACC_REQUIRED = [
    "wacc_pct", "cost_of_equity_pct", "schuldkosten_na_belasting_pct",
    "beta_adjusted", "risicovrije_rente_pct", "erp_pct",
]
FAIR_VALUE_DCF_REQUIRED = ["wacc_pct", "shares_outstanding_mln", "basis_fcf"]

# Financieel: minimaal 5 jaar historische data
FINANCIEEL_MIN_YEARS = 5

MOAT_CATEGORIEN_NAMES = {
    "Immateriële activa", "Overstapkosten", "Netwerkeffecten",
    "Kostenvoordeel", "Efficiënte schaal",
}

SCOREKAART_FRAMEWORKS = [
    "Graham", "Buffett / Munger", "Peter Lynch", "Phil Fisher",
    "Magic Formula", "Moat", "Management",
    "Fair Value DCF", "Fair Value IPO-gecorr.",
]

DATABRONNEN_REQUIRED = [
    "bronnen_geraadpleegd", "pre_ipo_data_beschikbaar",
    "ontbrekende_data", "non_gaap_gebruikt", "non_gaap_toelichting",
]

# databronnen.financieel: elke entry moet deze velden hebben
FINANCIEEL_BRON_KEYS = {"jaar", "bron", "url", "betrouwbaarheid"}
FINANCIEEL_BETROUWBAARHEID_ENUM = {"HOOG", "AGGREGATOR"}
# Minimaal 5 entries (was 10; verlaagd 2026-04-24 omdat sommige bedrijven
# pas recent noteren of pre-IPO data simpelweg niet verifieerbaar is — dan
# is "geen bron = leeg laten" correct gedrag, zie METHODE.md STAP 0.5).
# De recente 5 jaren blijven verplicht HOOG. Ontbrekende oudere jaren
# horen in databronnen.ontbrekende_data te staan.
FINANCIEEL_BRON_MIN_TOTAL = 5
# De 5 meest recente jaren moeten allemaal HOOG zijn (jaarverslagen)
FINANCIEEL_BRON_RECENT_HOOG_YEARS = 5
# HOOG-URLs moeten lijken op jaarverslag-bron.
# Uitgebreid 2026-04-24 met IR-distributie-platforms (mfn.se, cision.com,
# globenewswire.com, nasdaq-news) die Zweedse small/mid-caps standaard
# gebruiken voor persberichten + jaarverslag-PDF's.
FINANCIEEL_HOOG_URL_PATTERN = re.compile(
    r"(jaarverslag|annual|investor|\.pdf$|mfn\.se|cision\.com|globenewswire\.com|news\.eu\.nasdaq)",
    re.IGNORECASE,
)

ENUM_KANS = {"LAAG", "MIDDEN", "HOOG"}
ENUM_IMPACT = {"KLEIN", "MIDDEL", "GROOT"}
ENUM_KATALYSATOR_RICHTING = {"POSITIEF", "NEGATIEF", "NEUTRAAL", "BINAIR"}
ENUM_KATALYSATOR_IMPACT = {"GROOT", "MIDDEL", "KLEIN"}
ENUM_EINDOORDEEL = {"KOOP", "HOLD", "PASS"}
ENUM_MOAT = {"WIDE MOAT", "NARROW MOAT", "NO MOAT"}
ENUM_MGMT = {"STERK", "NEUTRAAL", "ZORGWEKKEND"}

# File-size sanity: echte analyses zijn ca. 40-90KB. Onder 20KB = vrijwel zeker truncation of halve data.
MIN_FILE_SIZE_KB = 20


def check(results, name, condition, detail=""):
    results.append({"name": name, "status": "PASS" if condition else "FAIL", "detail": detail})
    return condition


def g(obj, path, default=None):
    for key in path.split("."):
        if isinstance(obj, dict) and key in obj:
            obj = obj[key]
        else:
            return default
    return obj


def validate_file_size(results, filepath):
    size_kb = os.path.getsize(filepath) / 1024
    check(results,
          f"Bestandsgrootte >= {MIN_FILE_SIZE_KB}KB (truncation-detectie)",
          size_kb >= MIN_FILE_SIZE_KB,
          f"grootte={size_kb:.1f}KB")


def validate_top_level(results, data):
    for key in TOP_LEVEL_KEYS:
        check(results, f"top-level key aanwezig: {key}", key in data, "")


def validate_meta(results, data, filename_stem):
    for key in META_REQUIRED:
        val = g(data, f"meta.{key}")
        check(results, f"meta.{key} aanwezig", val not in (None, ""), f"waarde={val}")
    ticker = g(data, "meta.ticker")
    if ticker:
        check(results,
              "meta.ticker matcht filename (bare ticker, geen exchange-suffix)",
              ticker == filename_stem,
              f"filename={filename_stem}, meta.ticker={ticker}")
        check(results,
              "meta.ticker bevat GEEN exchange-suffix (.ST/.AS/.PA etc)",
              "." not in ticker,
              f"ticker={ticker}")


def validate_executive_summary(results, data):
    for key in EXEC_SUMMARY_REQUIRED:
        val = g(data, f"executive_summary.{key}")
        check(results, f"executive_summary.{key} aanwezig",
              val is not None and val != "", f"waarde={val}")
    oordeel = g(data, "executive_summary.oordeel")
    if oordeel:
        check(results, "executive_summary.oordeel in {KOOP|HOLD|PASS}",
              oordeel in ENUM_EINDOORDEEL, f"waarde={oordeel}")
    es_scenarios = g(data, "executive_summary.fair_value_scenarios", [])
    es_labels = {s.get("scenario") for s in es_scenarios if isinstance(s, dict)}
    for label in SCENARIOS_REQUIRED:
        check(results, f"exec_summary.fair_value_scenarios bevat '{label}'",
              label in es_labels, f"gevonden={sorted(es_labels)}")


def validate_fair_value(results, data):
    fv = g(data, "fair_value", {})
    if not isinstance(fv, dict):
        check(results, "fair_value is dict", False, f"type={type(fv).__name__}")
        return

    # synthese: EXACT 6 keys
    synthese = fv.get("synthese")
    if isinstance(synthese, dict):
        actual_keys = set(synthese.keys())
        missing = FAIR_VALUE_SYNTHESE_KEYS - actual_keys
        extra = actual_keys - FAIR_VALUE_SYNTHESE_KEYS
        check(results,
              "fair_value.synthese: alle 6 verplichte keys aanwezig",
              not missing,
              f"ontbreken: {sorted(missing)}" if missing else "")
        check(results,
              "fair_value.synthese: geen onverwachte keys",
              not extra,
              f"onverwacht: {sorted(extra)} (bv. verkeerde naming zoals 'laagste' ipv 'fair_value_bandbreedte_laag')" if extra else "")
    else:
        check(results, "fair_value.synthese is dict", False, f"waarde={synthese}")

    # synthese_toelichting: op top-level van fair_value, NIET genest
    st = fv.get("synthese_toelichting")
    check(results,
          "fair_value.synthese_toelichting (string) aanwezig",
          isinstance(st, str) and len(st) > 0,
          f"type={type(st).__name__ if st is not None else 'None'}")

    # scenarios: ≥ 3 items met juiste labels
    scenarios = fv.get("scenarios", [])
    check(results,
          "fair_value.scenarios niet leeg (>= 3 items)",
          isinstance(scenarios, list) and len(scenarios) >= 3,
          f"count={len(scenarios) if isinstance(scenarios, list) else 'n/a'}")
    if isinstance(scenarios, list):
        labels = {s.get("scenario") for s in scenarios if isinstance(s, dict)}
        for label in SCENARIOS_REQUIRED:
            check(results, f"fair_value.scenarios bevat '{label}'",
                  label in labels, f"gevonden={sorted(l for l in labels if l)}")

    # EPV: 6 verplichte keys
    epv = fv.get("epv", {})
    if isinstance(epv, dict):
        for key in FAIR_VALUE_EPV_KEYS:
            check(results, f"fair_value.epv.{key} aanwezig",
                  key in epv and epv[key] is not None,
                  f"waarde={epv.get(key)}")
    else:
        check(results, "fair_value.epv is dict", False, "")

    # Reverse DCF
    rdcf = fv.get("reverse_dcf")
    check(results, "fair_value.reverse_dcf is dict",
          isinstance(rdcf, dict), f"waarde={rdcf}")
    if isinstance(rdcf, dict):
        for key in FAIR_VALUE_REVERSE_DCF_KEYS:
            check(results, f"fair_value.reverse_dcf.{key} aanwezig",
                  rdcf.get(key) is not None, f"waarde={rdcf.get(key)}")

    # WACC
    wacc = fv.get("wacc", {})
    if isinstance(wacc, dict):
        for key in FAIR_VALUE_WACC_REQUIRED:
            check(results, f"fair_value.wacc.{key} aanwezig en > 0",
                  isinstance(wacc.get(key), (int, float)) and wacc.get(key) > 0,
                  f"waarde={wacc.get(key)}")

    # DCF
    dcf = fv.get("dcf", {})
    if isinstance(dcf, dict):
        for key in FAIR_VALUE_DCF_REQUIRED:
            val = dcf.get(key)
            check(results, f"fair_value.dcf.{key} aanwezig en > 0",
                  isinstance(val, (int, float)) and val > 0,
                  f"waarde={val}")


def validate_financieel(results, data):
    fin = g(data, "financieel", {})
    if not isinstance(fin, dict):
        check(results, "financieel is dict", False, "")
        return
    for section in ("resultatenrekening", "kasstromen", "balans"):
        rows = fin.get(section, [])
        check(results,
              f"financieel.{section} >= {FINANCIEEL_MIN_YEARS} jaar historie",
              isinstance(rows, list) and len(rows) >= FINANCIEEL_MIN_YEARS,
              f"count={len(rows) if isinstance(rows, list) else 'n/a'}")


def validate_moat(results, data):
    moat = g(data, "moat", {})
    if not isinstance(moat, dict):
        check(results, "moat is dict", False, "")
        return
    oordeel = moat.get("oordeel")
    check(results, f"moat.oordeel in {{{'|'.join(ENUM_MOAT)}}}",
          oordeel in ENUM_MOAT, f"waarde={oordeel}")
    cats = moat.get("categorieen", [])
    check(results,
          "moat.categorieen bevat 5 items",
          isinstance(cats, list) and len(cats) == 5,
          f"count={len(cats) if isinstance(cats, list) else 'n/a'}")
    if isinstance(cats, list):
        names = {c.get("naam") for c in cats if isinstance(c, dict)}
        missing = MOAT_CATEGORIEN_NAMES - names
        if missing:
            check(results, "moat.categorieen bevat alle 5 canonieke namen",
                  False, f"ontbreken: {sorted(missing)}")


def validate_management(results, data):
    mgmt = g(data, "management", {})
    if not isinstance(mgmt, dict):
        check(results, "management is dict", False, "")
        return
    oordeel = mgmt.get("oordeel")
    check(results, f"management.oordeel in {{{'|'.join(ENUM_MGMT)}}}",
          oordeel in ENUM_MGMT, f"waarde={oordeel}")
    personen = mgmt.get("personen", [])
    check(results, "management.personen niet leeg",
          isinstance(personen, list) and len(personen) > 0,
          f"count={len(personen) if isinstance(personen, list) else 'n/a'}")


def validate_risicos_en_katalysatoren(results, data):
    risicos = data.get("risicos", [])
    check(results, "risicos niet leeg (>= 1)",
          isinstance(risicos, list) and len(risicos) > 0,
          f"count={len(risicos) if isinstance(risicos, list) else 'n/a'}")
    if isinstance(risicos, list):
        for i, r in enumerate(risicos):
            if not isinstance(r, dict):
                continue
            kans = r.get("kans")
            impact = r.get("impact")
            check(results, f"risicos[{i}].kans in {{LAAG|MIDDEN|HOOG}}",
                  kans in ENUM_KANS, f"waarde={kans}")
            check(results, f"risicos[{i}].impact in {{KLEIN|MIDDEL|GROOT}}",
                  impact in ENUM_IMPACT, f"waarde={impact}")

    kats = data.get("katalysatoren", [])
    check(results, "katalysatoren niet leeg (>= 1)",
          isinstance(kats, list) and len(kats) > 0,
          f"count={len(kats) if isinstance(kats, list) else 'n/a'}")
    if isinstance(kats, list):
        for i, k in enumerate(kats):
            if not isinstance(k, dict):
                continue
            richting = k.get("richting")
            impact = k.get("impact")
            check(results, f"katalysatoren[{i}].richting in {{POSITIEF|NEGATIEF|NEUTRAAL|BINAIR}}",
                  richting in ENUM_KATALYSATOR_RICHTING, f"waarde={richting}")
            check(results, f"katalysatoren[{i}].impact in {{GROOT|MIDDEL|KLEIN}}",
                  impact in ENUM_KATALYSATOR_IMPACT, f"waarde={impact}")


def validate_scorekaart(results, data):
    sk = data.get("scorekaart", {})
    if not isinstance(sk, dict):
        check(results, "scorekaart is dict", False, "")
        return
    items = sk.get("items", [])
    check(results, "scorekaart.items bevat 9 items",
          isinstance(items, list) and len(items) == 9,
          f"count={len(items) if isinstance(items, list) else 'n/a'}")
    if isinstance(items, list):
        frameworks = [i.get("framework") for i in items if isinstance(i, dict)]
        for fw in SCOREKAART_FRAMEWORKS:
            check(results, f"scorekaart.items bevat framework '{fw}'",
                  fw in frameworks,
                  f"gevonden={frameworks}")

    totaal = sk.get("totaal")
    check(results, "scorekaart.totaal is integer",
          isinstance(totaal, int), f"waarde={totaal}, type={type(totaal).__name__}")

    eindoordeel = sk.get("eindoordeel")
    check(results, f"scorekaart.eindoordeel in {{KOOP|HOLD|PASS}}",
          eindoordeel in ENUM_EINDOORDEEL, f"waarde={eindoordeel}")

    # Deterministische regel: totaal < 24 of DCF=1 -> PASS; totaal >= 33 en DCF >= 3 -> KOOP; anders HOLD.
    if isinstance(items, list) and isinstance(totaal, int) and eindoordeel in ENUM_EINDOORDEEL:
        fv_dcf = next(
            (i.get("score") for i in items
             if isinstance(i, dict) and i.get("framework") == "Fair Value DCF"),
            None,
        )
        if isinstance(fv_dcf, int):
            if totaal >= 33 and fv_dcf >= 3:
                expected = "KOOP"
            elif totaal < 24 or fv_dcf == 1:
                expected = "PASS"
            else:
                expected = "HOLD"
            check(results,
                  f"scorekaart.eindoordeel volgt regel (totaal={totaal}, DCF={fv_dcf}, verwacht={expected})",
                  eindoordeel == expected,
                  f"opgeslagen={eindoordeel}, verwacht={expected}")


def validate_databronnen_financieel(results, data):
    db = data.get("databronnen", {})
    if not isinstance(db, dict):
        return
    fin = db.get("financieel")
    if fin is None:
        check(results, "databronnen.financieel aanwezig",
              False, "ontbreekt — vereist voor traceerbaarheid")
        return
    if not isinstance(fin, list):
        check(results, "databronnen.financieel is lijst",
              False, f"type={type(fin).__name__}")
        return

    check(results, f"databronnen.financieel >= {FINANCIEEL_BRON_MIN_TOTAL} entries",
          len(fin) >= FINANCIEEL_BRON_MIN_TOTAL,
          f"count={len(fin)}")

    # Elke entry heeft alle verplichte velden
    for i, entry in enumerate(fin):
        if not isinstance(entry, dict):
            check(results, f"databronnen.financieel[{i}] is object",
                  False, f"type={type(entry).__name__}")
            continue
        missing = FINANCIEEL_BRON_KEYS - set(entry.keys())
        check(results, f"databronnen.financieel[{i}] alle verplichte velden",
              not missing, f"mist: {missing}" if missing else "")
        bet = entry.get("betrouwbaarheid")
        check(results, f"databronnen.financieel[{i}].betrouwbaarheid in {{HOOG|AGGREGATOR}}",
              bet in FINANCIEEL_BETROUWBAARHEID_ENUM,
              f"waarde={bet}")

    # Jaren uniek
    jaren = [e.get("jaar") for e in fin if isinstance(e, dict) and isinstance(e.get("jaar"), int)]
    check(results, "databronnen.financieel: jaren uniek (geen dubbelingen)",
          len(jaren) == len(set(jaren)),
          f"duplicates: {[j for j in jaren if jaren.count(j) > 1]}")

    # Recente 5 jaar moeten HOOG zijn
    if jaren:
        max_jaar = max(jaren)
        recent_jaren = set(range(max_jaar - FINANCIEEL_BRON_RECENT_HOOG_YEARS + 1, max_jaar + 1))
        recent_entries = [e for e in fin if isinstance(e, dict) and e.get("jaar") in recent_jaren]
        niet_hoog = [e.get("jaar") for e in recent_entries if e.get("betrouwbaarheid") != "HOOG"]
        check(results,
              f"databronnen.financieel: recente {FINANCIEEL_BRON_RECENT_HOOG_YEARS} jaar ({min(recent_jaren)}-{max_jaar}) allemaal HOOG",
              not niet_hoog,
              f"niet-HOOG jaren: {niet_hoog}" if niet_hoog else "")

    # HOOG-URLs moeten lijken op jaarverslag-bron
    for i, entry in enumerate(fin):
        if not isinstance(entry, dict):
            continue
        if entry.get("betrouwbaarheid") == "HOOG":
            url = entry.get("url", "")
            check(results,
                  f"databronnen.financieel[{i}] HOOG url past bij jaarverslag/IR",
                  bool(FINANCIEEL_HOOG_URL_PATTERN.search(url)),
                  f"url={url}")


def validate_databronnen_en_bronnen(results, data):
    db = data.get("databronnen", {})
    if isinstance(db, dict):
        for key in DATABRONNEN_REQUIRED:
            check(results, f"databronnen.{key} aanwezig",
                  key in db, f"waarde={db.get(key)}")
    else:
        check(results, "databronnen is dict", False, "")

    bronnen = data.get("bronnen", [])
    check(results, "bronnen niet leeg (>= 1)",
          isinstance(bronnen, list) and len(bronnen) > 0,
          f"count={len(bronnen) if isinstance(bronnen, list) else 'n/a'}")

    uh = data.get("update_historie", [])
    check(results, "update_historie niet leeg (>= 1)",
          isinstance(uh, list) and len(uh) > 0,
          f"count={len(uh) if isinstance(uh, list) else 'n/a'}")


def verify(data, filepath):
    results = []
    validate_file_size(results, filepath)
    validate_top_level(results, data)
    validate_meta(results, data, Path(filepath).stem)
    validate_executive_summary(results, data)
    validate_fair_value(results, data)
    validate_financieel(results, data)
    validate_moat(results, data)
    validate_management(results, data)
    validate_risicos_en_katalysatoren(results, data)
    validate_scorekaart(results, data)
    validate_databronnen_en_bronnen(results, data)
    validate_databronnen_financieel(results, data)
    return results


def print_results(ticker, results):
    passes = sum(1 for r in results if r["status"] == "PASS")
    fails = sum(1 for r in results if r["status"] == "FAIL")
    print(f"\n{'='*60}")
    print(f"  STRUCTURE CHECK: {ticker}")
    print(f"{'='*60}\n")
    for r in results:
        icon = "v" if r["status"] == "PASS" else "x"
        print(f"  {icon} {r['status']:4s}  {r['name']}")
        if r["status"] == "FAIL" and r["detail"]:
            print(f"         -> {r['detail']}")
    print(f"\n{'-'*60}")
    print(f"  Resultaat: {passes} PASS, {fails} FAIL van {len(results)} checks")
    if fails == 0:
        print("  v Structuur is volledig.")
    else:
        print(f"  x {fails} structurele fout(en) gevonden.")
    print(f"{'-'*60}\n")
    return fails


def resolve_path(arg):
    p = Path(arg)
    if p.exists():
        return p
    candidate = DATA_DIR / (arg if arg.endswith(".json") else f"{arg}.json")
    if candidate.exists():
        return candidate
    return None


def main():
    if len(sys.argv) < 2:
        if not DATA_DIR.exists():
            print(f"Data-map niet gevonden: {DATA_DIR}")
            sys.exit(2)
        files = sorted(p for p in DATA_DIR.glob("*.json") if p.name != "index.json")
        if not files:
            print(f"Geen JSON-bestanden in {DATA_DIR}")
            sys.exit(0)
        total_fails = 0
        for f in files:
            try:
                data = json.load(open(f, encoding="utf-8"))
            except json.JSONDecodeError as e:
                print(f"\n[JSON-PARSE-FAIL] {f.name}: {e}")
                total_fails += 1
                continue
            ticker = data.get("meta", {}).get("ticker", f.stem)
            results = verify(data, f)
            total_fails += print_results(ticker, results)
        print(f"\nTotaal mislukte checks: {total_fails}")
        sys.exit(1 if total_fails > 0 else 0)

    path = resolve_path(sys.argv[1])
    if path is None:
        print(f"Bestand niet gevonden: {sys.argv[1]}")
        print(f"Gezocht in: {DATA_DIR}")
        sys.exit(2)
    try:
        data = json.load(open(path, encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"[JSON-PARSE-FAIL] {path.name}: {e}")
        sys.exit(1)
    ticker = data.get("meta", {}).get("ticker", path.stem)
    results = verify(data, path)
    fails = print_results(ticker, results)
    sys.exit(1 if fails > 0 else 0)


if __name__ == "__main__":
    main()
