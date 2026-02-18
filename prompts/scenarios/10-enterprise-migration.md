# Ralph Loop: Versatility Test — Enterprise CRM Migration
rder for you to go back to the start and code this build 

## Simulated Client Request
"We have a legacy PHP CRM that's falling apart. We need to rebuild it in modern tech. It needs: contact management (companies + people with relationships), deal pipeline with stages (Lead → Qualified → Proposal → Negotiation → Closed Won/Lost), activity logging (calls, emails, meetings linked to contacts), custom fields per contact, team permissions (sales rep sees own deals, manager sees all), and import/export of contacts via CSV. This is for a 50-person sales team."

## Your Task
This tests the MOST complex scenario — enterprise data models, relationships, and workflows.

## Success Criteria
- Companies table: name, industry, size, website, address
- Contacts table: company_id, first_name, last_name, email, phone, job_title, custom_fields (JSONB)
- Deals table: contact_id, title, value_cents, stage, probability, expected_close_date, assigned_to
- Activities table: contact_id, deal_id, type (call/email/meeting/note), description, date, logged_by
- Pipeline view showing deals in columns by stage (like a Kanban board)
- Contact detail page showing company, deals, and activity timeline
- CSV import route (upload CSV → parse → create contacts)
- CSV export of contacts
- Role-based: sales rep sees own deals, manager sees all
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
