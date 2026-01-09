import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get email settings
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .single()

    if (!settings?.enabled) {
      return new Response(
        JSON.stringify({ message: 'Reminders are disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const reminderDays = settings.reminder_days || [0, 1, 3, 7]

    // Get internal users with email enabled
    const { data: internalUsers } = await supabase
      .from('internal_users')
      .select('*')
      .eq('receive_reminders', true)

    if (!internalUsers?.length) {
      return new Response(
        JSON.stringify({ message: 'No users configured for reminders' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build lookup map for users (by name)
    const usersByName = new Map<string, { name: string; email: string }>()
    for (const user of internalUsers) {
      usersByName.set(user.name.toLowerCase(), user)
      // Also add first name
      const firstName = user.name.split(' ')[0].toLowerCase()
      if (!usersByName.has(firstName)) {
        usersByName.set(firstName, user)
      }
    }

    // Get upcoming action items
    const today = new Date()
    const dates = reminderDays.map(days => {
      const date = new Date(today)
      date.setDate(date.getDate() + days)
      return date.toISOString().split('T')[0]
    })

    const { data: actionItems } = await supabase
      .from('action_items')
      .select(`
        *,
        projects(name, client)
      `)
      .in('deadline', dates)
      .neq('status', 'completed')
      .neq('status', 'cancelled')

    if (!actionItems?.length) {
      return new Response(
        JSON.stringify({ message: 'No action items to remind about' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Group by owner and send emails
    const emailsSent: string[] = []
    const actionsByOwner = new Map<string, typeof actionItems>()

    for (const item of actionItems) {
      if (!item.owner) continue
      
      const ownerKey = item.owner.toLowerCase()
      if (!actionsByOwner.has(ownerKey)) {
        actionsByOwner.set(ownerKey, [])
      }
      actionsByOwner.get(ownerKey)!.push(item)
    }

    for (const [ownerName, items] of actionsByOwner) {
      // Find user by name
      const user = usersByName.get(ownerName)
      if (!user) continue

      // Build email content
      const itemsList = items.map(item => {
        const daysUntil = Math.ceil(
          (new Date(item.deadline!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
        const urgency = daysUntil === 0 ? 'VANDAAG' : daysUntil === 1 ? 'MORGEN' : `over ${daysUntil} dagen`
        const project = item.projects as { name: string; client: string } | null
        
        return `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
              <strong>${item.title}</strong>
              ${project ? `<br><span style="color: #6b7280; font-size: 14px;">${project.name} - ${project.client}</span>` : ''}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
              <span style="color: ${daysUntil <= 1 ? '#ef4444' : '#eab308'}; font-weight: 600;">
                ${urgency}
              </span>
            </td>
          </tr>
        `
      }).join('')

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Deadline Herinnering</title>
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">
            Deadline Herinnering
          </h1>
          <p style="color: #4b5563; margin-bottom: 20px;">
            Hoi ${user.name.split(' ')[0]}, je hebt ${items.length} ${items.length === 1 ? 'actie' : 'acties'} met naderende deadline${items.length === 1 ? '' : 's'}:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; font-weight: 600;">Actie</th>
                <th style="padding: 12px; text-align: right; font-weight: 600;">Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <p style="color: #6b7280; font-size: 14px;">
            Log in op Compass om je acties te bekijken en af te ronden.
          </p>
        </body>
        </html>
      `

      // Send email via Resend
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Compass <noreply@compass.app>',
          to: user.email,
          subject: `Herinnering: ${items.length} ${items.length === 1 ? 'actie' : 'acties'} met naderende deadline`,
          html: htmlContent,
        }),
      })

      if (response.ok) {
        emailsSent.push(user.email)
      } else {
        console.error('Failed to send email to:', user.email)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: emailsSent.length,
        recipients: emailsSent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Send reminders error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
