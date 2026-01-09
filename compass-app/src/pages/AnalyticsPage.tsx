import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  ProjectStatusChart, 
  ActionItemsChart, 
  ActivityTrendChart,
  MeetingsPerMonthChart,
} from '@/components/dashboard/AnalyticsCharts'
import { ArrowLeft, Download } from 'lucide-react'

export function AnalyticsPage() {
  const handleExport = () => {
    // TODO: Implement CSV/PDF export
    console.log('Exporting analytics...')
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                Inzichten en statistieken over je projecten
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exporteren
          </Button>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <ProjectStatusChart />
          <ActionItemsChart />
          <ActivityTrendChart />
          <MeetingsPerMonthChart />
        </div>
      </div>
    </div>
  )
}
