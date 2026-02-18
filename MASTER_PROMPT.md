# MASTER PROMPT: Build Lumina RaaS From Scratch

You are an expert full-stack engineer. Build the complete **Lumina RaaS (Results-as-a-Service)** platform from scratch in this directory. This is a SaaS platform where AI agents deliver complete software outcomes and customers pay only when results are verified and live.

## Tech Stack (exact versions matter)
- Next.js 15+ with App Router, TypeScript, Tailwind CSS v4
- tRPC v11 for type-safe API (with superjson transformer)
- Supabase for PostgreSQL database + Realtime + RLS
- Clerk for authentication (with conditional rendering — app must work WITHOUT Clerk keys)
- Stripe for pay-per-result payments
- Resend for transactional email
- Recharts for analytics charts
- Framer Motion for landing page animations
- Lucide React for icons

## Step 1: Scaffold
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --yes
npm install @clerk/nextjs @supabase/supabase-js @trpc/server @trpc/client @trpc/next @trpc/react-query @tanstack/react-query stripe @stripe/stripe-js resend recharts framer-motion lucide-react zod superjson @upstash/ratelimit
```

## Step 2: Core Config Files

### `app/globals.css` — Dark theme with violet accent
- Background: #09090b, foreground: #fafafa
- `.gradient-text` class: linear-gradient 90deg #8B5CF6 to #C4B5FD with background-clip text

### `app/layout.tsx` — Root layout
- Inter font, dark theme (`html lang="en" className="dark"`)
- Wrap children in `<Providers>` component
- Metadata: "Lumina RaaS – Results-as-a-Service"

### `app/providers.tsx` — Client component
- Conditional ClerkProvider (skip if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not set)
- tRPC Provider with httpBatchLink to `/api/trpc`
- QueryClientProvider from @tanstack/react-query

### `.env.example` — All keys with placeholders
- NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET
- STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY, SENTRY_DSN, APOLLO_API_KEY, RETELL_API_KEY, RETELL_PHONE_NUMBER_AU

### `vercel.json` — Sydney region (syd1), 60s function timeout
### `Dockerfile` — Multi-stage Alpine Node 20 build

## Step 3: Database (PRD 4)

### `supabase/migrations/001_create_core_schema.sql`
Create these 11 tables with UUID PKs, proper FKs, indexes, RLS policies, and Supabase Realtime:

1. **users**: id, auth_id (unique), email, full_name, role (user/paid_user/admin), created_at
2. **outcomes**: id, user_id FK, title, description, prd_id, status (pending/in_progress/delivered/verified/paid), success_criteria, delivered_at, verified_at, payment_triggered, amount_cents, stripe_session_id, created_at
3. **prd_instances**: id, outcome_id FK, prd_number, status, logs (JSONB), completed_at
4. **agent_executions**: id, outcome_id FK, agent_role, iteration_count, last_status, completed
5. **aether_leads**: id, campaign, name, email, phone, company, title, status (pending/contacted/qualified/booked/converted/rejected), dnc_checked, outcome_id FK, notes
6. **subscriptions**: id, user_id FK, stripe_subscription_id, stripe_customer_id, tier (free/growth/enterprise), status, next_billing
7. **notification_preferences**: id, user_id FK (unique), email_enabled, in_app_enabled, outcome_delivered, payment_confirmed, aether_summary
8. **raas_metrics**: id, outcome_id FK, metric_type, value, recorded_at
9. **aether_campaign_metrics**: id, campaign, leads_contacted, meetings_booked, cost_cents
10. **audit_logs**: id, action, performed_by, target_type, target_id, details (JSONB), created_at

RLS: users see own data, admins see all metrics. Realtime on outcomes, prd_instances, agent_executions, aether_leads.

## Step 4: Lib Files

### `lib/supabase.ts` — Client (anon key) and admin (service role) Supabase clients, with placeholder fallbacks
### `lib/stripe.ts` — Stripe client, `createPayPerResultSession(outcomeId, amountCents, userEmail)` function, AUD currency
### `lib/resend.ts` — Resend client, `sendRaaSNotification(to, subject, html)`, plus HTML email templates for outcome delivery and payment confirmation
### `lib/logger.ts` — `logRaaS(event, details, userId)` structured logger + `logAudit()` that writes to Supabase audit_logs
### `lib/trpc.ts` — tRPC init with superjson, `createContext()` that resolves Clerk auth → Supabase user, publicProcedure, protectedProcedure (auth required), adminProcedure (admin role required)
### `lib/trpc-client.ts` — `createTRPCReact<AppRouter>()` export

## Step 5: Authentication (PRD 5)

### `middleware.ts`
- If CLERK_SECRET_KEY exists: use clerkMiddleware with public routes (/, /sign-in, /sign-up, /api/webhooks, /api/stripe/webhook, /api/monitor/health)
- If missing: simple middleware that just adds security headers
- Security headers on ALL responses: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, HSTS 1 year

### `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`
- Client components, conditional: if no Clerk key, show helpful placeholder with setup instructions
- If Clerk key exists, dynamically require and render SignIn/SignUp components

### `app/api/webhooks/clerk/route.ts`
- Handles user.created, user.updated, user.deleted
- Upserts to Supabase users table, creates default notification_preferences on user.created

## Step 6: tRPC Backend (PRD 6)

### `server/routers/outcome.ts` — create, getAll, getById, verify (triggers payment flag), updateStatus
### `server/routers/admin.ts` — getAllUsers, getAllOutcomes, bulkVerifyOutcomes, updateUserRole, getAllLeads, getAuditLogs, getStats (returns totalUsers, totalOutcomes, verifiedOutcomes, paidOutcomes, totalRevenueCents, totalLeads)
### `server/routers/analytics.ts` — getMyMetrics (total/delivered/verified/paid counts), getAllMetrics, getAetherMetrics, getDeliveryStats (calculates delivery time in minutes), exportOutcomes
### `server/routers/_app.ts` — Root router merging outcome + admin + analytics
### `app/api/trpc/[trpc]/route.ts` — fetchRequestHandler with createContext

## Step 7: Pages

### `app/components/AppNav.tsx`
- Shared nav bar used on all authenticated pages
- Links: Dashboard, Analytics, Aether, Admin
- Conditional Clerk UserButton (if no key, show placeholder avatar linking to /sign-in)
- Active link highlighting based on pathname

### `app/page.tsx` — PRD 1: Landing Page (client component)
- Sections: Navbar → Hero ("Lumina RaaS. We deliver your complete software business — or you pay nothing.") → RaaS Guarantee → Trusted By → Features (6 cards) → Pricing (3 tiers: Free Pilot $0, Pay-per-Result $2,500+, RaaS Growth $499/mo) → FAQ (4 items with details/summary) → Contact Form → Footer
- Violet accent (#8B5CF6), dark zinc-950 background, Framer Motion animations, mobile responsive

### `app/dashboard/page.tsx` — PRD 7: Dashboard (client component)
- AppNav, stats cards (Active/Verified/Total), outcome list with status badges and progress bars
- Create Outcome modal (title + description inputs)
- Empty state with CTA, quick links to Aether and Analytics
- Status colors: pending=grey, in_progress=blue, delivered=violet, verified=emerald, paid=green

### `app/analytics/page.tsx` — PRD 10: Analytics
- AppNav, stats grid (4 cards), two Recharts BarCharts (delivery time + outcome value), CSV export link

### `app/admin/page.tsx` — PRD 11: Admin Panel
- AppNav, stats dashboard, tabbed interface (Outcomes/Users/Aether Leads/Audit Log)
- Data tables for each tab, access denied page if not admin

### `app/aether/page.tsx` — PRD 13: Aether Sales Agent
- AppNav, hero with "Autonomous Sales Agent" badge
- How-it-works cards (Find Leads → Outreach → Voice Calls → Book Meetings)
- Campaign launcher form (name, keywords, daily limit)
- Retell voice script display, cost info

## Step 8: API Routes

### `app/api/stripe/webhook/route.ts` — Handles checkout.session.completed, updates outcome to paid, sends confirmation email
### `app/api/stripe/create-session/route.ts` — Creates Stripe Checkout session for pay-per-result
### `app/api/analytics/export/route.ts` — GET returns CSV of all outcomes
### `app/api/monitor/health/route.ts` — GET returns { status: "healthy", timestamp, version }
### `app/api/aether/start/route.ts` — POST creates campaign metrics record, stubs Apollo/Retell integration

## Step 9: CI/CD (PRD 3)
### `.github/workflows/ci.yml` — Node 20, npm ci, lint, tsc --noEmit, build

## Step 10: Business Documents (in `docs/`)
Create these markdown files:
- `PITCH_DECK.md` — 13-slide investor deck
- `FINANCIAL_MODEL.csv` — 3-year P&L with unit economics
- `CUSTOMER_VALIDATION_SURVEY.md` — 14-question survey with scoring framework
- `SALES_PLAYBOOK.md` — Aether voice script, email templates, objection handling, BANT, AU compliance
- `COMPETITOR_ANALYSIS.md` — Cursor/Replit/Devin/Copilot/Bolt comparison matrix
- `GTM_EXECUTION_PLAN.md` — Week-by-week 6-month playbook with budgets and metrics
- `PRD_KNOWLEDGE_BASE.md` — All 13 PRDs with objectives, features, success criteria, key files

Also create `generate-pdfs.mjs` (markdown→HTML converter with dark violet styling) and `html-to-pdf.mjs` (Puppeteer PDF generator).

## Step 11: Ralph Loop Infrastructure
- `ralph.sh` — Main loop runner (bash, reads PROMPT.md, feeds to claude CLI, checks progress.txt for COMPLETE, auto-commits)
- `PROMPT.md` — Default task: polish & harden
- `prompts/features.md` — Add 6 missing features
- `prompts/testing.md` — Add test suite
- `prompts/conversion.md` — Optimize landing page
- `prompts/scenarios/01-10` — 10 versatility test scenarios (SaaS, agency, fintech, ecommerce, internal tool, marketplace, AI product, nonprofit, vague request, enterprise CRM)
- `run-scenarios.sh` — Batch runner with git branching and versatility report

## Critical Rules
- ALL Clerk components must be conditional — app MUST build and run without any API keys
- Use placeholder/fallback values in all lib clients (Supabase, Stripe, etc.)
- Dark theme everywhere, violet (#8B5CF6) accent
- RaaS messaging: "pay only for delivered results" in every customer-facing element
- `npm run build` MUST succeed when complete
- Australian context: AUD currency, Sydney region, AU compliance references

## Verification
After building everything, run:
1. `npm run build` — must succeed with zero errors
2. `npm run dev` — must start and show landing page at localhost:3000
3. Navigate to /dashboard, /analytics, /aether, /admin — all must render
4. Navigate to /api/monitor/health — must return JSON

Build everything now. Do not ask questions. Start with scaffold and proceed sequentially through all steps.
