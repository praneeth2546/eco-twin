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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function DashboardPage() {
  const [institution, setInstitution] = useState<any>(null)
  const [metrics, setMetrics] = useState<any[]>([])
  const [yearlyData, setYearlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Fetch user's institution
      const institutionId = user.user_metadata?.institution_id
      const { data: instData } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', institutionId)
        .single()

      if (instData) setInstitution(instData)

      // Fetch recent metrics
      const { data: metricsData } = await supabase
        .from('sustainability_metrics')
        .select('*')
        .eq('institution_id', institutionId)
        .order('recorded_date', { ascending: false })
        .limit(12)

      if (metricsData) {
        setMetrics(metricsData)
        // Prepare yearly summary
        const yearly = metricsData
          .reverse()
          .map((m) => ({
            date: new Date(m.recorded_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            carbon_footprint: m.carbon_footprint,
            energy_usage: m.energy_usage,
            waste_generated: m.waste_generated,
          }))
        setYearlyData(yearly)
      }

      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  const latestMetric = metrics[0]
  const carbonChange = metrics.length > 1
    ? ((metrics[0].carbon_footprint - metrics[1].carbon_footprint) /
        metrics[1].carbon_footprint) *
      100
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {institution?.name || 'Institution'} Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor your sustainability metrics and progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric?.carbon_footprint?.toFixed(2) || '0'} tCO₂e
            </div>
            <p
              className={`text-xs ${
                carbonChange > 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {carbonChange > 0 ? '↑' : '↓'} {Math.abs(carbonChange).toFixed(1)}%
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric?.energy_usage?.toFixed(0) || '0'} kWh
            </div>
            <p className="text-xs text-muted-foreground">Monthly consumption</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Waste Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric?.waste_generated?.toFixed(1) || '0'} kg
            </div>
            <p className="text-xs text-muted-foreground">Monthly waste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric?.water_usage?.toFixed(0) || '0'} m³
            </div>
            <p className="text-xs text-muted-foreground">Monthly consumption</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Footprint Trend</CardTitle>
            <CardDescription>Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="carbon_footprint"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>Energy and Water consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="energy_usage" fill="#3b82f6" />
                <Bar dataKey="waste_generated" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
