@../CLAUDE.md
@AGENTS.md

## Platform-specifiek

- Data wordt geladen via `src/lib/data.ts` (readFileSync at build time)
- `src/lib/types.ts` = het volledige schema — alle componenten bouwen hierop
- Chart design system: zie `src/components/charts/chart-config.ts`
- Kleuren: navy #1E3A5F, blue #4A7AB5, green #166534, gray #A8A29E
- Nederlandse formatting (nl-NL locale) voor getallen en percentages
- PaywallGate wraps premium content met blur + CTA
