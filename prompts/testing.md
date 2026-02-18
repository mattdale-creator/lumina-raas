# Ralph Loop Task: Add Comprehensive Tests

## Context
Lumina RaaS project — Next.js 15, tRPC, Supabase.
Read `progress.txt` for current status.

## Setup (first iteration only)
- Install vitest: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- Add vitest config to `vitest.config.ts`
- Add `"test": "vitest run"` to package.json scripts

## Task
Add tests for each layer:

1. **tRPC Router Unit Tests** (`server/routers/__tests__/`)
   - outcome.test.ts: create, getAll, verify mutations with mocked Supabase
   - admin.test.ts: getStats, bulkVerify with role checks
   - analytics.test.ts: getMyMetrics calculations

2. **API Route Tests** (`app/api/__tests__/`)
   - Stripe webhook: verify signature, outcome status update
   - Health endpoint: returns 200 with status
   - Aether start: validates input, creates campaign record

3. **Component Tests** (`app/__tests__/`)
   - Landing page: renders hero, features, pricing
   - Dashboard: renders stats cards, empty state, outcome cards
   - Create outcome modal: form validation, submission

4. **Integration Tests**
   - Full outcome lifecycle: create → verify → payment trigger
   - Auth flow: protected routes redirect unauthenticated users

## Success Criteria
- `npm run test` passes with ZERO failures
- At least 20 test cases total
- All tRPC routers have tests
- All API routes have tests
- Write COMPLETE to progress.txt when passing
