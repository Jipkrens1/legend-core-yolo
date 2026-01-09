import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Compass, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary text-primary-foreground">
              <Compass className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Compass</h1>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle className="text-2xl">E-mail verzonden</CardTitle>
              </div>
              <CardDescription>
                We hebben een e-mail naar <strong>{email}</strong> gestuurd met instructies om je wachtwoord te herstellen.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug naar inloggen
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary text-primary-foreground">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Compass</h1>
        </div>

        {/* Forgot Password Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Wachtwoord vergeten</CardTitle>
            <CardDescription>
              Voer je e-mailadres in en we sturen je een link om je wachtwoord te herstellen
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bezig met verzenden...
                  </>
                ) : (
                  'Herstelmail verzenden'
                )}
              </Button>
              
              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug naar inloggen
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
