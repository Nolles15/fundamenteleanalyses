import { prisma } from '@/lib/prisma'

const PLAN_LABELS: Record<string, string> = {
  GRATIS: 'Gratis',
  PREMIUM_MAAND: 'Premium (mnd)',
  PREMIUM_JAAR: 'Premium (jaar)',
}

export default async function GebruikersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      subscription: true,
      purchases: { select: { ticker: true } },
    },
  })

  const total = users.length
  const premium = users.filter(
    (u) => u.subscription?.plan && u.subscription.plan !== 'GRATIS'
  ).length
  const metAankopen = users.filter((u) => u.purchases.length > 0).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary font-sans">
          Gebruikers
        </h1>
        <p className="text-sm text-text-muted font-sans">
          {total} totaal &middot; {premium} premium &middot; {metAankopen} met aankopen
        </p>
      </div>

      <div
        className="bg-bg-surface border border-border rounded-lg overflow-hidden"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Naam</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Email</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Aankopen</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Geregistreerd</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const plan = user.subscription?.plan ?? 'GRATIS'
                const status = user.subscription?.status ?? 'ACTIVE'
                const isPremium = plan !== 'GRATIS'

                return (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0 hover:bg-bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                      {user.naam ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPremium
                            ? 'bg-buy-bg text-buy'
                            : 'bg-bg-muted text-text-muted'
                        }`}
                      >
                        {PLAN_LABELS[plan] ?? plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusDot status={status} />
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {user.purchases.length === 0 ? (
                        <span className="text-text-muted">—</span>
                      ) : (
                        <span className="font-medium">
                          {user.purchases.map((p: { ticker: string }) => p.ticker).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-text-muted tabular-nums whitespace-nowrap">
                      {user.createdAt.toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    ACTIVE: { color: 'bg-buy', label: 'Actief' },
    PAST_DUE: { color: 'bg-hold', label: 'Achterstallig' },
    CANCELED: { color: 'bg-pass', label: 'Opgezegd' },
    INCOMPLETE: { color: 'bg-text-muted', label: 'Incompleet' },
  }
  const { color, label } = config[status] ?? { color: 'bg-text-muted', label: status }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {label}
    </span>
  )
}
