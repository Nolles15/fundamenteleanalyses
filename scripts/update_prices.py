"""
Wekelijkse data-update voor het Aandelenanalyse Dashboard.

Wat dit script doet:
  1. Leest alle bedrijven uit data/index.json
  2. Haalt actuele koers + financiële metrics op via yfinance
  3. Detecteert of er nieuwe kwartaal-/jaarcijfers zijn uitgebracht
  4. Zet 'update_beschikbaar: true' als nieuwe rapportage beschikbaar is
  5. Schrijft alle wijzigingen terug naar de JSON-bestanden
"""

import json
import os
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

try:
    import yfinance as yf
except ImportError:
    print("yfinance niet gevonden. Installeer met: pip install yfinance")
    sys.exit(1)

# ────────────────────────────────────────────────────────────
# CONFIGURATIE
# ────────────────────────────────────────────────────────────

# Relatief pad naar de data-map (script staat in scripts/, data staat in data/)
DATA_DIR = Path(__file__).parent.parent / "data"

# Vertaaltabel: beurs-code → yfinance suffix
EXCHANGE_SUFFIX = {
    "OSL":    ".OL",    # Oslo Børs
    "STO":    ".ST",    # Stockholm
    "BME":    ".MC",    # Madrid/Barcelona
    "MAD":    ".MC",
    "AMS":    ".AS",    # Amsterdam
    "FRA":    ".DE",    # Frankfurt (XETRA)
    "LON":    ".L",     # London
    "SWX":    ".SW",    # Zürich
    "HEL":    ".HE",    # Helsinki
    "CPH":    ".CO",    # Kopenhagen
    "BRU":    ".BR",    # Brussel
    "MIL":    ".MI",    # Milaan
    "LIS":    ".LS",    # Lissabon
    "WSE":    ".WA",    # Warschau
    "NYSE":   "",
    "NASDAQ": "",
    "AEX":    ".AS",
}

TIMEOUT = 10  # seconden per yfinance call

# ────────────────────────────────────────────────────────────
# HELPERS
# ────────────────────────────────────────────────────────────

def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path: Path, data: dict):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✓ Opgeslagen: {path.name}")

def ticker_symbol(ticker: str, exchange: str) -> str:
    """Bouw het yfinance ticker-symbool op."""
    suffix = EXCHANGE_SUFFIX.get(exchange.upper(), "")
    return f"{ticker}{suffix}"

def safe_round(val, decimals=2):
    """Rond af als het een getal is, anders None."""
    try:
        return round(float(val), decimals)
    except (TypeError, ValueError):
        return None

def parse_date(s) -> date | None:
    """Probeer een datum te parsen vanuit string of timestamp."""
    if s is None:
        return None
    if isinstance(s, (int, float)):
        try:
            return date.fromtimestamp(s)
        except Exception:
            return None
    if isinstance(s, date):
        return s
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%d-%m-%Y"):
        try:
            return datetime.strptime(str(s)[:10], fmt).date()
        except ValueError:
            continue
    return None

def pct_change(new_val, old_val):
    """Procentuele verandering."""
    if old_val and old_val != 0:
        return round((new_val - old_val) / abs(old_val) * 100, 1)
    return None

# ────────────────────────────────────────────────────────────
# YFINANCE FETCH
# ────────────────────────────────────────────────────────────

def fetch_yfinance(symbol: str) -> dict | None:
    """
    Haal actuele data op via yfinance.
    Geeft een dict terug met gestandaardiseerde velden, of None bij fout.
    """
    try:
        stock = yf.Ticker(symbol)
        info = stock.info or {}

        # Prijs — probeer meerdere velden
        price = (
            info.get("currentPrice")
            or info.get("regularMarketPrice")
            or info.get("previousClose")
        )
        if price is None:
            # Fallback: slotkoers van gisteren
            hist = stock.history(period="5d")
            if not hist.empty:
                price = round(float(hist["Close"].iloc[-1]), 2)

        # Meest recente kwartaal / jaarrapport
        most_recent_quarter = parse_date(info.get("mostRecentQuarter"))

        # Volgende earnings datum
        next_earnings = None
        try:
            cal = stock.calendar
            if cal is not None and not cal.empty:
                # calendar kan een DataFrame of dict zijn afhankelijk van yfinance versie
                if hasattr(cal, "iloc"):
                    ev = cal.iloc[0, 0] if cal.shape[0] > 0 else None
                elif isinstance(cal, dict):
                    ev = cal.get("Earnings Date", [None])[0]
                else:
                    ev = None
                next_earnings = parse_date(ev)
        except Exception:
            pass

        market_cap = info.get("marketCap")
        if market_cap:
            # Formatteer als leesbare string
            if market_cap >= 1e12:
                mc_str = f"${market_cap/1e12:.1f} bln"
            elif market_cap >= 1e9:
                mc_str = f"${market_cap/1e9:.1f} mrd"
            else:
                mc_str = f"${market_cap/1e6:.0f} mln"
        else:
            mc_str = None

        return {
            "koers":                   safe_round(price, 2),
            "pe":                      safe_round(info.get("trailingPE"), 1),
            "forward_pe":              safe_round(info.get("forwardPE"), 1),
            "p_b":                     safe_round(info.get("priceToBook"), 2),
            "ev_ebitda":               safe_round(info.get("enterpriseToEbitda"), 1),
            "ev_omzet":                safe_round(info.get("enterpriseToRevenue"), 2),
            "dividendrendement_pct":   safe_round((info.get("dividendYield") or 0) * 100, 1),
            "marktkapitalisatie":      mc_str,
            "most_recent_quarter":     most_recent_quarter,
            "next_earnings":           next_earnings,
            "currency":                info.get("currency"),
        }
    except Exception as e:
        print(f"  ✗ yfinance fout voor {symbol}: {e}")
        return None

# ────────────────────────────────────────────────────────────
# UPDATE LOGICA PER BEDRIJF
# ────────────────────────────────────────────────────────────

def update_company(json_path: Path, summary: dict) -> dict:
    """
    Update één bedrijfs-JSON met actuele data.
    Geeft een bijgewerkt summary-dict terug voor index.json.
    """
    data = load_json(json_path)
    ticker  = data["meta"]["ticker"]
    exchange = data["meta"].get("exchange", "")
    symbol  = ticker_symbol(ticker, exchange)
    peildatum = parse_date(data["meta"].get("peildatum"))

    print(f"\n→ {ticker} ({symbol})")

    yf_data = fetch_yfinance(symbol)

    if yf_data is None or yf_data.get("koers") is None:
        print(f"  ⚠ Geen actuele koers ontvangen — bestand ongewijzigd gelaten.")
        return summary

    old_koers = data["meta"]["koers"]
    new_koers = yf_data["koers"]
    koers_wijziging = pct_change(new_koers, old_koers)

    # ── Koers updaten ──────────────────────────────────────
    data["meta"]["koers"] = new_koers
    data["executive_summary"]["koers"] = new_koers

    # Marktkapitalisatie bijwerken als beschikbaar
    if yf_data["marktkapitalisatie"]:
        data["meta"]["marktkapitalisatie"] = yf_data["marktkapitalisatie"]

    # ── Upside herberekenen ────────────────────────────────
    fv_basis = data["executive_summary"].get("fair_value_basis")
    if fv_basis and new_koers:
        new_upside = round((fv_basis - new_koers) / new_koers * 100, 1)
        data["executive_summary"]["upside_pct"] = new_upside
    else:
        new_upside = summary.get("upside_pct")

    # ── Waarderingsratio's bijwerken ───────────────────────
    w = data["financieel"]["waardering"]
    updates = {
        "pe":                      yf_data["pe"],
        "p_b":                     yf_data["p_b"],
        "ev_ebitda":               yf_data["ev_ebitda"],
        "ev_omzet":                yf_data["ev_omzet"],
        "dividendrendement_pct":   yf_data["dividendrendement_pct"] or w.get("dividendrendement_pct"),
    }
    for k, v in updates.items():
        if v is not None:
            w[k] = v

    # ── FCF Yield herberekenen als we de FCF kennen ────────
    kasstromen = data["financieel"].get("kasstromen", [])
    if kasstromen and new_koers:
        meest_recent_fcf = kasstromen[-1].get("fcf_per_aandeel")
        if meest_recent_fcf:
            # FCF per aandeel staat in $, koers kan in andere valuta zijn
            # Alleen updaten als zelfde valuta (rudimentaire check)
            currency = yf_data.get("currency", "")
            if currency in ("USD", "EUR", "GBP") or exchange in ("NYSE", "NASDAQ", "AMS", "FRA"):
                fcf_yield = round(meest_recent_fcf / new_koers * 100, 1)
                w["fcf_yield_pct"] = fcf_yield

    # ── Nieuwe cijfers detectie ────────────────────────────
    update_beschikbaar = False
    update_reden = []

    mrq = yf_data["most_recent_quarter"]
    if mrq and peildatum and mrq > peildatum:
        update_beschikbaar = True
        update_reden.append(f"Nieuw kwartaalrapport: {mrq}")

    next_earn = yf_data["next_earnings"]
    if next_earn:
        today = date.today()
        days_until = (next_earn - today).days
        if 0 <= days_until <= 14:
            update_beschikbaar = True
            update_reden.append(f"Earnings verwacht over {days_until} dagen ({next_earn})")

    data["update_beschikbaar"] = update_beschikbaar
    data["update_reden"] = update_reden if update_reden else None
    data["laatste_koers_update"] = date.today().isoformat()

    # ── Opslaan ────────────────────────────────────────────
    save_json(json_path, data)

    # Feedback
    sign = "+" if (koers_wijziging or 0) > 0 else ""
    print(f"  Koers: {old_koers} → {new_koers} ({sign}{koers_wijziging}%)")
    if update_beschikbaar:
        for r in update_reden:
            print(f"  ⚡ UPDATE BESCHIKBAAR: {r}")

    # ── Summary voor index.json bijwerken ─────────────────
    summary["koers"] = new_koers
    summary["upside_pct"] = new_upside
    summary["update_beschikbaar"] = update_beschikbaar
    return summary

# ────────────────────────────────────────────────────────────
# MAIN
# ────────────────────────────────────────────────────────────

def main():
    print("=" * 50)
    print("Aandelenanalyse — Wekelijkse data-update")
    print(f"Datum: {date.today()}")
    print("=" * 50)

    index_path = DATA_DIR / "index.json"
    if not index_path.exists():
        print(f"Fout: {index_path} niet gevonden.")
        sys.exit(1)

    index = load_json(index_path)
    companies = index.get("companies", [])

    if not companies:
        print("Geen bedrijven gevonden in index.json.")
        sys.exit(0)

    updated_summaries = []
    for summary in companies:
        ticker = summary["ticker"]
        json_path = DATA_DIR / f"{ticker}.json"
        if not json_path.exists():
            print(f"\n⚠ {ticker}.json niet gevonden — overgeslagen.")
            updated_summaries.append(summary)
            continue
        updated = update_company(json_path, summary.copy())
        updated_summaries.append(updated)

    # Index bijwerken
    index["companies"] = updated_summaries
    index["laatste_update"] = date.today().isoformat()
    save_json(index_path, index)

    # Samenvattend rapport
    print("\n" + "=" * 50)
    print("SAMENVATTING")
    print("=" * 50)
    updates = [c for c in updated_summaries if c.get("update_beschikbaar")]
    if updates:
        print(f"\n⚡ {len(updates)} bedrijf/bedrijven met nieuwe data:")
        for c in updates:
            print(f"  • {c['ticker']} — {c['naam']}")
    else:
        print("\n✓ Alles up-to-date, geen nieuwe rapportages gedetecteerd.")

    print(f"\n✓ {len(updated_summaries)} bedrijven bijgewerkt.")

if __name__ == "__main__":
    main()
