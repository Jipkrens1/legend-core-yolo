import { useProjectPresence } from '@/hooks/usePresence'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getInitials, cn } from '@/lib/utils'

interface PresenceIndicatorProps {
  projectId: string
  maxDisplay?: number
}

export function PresenceIndicator({ projectId, maxDisplay = 5 }: PresenceIndicatorProps) {
  const { data: presenceData } = useProjectPresence(projectId)

  if (!presenceData || presenceData.length === 0) return null

  const displayUsers = presenceData.slice(0, maxDisplay)
  const remainingCount = Math.max(0, presenceData.length - maxDisplay)

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-muted-foreground mr-2">Online:</span>
      <div className="flex -space-x-2">
        {displayUsers.map((presence) => (
          <Tooltip key={presence.id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={presence.user_profiles?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(presence.user_profiles?.full_name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                    presence.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{presence.user_profiles?.full_name || 'Onbekend'}</p>
              <p className="text-xs text-muted-foreground">
                {presence.status === 'online' ? 'Online' : 'Afwezig'}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted border-2 border-background text-xs font-medium">
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>En {remainingCount} anderen</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
