import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'

export function ProjectStatusChart() {
  const { resolvedTheme } = useTheme()
  
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'project-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('status')
      
      if (error) throw error
      
      const counts = (data as { status: string }[]).reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return [
        { name: 'Actief', value: counts.active || 0, color: '#22c55e' },
        { name: 'On Hold', value: counts.on_hold || 0, color: '#eab308' },
        { name: 'Afgerond', value: counts.completed || 0, color: '#3b82f6' },
        { name: 'Gearchiveerd', value: counts.archived || 0, color: '#6b7280' },
      ].filter(item => item.value > 0)
    },
  })

  if (isLoading) return <ChartSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projectstatus</CardTitle>
        <CardDescription>Verdeling van projecten per status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActionItemsChart() {
  const { resolvedTheme } = useTheme()
  
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'action-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_items')
        .select('status, priority')
      
      if (error) throw error
      
      const items = data as { status: string; priority: string }[]
      const statusCounts = items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const priorityCounts = items.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        byStatus: [
          { name: 'Open', value: statusCounts.open || 0 },
          { name: 'In uitvoering', value: statusCounts.in_progress || 0 },
          { name: 'Afgerond', value: statusCounts.completed || 0 },
          { name: 'Geannuleerd', value: statusCounts.cancelled || 0 },
        ],
        byPriority: [
          { name: 'Hoog', value: priorityCounts.high || 0, color: '#ef4444' },
          { name: 'Medium', value: priorityCounts.medium || 0, color: '#eab308' },
          { name: 'Laag', value: priorityCounts.low || 0, color: '#22c55e' },
        ],
      }
    },
  })

  if (isLoading) return <ChartSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acties overzicht</CardTitle>
        <CardDescription>Status en prioriteit van acties</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.byStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis type="number" stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis dataKey="name" type="category" width={100} stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivityTrendChart() {
  const { resolvedTheme } = useTheme()
  
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'activity-trend'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data, error } = await supabase
        .from('activity_feed')
        .select('created_at, action')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      // Group by date
      const items = data as { created_at: string; action: string }[]
      const grouped = items.reduce((acc, item) => {
        const date = new Date(item.created_at).toLocaleDateString('nl-NL', { 
          day: 'numeric',
          month: 'short' 
        })
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return Object.entries(grouped).map(([date, count]) => ({
        date,
        activiteiten: count,
      }))
    },
  })

  if (isLoading) return <ChartSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activiteit trend</CardTitle>
        <CardDescription>Aantal activiteiten per dag (laatste 30 dagen)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'}
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="activiteiten" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorActivity)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function MeetingsPerMonthChart() {
  const { resolvedTheme } = useTheme()
  
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'meetings-per-month'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('date')
        .order('date', { ascending: true })
      
      if (error) throw error
      
      // Group by month
      const items = data as { date: string }[]
      const grouped = items.reduce((acc, item) => {
        const month = new Date(item.date).toLocaleDateString('nl-NL', { 
          month: 'short',
          year: 'numeric'
        })
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return Object.entries(grouped).slice(-6).map(([month, count]) => ({
        month,
        meetings: count,
      }))
    },
  })

  if (isLoading) return <ChartSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meetings per maand</CardTitle>
        <CardDescription>Aantal meetings in de laatste 6 maanden</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="month" 
                stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <YAxis stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="meetings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}
