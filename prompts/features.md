# Ralph Loop Task: Add Missing Features

## Context
Lumina RaaS project — Next.js 15, tRPC, Supabase, Clerk, Stripe.
Read `progress.txt` for current status.

## Task
Add these features one at a time, committing each:

1. **Supabase Realtime on Dashboard** — Subscribe to outcomes table changes so the dashboard auto-updates when outcome status changes (no page refresh needed)
2. **Billing Page** (`app/billing/page.tsx`) — Page showing subscription status, payment history, and a button to open Stripe Customer Portal
3. **Outcome Detail Page** (`app/dashboard/[id]/page.tsx`) — Click an outcome card → see full details, PRD instance logs, agent execution history, verify/pay buttons
4. **Search & Filter on Admin** — Add a search input that filters outcomes/users/leads tables by text. Add status filter dropdown.
5. **In-App Notification Bell** — Component that shows unread count badge, subscribes to Supabase Realtime inserts on outcomes table, shows dropdown with recent events
6. **Settings Page** (`app/settings/page.tsx`) — Notification preferences toggle (email on/off, in-app on/off), saved to notification_preferences table

## Success Criteria
- All 6 features implemented and working
- `npm run build` succeeds
- Each feature has its own git commit
- Write COMPLETE to progress.txt when all 6 are done
