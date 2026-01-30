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

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInstitutions = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setInstitutions(data)
      setLoading(false)
    }

    fetchInstitutions()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Institutions</h1>
        <p className="text-muted-foreground">Manage organizations and their settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Institutions</CardTitle>
          <CardDescription>
            {institutions.length} institutions registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading institutions...</p>
          ) : institutions.length === 0 ? (
            <p className="text-muted-foreground">No institutions found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institutions.map((inst) => (
                    <TableRow key={inst.id}>
                      <TableCell className="font-medium">{inst.name}</TableCell>
                      <TableCell>{inst.institution_type}</TableCell>
                      <TableCell>{inst.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={inst.status === 'active' ? 'default' : 'secondary'}>
                          {inst.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(inst.created_at).toLocaleDateString()}
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
