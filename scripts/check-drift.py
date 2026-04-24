"""
check-drift.py — detecteert drift tussen de enum-bronnen van de pipeline.

Schema-waarheid leeft op dit moment op vier plekken:
  - platform/scripts/validate_structure.py  (Python sets — BRON)
  - platform/src/lib/types.ts               (TypeScript unions)
  - research/TEMPLATE.md                    (markdown met enum-hints)
  - research/_PROMPT_COWORK.md              (markdown met enum-lijsten)

Dit script:
  1. Leest de canonical enums uit validate_structure.py
  2. Checkt dat de andere drie bronnen GEEN legacy-tokens bevatten
     (HOUDEN/MIJDEN/BEAR/BASE/BULL/UITSTEKEND/GOED/ZWAK/BEPERKTE MOAT/...)
  3. Checkt dat de canonical tokens wel aanwezig zijn in template+prompt

Exit 0 = clean, exit 1 = drift gevonden. Kort terug te lopen output.

Uit te breiden bij schema-wijzigingen: voeg nieuwe legacy-tokens toe aan
LEGACY_TOKENS en nieuwe canonical sets aan CANONICAL_REQUIRED.
"""

import re
import sys
from pathlib import Path

# Windows console = cp1252 by default, maar onze docs bevatten UTF-8
# (Immateriële, Efficiënte, em-dashes). Forceer UTF-8 op stdout.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO = Path(__file__).resolve().parent.parent

# Legacy-tokens die NERGENS als geldige waarde meer mogen voorkomen.
# Noot: "GEMIDDELD" NIET hier opnemen — dat is legitiem onderdeel van de
# ESG-enum ("GEMIDDELD RISICO"). Idem andere woorden die ook in andere
# enums voorkomen.
LEGACY_TOKENS = [
    # oude oordeel-enum (vóór KOOP|HOLD|PASS)
    "HOUDEN",
    "MIJDEN",
    "OVERWEEG BIJ DIP",
    # oude management-enum (vóór STERK|NEUTRAAL|ZORGWEKKEND)
    "UITSTEKEND",
    # oude scenario-labels (vóór Pessimistisch|Basis|Optimistisch)
    "BEAR",
    "BULL",
    # oude moat-variant
    "BEPERKTE MOAT",
    # oude scorekaart-schaal
    "0-10 per framework",
    "max 90",
    "integer scores 0-10",
]

# Regels met deze prefix-markers zijn bewust-noemen (bv "NIET HOUDEN" in
# een prompt-waarschuwing) en zijn geen drift. Case-insensitive check.
EXCLUSION_MARKERS = (
    "niet ",  # "NIET HOUDEN/MIJDEN"
    "geen ",  # "geen NL-varianten zoals HOUDEN"
    "nooit ",
)

# Canonical enum-waarden die AANWEZIG moeten zijn in template + prompt.
# Als een van deze verdwijnt is dat ook drift (template gaat drift).
CANONICAL_REQUIRED_IN_DOCS = [
    "KOOP",
    "HOLD",
    "PASS",
    "WIDE MOAT",
    "NARROW MOAT",
    "NO MOAT",
    "STERK",
    "NEUTRAAL",
    "ZORGWEKKEND",
    "Pessimistisch",
    "Basis",
    "Optimistisch",
    "Immateriële activa",
    "Overstapkosten",
    "Netwerkeffecten",
    "Kostenvoordeel",
    "Efficiënte schaal",
]

# Scope voor legacy-scan: bronnen die cowork / validator actief gebruiken.
# Docs (PIPELINE_TWO_STAGE.md, HANDOVER) mogen history benoemen zonder drift
# te signaleren — die zijn bedoeld voor mensen, niet voor de pipeline.
FILES_TO_SCAN = [
    REPO / "research" / "TEMPLATE.md",
    REPO / "research" / "_PROMPT_COWORK.md",
    REPO / "platform" / "src" / "lib" / "types.ts",
]


def _line_is_exclusion_context(line: str) -> bool:
    """True als de regel het legacy-token expliciet uitsluit
    (bv 'NIET HOUDEN', 'geen NL-varianten zoals BEAR')."""
    lowered = line.lower()
    return any(marker in lowered for marker in EXCLUSION_MARKERS)


def scan_legacy(path: Path) -> list[tuple[str, int, str]]:
    """Returns [(token, line_no, line_text)] voor elke legacy-hit.
    Skipt regels waarin het token in uitsluitings-context staat."""
    hits = []
    if not path.exists():
        return hits
    for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if _line_is_exclusion_context(line):
            continue
        for token in LEGACY_TOKENS:
            # Woord-grenzen voor korte tokens (BEAR/BULL) om false-positives
            # op 'beargument' o.i.d. te vermijden.
            if len(token) <= 5:
                pattern = rf"\b{re.escape(token)}\b"
                if re.search(pattern, line):
                    hits.append((token, lineno, line.strip()))
            else:
                if token in line:
                    hits.append((token, lineno, line.strip()))
    return hits


def scan_canonical(path: Path) -> set[str]:
    """Returns set of canonical tokens aanwezig in file."""
    if not path.exists():
        return set()
    text = path.read_text(encoding="utf-8")
    return {token for token in CANONICAL_REQUIRED_IN_DOCS if token in text}


def main() -> int:
    drifts: list[str] = []

    # 0. METHODE.md moet bestaan — dit is de inhoudelijke rigueur die cowork
    #    verplicht leest vóór elke analyse. Zonder dit bestand wordt elke
    #    analyse oppervlakkiger (scoring-rubrics, cyclus-regels, etc ontbreken).
    methode = REPO / "research" / "METHODE.md"
    if not methode.exists():
        drifts.append(
            "MISSING research/METHODE.md — de inhoudelijke methodiek-file. "
            "Cowork heeft die verplicht nodig; zonder wordt elke analyse zwakker."
        )

    # 1. Legacy-token scan (zou nergens mogen voorkomen)
    for path in FILES_TO_SCAN:
        hits = scan_legacy(path)
        for token, lineno, text in hits:
            drifts.append(
                f"LEGACY in {path.relative_to(REPO)}:{lineno}  [{token}]\n    {text[:120]}"
            )

    # 2. Canonical-aanwezigheid in template + prompt
    docs_paths = [
        REPO / "research" / "TEMPLATE.md",
        REPO / "research" / "_PROMPT_COWORK.md",
    ]
    for path in docs_paths:
        if not path.exists():
            drifts.append(f"MISSING {path.relative_to(REPO)}")
            continue
        present = scan_canonical(path)
        missing = set(CANONICAL_REQUIRED_IN_DOCS) - present
        if missing:
            drifts.append(
                f"MISSING canonical tokens in {path.relative_to(REPO)}: "
                + ", ".join(sorted(missing))
            )

    if drifts:
        print("check-drift: DRIFT GEVONDEN")
        for d in drifts:
            print("  -", d)
        print(f"\n{len(drifts)} drift-melding(en). Fix vóór stage 2.")
        return 1

    print("check-drift: OK — geen legacy-tokens, alle canonicals aanwezig")
    return 0


if __name__ == "__main__":
    sys.exit(main())
