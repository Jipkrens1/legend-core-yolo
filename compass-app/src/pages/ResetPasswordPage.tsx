import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Compass, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { updatePassword, session } = useAuth()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Check if user has a valid recovery session
  useEffect(() => {
    if (!session) {
      // No session means the reset link may have expired or is invalid
      // We'll show the form anyway and handle errors on submit
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate password match
    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.')
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten.')
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het instellen van je wachtwoord.')
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
                <CardTitle className="text-2xl">Wachtwoord gewijzigd</CardTitle>
              </div>
              <CardDescription>
                Je wachtwoord is succesvol gewijzigd. Je kunt nu inloggen met je nieuwe wachtwoord.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Naar inloggen
              </Button>
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

        {/* Reset Password Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Nieuw wachtwoord instellen</CardTitle>
            <CardDescription>
              Kies een nieuw wachtwoord voor je account
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
                <Label htmlFor="password">Nieuw wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimaal 8 tekens"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Wachtwoord bevestigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Herhaal je wachtwoord"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bezig met opslaan...
                  </>
                ) : (
                  'Wachtwoord opslaan'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
