'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AdminPage() {
  const [stats, setStats] = useState({
    institutions: 0,
    users: 0,
    metrics: 0,
    goals: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      // Fetch institution count
      const { count: instCount } = await supabase
        .from('institutions')
        .select('*', { count: 'exact', head: true })

      // Fetch user count
      const { count: userCount } = await supabase
        .from('institution_users')
        .select('*', { count: 'exact', head: true })

      // Fetch metrics count
      const { count: metricsCount } = await supabase
        .from('sustainability_metrics')
        .select('*', { count: 'exact', head: true })

      // Fetch goals count
      const { count: goalsCount } = await supabase
        .from('sustainability_goals')
        .select('*', { count: 'exact', head: true })

      setStats({
        institutions: instCount || 0,
        users: userCount || 0,
        metrics: metricsCount || 0,
        goals: goalsCount || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and statistics
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading statistics...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Institutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.institutions}</div>
              <p className="text-xs text-muted-foreground">Active organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Metrics Recorded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.metrics}</div>
              <p className="text-xs text-muted-foreground">Sustainability data points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Sustainability Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.goals}</div>
              <p className="text-xs text-muted-foreground">Active targets</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication</span>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Services</span>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/institutions"
              className="block rounded-lg border border-border p-2 text-sm hover:bg-accent"
            >
              Manage Institutions
            </a>
            <a
              href="/admin/users"
              className="block rounded-lg border border-border p-2 text-sm hover:bg-accent"
            >
              Manage Users
            </a>
            <a
              href="/admin/activity"
              className="block rounded-lg border border-border p-2 text-sm hover:bg-accent"
            >
              View Activity Log
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
