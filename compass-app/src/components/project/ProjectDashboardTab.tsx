import { useActionItems } from '@/hooks/useActionItems'
import { useDecisions } from '@/hooks/useDecisions'
import { useMeetings } from '@/hooks/useMeetings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  CheckSquare, 
  Lightbulb, 
  Calendar,
  AlertCircle,
  Clock,
  Target,
} from 'lucide-react'
import { formatDateShort, cn } from '@/lib/utils'

interface ProjectDashboardTabProps {
  projectId: string
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/10 text-red-700 dark:text-red-400',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  low: 'bg-green-500/10 text-green-700 dark:text-green-400',
}

// Status colors for future use
// const statusColors: Record<string, string> = {
//   open: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
//   in_progress: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
//   completed: 'bg-green-500/10 text-green-700 dark:text-green-400',
//   cancelled: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
// }

export function ProjectDashboardTab({ projectId }: ProjectDashboardTabProps) {
  const { data: actionItems, isLoading: loadingActions } = useActionItems(projectId)
  const { data: decisions, isLoading: loadingDecisions } = useDecisions(projectId)
  const { data: meetings, isLoading: loadingMeetings } = useMeetings(projectId)

  // Calculate completeness score
  const completedActions = actionItems?.filter(a => a.status === 'completed').length || 0
  const totalActions = actionItems?.length || 0
  const completenessScore = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0

  // Open actions
  const openActions = actionItems?.filter(a => a.status === 'open' || a.status === 'in_progress') || []
  const urgentActions = openActions.filter(a => a.priority === 'high')

  // Recent decisions
  const recentDecisions = decisions?.slice(0, 5) || []

  // Upcoming meetings
  const upcomingMeetings = meetings?.filter(m => new Date(m.date) >= new Date()).slice(0, 3) || []

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voortgang</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completenessScore}%</div>
            <Progress value={completenessScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedActions} van {totalActions} acties afgerond
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open acties</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingActions ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{openActions.length}</div>
                {urgentActions.length > 0 && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {urgentActions.length} urgent
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Besluiten</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingDecisions ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{decisions?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingMeetings ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{meetings?.length || 0}</div>
                {upcomingMeetings.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {upcomingMeetings.length} gepland
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Open Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Open acties</CardTitle>
            <CardDescription>Acties die nog gedaan moeten worden</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingActions ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : openActions.length > 0 ? (
              <div className="space-y-3">
                {openActions.slice(0, 5).map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{action.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {action.owner && (
                          <span className="text-xs text-muted-foreground">
                            {action.owner}
                          </span>
                        )}
                        {action.deadline && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateShort(action.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className={cn(priorityColors[action.priority])}>
                      {action.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Geen open acties
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Decisions */}
        <Card>
          <CardHeader>
            <CardTitle>Recente besluiten</CardTitle>
            <CardDescription>Laatst genomen besluiten</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDecisions ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentDecisions.length > 0 ? (
              <div className="space-y-3">
                {recentDecisions.map((decision) => (
                  <div key={decision.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{decision.title}</p>
                      {decision.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {decision.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {decision.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nog geen besluiten vastgelegd
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
