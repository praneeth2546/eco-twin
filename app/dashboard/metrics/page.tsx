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
import { Button } from '@/components/ui/button'

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const institutionId = user.user_metadata?.institution_id

      const { data } = await supabase
        .from('sustainability_metrics')
        .select('*')
        .eq('institution_id', institutionId)
        .order('recorded_date', { ascending: false })

      if (data) setMetrics(data)
      setLoading(false)
    }

    fetchMetrics()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sustainability Metrics</h1>
        <p className="text-muted-foreground">View all recorded metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Metrics</CardTitle>
          <CardDescription>
            {metrics.length} records found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading metrics...</p>
          ) : metrics.length === 0 ? (
            <p className="text-muted-foreground">No metrics recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Carbon Footprint</TableHead>
                    <TableHead>Energy Usage</TableHead>
                    <TableHead>Water Usage</TableHead>
                    <TableHead>Waste Generated</TableHead>
                    <TableHead>Recycling Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell>
                        {new Date(metric.recorded_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{metric.carbon_footprint?.toFixed(2)} tCO₂e</TableCell>
                      <TableCell>{metric.energy_usage?.toFixed(0)} kWh</TableCell>
                      <TableCell>{metric.water_usage?.toFixed(0)} m³</TableCell>
                      <TableCell>{metric.waste_generated?.toFixed(1)} kg</TableCell>
                      <TableCell>{metric.recycling_rate?.toFixed(1)}%</TableCell>
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
