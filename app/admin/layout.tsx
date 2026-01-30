import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const isAdmin = user.user_metadata?.is_admin
  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link href="/admin" className="text-xl font-bold text-foreground">
          EcoTwin Admin
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action="/auth/logout" method="post">
            <Button variant="outline" size="sm" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </nav>
      <div className="flex flex-1">
        <aside className="w-64 border-r border-border p-6">
          <nav className="flex flex-col gap-2">
            <Link
              href="/admin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Overview
            </Link>
            <Link
              href="/admin/institutions"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Institutions
            </Link>
            <Link
              href="/admin/users"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Users
            </Link>
            <Link
              href="/admin/metrics"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Metrics
            </Link>
            <Link
              href="/admin/activity"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Activity Log
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
