import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { 
  FolderKanban, 
  Calendar, 
  Mail, 
  CheckSquare, 
  Lightbulb,
  Search,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchResult {
  id: string
  type: 'project' | 'meeting' | 'email' | 'action' | 'decision'
  title: string
  subtitle?: string
  projectId?: string
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  // Search function
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const searchResults: SearchResult[] = []

    try {
      // Search projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, client')
        .or(`name.ilike.%${searchQuery}%,client.ilike.%${searchQuery}%`)
        .limit(5)

      if (projects) {
        const typedProjects = projects as { id: string; name: string; client: string }[]
        searchResults.push(
          ...typedProjects.map((p) => ({
            id: p.id,
            type: 'project' as const,
            title: p.name,
            subtitle: p.client,
          }))
        )
      }

      // Search meetings
      const { data: meetings } = await supabase
        .from('meetings')
        .select('id, title, project_id, projects(name)')
        .ilike('title', `%${searchQuery}%`)
        .limit(5)

      if (meetings) {
        const typedMeetings = meetings as { id: string; title: string; project_id: string; projects: { name: string } | null }[]
        searchResults.push(
          ...typedMeetings.map((m) => ({
            id: m.id,
            type: 'meeting' as const,
            title: m.title,
            subtitle: m.projects?.name,
            projectId: m.project_id,
          }))
        )
      }

      // Search emails
      const { data: emails } = await supabase
        .from('project_emails')
        .select('id, subject, project_id, projects(name)')
        .ilike('subject', `%${searchQuery}%`)
        .limit(5)

      if (emails) {
        const typedEmails = emails as { id: string; subject: string; project_id: string; projects: { name: string } | null }[]
        searchResults.push(
          ...typedEmails.map((e) => ({
            id: e.id,
            type: 'email' as const,
            title: e.subject,
            subtitle: e.projects?.name,
            projectId: e.project_id,
          }))
        )
      }

      // Search action items
      const { data: actions } = await supabase
        .from('action_items')
        .select('id, title, project_id, projects(name)')
        .ilike('title', `%${searchQuery}%`)
        .limit(5)

      if (actions) {
        const typedActions = actions as { id: string; title: string; project_id: string; projects: { name: string } | null }[]
        searchResults.push(
          ...typedActions.map((a) => ({
            id: a.id,
            type: 'action' as const,
            title: a.title,
            subtitle: a.projects?.name,
            projectId: a.project_id,
          }))
        )
      }

      // Search decisions
      const { data: decisions } = await supabase
        .from('decisions')
        .select('id, title, project_id, projects(name)')
        .ilike('title', `%${searchQuery}%`)
        .limit(5)

      if (decisions) {
        const typedDecisions = decisions as { id: string; title: string; project_id: string; projects: { name: string } | null }[]
        searchResults.push(
          ...typedDecisions.map((d) => ({
            id: d.id,
            type: 'decision' as const,
            title: d.title,
            subtitle: d.projects?.name,
            projectId: d.project_id,
          }))
        )
      }

      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, search])

  const handleSelect = (result: SearchResult) => {
    onOpenChange(false)
    setQuery('')
    
    if (result.type === 'project') {
      navigate(`/projects/${result.id}`)
    } else if (result.projectId) {
      // Navigate to project with specific tab based on type
      const tabMap: Record<string, string> = {
        meeting: 'meetings',
        email: 'emails',
        action: 'dashboard',
        decision: 'dashboard',
      }
      navigate(`/projects/${result.projectId}?tab=${tabMap[result.type]}`)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return FolderKanban
      case 'meeting':
        return Calendar
      case 'email':
        return Mail
      case 'action':
        return CheckSquare
      case 'decision':
        return Lightbulb
      default:
        return Search
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Project'
      case 'meeting':
        return 'Meeting'
      case 'email':
        return 'E-mail'
      case 'action':
        return 'Actie'
      case 'decision':
        return 'Besluit'
      default:
        return type
    }
  }

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Zoeken in projecten, meetings, e-mails..."
              value={query}
              onValueChange={setQuery}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {query && !loading && results.length === 0 && (
              <Command.Empty className="py-6 text-center text-sm">
                Geen resultaten gevonden.
              </Command.Empty>
            )}
            
            {Object.entries(groupedResults).map(([type, items]) => (
              <Command.Group key={type} heading={getTypeLabel(type)}>
                {items.map((result) => {
                  const Icon = getIcon(result.type)
                  return (
                    <Command.Item
                      key={`${result.type}-${result.id}`}
                      value={`${result.title} ${result.subtitle || ''}`}
                      onSelect={() => handleSelect(result)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm",
                        "aria-selected:bg-accent aria-selected:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span>{result.title}</span>
                        {result.subtitle && (
                          <span className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </span>
                        )}
                      </div>
                    </Command.Item>
                  )
                })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
