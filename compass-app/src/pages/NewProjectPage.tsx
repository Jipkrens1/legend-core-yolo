import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateProject } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Loader2,
  FolderKanban,
  Briefcase,
  Globe,
  Smartphone,
  Database,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Project templates
const templates = [
  {
    id: 'blank',
    name: 'Blanco project',
    description: 'Start met een leeg project',
    icon: FolderKanban,
    color: 'bg-slate-500',
  },
  {
    id: 'website',
    name: 'Website project',
    description: 'Website of webapplicatie bouwen',
    icon: Globe,
    color: 'bg-blue-500',
    defaults: {
      project_type: 'Website',
    },
  },
  {
    id: 'app',
    name: 'App project',
    description: 'Mobiele app ontwikkeling',
    icon: Smartphone,
    color: 'bg-green-500',
    defaults: {
      project_type: 'Mobile App',
    },
  },
  {
    id: 'consultancy',
    name: 'Consultancy',
    description: 'Advies en consulting opdracht',
    icon: Briefcase,
    color: 'bg-purple-500',
    defaults: {
      project_type: 'Consultancy',
    },
  },
  {
    id: 'data',
    name: 'Data project',
    description: 'Data analyse of BI oplossing',
    icon: Database,
    color: 'bg-orange-500',
    defaults: {
      project_type: 'Data & Analytics',
    },
  },
  {
    id: 'ai',
    name: 'AI project',
    description: 'AI/ML implementatie',
    icon: Sparkles,
    color: 'bg-pink-500',
    defaults: {
      project_type: 'AI/ML',
    },
  },
]

const steps = [
  { id: 'template', title: 'Template' },
  { id: 'basics', title: 'Basisgegevens' },
  { id: 'details', title: 'Details' },
  { id: 'complete', title: 'Gereed' },
]

export function NewProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const createProject = useCreateProject()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    project_type: '',
    owner: user?.user_metadata?.full_name || '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  })

  const currentStepId = steps[currentStep].id
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template?.defaults) {
      setFormData(prev => ({ ...prev, ...template.defaults }))
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const project = await createProject.mutateAsync({
        name: formData.name,
        client: formData.client,
        description: formData.description || null,
        project_type: formData.project_type || null,
        owner: formData.owner || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: 'active',
        bcc_email: null,
        user_id: user?.id || null,
      })
      
      // Move to complete step
      setCurrentStep(steps.length - 1)
      
      // Wait a moment then navigate to the project
      setTimeout(() => {
        navigate(`/projects/${project.id}`)
      }, 2000)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const canProceed = () => {
    switch (currentStepId) {
      case 'template':
        return selectedTemplate !== null
      case 'basics':
        return formData.name.trim() !== '' && formData.client.trim() !== ''
      case 'details':
        return true
      default:
        return false
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold opacity-50 text-center" style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif' }}>Nieuw project</h1>
            <p className="text-muted-foreground">
              Maak een nieuw project aan in enkele stappen
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={cn(
                  "flex items-center gap-2",
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                  index < currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : index === currentStep 
                      ? "border-2 border-primary text-primary"
                      : "border border-muted-foreground"
                )}>
                  {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </span>
            ))}
          </div>
          <Progress value={progress} />
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {currentStepId === 'template' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Kies een template</h2>
                  <p className="text-muted-foreground">
                    Selecteer een template als startpunt voor je project
                  </p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => {
                    const Icon = template.icon
                    return (
                      <Card
                        key={template.id}
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary",
                          selectedTemplate === template.id && "border-primary ring-2 ring-primary ring-offset-2"
                        )}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg text-white mb-3",
                            template.color
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {currentStepId === 'basics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Basisgegevens</h2>
                  <p className="text-muted-foreground">
                    Vul de essientele informatie in over je project
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Projectnaam *</Label>
                    <Input
                      id="name"
                      placeholder="Bijv. Website Redesign"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client">Klant *</Label>
                    <Input
                      id="client"
                      placeholder="Bijv. Acme Corp"
                      value={formData.client}
                      onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Beschrijving</Label>
                    <Textarea
                      id="description"
                      placeholder="Korte beschrijving van het project..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStepId === 'details' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Project details</h2>
                  <p className="text-muted-foreground">
                    Optionele extra informatie over het project
                  </p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project_type">Projecttype</Label>
                    <Select
                      value={formData.project_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Mobile App">Mobile App</SelectItem>
                        <SelectItem value="Web Application">Web Application</SelectItem>
                        <SelectItem value="Consultancy">Consultancy</SelectItem>
                        <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Other">Anders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="owner">Projecteigenaar</Label>
                    <Input
                      id="owner"
                      placeholder="Naam van de projecteigenaar"
                      value={formData.owner}
                      onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Startdatum</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Einddatum</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStepId === 'complete' && (
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Project aangemaakt!</h2>
                <p className="text-muted-foreground mb-4">
                  Je project "{formData.name}" is succesvol aangemaakt.
                </p>
                <p className="text-sm text-muted-foreground">
                  Je wordt automatisch doorgestuurd...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStepId !== 'complete' && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Vorige
            </Button>
            
            {currentStepId === 'details' ? (
              <Button
                onClick={handleSubmit}
                disabled={createProject.isPending}
              >
                {createProject.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bezig...
                  </>
                ) : (
                  <>
                    Project aanmaken
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Volgende
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
