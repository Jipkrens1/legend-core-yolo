import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Plus, 
  Search,
  FileSpreadsheet,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScopeItem } from '@/types/database'
import { toast } from 'sonner'

interface ProjectScopeTabProps {
  projectId: string
}

const priorityLabels: Record<string, string> = {
  must: 'Must Have',
  should: 'Should Have',
  could: 'Could Have',
  wont: "Won't Have",
}

const priorityColors: Record<string, string> = {
  must: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  should: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  could: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  wont: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
}

const statusLabels: Record<string, string> = {
  pending: 'Te doen',
  in_progress: 'In uitvoering',
  completed: 'Afgerond',
  blocked: 'Geblokkeerd',
}

const statusColors: Record<string, string> = {
  pending: 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
  in_progress: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  completed: 'bg-green-500/10 text-green-700 dark:text-green-400',
  blocked: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

export function ProjectScopeTab({ projectId }: ProjectScopeTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: scopeItems, isLoading } = useQuery({
    queryKey: ['scope-items', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scope_items')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      return data as ScopeItem[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (item: Partial<ScopeItem>) => {
      const { data, error } = await supabase
        .from('scope_items')
        .insert({
          project_id: projectId,
          requirement: item.requirement || 'Nieuwe requirement',
          priority: item.priority || 'should',
          status: item.status || 'pending',
          sort_order: (scopeItems?.length || 0) + 1,
        } as never)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scope-items', projectId] })
      toast.success('Requirement toegevoegd')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })

  // Filter items
  const filteredItems = scopeItems?.filter((item) => {
    const matchesSearch = !searchQuery || 
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPriority = !filterPriority || item.priority === filterPriority
    
    return matchesSearch && matchesPriority
  }) || []

  // Group by priority
  const groupedItems = filteredItems.reduce((acc, item) => {
    const priority = item.priority || 'should'
    if (!acc[priority]) acc[priority] = []
    acc[priority].push(item)
    return acc
  }, {} as Record<string, ScopeItem[]>)

  const priorityOrder = ['must', 'should', 'could', 'wont']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Scope</h2>
          <p className="text-sm text-muted-foreground">
            {scopeItems?.length || 0} requirements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importeren
          </Button>
          <Button size="sm" onClick={() => createMutation.mutate({})}>
            <Plus className="mr-2 h-4 w-4" />
            Toevoegen
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoeken in requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {priorityOrder.map((priority) => (
            <Button
              key={priority}
              variant={filterPriority === priority ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPriority(filterPriority === priority ? null : priority)}
            >
              {priorityLabels[priority]}
            </Button>
          ))}
        </div>
      </div>

      {/* Scope Items */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-6">
          {priorityOrder.map((priority) => {
            const items = groupedItems[priority]
            if (!items?.length) return null
            
            return (
              <div key={priority}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={cn(priorityColors[priority])}>
                    {priorityLabels[priority]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {items.length} items
                  </span>
                </div>
                
                <div className="space-y-2">
                  {items.map((item) => (
                    <Card key={item.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{item.requirement}</p>
                            {item.category && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.category}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={cn(statusColors[item.status || 'pending'])}
                          >
                            {statusLabels[item.status || 'pending']}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterPriority 
                ? 'Geen requirements gevonden met deze filters' 
                : 'Nog geen requirements toegevoegd'}
            </p>
            {!searchQuery && !filterPriority && (
              <Button onClick={() => createMutation.mutate({})}>
                <Plus className="mr-2 h-4 w-4" />
                Eerste requirement toevoegen
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
