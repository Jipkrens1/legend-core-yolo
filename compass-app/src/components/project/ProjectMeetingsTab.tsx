import { useState } from 'react'
import { useMeetings, useCreateMeeting } from '@/hooks/useMeetings'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Calendar,
  Users,
  FileText,
} from 'lucide-react'
// formatDate available for future use

interface ProjectMeetingsTabProps {
  projectId: string
}

export function ProjectMeetingsTab({ projectId }: ProjectMeetingsTabProps) {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    agenda: '',
  })

  const { data: meetings, isLoading } = useMeetings(projectId)
  const createMutation = useCreateMeeting()

  const handleCreate = async () => {
    if (!newMeeting.title.trim()) return

    await createMutation.mutateAsync({
      project_id: projectId,
      title: newMeeting.title,
      date: new Date(newMeeting.date).toISOString(),
      agenda: newMeeting.agenda || null,
      attendees: null,
      transcript: null,
      summary: null,
      notes: null,
    })

    setNewMeeting({ title: '', date: new Date().toISOString().split('T')[0], agenda: '' })
    setShowNewDialog(false)
  }

  // Group meetings by month
  const groupedMeetings = meetings?.reduce((acc, meeting) => {
    const date = new Date(meeting.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(date)
    
    if (!acc[monthKey]) {
      acc[monthKey] = { label: monthLabel, meetings: [] }
    }
    acc[monthKey].meetings.push(meeting)
    return acc
  }, {} as Record<string, { label: string; meetings: typeof meetings }>) || {}

  const sortedMonths = Object.keys(groupedMeetings).sort().reverse()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Meetings</h2>
          <p className="text-sm text-muted-foreground">
            {meetings?.length || 0} meetings
          </p>
        </div>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe meeting
        </Button>
      </div>

      {/* Meetings List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : meetings && meetings.length > 0 ? (
        <div className="space-y-8">
          {sortedMonths.map((monthKey) => {
            const { label, meetings: monthMeetings } = groupedMeetings[monthKey]
            return (
              <div key={monthKey}>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 capitalize">
                  {label}
                </h3>
                <div className="space-y-3">
                  {monthMeetings?.map((meeting) => (
                    <Card key={meeting.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary shrink-0">
                            <span className="text-lg font-bold">
                              {new Date(meeting.date).getDate()}
                            </span>
                            <span className="text-xs">
                              {new Intl.DateTimeFormat('nl-NL', { month: 'short' }).format(new Date(meeting.date))}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium truncate">{meeting.title}</h4>
                              {meeting.summary && (
                                <Badge variant="secondary" className="shrink-0">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Samenvatting
                                </Badge>
                              )}
                            </div>
                            
                            {meeting.attendees && meeting.attendees.length > 0 && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <Users className="h-3 w-3" />
                                {meeting.attendees.slice(0, 3).join(', ')}
                                {meeting.attendees.length > 3 && ` +${meeting.attendees.length - 3}`}
                              </div>
                            )}
                            
                            {meeting.agenda && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {meeting.agenda}
                              </p>
                            )}
                          </div>
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
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Nog geen meetings gepland
            </p>
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Eerste meeting plannen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* New Meeting Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe meeting</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                placeholder="Bijv. Kickoff meeting"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda (optioneel)</Label>
              <Textarea
                id="agenda"
                placeholder="Wat wordt er besproken?"
                value={newMeeting.agenda}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, agenda: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Annuleren
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!newMeeting.title.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? 'Bezig...' : 'Toevoegen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
