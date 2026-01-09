import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSidebar } from '@/contexts/SidebarContext'
import { useProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  FolderKanban,
  Home,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  on_hold: 'bg-yellow-500',
  completed: 'bg-blue-500',
  archived: 'bg-gray-500',
}

export function Sidebar() {
  const { id: currentProjectId } = useParams()
  const navigate = useNavigate()
  const { isCollapsed, isHovered, setIsHovered } = useSidebar()
  const { data: projects, isLoading } = useProjects()
  
  const showExpanded = !isCollapsed || isHovered

  const activeProjects = projects?.filter(p => p.status === 'active') || []
  const otherProjects = projects?.filter(p => p.status !== 'active') || []

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-14 z-30 flex h-[calc(100vh-3.5rem)] flex-col border-r bg-sidebar transition-all duration-300",
          isCollapsed && !isHovered ? "w-16" : "w-64"
        )}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation */}
        <div className="flex flex-col gap-1 p-2">
          <SidebarLink
            to="/"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            collapsed={!showExpanded}
          />
        </div>

        {/* Projects Header */}
        <div className={cn(
          "flex items-center justify-between px-3 py-2",
          !showExpanded && "justify-center px-2"
        )}>
          {showExpanded && (
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Projecten
            </span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => navigate('/projects/new')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Nieuw project
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Projects List */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  {showExpanded && <Skeleton className="h-4 flex-1" />}
                </div>
              ))
            ) : (
              <>
                {/* Active Projects */}
                {activeProjects.map((project) => (
                  <ProjectLink
                    key={project.id}
                    project={project}
                    isActive={project.id === currentProjectId}
                    collapsed={!showExpanded}
                  />
                ))}
                
                {/* Separator if there are other projects */}
                {otherProjects.length > 0 && activeProjects.length > 0 && (
                  <div className="my-2 border-t" />
                )}
                
                {/* Other Projects */}
                {otherProjects.map((project) => (
                  <ProjectLink
                    key={project.id}
                    project={project}
                    isActive={project.id === currentProjectId}
                    collapsed={!showExpanded}
                  />
                ))}

                {/* Empty State */}
                {projects?.length === 0 && (
                  <div className={cn(
                    "py-8 text-center text-sm text-muted-foreground",
                    !showExpanded && "px-2"
                  )}>
                    {showExpanded ? (
                      <>
                        <FolderKanban className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p>Nog geen projecten</p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => navigate('/projects/new')}
                        >
                          Maak je eerste project
                        </Button>
                      </>
                    ) : (
                      <FolderKanban className="mx-auto h-5 w-5 opacity-50" />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  )
}

interface SidebarLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  badge?: number
}

function SidebarLink({ to, icon, label, collapsed, badge }: SidebarLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center"
          )}
        >
          {icon}
          {!collapsed && (
            <>
              <span className="flex-1">{label}</span>
              {badge !== undefined && badge > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {badge}
                </Badge>
              )}
            </>
          )}
        </Link>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right">
          {label}
          {badge !== undefined && badge > 0 && ` (${badge})`}
        </TooltipContent>
      )}
    </Tooltip>
  )
}

interface ProjectLinkProps {
  project: {
    id: string
    name: string
    client: string
    status: string
  }
  isActive: boolean
  collapsed: boolean
}

function ProjectLink({ project, isActive, collapsed }: ProjectLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={`/projects/${project.id}`}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
            collapsed && "justify-center"
          )}
        >
          {/* Project Avatar/Initials */}
          <div className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-medium",
            isActive 
              ? "bg-sidebar-primary text-sidebar-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {getInitials(project.name)}
          </div>
          
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{project.name}</span>
                <span className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  statusColors[project.status] || statusColors.active
                )} />
              </div>
              <span className="text-xs text-muted-foreground truncate block">
                {project.client}
              </span>
            </div>
          )}
        </Link>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right">
          <div>
            <p className="font-medium">{project.name}</p>
            <p className="text-xs text-muted-foreground">{project.client}</p>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  )
}
