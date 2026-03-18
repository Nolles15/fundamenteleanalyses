@echo off
title Aandelenanalyse Dashboard
echo.
echo  Aandelenanalyse Dashboard
echo  ═══════════════════════════════════════
echo  Server draait op: http://localhost:8080
echo  Sluit dit venster om de server te stoppen.
echo.
start "" "http://localhost:8080"
python -m http.server 8080 2>nul
if %errorlevel% neq 0 (
    py -m http.server 8080 2>nul
)
if %errorlevel% neq 0 (
    echo Python niet gevonden. Probeer: winget install Python.Python.3
    pause
)
