# Ralph Loop: Versatility Test — Deliberately Vague Request

## Simulated Client Request
"I have an idea for an app. It's like Airbnb but for parking spots. People list their unused driveways or garage spaces and others can book them hourly or daily near where they need to park. Make it work."

## Your Task
This is intentionally vague. The test is whether the system can:
1. **Decompose** a vague idea into concrete requirements
2. **Make reasonable assumptions** where info is missing
3. **Build something functional** without hand-holding

You must figure out: What tables? What user flows? What pages? What payments model?

## Success Criteria
- You've documented your assumptions in progress.txt before building
- At minimum: listings table (location, price, availability, photos), bookings table, search by location
- Host flow: list a space → manage availability → see bookings → get paid
- Guest flow: search nearby → book a spot → pay → get confirmation
- Map placeholder (div with "Map would go here" showing listed locations)
- Rating/review system
- `npm run build` succeeds
- Write assumptions + coverage analysis + COMPLETE to progress.txt
