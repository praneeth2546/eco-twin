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
import { Badge } from '@/components/ui/badge'

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from('activity_logs')
        .select(`
          *,
          institutions (name)
        `)
        .order('timestamp', { ascending: false })
        .limit(100)

      if (data) setActivities(data)
      setLoading(false)
    }

    fetchActivities()
  }, [])

  const getActivityBadge = (action: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      create: 'default',
      update: 'secondary',
      delete: 'destructive',
      view: 'outline',
    }
    return <Badge variant={variants[action] || 'outline'}>{action}</Badge>
  }

  const getEntityColor = (entity: string) => {
    const colors: Record<string, string> = {
      institution: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
      metric: 'bg-purple-100 text-purple-800',
      goal: 'bg-orange-100 text-orange-800',
      report: 'bg-pink-100 text-pink-800',
    }
    return colors[entity] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
        <p className="text-muted-foreground">Track system activities and changes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest {activities.length} system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-muted-foreground">No activities recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="text-sm">
                        {new Date(activity.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{activity.institutions?.name || '-'}</TableCell>
                      <TableCell>{getActivityBadge(activity.action)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-medium ${getEntityColor(
                            activity.entity_type
                          )}`}
                        >
                          {activity.entity_type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {activity.description || '-'}
                      </TableCell>
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
