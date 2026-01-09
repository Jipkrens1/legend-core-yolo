# Compass

Een uitgebreide projectmanagement applicatie gebouwd voor agencies en consulting firms. Geschreven in het Nederlands.

## Features

### Core Features
- **Projectbeheer** - Volledige CRUD voor projecten met status tracking
- **Scope Management** - Requirements met MoSCoW prioritering
- **Meeting Management** - Vergaderingen met transcripties en samenvattingen
- **Action Items** - Actiepunten met drag-and-drop en deadlines
- **Stakeholder Management** - Contactenbeheer per project
- **Besluitenlog** - Bijhouden van genomen besluiten

### Authenticatie & Beveiliging
- Email/wachtwoord authenticatie via Supabase
- Wachtwoord reset flow
- Row Level Security (RLS) voor data isolatie
- Session management

### UI/UX
- **Dark Mode** - Automatische detectie + handmatige toggle
- **Collapsible Sidebar** - Keyboard shortcut (Cmd+B)
- **Responsive Design** - Mobile-first approach
- **Global Search** - Cmd+K command palette

### Samenwerking
- **Real-time Presence** - Zie wie online is
- **Comments** - Threaded reacties op items
- **Activity Feed** - Live updates van wijzigingen
- **Notificaties** - In-app en push notificaties

### Analytics
- Project status overzicht
- Action items dashboards
- Activity trends
- Meeting statistieken

### AI Features
- **Chat Assistant** - Stel vragen over je project
- **Meeting Summaries** - Automatische samenvattingen
- **Action Extraction** - Extraheer acties uit transcripties
- **Project Insights** - Risicoanalyse en suggesties

### Integraties
- **Jira** - Sync projecten en sprints
- **Tempo** - Time tracking integratie
- **Email** - Inbound email naar projecten
- **Deadline Reminders** - Automatische herinneringen

### Enterprise
- **Teams** - Team management met rollen
- **Audit Log** - Volledige audit trail
- **SSO Ready** - OAuth providers configureerbaar

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- TanStack Query (server state)
- React Router v6
- Recharts (charts)

### Backend
- Supabase (PostgreSQL + Auth + Storage)
- Supabase Edge Functions (Deno)
- OpenAI GPT-4o-mini (AI features)
- Resend (email delivery)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (voor AI features)

### Installation

1. Clone de repository:
\`\`\`bash
cd compass-app
npm install
\`\`\`

2. Maak een \`.env\` bestand:
\`\`\`env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

3. Pas de database migratie toe:
\`\`\`bash
# Via Supabase CLI
supabase db push
\`\`\`

4. Start de development server:
\`\`\`bash
npm run dev
\`\`\`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | Yes |
| VITE_VAPID_PUBLIC_KEY | VAPID key voor push notifications | No |

### Edge Functions Environment

Deze moeten in Supabase worden geconfigureerd:

| Variable | Description |
|----------|-------------|
| OPENAI_API_KEY | OpenAI API key |
| RESEND_API_KEY | Resend API key |

## Project Structure

\`\`\`
compass-app/
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── src/
│   ├── components/
│   │   ├── auth/         # Auth components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── layout/       # Layout components
│   │   ├── project/      # Project components
│   │   └── ui/           # shadcn/ui components
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── SidebarContext.tsx
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   ├── useActionItems.ts
│   │   ├── useMeetings.ts
│   │   └── ...
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client
│   │   ├── utils.ts      # Utility functions
│   │   └── performance.ts # Performance utils
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectPage.tsx
│   │   └── ...
│   └── types/
│       └── database.ts   # TypeScript types
├── supabase/
│   ├── functions/        # Edge functions
│   └── migrations/       # Database migrations
└── package.json
\`\`\`

## Development

### Commands

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run typecheck
\`\`\`

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Tailwind CSS class sorting

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables
3. Deploy

### Docker

\`\`\`bash
# Build image
docker build -t compass-app .

# Run container
docker run -p 3000:3000 compass-app
\`\`\`

## Database Schema

Key tables:
- \`projects\` - Project records
- \`scope_items\` - Requirements
- \`meetings\` - Meeting records
- \`action_items\` - Action items
- \`decisions\` - Decisions
- \`stakeholders\` - Project stakeholders
- \`user_profiles\` - User profiles
- \`teams\` - Team management
- \`notifications\` - User notifications
- \`activity_feed\` - Activity log
- \`audit_log\` - Audit trail

## Contributing

1. Fork het project
2. Maak een feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit je changes (\`git commit -m 'Add amazing feature'\`)
4. Push naar de branch (\`git push origin feature/amazing-feature\`)
5. Open een Pull Request

## License

MIT License - zie LICENSE bestand voor details.

## Support

Voor vragen en ondersteuning:
- Open een GitHub issue
- Email: support@compass.app
