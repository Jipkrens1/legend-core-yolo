import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, getNotificationIcon } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  Bell, 
  CheckCheck,
  Clock,
  Calendar,
  MessageSquare,
  AtSign,
  FolderKanban,
  CheckCircle,
  GitBranch,
  UserPlus,
} from 'lucide-react'
import { formatDateTime, cn } from '@/lib/utils'

const iconMap: Record<string, React.ReactNode> = {
  clock: <Clock className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  'message-square': <MessageSquare className="h-4 w-4" />,
  'at-sign': <AtSign className="h-4 w-4" />,
  folder: <FolderKanban className="h-4 w-4" />,
  'check-circle': <CheckCircle className="h-4 w-4" />,
  'git-branch': <GitBranch className="h-4 w-4" />,
  'user-plus': <UserPlus className="h-4 w-4" />,
  bell: <Bell className="h-4 w-4" />,
}

export function NotificationCenter() {
  const navigate = useNavigate()
  const { notifications, isLoading, unreadCount } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  
  const [open, setOpen] = useState(false)

  const handleNotificationClick = (notification: { id: string; read: boolean; data: unknown }) => {
    // Mark as read
    if (!notification.read) {
      markRead.mutate(notification.id)
    }

    // Navigate based on notification data
    if (notification.data) {
      const data = notification.data as Record<string, string>
      if (data.projectId) {
        navigate(`/projects/${data.projectId}`)
        setOpen(false)
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaties</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Alles gelezen
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification: { id: string; type: string; title: string; message: string; read: boolean; data: unknown; created_at: string }) => {
                const iconName = getNotificationIcon(notification.type)
                const icon = iconMap[iconName] || iconMap.bell
                
                return (
                  <button
                    key={notification.id}
                    className={cn(
                      "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full shrink-0",
                        notification.read ? "bg-muted" : "bg-primary/10 text-primary"
                      )}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm",
                            !notification.read && "font-medium"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Geen notificaties
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
