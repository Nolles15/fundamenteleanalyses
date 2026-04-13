import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (
    !session?.user?.email ||
    session.user.email !== process.env.ADMIN_EMAIL
  ) {
    redirect('/')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-bg-surface border-r border-border p-5 hidden sm:block">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-4">
          Admin
        </p>
        <nav className="space-y-1">
          <SidebarLink href="/admin">Dashboard</SidebarLink>
          <SidebarLink href="/admin/gebruikers">Gebruikers</SidebarLink>
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-surface border-t border-border flex">
        <Link href="/admin" className="flex-1 text-center py-3 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
          Dashboard
        </Link>
        <Link href="/admin/gebruikers" className="flex-1 text-center py-3 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
          Gebruikers
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 sm:p-8 max-w-5xl">
        {children}
      </div>
    </div>
  )
}

function SidebarLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors font-sans"
    >
      {children}
    </Link>
  )
}
