import { useActivityFeed, formatActivityMessage } from '@/hooks/useActivityFeed'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  MessageSquare,
  Archive,
  RefreshCw,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityFeed as ActivityFeedType } from '@/types/database'

interface ActivityFeedProps {
  projectId: string
  limit?: number
  showHeader?: boolean
}

const actionIcons: Record<string, React.ReactNode> = {
  created: <Plus className="h-4 w-4" />,
  updated: <Edit className="h-4 w-4" />,
  deleted: <Trash2 className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  commented: <MessageSquare className="h-4 w-4" />,
  assigned: <User className="h-4 w-4" />,
  archived: <Archive className="h-4 w-4" />,
  restored: <RefreshCw className="h-4 w-4" />,
}

const actionColors: Record<string, string> = {
  created: 'bg-green-500/10 text-green-500',
  updated: 'bg-blue-500/10 text-blue-500',
  deleted: 'bg-red-500/10 text-red-500',
  completed: 'bg-green-500/10 text-green-500',
  commented: 'bg-yellow-500/10 text-yellow-500',
  assigned: 'bg-purple-500/10 text-purple-500',
  archived: 'bg-gray-500/10 text-gray-500',
  restored: 'bg-blue-500/10 text-blue-500',
}

export function ActivityFeed({ projectId, limit = 20, showHeader = true }: ActivityFeedProps) {
  const { activities, isLoading } = useActivityFeed(projectId, limit)

  // Group activities by date
  const groupedActivities = activities?.reduce((groups, activity) => {
    const date = new Date(activity.created_at).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as Record<string, typeof activities>)

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Vandaag'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Gisteren'
    } else {
      return new Intl.DateTimeFormat('nl-NL', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      }).format(date)
    }
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activiteit
          </CardTitle>
          <CardDescription>
            Recente wijzigingen in dit project
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(!showHeader && "pt-6")}>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {groupedActivities && Object.entries(groupedActivities).map(([date, dayActivities]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-card">
                    {formatDateHeader(date)}
                  </h4>
                  <div className="space-y-3">
                    {dayActivities?.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-muted-foreground">Nog geen activiteit</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  activity: {
    id: string
    action: string
    entity_type: string
    entity_name: string | null
    created_at: string
    user_profiles: {
      full_name: string | null
      avatar_url: string | null
    } | null
  }
}

function ActivityItem({ activity }: ActivityItemProps) {
  const authorName = activity.user_profiles?.full_name || 'Systeem'
  const icon = actionIcons[activity.action] || <Activity className="h-4 w-4" />
  const colorClass = actionColors[activity.action] || 'bg-muted text-muted-foreground'
  
  // Create a compatible object for formatActivityMessage
  const activityForFormat: ActivityFeedType = {
    id: activity.id,
    project_id: '',
    user_id: null,
    action: activity.action,
    entity_type: activity.entity_type,
    entity_id: '',
    entity_name: activity.entity_name,
    metadata: null,
    created_at: activity.created_at,
  }

  return (
    <div className="flex items-start gap-3">
      <div className={cn("flex items-center justify-center h-8 w-8 rounded-full shrink-0", colorClass)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{authorName}</span>
          {' '}
          <span className="text-muted-foreground">
            {formatActivityMessage(activityForFormat)}
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Intl.DateTimeFormat('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(activity.created_at))}
        </p>
      </div>
    </div>
  )
}
