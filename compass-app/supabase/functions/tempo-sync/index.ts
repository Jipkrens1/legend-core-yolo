import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TempoRequest {
  action: 'test' | 'get-hours' | 'sync'
  from?: string
  to?: string
  issueKey?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get Tempo settings
    const { data: settings, error: settingsError } = await supabase
      .from('tempo_settings')
      .select('*')
      .single()

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ error: 'Tempo settings not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { api_token } = settings

    const body: TempoRequest = await req.json()
    const { action, from, to, issueKey } = body

    if (action === 'test') {
      const response = await fetch('https://api.tempo.io/core/3/worklogs?limit=1', {
        headers: {
          'Authorization': `Bearer ${api_token}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to connect to Tempo')
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'get-hours') {
      const params = new URLSearchParams()
      if (from) params.append('from', from)
      if (to) params.append('to', to)
      if (issueKey) params.append('issue', issueKey)
      params.append('limit', '1000')

      const response = await fetch(`https://api.tempo.io/core/3/worklogs?${params}`, {
        headers: {
          'Authorization': `Bearer ${api_token}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch worklogs')
      }

      const data = await response.json()
      
      // Calculate total hours
      const totalSeconds = data.results?.reduce(
        (sum: number, log: any) => sum + log.timeSpentSeconds,
        0
      ) || 0
      const totalHours = Math.round((totalSeconds / 3600) * 10) / 10

      return new Response(
        JSON.stringify({ 
          worklogs: data.results,
          totalHours,
          count: data.results?.length || 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'sync') {
      const params = new URLSearchParams()
      if (from) params.append('from', from)
      if (to) params.append('to', to)
      params.append('limit', '1000')

      const response = await fetch(`https://api.tempo.io/core/3/worklogs?${params}`, {
        headers: {
          'Authorization': `Bearer ${api_token}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch worklogs')
      }

      const data = await response.json()

      // Upsert worklogs
      for (const log of data.results || []) {
        await supabase.from('tempo_worklogs').upsert({
          tempo_id: log.tempoWorklogId,
          issue_key: log.issue?.key || '',
          author_account_id: log.author?.accountId || '',
          author_display_name: log.author?.displayName || '',
          time_spent_seconds: log.timeSpentSeconds,
          started: log.startDate,
          description: log.description || null,
          synced_at: new Date().toISOString(),
        }, { onConflict: 'tempo_id' })
      }

      return new Response(
        JSON.stringify({ success: true, count: data.results?.length || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Tempo sync error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
