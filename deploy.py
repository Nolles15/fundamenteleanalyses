"""
deploy.py — Update index.json en push alle analyses naar GitHub in één stap.

Gebruik:
  python deploy.py
  python deploy.py --dry-run   (laat zien wat er zou gebeuren, zonder te pushen)

Workflow:
  1. Leest alle dashboard-format JSONs in data/
  2. Schrijft data/index.json opnieuw
  3. git add data/
  4. git commit (alleen als er wijzigingen zijn)
  5. git push origin main
"""

import json
import subprocess
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

REPO = Path(__file__).parent
DRY_RUN = "--dry-run" in sys.argv


def run(cmd: list, check=True) -> subprocess.CompletedProcess:
    print(f"  $ {' '.join(cmd)}")
    if DRY_RUN and cmd[0] == "git" and cmd[1] in ("commit", "push"):
        print("    (dry-run, overgeslagen)")
        return subprocess.CompletedProcess(cmd, 0)
    return subprocess.run(cmd, cwd=str(REPO), capture_output=True, text=True,
                          encoding="utf-8", errors="replace")


def git_heeft_wijzigingen() -> bool:
    r = subprocess.run(["git", "status", "--porcelain", "data/"],
                       cwd=str(REPO), capture_output=True, text=True, encoding="utf-8")
    return bool(r.stdout.strip())


# ── Stap 1: index.json bijwerken ─────────────────────────────────────────────
print("=== Stap 1: index.json bijwerken ===")
from update_index import update_index
bedrijven = update_index()

# ── Stap 2: domein invoeren voor nieuwe bedrijven ────────────────────────────
idx_pad = REPO / "data" / "index.json"
idx = json.loads(idx_pad.read_text(encoding="utf-8"))
zonder_domein = [c for c in idx["companies"] if not c.get("domein")]
if zonder_domein:
    print(f"\n{'='*50}")
    print("Nieuwe bedrijven zonder domein gevonden.")
    print("Vul het website-domein in (bijv. adyen.com) of druk Enter om over te slaan:\n")
    for c in zonder_domein:
        domein = input(f"  {c['ticker']} — {c['naam']}: ").strip()
        if domein:
            c["domein"] = domein
    idx_pad.write_text(json.dumps(idx, ensure_ascii=False, indent=2), encoding="utf-8")

# ── Stap 3: git add + commit + push ──────────────────────────────────────────
print("\n=== Stap 2: Git push ===")

if not git_heeft_wijzigingen():
    print("  Geen wijzigingen in data/ — niets te committen.")
    sys.exit(0)

tickers = [c["ticker"] for c in idx["companies"]]
bericht = f"data: analyses bijgewerkt ({date.today()}) — {', '.join(tickers)}"

r = run(["git", "add", "data/"])
if r.returncode != 0:
    print(f"FOUT bij git add:\n{r.stderr}")
    sys.exit(1)

r = run(["git", "commit", "-m", bericht])
if r.returncode != 0 and "nothing to commit" not in r.stdout + r.stderr:
    print(f"FOUT bij git commit:\n{r.stderr}")
    sys.exit(1)

r = run(["git", "push", "origin", "main"])
if r.returncode != 0:
    print(f"FOUT bij git push:\n{r.stderr}")
    sys.exit(1)

print(f"\n✓ Klaar! {len(idx['companies'])} bedrijven live op GitHub Pages.")
