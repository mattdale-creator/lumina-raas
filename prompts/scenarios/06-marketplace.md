# Ralph Loop: Versatility Test — Two-Sided Marketplace

## Simulated Client Request
"I'm building an Uber for dog walking. Need separate signup for dog owners and walkers, a matching system based on location and availability, real-time tracking placeholder, reviews and ratings after each walk, payment splitting (walker gets 80%, platform 20%), and push notification stubs."

## Success Criteria
- Two user types: owner and walker (stored in users table with type field)
- Walkers table: bio, hourly_rate, availability, location, rating
- Bookings table: owner_id, walker_id, date, time, status (requested/accepted/in_progress/completed/cancelled)
- Reviews table: booking_id, rating (1-5), comment, reviewer_id
- Booking flow: owner requests → walker accepts → in_progress → completed → review
- Payment calculation showing 80/20 split
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
