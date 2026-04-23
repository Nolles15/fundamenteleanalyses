#!/usr/bin/env python3
"""
Cross-Reference Consistency Checker voor Fundamentele Analyse JSON's
====================================================================
Controleert of alle kruisverwijzingen in een analyse-JSON consistent zijn.
Elke check geeft PASS of FAIL + reden.

Gebruik:
  python verify_consistency.py                       # scant alle JSON's in src/content/data/
  python verify_consistency.py TICKER                # een enkel ticker-bestand
  python verify_consistency.py /pad/naar/TICKER.json # vrij pad

Output: overzicht van checks naar stdout, exit code 0 = alles ok, 1 = fouten
"""

import json
import sys
import os
from pathlib import Path


# Content-data map van het platform (relatief aan dit script: ../src/content/data)
SCRIPT_DIR = Path(__file__).resolve().parent
DATA_DIR = SCRIPT_DIR.parent / "src" / "content" / "data"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def approx(a, b, tolerance=5):
    """Check of twee getallen binnen tolerance van elkaar liggen."""
    if a is None or b is None:
        return a is None and b is None
    return abs(a - b) <= tolerance


def check(results, name, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    results.append({"name": name, "status": status, "detail": detail})
    return condition


def verify(data):
    results = []

    def g(path, default=None):
        obj = data
        for key in path.split("."):
            if isinstance(obj, dict) and key in obj:
                obj = obj[key]
            else:
                return default
        return obj

    # 1. META ↔ EXECUTIVE SUMMARY
    check(results,
          "meta.koers == executive_summary.koers",
          approx(g("meta.koers"), g("executive_summary.koers"), 0.01),
          f"meta={g('meta.koers')}, exec={g('executive_summary.koers')}")

    # 2. EXECUTIVE SUMMARY ↔ FAIR VALUE SCENARIOS
    es_scenarios = g("executive_summary.fair_value_scenarios", [])
    fv_scenarios = g("fair_value.scenarios", [])

    for label in ["Pessimistisch", "Basis", "Optimistisch"]:
        es_s = next((s for s in es_scenarios if s.get("scenario") == label), None)
        fv_s = next((s for s in fv_scenarios if s.get("scenario") == label), None)
        if es_s and fv_s:
            check(results,
                  f"exec_summary.scenarios[{label}].fair_value == fair_value.scenarios[{label}].fair_value",
                  approx(es_s.get("fair_value"), fv_s.get("fair_value")),
                  f"exec={es_s.get('fair_value')}, fv={fv_s.get('fair_value')}")
            check(results,
                  f"exec_summary.scenarios[{label}].wacc_pct == fair_value.scenarios[{label}].wacc_pct",
                  approx(es_s.get("wacc_pct"), fv_s.get("wacc_pct"), 0.1),
                  f"exec={es_s.get('wacc_pct')}, fv={fv_s.get('wacc_pct')}")

    # 3. EXECUTIVE SUMMARY fair_value_basis == Basis scenario fair_value
    basis_scenario = next((s for s in fv_scenarios if s.get("scenario") == "Basis"), None)
    if basis_scenario:
        check(results,
              "exec_summary.fair_value_basis == fair_value.scenarios[Basis].fair_value",
              approx(g("executive_summary.fair_value_basis"), basis_scenario.get("fair_value")),
              f"exec={g('executive_summary.fair_value_basis')}, basis={basis_scenario.get('fair_value')}")

    # 4. KANSGEWOGEN FAIR VALUE
    check(results,
          "exec_summary.fair_value_kansgewogen == fair_value.kansgewogen_fair_value",
          approx(g("executive_summary.fair_value_kansgewogen"), g("fair_value.kansgewogen_fair_value")),
          f"exec={g('executive_summary.fair_value_kansgewogen')}, fv={g('fair_value.kansgewogen_fair_value')}")

    # 5. EPV
    check(results,
          "exec_summary.epv_per_aandeel == fair_value.epv.epv_per_aandeel",
          approx(g("executive_summary.epv_per_aandeel"), g("fair_value.epv.epv_per_aandeel")),
          f"exec={g('executive_summary.epv_per_aandeel')}, fv={g('fair_value.epv.epv_per_aandeel')}")

    # 6. REVERSE DCF
    check(results,
          "exec_summary.reverse_dcf == fair_value.reverse_dcf.impliciete_groei_pct",
          approx(g("executive_summary.reverse_dcf_impliciete_groei_pct"),
                 g("fair_value.reverse_dcf.impliciete_groei_pct"), 0.5),
          f"exec={g('executive_summary.reverse_dcf_impliciete_groei_pct')}, fv={g('fair_value.reverse_dcf.impliciete_groei_pct')}")

    # 7. UPSIDE PCT
    if basis_scenario and g("meta.koers"):
        calc_upside = round((basis_scenario["fair_value"] / g("meta.koers") - 1) * 100)
        check(results,
              "exec_summary.upside_pct consistent met fair_value/koers",
              approx(g("executive_summary.upside_pct"), calc_upside, 2),
              f"exec={g('executive_summary.upside_pct')}, berekend={calc_upside}")

    # 8. WACC intern consistent
    wacc_section = g("fair_value.wacc", {})
    if wacc_section:
        ke = wacc_section.get("cost_of_equity_pct")
        kd = wacc_section.get("schuldkosten_na_belasting_pct")
        ew = wacc_section.get("ev_gewicht_pct", 0) / 100
        dw = wacc_section.get("dv_gewicht_pct", 0) / 100
        if ke and kd:
            calc_wacc = round(ew * ke + dw * kd, 2)
            check(results,
                  "WACC herberekening = wacc.wacc_pct",
                  approx(calc_wacc, wacc_section.get("wacc_pct"), 0.05),
                  f"berekend={calc_wacc}, opgeslagen={wacc_section.get('wacc_pct')}")

    # 9. WACC in DCF == WACC in wacc-sectie
    check(results,
          "fair_value.dcf.wacc_pct == fair_value.wacc.wacc_pct",
          approx(g("fair_value.dcf.wacc_pct"), g("fair_value.wacc.wacc_pct"), 0.01),
          f"dcf={g('fair_value.dcf.wacc_pct')}, wacc={g('fair_value.wacc.wacc_pct')}")

    # 10. SCOREKAART TOTAAL
    scorekaart = g("scorekaart", {})
    items = scorekaart.get("items", [])
    if items:
        calc_totaal = sum(i.get("score", 0) for i in items)
        check(results,
              "scorekaart.totaal == som van individuele scores",
              calc_totaal == scorekaart.get("totaal"),
              f"som={calc_totaal}, opgeslagen={scorekaart.get('totaal')}")

    # 11. EINDOORDEEL LOGICA
    totaal = scorekaart.get("totaal", 0)
    fv_dcf_score = next((i["score"] for i in items if "Fair Value DCF" in i.get("framework", "") and "IPO" not in i.get("framework", "")), None)
    if fv_dcf_score is not None:
        if totaal >= 33 and fv_dcf_score >= 3:
            expected = "KOOP"
        elif totaal < 24 or fv_dcf_score == 1:
            expected = "PASS"
        else:
            expected = "HOLD"
        check(results,
              "scorekaart.eindoordeel volgt deterministische regels",
              scorekaart.get("eindoordeel") == expected,
              f"verwacht={expected}, opgeslagen={scorekaart.get('eindoordeel')}")

    # 12. EXEC SUMMARY OORDEEL == SCOREKAART EINDOORDEEL
    check(results,
          "exec_summary.oordeel == scorekaart.eindoordeel",
          g("executive_summary.oordeel") == scorekaart.get("eindoordeel"),
          f"exec={g('executive_summary.oordeel')}, score={scorekaart.get('eindoordeel')}")

    # 13. SYNTHESE BANDBREEDTE
    synthese = g("fair_value.synthese", {})
    if synthese and fv_scenarios:
        pess = next((s for s in fv_scenarios if s.get("scenario") == "Pessimistisch"), None)
        opti = next((s for s in fv_scenarios if s.get("scenario") == "Optimistisch"), None)
        if pess:
            check(results,
                  "synthese.laag == pessimistisch fair value",
                  approx(synthese.get("fair_value_bandbreedte_laag"), pess.get("fair_value")),
                  f"synthese={synthese.get('fair_value_bandbreedte_laag')}, pess={pess.get('fair_value')}")
        if opti:
            check(results,
                  "synthese.hoog == optimistisch fair value",
                  approx(synthese.get("fair_value_bandbreedte_hoog"), opti.get("fair_value")),
                  f"synthese={synthese.get('fair_value_bandbreedte_hoog')}, opti={opti.get('fair_value')}")
        if basis_scenario:
            check(results,
                  "synthese.centraal == basis fair value",
                  approx(synthese.get("fair_value_bandbreedte_centraal"), basis_scenario.get("fair_value")),
                  f"synthese={synthese.get('fair_value_bandbreedte_centraal')}, basis={basis_scenario.get('fair_value')}")

    # 14. KOOPNIVEAU = fair_value_basis * (1 - MoS%)
    mos = synthese.get("margin_of_safety_vereist_pct", 25)
    fv_basis = g("executive_summary.fair_value_basis")
    if fv_basis and mos:
        calc_koopniveau = round(fv_basis * (1 - mos / 100))
        check(results,
              "synthese.koopniveau == fair_value_basis * (1 - MoS%)",
              approx(synthese.get("koopniveau"), calc_koopniveau, 5),
              f"opgeslagen={synthese.get('koopniveau')}, berekend={calc_koopniveau}")

    # 15. DCF PARAMETERS consistent in scenario's
    dcf = g("fair_value.dcf", {})
    if dcf and basis_scenario:
        check(results,
              "dcf.groei_fase1_pct == basis scenario fcf_groei_pct",
              approx(dcf.get("groei_fase1_pct"), basis_scenario.get("fcf_groei_pct"), 0.1),
              f"dcf={dcf.get('groei_fase1_pct')}, scenario={basis_scenario.get('fcf_groei_pct')}")

    # 16. SHARES OUTSTANDING aanwezig en > 0
    check(results,
          "fair_value.dcf.shares_outstanding_mln aanwezig en > 0",
          g("fair_value.dcf.shares_outstanding_mln") is not None and g("fair_value.dcf.shares_outstanding_mln") > 0,
          f"shares={g('fair_value.dcf.shares_outstanding_mln')}")

    # 17. MOAT OORDEEL consistent met scorekaart
    moat_oordeel = g("moat.oordeel")
    moat_score_item = next((i for i in items if i.get("framework") == "Moat"), None)
    if moat_oordeel and moat_score_item:
        if moat_oordeel == "WIDE MOAT":
            check(results,
                  "moat WIDE MOAT -> scorekaart Moat >= 3",
                  moat_score_item["score"] >= 3,
                  f"moat={moat_oordeel}, score={moat_score_item['score']}")
        elif moat_oordeel == "NO MOAT":
            check(results,
                  "moat NO MOAT -> scorekaart Moat <= 2",
                  moat_score_item["score"] <= 2,
                  f"moat={moat_oordeel}, score={moat_score_item['score']}")

    # 18. MANAGEMENT OORDEEL consistent met scorekaart
    mgmt_oordeel = g("management.oordeel")
    mgmt_score_item = next((i for i in items if i.get("framework") == "Management"), None)
    if mgmt_oordeel and mgmt_score_item:
        if mgmt_oordeel == "ZORGWEKKEND":
            check(results,
                  "management ZORGWEKKEND -> scorekaart Management <= 2",
                  mgmt_score_item["score"] <= 2,
                  f"mgmt={mgmt_oordeel}, score={mgmt_score_item['score']}")

    # 19. MINIMALE TEKSTLENGTES (woordtellingen)
    min_lengths = {
        "executive_summary.kernthese": 80,
        "bedrijfsprofiel.beschrijving": 150,
        "bedrijfsprofiel.geschiedenis": 150,
        "moat.toelichting": 80,
        "management.toelichting": 80,
        "fair_value.dcf_toelichting": 80,
        "scorekaart.samenvatting": 80,
    }
    for path, min_words in min_lengths.items():
        text = g(path, "")
        if text:
            wc = len(text.split())
            check(results,
                  f"Woordtelling {path} >= {min_words}",
                  wc >= min_words,
                  f"geteld={wc}, minimum={min_words}")

    # 20. VERPLICHTE VELDEN AANWEZIG
    required = [
        "meta.ticker", "meta.koers", "meta.valuta", "meta.peildatum",
        "executive_summary.oordeel", "executive_summary.fair_value_basis",
        "bedrijfsprofiel.beschrijving", "bedrijfsprofiel.geschiedenis",
        "moat.oordeel", "moat.toelichting",
        "management.oordeel", "management.toelichting",
        "fair_value.wacc.wacc_pct", "fair_value.dcf",
        "scorekaart.totaal", "scorekaart.eindoordeel",
    ]
    for path in required:
        val = g(path)
        check(results,
              f"Verplicht veld aanwezig: {path}",
              val is not None and val != "",
              f"waarde={'aanwezig' if val else 'ONTBREEKT'}")

    return results


def print_results(ticker, results):
    passes = sum(1 for r in results if r["status"] == "PASS")
    fails = sum(1 for r in results if r["status"] == "FAIL")

    print(f"\n{'='*60}")
    print(f"  CONSISTENCY CHECK: {ticker}")
    print(f"{'='*60}\n")

    for r in results:
        icon = "v" if r["status"] == "PASS" else "x"
        print(f"  {icon} {r['status']:4s}  {r['name']}")
        if r["status"] == "FAIL" and r["detail"]:
            print(f"         -> {r['detail']}")

    print(f"\n{'-'*60}")
    print(f"  Resultaat: {passes} PASS, {fails} FAIL van {len(results)} checks")
    if fails == 0:
        print("  v Alle kruisverwijzingen zijn consistent!")
    else:
        print(f"  x {fails} inconsistentie(s) gevonden - controleer handmatig.")
    print(f"{'-'*60}\n")
    return fails


def resolve_path(arg):
    """Accepteer: vol pad | 'TICKER' | 'TICKER.json'"""
    p = Path(arg)
    if p.exists():
        return p
    candidate = DATA_DIR / (arg if arg.endswith(".json") else f"{arg}.json")
    if candidate.exists():
        return candidate
    return None


def main():
    # Geen args: scan alle JSON's in src/content/data/
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
            data = load_json(f)
            ticker = data.get("meta", {}).get("ticker", f.stem)
            results = verify(data)
            total_fails += print_results(ticker, results)
        print(f"\nTotaal mislukte checks: {total_fails}")
        sys.exit(1 if total_fails > 0 else 0)

    path = resolve_path(sys.argv[1])
    if path is None:
        print(f"Bestand niet gevonden: {sys.argv[1]}")
        print(f"Gezocht in: {DATA_DIR}")
        sys.exit(2)

    data = load_json(path)
    ticker = data.get("meta", {}).get("ticker", path.stem)
    results = verify(data)
    fails = print_results(ticker, results)
    sys.exit(1 if fails > 0 else 0)


if __name__ == "__main__":
    main()
