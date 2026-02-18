# Ralph Loop: Versatility Test — Fintech MVP

## Simulated Client Request
"I'm building an expense tracking app for Australian SMBs. It needs GST calculation (10% auto-applied), receipt upload with a stub for OCR, a placeholder for Xero API integration, bank-level security, expense categories, team expense approvals, and a monthly summary report. Must be APRA-aware and store data in AU."

## Your Task
1. **Interpret** — Expense tracker: GST calc, receipt handling, accounting integration, approval workflow, reporting
2. **Map to PRDs** — Auth (PRD5), Database (PRD4), Payments (PRD8), Analytics (PRD10), Admin (PRD11), Security (PRD12)
3. **Identify gaps** — Expense model, GST logic, receipt upload, approval workflow, Xero stub, summary reports
4. **Build gaps** — Expenses table, GST calculator util, file upload placeholder, approval status flow, report page
5. **Verify** — `npm run build` succeeds

## Success Criteria
- Expenses table: amount, gst_amount (auto-calc'd), category, receipt_url, status (pending/approved/rejected), submitted_by, approved_by
- GST utility function that calculates 10% correctly
- Create/edit expense form with category dropdown
- Approval workflow (pending → approved/rejected by admin)
- Monthly summary page with totals by category
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
