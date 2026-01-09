import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PostmarkInboundEmail {
  From: string
  FromName: string
  To: string
  Cc?: string
  Bcc?: string
  Subject: string
  TextBody?: string
  HtmlBody?: string
  MessageID: string
  Date: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const email: PostmarkInboundEmail = await req.json()
    
    // Extract project ID from the BCC or To address
    // Format: compass+{projectId}@inbound.postmarkapp.com
    const allAddresses = [email.To, email.Bcc, email.Cc].filter(Boolean).join(',')
    const projectIdMatch = allAddresses.match(/compass\+([a-f0-9-]+)@/i)
    
    if (!projectIdMatch) {
      console.log('No project ID found in email addresses:', allAddresses)
      return new Response(
        JSON.stringify({ error: 'No project ID found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const projectId = projectIdMatch[1]

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      console.log('Project not found:', projectId)
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store the email
    const { error: insertError } = await supabase
      .from('project_emails')
      .insert({
        project_id: projectId,
        from_email: email.From,
        from_name: email.FromName || null,
        subject: email.Subject,
        body_text: email.TextBody || null,
        body_html: email.HtmlBody || null,
        received_at: email.Date || new Date().toISOString(),
        message_id: email.MessageID || null,
      })

    if (insertError) {
      throw insertError
    }

    console.log('Email stored for project:', projectId)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Receive email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
