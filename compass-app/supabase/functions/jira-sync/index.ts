import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JiraRequest {
  action: 'test' | 'sync' | 'get-boards' | 'get-sprints' | 'sync-sprints'
  projectKey?: string
  boardId?: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get Jira settings
    const { data: settings, error: settingsError } = await supabase
      .from('jira_settings')
      .select('*')
      .single()

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ error: 'Jira settings not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { cloud_id, site_url, api_token, email } = settings
    const authHeader = `Basic ${btoa(`${email}:${api_token}`)}`

    const body: JiraRequest = await req.json()
    const { action, projectKey, boardId } = body

    if (action === 'test') {
      // Test connection
      const response = await fetch(`https://api.atlassian.com/ex/jira/${cloud_id}/rest/api/3/myself`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to connect to Jira')
      }

      const user = await response.json()
      return new Response(
        JSON.stringify({ success: true, user: { displayName: user.displayName, emailAddress: user.emailAddress } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'sync') {
      // Sync all projects
      const response = await fetch(`https://api.atlassian.com/ex/jira/${cloud_id}/rest/api/3/project`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch Jira projects')
      }

      const projects = await response.json()

      // Upsert projects
      for (const project of projects) {
        await supabase.from('jira_projects').upsert({
          jira_id: project.id,
          key: project.key,
          name: project.name,
          project_type: project.projectTypeKey,
          synced_at: new Date().toISOString(),
        }, { onConflict: 'jira_id' })
      }

      return new Response(
        JSON.stringify({ success: true, count: projects.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'get-boards' && projectKey) {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloud_id}/rest/agile/1.0/board?projectKeyOrId=${projectKey}`,
        {
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch boards')
      }

      const data = await response.json()
      return new Response(
        JSON.stringify({ boards: data.values }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'get-sprints' && boardId) {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloud_id}/rest/agile/1.0/board/${boardId}/sprint`,
        {
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch sprints')
      }

      const data = await response.json()
      return new Response(
        JSON.stringify({ sprints: data.values }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'sync-sprints' && boardId) {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloud_id}/rest/agile/1.0/board/${boardId}/sprint`,
        {
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch sprints')
      }

      const data = await response.json()

      // Upsert sprints
      for (const sprint of data.values || []) {
        await supabase.from('jira_sprints').upsert({
          jira_id: sprint.id,
          board_id: boardId,
          name: sprint.name,
          state: sprint.state,
          start_date: sprint.startDate || null,
          end_date: sprint.endDate || null,
          synced_at: new Date().toISOString(),
        }, { onConflict: 'jira_id' })
      }

      return new Response(
        JSON.stringify({ success: true, count: data.values?.length || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Jira sync error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
