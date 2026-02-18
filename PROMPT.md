# Ralph Loop Task: Polish & Harden Lumina RaaS

## Context
You are working on the Lumina RaaS project — a Results-as-a-Service platform built with Next.js 15, TypeScript, Tailwind, tRPC, Supabase, Clerk, and Stripe. The project is in this directory.

Read `progress.txt` for current status and what was done in previous iterations.

## Current State
- All 13 PRDs are implemented and the build succeeds (`npm run build`)
- The app runs at localhost:3000 with `npm run dev`
- External services (Clerk, Supabase, Stripe, Resend) are stubbed — work without API keys

## Task (This Iteration)
Work through this checklist in order. Do as much as you can per iteration:

1. Run `npm run build` — fix ANY errors or warnings
2. Run `npm run lint` — fix ALL lint warnings
3. Add proper TypeScript types (eliminate all `any` types)
4. Add loading skeletons to dashboard, analytics, and admin pages
5. Add error boundaries with user-friendly fallback UI to all route pages
6. Add proper form validation (title min 3 chars, email format, etc.)
7. Add meta descriptions to all pages for SEO
8. Improve mobile responsiveness — test all pages at 375px width
9. Add keyboard accessibility (focus states, tab order) to all interactive elements
10. Add a proper 404 page at `app/not-found.tsx`

## Success Criteria (ALL must be true)
- `npm run build` succeeds with ZERO errors
- `npm run lint` returns ZERO warnings
- No `any` types in the codebase
- All pages have loading states
- All pages have error boundaries
- 404 page exists and renders correctly
- All forms validate before submission

## Rules
- Make small, focused changes — one fix per commit message
- Always run `npm run build` after changes to verify nothing broke
- Update `progress.txt` after each meaningful change with what you did
- Write `COMPLETE` as the first line of `progress.txt` ONLY when ALL success criteria are verified passing

## Important
Do NOT mark as complete until you've verified every criterion. If in doubt, leave it incomplete and describe what's remaining in progress.txt.
