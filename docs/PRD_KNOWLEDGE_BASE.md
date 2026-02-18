# Lumina RaaS — Complete PRD Knowledge Base
## All 13 Product Requirements Documents

---

## PRD 1: Marketing & Landing-Page Website

### Objective
Public-facing RaaS marketing site to acquire users, communicate the "pay only for delivered results" value proposition, and capture leads.

### Key Features
- Responsive landing page with hero, features grid, pricing table, FAQ, and contact form
- Dark theme with violet (#8B5CF6) accent, gradient text effects
- Mobile-first design with hamburger menu
- SEO-optimised metadata and Open Graph tags
- RaaS-specific CTAs: "Start Free Pilot", "Request Early Access"

### Tech Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Framer Motion animations
- Lucide React icons

### Success Criteria
- Lighthouse score ≥95 across all categories
- < 2-second load time
- Mobile responsive on all breakpoints
- Contact form with success state
- All sections: Hero → Guarantee → Trusted By → Features → Pricing → FAQ → CTA → Footer

### Key Files
- `app/page.tsx` — Full landing page (client component)
- `app/layout.tsx` — Root layout with Inter font, dark theme
- `app/globals.css` — Tailwind config with gradient-text utility

---

## PRD 2: Cloud Infrastructure & Base Hosting Environment

### Objective
Foundational cloud setup with multi-environment support, secrets management, and deployment configuration.

### Key Features
- Vercel deployment config (Sydney region `syd1` for AU latency)
- Docker support for local development consistency
- Environment variable template (.env.example) with all service keys
- Multi-environment: development, staging, production

### Tech Stack
- Vercel (frontend + serverless functions)
- Supabase (PostgreSQL + auth + storage + realtime)
- Docker (Alpine Node 20)

### Success Criteria
- One-click Vercel deploy from GitHub
- All secrets isolated per environment
- Docker build succeeds: `docker build --no-cache`
- Zero-downtime deployments

### Key Files
- `vercel.json` — Region config, function timeouts
- `Dockerfile` — Multi-stage build (deps → builder → runner)
- `.env.example` — Complete environment variable template

---

## PRD 3: CI/CD Pipelines & DevOps Automation

### Objective
Automated build, test, lint, and deployment workflows with RaaS outcome verification.

### Key Features
- GitHub Actions workflow triggered on push to main and PRs
- Node.js 20 with npm caching
- Lint → Type check → Build pipeline
- RaaS outcome verification step (confirms build meets success criteria)

### Success Criteria
- Every code change triggers verified deployment
- < 5 min full pipeline execution
- Type errors and lint issues block merge

### Key Files
- `.github/workflows/ci.yml` — Complete CI/CD pipeline

---

## PRD 4: Database Schema, Models & Data Layer

### Objective
Persistent PostgreSQL storage with all core entities, relationships, indexing, Row Level Security (RLS), and real-time subscriptions.

### Key Features
- **11 tables:** users, outcomes, prd_instances, agent_executions, aether_leads, subscriptions, notification_preferences, raas_metrics, aether_campaign_metrics, audit_logs
- Full foreign key relationships and cascading deletes
- Performance indexes on all query-heavy columns
- RLS policies for multi-tenant isolation
- Supabase Realtime on outcomes, prd_instances, agent_executions, aether_leads

### Schema Overview

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **users** | Clerk-synced user profiles | auth_id, email, role (user/paid_user/admin) |
| **outcomes** | Core RaaS billing entity | title, status, success_criteria, amount_cents, verified_at, payment_triggered |
| **prd_instances** | Tracked PRD executions | outcome_id, prd_number, status, logs (JSONB) |
| **agent_executions** | Ralph-loop tracking | outcome_id, agent_role, iteration_count, completed |
| **aether_leads** | Sales leads | campaign, name, email, phone, company, status |
| **subscriptions** | RaaS retainers | stripe_subscription_id, tier, status |
| **notification_preferences** | User notification settings | email_enabled, in_app_enabled |
| **raas_metrics** | Outcome performance data | outcome_id, metric_type, value |
| **aether_campaign_metrics** | Campaign performance | leads_contacted, meetings_booked, cost_cents |
| **audit_logs** | Admin action tracking | action, performed_by, target_type, details (JSONB) |

### Success Criteria
- All migrations apply cleanly (`supabase db push`)
- RLS prevents unauthorised cross-user access
- Realtime subscriptions work for outcome status updates
- Query latency < 50ms p95 on indexed columns

### Key Files
- `supabase/migrations/001_create_core_schema.sql` — Complete migration
- `lib/supabase.ts` — Client and admin Supabase clients

---

## PRD 5: User Authentication & Authorization System

### Objective
Secure sign-up, login, sessions, roles, and OAuth with automatic Supabase sync.

### Key Features
- Clerk integration with ClerkProvider (conditional — works without keys)
- Sign-in and sign-up pages with dark theme styling
- Middleware for route protection (public: `/`, `/sign-in`, `/sign-up`, webhooks)
- Clerk webhook syncs users to Supabase `users` table on create/update/delete
- Role-based access: user → paid_user → admin
- Default notification preferences created on signup
- Graceful degradation: app runs without Clerk keys configured

### RBAC Model

| Role | Access |
|------|--------|
| **user** | Own outcomes, dashboard, analytics |
| **paid_user** | + verified outcome access, payment features |
| **admin** | + all users, all outcomes, bulk actions, audit logs |

### Success Criteria
- Sign-up/login flows complete without errors
- Protected routes redirect unauthenticated users
- New users auto-sync to Supabase with correct role
- Zero security findings

### Key Files
- `middleware.ts` — Clerk middleware with security headers
- `app/sign-in/[[...sign-in]]/page.tsx` — Sign-in page
- `app/sign-up/[[...sign-up]]/page.tsx` — Sign-up page
- `app/api/webhooks/clerk/route.ts` — User sync webhook
- `app/providers.tsx` — Conditional ClerkProvider + tRPC

---

## PRD 6: Core Product Backend API Services

### Objective
Type-safe tRPC API layer for outcome management, admin operations, and analytics.

### Key Features
- tRPC v11 with superjson transformer
- Context creation: authenticates via Clerk, resolves Supabase user
- Three procedure levels: public, protected (auth required), admin (admin role)
- **Outcome router:** create, getAll, getById, verify, updateStatus
- **Admin router:** getAllUsers, getAllOutcomes, bulkVerifyOutcomes, updateUserRole, getAllLeads, getAuditLogs, getStats
- **Analytics router:** getMyMetrics, getAllMetrics, getAetherMetrics, getDeliveryStats, exportOutcomes

### API Endpoints

| Router | Procedure | Type | Description |
|--------|-----------|------|-------------|
| outcome | create | mutation | Create new RaaS outcome |
| outcome | getAll | query | User's outcomes (ordered by date) |
| outcome | verify | mutation | Mark verified + trigger payment |
| admin | getStats | query | Dashboard stats (users, outcomes, revenue) |
| admin | bulkVerifyOutcomes | mutation | Verify multiple outcomes at once |
| analytics | getDeliveryStats | query | Delivery time and value per outcome |

### Success Criteria
- All procedures pass integration tests
- < 150ms p95 latency
- Unauthorised users cannot access protected/admin procedures
- Outcome create → verify → payment flow works end-to-end

### Key Files
- `lib/trpc.ts` — Server-side tRPC init with auth context
- `lib/trpc-client.ts` — Client-side React hooks
- `server/routers/_app.ts` — Root router
- `server/routers/outcome.ts` — Outcome CRUD
- `server/routers/admin.ts` — Admin operations
- `server/routers/analytics.ts` — Analytics queries
- `app/api/trpc/[trpc]/route.ts` — API handler

---

## PRD 7: Core Product Frontend Application (User Dashboard)

### Objective
Primary authenticated interface for defining, tracking, and managing RaaS outcomes.

### Key Features
- Stats cards: Active Outcomes, Verified Results, Total Outcomes
- Outcome list with status badges, progress bars, timestamps
- Create Outcome modal: title, description/success criteria input
- Status colour coding: pending (grey) → in_progress (blue) → delivered (violet) → verified (emerald) → paid (green)
- Quick links to Aether and Analytics
- Empty state with CTA when no outcomes exist
- Shared AppNav component with conditional Clerk UserButton

### Success Criteria
- Authenticated users see their outcomes in real time
- New outcome creation triggers backend and updates UI instantly
- Mobile responsive, accessible
- All interactions protected by auth

### Key Files
- `app/dashboard/page.tsx` — Full dashboard with modal
- `app/components/AppNav.tsx` — Shared navigation bar

---

## PRD 8: Payment Processing & Subscription Management

### Objective
Stripe-based billing triggered only on verified outcome delivery (RaaS model).

### Key Features
- Pay-per-result checkout sessions (AUD currency)
- Stripe webhook handler: processes `checkout.session.completed`
- Updates outcome status to `paid` and triggers email notification
- Customer Portal for subscription management
- Idempotent webhook processing with signature verification

### Payment Flow
```
Outcome verified → Payment triggered → Stripe Checkout →
Customer pays → Webhook fires → Outcome marked "paid" →
Confirmation email sent
```

### Success Criteria
- End-to-end: create → verify → checkout → payment → database update
- Webhook correctly updates outcomes atomically
- PCI-compliant (Stripe handles card data)

### Key Files
- `lib/stripe.ts` — Stripe client, checkout session creation
- `app/api/stripe/webhook/route.ts` — Webhook handler
- `app/api/stripe/create-session/route.ts` — Checkout API

---

## PRD 9: Notification & Communication Services

### Objective
Email notifications for RaaS events using Resend with branded templates.

### Key Features
- Transactional email templates:
  - Outcome Delivered (violet theme, dashboard link)
  - Payment Confirmed (green theme, amount display)
- User notification preferences (email/in-app toggles)
- Graceful error handling with logging
- HTML email templates with inline styles

### Success Criteria
- Outcome verification triggers delivery email
- Payment completion triggers confirmation email
- 98%+ deliverability
- Templates render correctly across email clients

### Key Files
- `lib/resend.ts` — Resend client, email templates, send function

---

## PRD 10: Analytics, Usage Tracking & Internal Reporting

### Objective
Privacy-first analytics dashboard with outcome metrics, charts, and CSV export.

### Key Features
- Stats overview: Total, Delivered, Verified, Paid outcomes
- Recharts bar charts: Delivery Time (minutes), Outcome Value (AUD)
- CSV export endpoint for all outcomes
- Dark-themed chart tooltips matching platform design
- Admin-level delivery stats with time calculations

### Success Criteria
- Dashboard loads with live data
- Charts render correctly (or show empty state)
- CSV export produces accurate data

### Key Files
- `app/analytics/page.tsx` — Full analytics dashboard with Recharts
- `app/api/analytics/export/route.ts` — CSV export endpoint

---

## PRD 11: Admin Panel & Internal Operational Tools

### Objective
Secure admin interface for managing all users, outcomes, leads, and audit logs.

### Key Features
- Tabbed interface: All Outcomes, Users, Aether Leads, Audit Log
- Stats dashboard: total users, outcomes, paid, revenue
- Data tables with status badges and role indicators
- Bulk verify functionality
- Access denied page for non-admin users
- Audit log with action, performer, target, timestamp

### Success Criteria
- Only admin users can access `/admin`
- All tabs show live data
- Bulk actions update correctly

### Key Files
- `app/admin/page.tsx` — Full tabbed admin panel

---

## PRD 12: Monitoring, Logging, Error Tracking & Security Baseline

### Objective
Production observability, security headers, structured logging, and health monitoring.

### Key Features
- Security headers in middleware: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS
- Structured JSON logger with RaaS event context
- Audit logging to Supabase
- Health check endpoint at `/api/monitor/health`
- Sentry integration ready (add DSN to enable)

### Security Headers

| Header | Value |
|--------|-------|
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |

### Success Criteria
- Health endpoint returns `{ status: "healthy" }`
- All RaaS actions logged with context
- Security headers pass securityheaders.com scan

### Key Files
- `lib/logger.ts` — Structured logger + audit function
- `app/api/monitor/health/route.ts` — Health check
- `middleware.ts` — Security headers (integrated with auth)

---

## PRD 13: Aether — Autonomous Sales Agent

### Objective
Autonomous AI sales agent that finds leads, makes real-time voice calls, qualifies prospects, and books meetings.

### Key Features
- Campaign launcher UI with configurable parameters
- Target keywords, daily contact limits
- How-it-works visual: Find Leads → Outreach → Voice Calls → Book Meetings
- API route for campaign activation (stubs Apollo.io + Retell AI integration)
- Retell AI voice agent prompt (adaptive, works for any person who answers)
- Campaign metrics stored in Supabase
- Australia-compliant (DNC scrubbing, consent, business hours)

### Voice Agent Architecture
```
Apollo.io (lead finding) → Personalised outreach (email/LinkedIn) →
Retell AI (real-time voice calls) → Qualify & book meetings →
Supabase (CRM logging)
```

### Operational Costs
- Retell AI: ~$0.07/connected minute + AU telephony ~$0.10/min
- Apollo.io: $49/month (Basic plan)
- Total: ~$0.17–0.20 per connected minute

### Success Criteria
- Campaign launches from UI and records to Supabase
- Ready for Apollo/Retell API key activation
- Voice script handles any role (receptionist through CEO)

### Key Files
- `app/aether/page.tsx` — Campaign launcher UI
- `app/api/aether/start/route.ts` — Campaign API endpoint

---

## Architecture Summary

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (TypeScript, App Router) + Tailwind CSS |
| **Backend** | tRPC v11 (serverless functions on Vercel) |
| **Database** | Supabase (PostgreSQL) with RLS + Realtime |
| **Auth** | Clerk |
| **Payments** | Stripe (Checkout + Webhooks) |
| **Email** | Resend |
| **Analytics** | Recharts + custom Supabase queries |
| **Monitoring** | Sentry + structured logging |
| **Sales** | Apollo.io + Retell AI (via Aether) |
| **Hosting** | Vercel (Sydney region) |
| **CI/CD** | GitHub Actions |

### Dependency Graph
```
PRD 1 (Landing) ← standalone
PRD 2 (Infra)   ← standalone
PRD 3 (CI/CD)   ← PRD 2
PRD 4 (Database) ← PRD 2
PRD 5 (Auth)     ← PRD 4
PRD 6 (APIs)     ← PRD 4, PRD 5
PRD 7 (Dashboard) ← PRD 5, PRD 6
PRD 8 (Payments)  ← PRD 5, PRD 6
PRD 9 (Notifications) ← PRD 5, PRD 6
PRD 10 (Analytics) ← PRD 6, PRD 7
PRD 11 (Admin)    ← PRD 5, PRD 6, PRD 7
PRD 12 (Monitoring) ← PRD 2, PRD 3
PRD 13 (Aether)   ← PRD 6
```

### File Count
- **~35 source files** across app/, lib/, server/
- **1 SQL migration** (11 tables)
- **1 CI/CD workflow**
- **6 business documents** + financial model

---

*Document generated: February 2026 | Lumina RaaS v1.0*
