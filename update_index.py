"""
update_index.py — Regenereer data/index.json vanuit dashboard-format JSON-analyses.

Gebruik:
  python update_index.py

Wat dit script doet:
  - Leest alle TICKER.json bestanden in data/ (dashboard-formaat: heeft 'meta' + 'executive_summary')
  - Slaat index.json over en bestanden in oud formaat over
  - Behoudt bestaande 'domein' waarden uit index.json
  - Schrijft een nieuw data/index.json in het formaat dat de site verwacht
"""

import json
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

DATA_MAP = Path(__file__).parent / "data"


def lees_domeinen(index_pad: Path) -> dict:
    """Haal bestaande domein-waarden op uit index.json zodat ze niet verloren gaan."""
    if not index_pad.exists():
        return {}
    try:
        d = json.loads(index_pad.read_text(encoding="utf-8"))
        return {c["ticker"]: c.get("domein", "") for c in d.get("companies", [])}
    except Exception:
        return {}


def update_index(data_map: Path = DATA_MAP) -> list:
    index_pad = data_map / "index.json"
    domeinen  = lees_domeinen(index_pad)
    companies = []

    for pad in sorted(data_map.glob("*.json")):
        if pad.name == "index.json":
            continue
        try:
            d = json.loads(pad.read_text(encoding="utf-8"))

            # Alleen dashboard-formaat accepteren (heeft 'meta' en 'executive_summary')
            if "meta" not in d or "executive_summary" not in d:
                print(f"  Overgeslagen (oud/onbekend formaat): {pad.name}")
                continue

            meta   = d["meta"]
            es     = d["executive_summary"]
            sk     = d.get("scorekaart", {})
            totaal = sum(i.get("score", 0) for i in sk.get("items", []))
            maxsc  = sum(i.get("max",   0) for i in sk.get("items", []))
            ticker = meta.get("ticker", pad.stem)

            companies.append({
                "ticker":            ticker,
                "naam":              meta.get("naam", ""),
                "sector":            meta.get("sector", ""),
                "exchange":          meta.get("exchange", ""),
                "koers":             meta.get("koers"),
                "valuta":            meta.get("valuta", ""),
                "fair_value_basis":  es.get("fair_value_basis"),
                "upside_pct":        es.get("upside_pct"),
                "oordeel":           es.get("oordeel", "HOLD"),
                "scorekaart_totaal": totaal,
                "scorekaart_max":    maxsc,
                "peildatum":         meta.get("peildatum", ""),
                "domein":            domeinen.get(ticker, ""),
            })
            print(f"  + {ticker:8s} {meta.get('naam', '')} ({es.get('oordeel', '?')})")

        except Exception as e:
            print(f"  FOUT: {pad.name} — {e}")

    index_pad.write_text(
        json.dumps({"laatste_update": str(date.today()), "companies": companies},
                   ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"\nindex.json bijgewerkt: {len(companies)} bedrijven")
    return companies


if __name__ == "__main__":
    update_index()
