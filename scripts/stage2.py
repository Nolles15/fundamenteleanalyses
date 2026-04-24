"""
stage2.py — orchestrator voor stage 2 van de aandelenanalyse-pipeline.

Stage 1 (Claude cowork) levert `research/[TICKER].md`.
Stage 2 (Claude Code) zet dat om naar JSON + pusht naar productie.

Dit script bundelt de omringende gates zodat Claude Code alleen nog de
MD→JSON interpretatie hoeft te doen; alles eromheen (checks, file-writes,
validators, build, commit) gaat via één entrypoint:

  python scripts/stage2.py TICKER precheck   — vóór JSON schrijven
  python scripts/stage2.py TICKER write PATH — JSON-file op PATH naar beide targets
  python scripts/stage2.py TICKER verify     — SHA256 + validators + build
  python scripts/stage2.py TICKER publish    — git add + commit + push

Of in één keer (als JSON al geschreven is):

  python scripts/stage2.py TICKER verify-and-publish

Elke subcommand print voortgang en returnt exit-code 0 bij succes.
Eerste faal = stop. Geen silencing.
"""

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

REPO = Path(__file__).resolve().parent.parent
RESEARCH = REPO / "research"
DATA_PRIMARY = REPO / "data"
DATA_PLATFORM = REPO / "platform" / "src" / "content" / "data"
VALIDATORS = REPO / "platform" / "scripts"
PLATFORM = REPO / "platform"
CHECK_DRIFT = REPO / "scripts" / "check-drift.py"
CHECK_SOURCES = REPO / "scripts" / "check-sources.py"

MIN_JSON_BYTES = 20_000
REQUIRED_TOP_LEVEL_KEYS = 17


def log(msg: str) -> None:
    print(f"[stage2] {msg}")


def fail(msg: str, code: int = 1) -> int:
    print(f"[stage2] FAIL: {msg}", file=sys.stderr)
    return code


def run(cmd: list[str], cwd: Path | None = None) -> int:
    """Run subprocess, stream output, return exit code.
    Windows note: shell=True nodig voor .cmd-shims (zoals npm.cmd, npx.cmd).
    """
    log("$ " + " ".join(cmd) + (f"   (cwd={cwd})" if cwd else ""))
    needs_shell = sys.platform == "win32" and cmd and cmd[0] in ("npm", "npx")
    if needs_shell:
        result = subprocess.run(" ".join(cmd), cwd=str(cwd) if cwd else None, shell=True)
    else:
        result = subprocess.run(cmd, cwd=str(cwd) if cwd else None)
    return result.returncode


# ---------------------------------------------------------------------------
# subcommands
# ---------------------------------------------------------------------------


def cmd_precheck(ticker: str) -> int:
    """Drift-scan + MD-aanwezig + Opmerkingen-sectie tonen."""
    log(f"precheck voor {ticker}")

    rc = run([sys.executable, str(CHECK_DRIFT)])
    if rc != 0:
        return fail("check-drift.py meldt drift — fix eerst voor verder")

    md_path = RESEARCH / f"{ticker}.md"
    if not md_path.exists():
        return fail(f"{md_path.relative_to(REPO)} niet gevonden — laat cowork stage 1 afmaken")

    md_bytes = md_path.stat().st_size
    log(f"OK research/{ticker}.md aanwezig ({md_bytes:,} bytes)")

    text = md_path.read_text(encoding="utf-8")
    marker = "## Opmerkingen voor Claude Code"
    if marker in text:
        section = text.split(marker, 1)[1].strip()
        if section:
            log(f"Cowork heeft opmerkingen achtergelaten — adresseer deze in de JSON:\n")
            print(section[:2000])
            print()

    log("precheck OK — ga nu de MD naar JSON omzetten, schrijf met 'write'")
    return 0


def cmd_write(ticker: str, source_path: str) -> int:
    """Kopieer bron-JSON naar beide target-paden, SHA256-check, size-check."""
    log(f"write JSON voor {ticker} vanaf {source_path}")

    src = Path(source_path).resolve()
    if not src.exists():
        return fail(f"bron-JSON niet gevonden: {src}")

    # Valideer de bron als parseable JSON met 17 top-level keys
    try:
        data = json.loads(src.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return fail(f"bron is geen valide JSON: {e}")

    if not isinstance(data, dict):
        return fail("bron-JSON is geen object op top-level")

    if len(data) != REQUIRED_TOP_LEVEL_KEYS:
        return fail(
            f"top-level keys = {len(data)} (verwacht {REQUIRED_TOP_LEVEL_KEYS}). "
            f"keys: {list(data.keys())}"
        )

    # Schrijf met vaste newline-conventie via json.dump (geen Write-tool,
    # die kapt op ~45KB)
    targets = [
        DATA_PRIMARY / f"{ticker}.json",
        DATA_PLATFORM / f"{ticker}.json",
    ]
    for target in targets:
        target.parent.mkdir(parents=True, exist_ok=True)
        with open(target, "w", encoding="utf-8", newline="\n") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        size = target.stat().st_size
        if size < MIN_JSON_BYTES:
            return fail(f"{target.relative_to(REPO)} te klein ({size} bytes < {MIN_JSON_BYTES})")
        log(f"  geschreven {target.relative_to(REPO)} ({size:,} bytes)")

    # SHA256 beide paden identiek
    digests = [hashlib.sha256(t.read_bytes()).hexdigest() for t in targets]
    if digests[0] != digests[1]:
        return fail(
            f"SHA256 mismatch tussen targets!\n  {targets[0]}: {digests[0]}\n  {targets[1]}: {digests[1]}"
        )
    log(f"SHA256 identiek: {digests[0][:16]}...")
    return 0


def cmd_verify(ticker: str) -> int:
    """check-sources + validate_structure + verify_consistency + npm run build."""
    log(f"verify voor {ticker}")

    # Bronnen-validator: elk jaar met data MOET een bron-URL hebben.
    # Toegevoegd na ATC-incident 2026-04-24 waarin cowork cijfers invulde
    # zonder officiële bron.
    rc = run([sys.executable, str(CHECK_SOURCES), ticker])
    if rc != 0:
        return fail("check-sources.py = FAIL (ingevulde cijfers zonder bron-URL)")

    # Structure validator
    rc = run([sys.executable, str(VALIDATORS / "validate_structure.py"), ticker])
    if rc != 0:
        return fail("validate_structure.py = FAIL")

    # Consistency validator
    rc = run([sys.executable, str(VALIDATORS / "verify_consistency.py"), ticker])
    if rc != 0:
        return fail("verify_consistency.py = FAIL")

    # Build-gate
    rc = run(["npm", "run", "build"], cwd=PLATFORM)
    if rc != 0:
        return fail("npm run build = FAIL (waarschijnlijk null.toLocaleString in een component)")

    log("verify OK — alle vier de gates groen")
    return 0


def cmd_publish(ticker: str, message: str | None = None) -> int:
    """git add beide JSONs + research MD, commit, push origin main."""
    log(f"publish voor {ticker}")

    paths_to_add = [
        str((DATA_PRIMARY / f"{ticker}.json").relative_to(REPO)),
        str((DATA_PLATFORM / f"{ticker}.json").relative_to(REPO)),
        str((RESEARCH / f"{ticker}.md").relative_to(REPO)),
    ]
    rc = run(["git", "add"] + paths_to_add, cwd=REPO)
    if rc != 0:
        return fail("git add = FAIL")

    commit_msg = message or f"feat: {ticker} fundamentele analyse (stage-2 pipeline)"
    rc = run(["git", "commit", "-m", commit_msg], cwd=REPO)
    if rc != 0:
        return fail("git commit = FAIL (mogelijk niks te committen — check 'git status')")

    rc = run(["git", "push", "origin", "main"], cwd=REPO)
    if rc != 0:
        return fail("git push = FAIL")

    log(f"publish OK — {ticker} live via Vercel auto-deploy")
    return 0


def cmd_verify_and_publish(ticker: str, message: str | None) -> int:
    rc = cmd_verify(ticker)
    if rc != 0:
        return rc
    return cmd_publish(ticker, message)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ticker", help="bare ticker (bv VIT-B, niet VIT-B.ST)")
    sub = parser.add_subparsers(dest="action", required=True)

    sub.add_parser("precheck", help="drift-scan + MD aanwezig + opmerkingen")
    write_p = sub.add_parser("write", help="schrijf bron-JSON naar beide target-paden")
    write_p.add_argument("source", help="pad naar de bron-JSON (bv /tmp/VIT-B.json)")
    sub.add_parser("verify", help="structure + consistency + npm build")
    pub_p = sub.add_parser("publish", help="git add/commit/push")
    pub_p.add_argument("-m", "--message", help="optionele commit-message override")
    vp_p = sub.add_parser("verify-and-publish", help="verify + publish in één call")
    vp_p.add_argument("-m", "--message", help="optionele commit-message override")

    args = parser.parse_args()

    if "." in args.ticker:
        return fail(f"ticker bevat een punt ({args.ticker}). Gebruik bare ticker zonder exchange-suffix.")

    if args.action == "precheck":
        return cmd_precheck(args.ticker)
    if args.action == "write":
        return cmd_write(args.ticker, args.source)
    if args.action == "verify":
        return cmd_verify(args.ticker)
    if args.action == "publish":
        return cmd_publish(args.ticker, args.message)
    if args.action == "verify-and-publish":
        return cmd_verify_and_publish(args.ticker, args.message)
    return fail(f"onbekende actie: {args.action}")


if __name__ == "__main__":
    sys.exit(main())
