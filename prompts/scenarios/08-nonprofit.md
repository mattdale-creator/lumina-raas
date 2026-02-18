# Ralph Loop: Versatility Test — Nonprofit Organisation

## Simulated Client Request
"We're a volunteer animal rescue in Perth. We need a member management system (volunteer profiles, skills, availability), event RSVP (adoption days, fundraisers), a donation page with Stripe, an email newsletter signup, and a public-facing page showing animals available for adoption. Budget is literally zero."

## Success Criteria
- Volunteers table: name, email, phone, skills, availability, hours_logged
- Events table: title, date, location, description, max_attendees
- RSVPs table: volunteer_id, event_id, status (attending/maybe/declined)
- Animals table: name, species, breed, age, description, photo_url, status (available/adopted)
- Public adoption page showing available animals in a card grid
- Donation page with Stripe one-time payment (any amount)
- Newsletter signup form (stores email in a subscribers table)
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
