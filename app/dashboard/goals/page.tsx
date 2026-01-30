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

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const institutionId = user.user_metadata?.institution_id

      const { data } = await supabase
        .from('sustainability_goals')
        .select('*')
        .eq('institution_id', institutionId)
        .order('created_at', { ascending: false })

      if (data) setGoals(data)
      setLoading(false)
    }

    fetchGoals()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sustainability Goals</h1>
        <p className="text-muted-foreground">Track your institution's environmental targets</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading goals...</p>
      ) : goals.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No sustainability goals set yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => {
            const progress =
              ((goal.current_value || 0) / (goal.target_value || 1)) * 100
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.goal_name}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Value</p>
                      <p className="font-semibold">{goal.current_value || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target Value</p>
                      <p className="font-semibold">{goal.target_value || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target Date</p>
                      <p className="font-semibold">
                        {new Date(goal.target_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
