import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Redirect authenticated users to their appropriate dashboard
    if (user.user_metadata?.is_admin) {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="text-2xl font-bold text-foreground">EcoTwin</div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center md:px-12">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight text-foreground md:text-6xl">
              Measure Your Institution's Environmental Impact
            </h1>
            <p className="text-xl text-muted-foreground">
              EcoTwin helps organizations track sustainability metrics, set environmental goals, and generate comprehensive reports to drive positive change.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border px-6 py-12 md:px-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Why EcoTwin?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 text-3xl">📊</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Real-Time Analytics
              </h3>
              <p className="text-muted-foreground">
                Track carbon footprint, energy usage, water consumption, and waste generation with comprehensive dashboards.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 text-3xl">🎯</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Goal Setting & Tracking
              </h3>
              <p className="text-muted-foreground">
                Set sustainability targets and monitor progress toward your environmental objectives in real time.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 text-3xl">📈</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Comprehensive Reporting
              </h3>
              <p className="text-muted-foreground">
                Generate detailed sustainability reports for stakeholders and regulatory compliance with ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground md:px-12">
        <p>&copy; 2026 EcoTwin. Helping institutions achieve sustainability goals.</p>
      </footer>
    </div>
  )
}
