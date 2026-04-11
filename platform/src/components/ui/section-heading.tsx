/**
 * Subsectie-heading — gebruikt binnen secties (niet de hoofdsectie-titels).
 * Compact navy accent-lijn + titel + doorlopende lijn.
 */
export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-0.5 h-4 bg-accent/40 rounded-full shrink-0" />
      <h3 className="text-sm font-semibold text-text-primary font-sans tracking-wide shrink-0">
        {title}
      </h3>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
