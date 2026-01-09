import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  type: 'chat' | 'extract-requirements' | 'extract-actions' | 'meeting-summary' | 'project-insights'
  projectId?: string
  messages?: Array<{ role: string; content: string }>
  documents?: string[]
  transcript?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: ChatRequest = await req.json()
    const { type, projectId, messages, documents, transcript } = body

    let systemPrompt = ''
    let userContent = ''

    if (type === 'chat' && projectId) {
      // Fetch project context
      const context = await getProjectContext(supabase, projectId)
      
      systemPrompt = `Je bent een AI assistent voor projectmanagement. Je helpt gebruikers met het analyseren en beheren van hun projecten.

Project Context:
${context}

Antwoord in het Nederlands. Wees beknopt maar volledig. Als je verwijst naar specifieke items, geef dan de bron aan.`

      userContent = messages?.[messages.length - 1]?.content || ''
    }

    if (type === 'extract-requirements' && documents) {
      systemPrompt = `Je bent een expert in het analyseren van projectdocumenten en het extraheren van requirements.

Analyseer de volgende documenten en extraheer alle requirements. Categoriseer ze en geef een prioriteit (must, should, could, wont) aan.

Retourneer een JSON array met objecten in dit formaat:
{
  "requirements": [
    { "requirement": "beschrijving", "category": "categorie", "priority": "must|should|could|wont" }
  ]
}`
      userContent = documents.join('\n\n---\n\n')
    }

    if (type === 'extract-actions' && transcript) {
      systemPrompt = `Je bent een expert in het analyseren van meeting transcripts en het extraheren van actiepunten.

Analyseer de volgende transcript en extraheer alle actiepunten. Identificeer indien mogelijk de eigenaar en deadline.

Retourneer een JSON array met objecten in dit formaat:
{
  "actions": [
    { "title": "actie", "owner": "naam of null", "deadline": "datum of null", "priority": "high|medium|low" }
  ]
}`
      userContent = transcript
    }

    if (type === 'meeting-summary' && transcript) {
      systemPrompt = `Je bent een expert in het samenvatten van meetings.

Maak een beknopte maar volledige samenvatting van de volgende meeting transcript. Structureer het als volgt:
- Hoofdpunten
- Besluiten
- Actiepunten (indien genoemd)
- Volgende stappen`
      userContent = transcript
    }

    if (type === 'project-insights' && projectId) {
      const context = await getProjectContext(supabase, projectId)
      
      systemPrompt = `Je bent een project management expert. Analyseer de volgende projectgegevens en geef inzichten.

Project Context:
${context}

Retourneer een JSON object met:
{
  "riskFactors": ["risico 1", "risico 2"],
  "suggestions": ["suggestie 1", "suggestie 2"],
  "healthScore": 0-100
}`
      userContent = 'Analyseer dit project en geef je inzichten.'
    }

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    // Parse JSON responses
    if (type === 'extract-requirements' || type === 'extract-actions' || type === 'project-insights') {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return new Response(jsonMatch[0], {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      } catch {
        // Return as plain text if JSON parsing fails
      }
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Chat function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getProjectContext(supabase: any, projectId: string): Promise<string> {
  const [
    { data: project },
    { data: scopeItems },
    { data: decisions },
    { data: actionItems },
    { data: meetings },
    { data: stakeholders },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('id', projectId).single(),
    supabase.from('scope_items').select('*').eq('project_id', projectId).limit(50),
    supabase.from('decisions').select('*').eq('project_id', projectId).limit(20),
    supabase.from('action_items').select('*').eq('project_id', projectId).limit(30),
    supabase.from('meetings').select('*').eq('project_id', projectId).limit(10),
    supabase.from('stakeholders').select('*').eq('project_id', projectId),
  ])

  let context = ''

  if (project) {
    context += `PROJECT: ${project.name}
Klant: ${project.client}
Status: ${project.status}
${project.description ? `Beschrijving: ${project.description}` : ''}

`
  }

  if (scopeItems?.length) {
    context += `SCOPE ITEMS (${scopeItems.length}):
${scopeItems.map((s: any) => `- [${s.priority || 'n/a'}] ${s.requirement}`).join('\n')}

`
  }

  if (decisions?.length) {
    context += `BESLUITEN (${decisions.length}):
${decisions.map((d: any) => `- [${d.status}] ${d.title}${d.description ? `: ${d.description}` : ''}`).join('\n')}

`
  }

  if (actionItems?.length) {
    context += `ACTIES (${actionItems.length}):
${actionItems.map((a: any) => `- [${a.status}/${a.priority}] ${a.title}${a.owner ? ` (${a.owner})` : ''}`).join('\n')}

`
  }

  if (meetings?.length) {
    context += `MEETINGS (${meetings.length}):
${meetings.map((m: any) => `- ${m.date}: ${m.title}${m.summary ? ` - ${m.summary.substring(0, 100)}...` : ''}`).join('\n')}

`
  }

  if (stakeholders?.length) {
    context += `STAKEHOLDERS (${stakeholders.length}):
${stakeholders.map((s: any) => `- ${s.name}${s.role ? ` (${s.role})` : ''}${s.is_primary ? ' [PRIMARY]' : ''}`).join('\n')}
`
  }

  return context
}
