"""
check-sources.py — dwingt brondiscipline af op de JSON-output.

Achtergrond: cowork heeft op 2026-04-24 bij ATC.md cijfers ingevuld die niet
uit officiële bronnen kwamen (verzonnen op basis van "plausibele marge",
"payout-beleid × nettowinst", etc.). METHODE.md verbiedt dit expliciet maar
de regel was niet afdwingbaar. Dit script maakt hem afdwingbaar.

REGELS:

1. Voor elk jaar J dat voorkomt in een financieel-tabel
   (resultatenrekening / balans / kasstromen / rendementsindicatoren /
   accruals) met TEN MINSTE ÉÉN niet-null, niet-nul numerieke waarde:
     → jaar J MOET voorkomen in databronnen.financieel[] met een niet-lege url
   Zonder bron = hard fail.

2. Als een rij in een financieel-tabel volledig leeg is (alle data-velden
   null), is dat OK — dat is de correcte handling voor 'geen bron
   beschikbaar'. Geen fail.

3. Elke databronnen.financieel[] entry moet een niet-lege url hebben.

4. WAARSCHUWING (geen fail): als de top-level `bronnen` array < 10 entries
   heeft, kan dat duiden op onvoldoende bronnen-dekking voor een volledige
   analyse. Wordt als WARN gelogd, niet als FAIL.

Exit 0 = clean, exit 1 = één of meer fails. WARN's gaan naar stdout maar
beïnvloeden exit-code niet.

CLI: python scripts/check-sources.py TICKER
  Leest platform/src/content/data/[TICKER].json
"""

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

REPO = Path(__file__).resolve().parent.parent

FINANCIEEL_TABELLEN = [
    "resultatenrekening",
    "balans",
    "kasstromen",
    "rendementsindicatoren",
    "accruals",
]

BRONNEN_WARN_MIN = 10


def is_blank(value) -> bool:
    """True als value een 'leeg' data-signaal is (null, lege string, dash)."""
    if value is None:
        return True
    if isinstance(value, str) and value.strip() in ("", "-", "—", "n/a", "N/A"):
        return True
    return False


def row_has_data(row: dict) -> bool:
    """True als de rij minstens één niet-blank veld heeft buiten 'jaar'."""
    for key, value in row.items():
        if key == "jaar":
            continue
        if isinstance(value, (int, float)) and value != 0:
            return True
        if not is_blank(value) and not isinstance(value, (int, float)):
            return True
        if isinstance(value, (int, float)) and value == 0:
            # 0.0 is een geldige datapoint (bv FCF = 0), beschouw als ingevuld
            return True
    return False


def collect_years_with_data(fin: dict) -> dict[int, list[str]]:
    """Map jaar -> lijst van tabellen waarin dat jaar een ingevulde rij heeft."""
    result: dict[int, list[str]] = {}
    for table_name in FINANCIEEL_TABELLEN:
        rows = fin.get(table_name, [])
        if not isinstance(rows, list):
            continue
        for row in rows:
            if not isinstance(row, dict):
                continue
            jaar = row.get("jaar")
            if not isinstance(jaar, int):
                continue
            if row_has_data(row):
                result.setdefault(jaar, []).append(table_name)
    return result


def main() -> int:
    if len(sys.argv) != 2:
        print("gebruik: check-sources.py TICKER", file=sys.stderr)
        return 2

    ticker = sys.argv[1]
    json_path = REPO / "platform" / "src" / "content" / "data" / f"{ticker}.json"
    if not json_path.exists():
        print(f"[check-sources] FAIL: {json_path.relative_to(REPO)} niet gevonden", file=sys.stderr)
        return 1

    data = json.loads(json_path.read_text(encoding="utf-8"))
    fin = data.get("financieel", {}) or {}
    db = data.get("databronnen", {}) or {}
    bronnen = db.get("financieel", []) or []

    # Jaar -> entry uit databronnen.financieel
    bron_by_jaar: dict[int, dict] = {}
    for entry in bronnen:
        if not isinstance(entry, dict):
            continue
        jaar = entry.get("jaar")
        if isinstance(jaar, int):
            bron_by_jaar[jaar] = entry

    fails: list[str] = []
    warns: list[str] = []

    # REGEL 3: elke bron-entry moet een url hebben
    for entry in bronnen:
        if not isinstance(entry, dict):
            fails.append(f"databronnen.financieel bevat een niet-object entry: {entry!r}")
            continue
        jaar = entry.get("jaar")
        url = entry.get("url")
        if is_blank(url):
            fails.append(f"databronnen.financieel[jaar={jaar}] heeft geen url")

    # REGEL 1: elk jaar met data in een tabel moet een matching bron hebben
    years_with_data = collect_years_with_data(fin)
    for jaar, tables in sorted(years_with_data.items()):
        if jaar not in bron_by_jaar:
            fails.append(
                f"jaar {jaar} heeft data in {', '.join(tables)} maar GEEN entry in "
                f"databronnen.financieel → verwijder de rij(en) of voeg een bron toe"
            )
            continue
        entry = bron_by_jaar[jaar]
        if is_blank(entry.get("url")):
            fails.append(
                f"jaar {jaar} heeft data maar databronnen.financieel[jaar={jaar}] "
                f"heeft geen url"
            )

    # WAARSCHUWING: algemene bronnen-array minimum
    top_bronnen = data.get("bronnen", []) or []
    if len(top_bronnen) < BRONNEN_WARN_MIN:
        warns.append(
            f"top-level 'bronnen' array heeft {len(top_bronnen)} entries "
            f"(< {BRONNEN_WARN_MIN}) — mogelijk onvolledige bronnen-dekking"
        )

    # Output
    if warns:
        for w in warns:
            print(f"[check-sources] WARN: {w}")

    if fails:
        print(f"[check-sources] FAIL: {len(fails)} probleem(en) gevonden", file=sys.stderr)
        for f in fails:
            print(f"  - {f}", file=sys.stderr)
        return 1

    years_checked = len(years_with_data)
    print(f"[check-sources] OK — {years_checked} jaar met data, alle gematcht aan bron-URL")
    return 0


if __name__ == "__main__":
    sys.exit(main())
