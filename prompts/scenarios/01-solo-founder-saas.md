# Ralph Loop: Versatility Test — Solo Founder SaaS

## Simulated Client Request
"I need a production-ready task management app with team workspaces, Kanban boards, Stripe billing for per-seat pricing, and user auth. I want it deployed to Vercel with a clean dark UI. I'm a solo founder with no engineering team."

## Your Task
Using the Lumina RaaS platform (existing codebase) as your base, modify/extend to fulfil this request:

1. **Interpret** — They need: multi-tenant workspaces, task CRUD with board/list views, drag-and-drop columns, per-seat Stripe billing, auth with team invites
2. **Map to PRDs** — Which of our 12 PRDs already cover this? (Auth=PRD5, Payments=PRD8, Dashboard=PRD7, etc.)
3. **Identify gaps** — What's NOT covered? (Task model, Kanban UI, workspace/team model, invite system)
4. **Build gaps** — Add database tables for tasks/workspaces, create Kanban board component, add team invite flow
5. **Customise UI** — Rebrand dashboard from "outcomes" to "tasks", add board view
6. **Verify** — `npm run build` succeeds, app looks like a task management tool

## Success Criteria
- Database has tasks, workspaces, workspace_members tables
- Dashboard shows Kanban board with draggable columns (To Do, In Progress, Done)
- Users can create/edit/delete tasks
- Workspace switcher in nav
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
