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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from('sustainability_metrics')
        .select(`
          *,
          institutions (name)
        `)
        .order('recorded_date', { ascending: false })
        .limit(50)

      if (data) setMetrics(data)
      setLoading(false)
    }

    fetchMetrics()
  }, [])

  const avgCarbon =
    metrics.length > 0
      ? (metrics.reduce((sum, m) => sum + (m.carbon_footprint || 0), 0) /
          metrics.length).toFixed(2)
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Metrics</h1>
        <p className="text-muted-foreground">Monitor all recorded sustainability metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Avg Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCarbon}</div>
            <p className="text-xs text-muted-foreground">tCO₂e</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Recent Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.filter((m) => {
                const date = new Date(m.recorded_date)
                const now = new Date()
                return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) <= 7
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Past 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Metrics</CardTitle>
          <CardDescription>
            Latest sustainability data from all institutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading metrics...</p>
          ) : metrics.length === 0 ? (
            <p className="text-muted-foreground">No metrics recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Carbon</TableHead>
                    <TableHead>Energy</TableHead>
                    <TableHead>Water</TableHead>
                    <TableHead>Waste</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell>{metric.institutions?.name || '-'}</TableCell>
                      <TableCell>
                        {new Date(metric.recorded_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{metric.carbon_footprint?.toFixed(2)} tCO₂e</TableCell>
                      <TableCell>{metric.energy_usage?.toFixed(0)} kWh</TableCell>
                      <TableCell>{metric.water_usage?.toFixed(0)} m³</TableCell>
                      <TableCell>{metric.waste_generated?.toFixed(1)} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
