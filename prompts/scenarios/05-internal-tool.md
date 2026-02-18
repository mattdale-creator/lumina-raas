# Ralph Loop: Versatility Test — Internal Operations Dashboard

## Simulated Client Request
"Our team of 30 needs an internal dashboard that tracks project progress across departments, shows employee utilisation (hours logged vs capacity), has role-based access (manager sees everything, employee sees own data), and exports CSV reports. We use it daily — needs to be fast and simple."

## Success Criteria
- Projects table: name, department, status, deadline, owner
- Time entries table: user_id, project_id, hours, date, notes
- Dashboard with project progress bars and utilisation charts
- Manager view: all projects + all employees, Employee view: own data only
- CSV export for time entries filtered by date range
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
