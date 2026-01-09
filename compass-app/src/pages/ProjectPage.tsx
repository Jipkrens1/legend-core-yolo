import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useProject } from '@/hooks/useProjects'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ArrowLeft,
  LayoutDashboard,
  Users,
  Wallet,
  CalendarDays,
  MessageSquare,
  Shield,
  Mail,
  Settings,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Tab Components (simplified for now)
import { ProjectDashboardTab } from '@/components/project/ProjectDashboardTab'
import { ProjectScopeTab } from '@/components/project/ProjectScopeTab'
import { ProjectMeetingsTab } from '@/components/project/ProjectMeetingsTab'
import { ProjectStakeholdersTab } from '@/components/project/ProjectStakeholdersTab'

const statusLabels: Record<string, string> = {
  active: 'Actief',
  on_hold: 'On Hold',
  completed: 'Afgerond',
  archived: 'Gearchiveerd',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  on_hold: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  completed: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  archived: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'client', label: 'Klantprofiel', icon: Users },
  { id: 'scope', label: 'Scope', icon: Target },
  { id: 'financials', label: 'Financien', icon: Wallet },
  { id: 'planning', label: 'Planning', icon: CalendarDays },
  { id: 'meetings', label: 'Meetings', icon: MessageSquare },
  { id: 'stakeholders', label: 'Stakeholders', icon: Users },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'emails', label: 'Emails', icon: Mail },
  { id: 'settings', label: 'Instellingen', icon: Settings },
]

export function ProjectPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'dashboard'
  
  const { data: project, isLoading, error } = useProject(id)

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground mb-4">
            Project niet gevonden
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Project Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-14 z-30">
        <div className="flex items-center gap-4 p-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold truncate">{project.name}</h1>
              <Badge 
                variant="outline" 
                className={cn(statusColors[project.status])}
              >
                {statusLabels[project.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate">
              {project.client}
              {project.project_type && ` - ${project.project_type}`}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start rounded-none border-b-0 h-auto p-0 bg-transparent overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "hover:bg-muted/50 transition-colors"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <Tabs value={currentTab}>
          <TabsContent value="dashboard" className="m-0">
            <ProjectDashboardTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="client" className="m-0">
            <div className="text-muted-foreground">Klantprofiel tab - coming soon</div>
          </TabsContent>
          
          <TabsContent value="scope" className="m-0">
            <ProjectScopeTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="financials" className="m-0">
            <div className="text-muted-foreground">Financien tab - coming soon</div>
          </TabsContent>
          
          <TabsContent value="planning" className="m-0">
            <div className="text-muted-foreground">Planning tab - coming soon</div>
          </TabsContent>
          
          <TabsContent value="meetings" className="m-0">
            <ProjectMeetingsTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="stakeholders" className="m-0">
            <ProjectStakeholdersTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="compliance" className="m-0">
            <div className="text-muted-foreground">Compliance tab - coming soon</div>
          </TabsContent>
          
          <TabsContent value="emails" className="m-0">
            <div className="text-muted-foreground">Emails tab - coming soon</div>
          </TabsContent>
          
          <TabsContent value="settings" className="m-0">
            <div className="text-muted-foreground">Instellingen tab - coming soon</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
