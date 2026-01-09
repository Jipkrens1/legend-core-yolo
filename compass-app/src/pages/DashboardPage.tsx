import { Link } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FolderKanban, 
  Plus, 
  CheckSquare, 
  Calendar, 
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statusLabels: Record<string, string> = {
  active: 'Actief',
  on_hold: 'On Hold',
  completed: 'Afgerond',
  archived: 'Gearchiveerd',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-700 dark:text-green-400',
  on_hold: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  completed: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  archived: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
}

export function DashboardPage() {
  const { data: projects, isLoading } = useProjects()

  const activeProjects = projects?.filter(p => p.status === 'active') || []
  const recentProjects = projects?.slice(0, 5) || []

  // Calculate stats
  const totalProjects = projects?.length || 0
  const activeCount = activeProjects.length
  const onHoldCount = projects?.filter(p => p.status === 'on_hold').length || 0
  const completedCount = projects?.filter(p => p.status === 'completed').length || 0

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welkom terug! Hier is een overzicht van je projecten.
          </p>
        </div>
        <Link to="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuw project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Totaal projecten"
          value={totalProjects}
          icon={<FolderKanban className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <StatsCard
          title="Actieve projecten"
          value={activeCount}
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          loading={isLoading}
        />
        <StatsCard
          title="On Hold"
          value={onHoldCount}
          icon={<Clock className="h-4 w-4 text-yellow-500" />}
          loading={isLoading}
        />
        <StatsCard
          title="Afgerond"
          value={completedCount}
          icon={<CheckSquare className="h-4 w-4 text-blue-500" />}
          loading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recente projecten</CardTitle>
            <CardDescription>
              Je laatst bijgewerkte projecten
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary font-semibold">
                      {project.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{project.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.client}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={cn("shrink-0", statusColors[project.status])}
                    >
                      {statusLabels[project.status]}
                    </Badge>
                  </Link>
                ))}
                
                {totalProjects > 5 && (
                  <Link to="/" className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                    Bekijk alle projecten
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderKanban className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">
                  Je hebt nog geen projecten
                </p>
                <Link to="/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Eerste project aanmaken
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Upcoming */}
        <Card>
          <CardHeader>
            <CardTitle>Snelle acties</CardTitle>
            <CardDescription>
              Veelgebruikte functies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/projects/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Nieuw project
              </Button>
            </Link>
            <Link to="/admin" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Instellingen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  loading?: boolean
  trend?: {
    value: number
    positive: boolean
  }
}

function StatsCard({ title, value, icon, loading, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {trend && (
          <p className={cn(
            "text-xs",
            trend.positive ? "text-green-600" : "text-red-600"
          )}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% vs vorige maand
          </p>
        )}
      </CardContent>
    </Card>
  )
}
