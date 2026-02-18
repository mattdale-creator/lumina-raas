# Lumina RaaS – Complete Build Guide

This guide contains all the steps needed to build, deploy, and operate the complete Lumina RaaS platform.

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Vercel
vercel deploy --prod
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
NEXT_PUBLIC_APP_URL=https://lumina-raas.vercel.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
SENTRY_DSN=
APOLLO_API_KEY=
RETELL_API_KEY=
RETELL_PHONE_NUMBER_AU=
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `supabase/` - Database migrations and functions
- `lib/` - Shared utilities and helpers
- `server/` - Backend routers and logic
- `components/` - Reusable React components
- `public/` - Static assets

## Features Implemented

- ✅ PRD 1: RaaS Marketing Landing Page
- ✅ PRD 2: Cloud Infrastructure
- ⏳ PRD 3-12: In progress via Ralph loops
- ⏳ PRD 13: Aether Sales Agent
- ⏳ PRD 14-15: Documentation & Guides

## Deployment

### To Vercel
1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### To Supabase
1. Create project at supabase.com
2. Run migrations: `supabase db push`
3. Enable realtime on tables
4. Link webhook to Clerk

## Support

For issues or questions, refer to the README in the conversation history.
