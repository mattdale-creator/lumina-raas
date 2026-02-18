# Ralph Loop: Refine the Master Prompt

## Context
You are improving `MASTER_PROMPT.md` — the single prompt that should recreate the entire Lumina RaaS platform from scratch when fed to a fresh AI coding agent.

Read `progress.txt` for results from previous test runs.

## How This Works
The `test-prompt.sh` script:
1. Creates a clean temporary directory
2. Feeds MASTER_PROMPT.md to an AI agent in that directory
3. Checks if the output builds and has all expected files
4. Writes the results to `prompt-test-results.txt`

Your job: read those results, identify what went wrong, and improve MASTER_PROMPT.md.

## Task (Each Iteration)
1. Read `prompt-test-results.txt` for the latest test outcome
2. Identify failures:
   - Did `npm run build` fail? What was the error?
   - Were expected files missing? Which ones?
   - Were there TypeScript errors? What types?
   - Did routes render correctly?
3. Trace each failure to an ambiguity or gap in MASTER_PROMPT.md
4. Rewrite the relevant section of MASTER_PROMPT.md to be more explicit
5. Add concrete code examples for anything the agent got wrong
6. Remove any instructions that caused confusion

## Improvement Strategies
- If the agent used wrong imports → add exact import paths
- If it created wrong file structure → add explicit file paths
- If TypeScript errors → add type annotations in the prompt
- If Clerk broke the build → emphasize conditional rendering more
- If missing features → add more detail to that section
- If the agent asked questions → make instructions more explicit

## Success Criteria
- `prompt-test-results.txt` shows ALL checks passing:
  - [ ] `npm run build` succeeds
  - [ ] All 14 routes exist (/, /dashboard, /analytics, /admin, /aether, /sign-in, /sign-up, plus 7 API routes)
  - [ ] All 6 lib files exist
  - [ ] All 3 tRPC routers exist
  - [ ] SQL migration file exists
  - [ ] CI/CD workflow exists
  - [ ] At least 5 docs/*.md files exist
  - [ ] ralph.sh and PROMPT.md exist
  - [ ] At least 5 scenario files exist
- When ALL checks pass, write COMPLETE to progress.txt

## Rules
- Only modify MASTER_PROMPT.md — don't change other files
- Make the minimum change needed to fix each issue
- Add code snippets/examples only where the agent consistently fails
- Keep the prompt as concise as possible while being unambiguous
- After each change, note what you changed in progress.txt
