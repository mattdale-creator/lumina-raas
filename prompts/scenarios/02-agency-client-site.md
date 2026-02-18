# Ralph Loop: Versatility Test — Agency Client Website

## Simulated Client Request
"We're a digital agency. Our client is a real estate agency in Perth. They need a property listing website with search and filters (price, bedrooms, location), individual property pages with photo galleries, a contact/enquiry form per listing, a simple CMS for adding new properties, and SEO optimization for local search."

## Your Task
1. **Interpret** — Property listing site with: search/filter, detail pages, enquiry forms, content management, SEO
2. **Map to PRDs** — Landing page (PRD1), Auth (PRD5), Database (PRD4), Notifications (PRD9)
3. **Identify gaps** — Property data model, search/filter UI, gallery component, CMS interface, dynamic SEO
4. **Build gaps** — Properties table, search page with filters, property detail route, admin CMS for CRUD, meta tags per property
5. **Verify** — `npm run build` succeeds

## Success Criteria
- Properties table with: title, price, bedrooms, bathrooms, location, description, images (JSON array), status
- Search page with filter sidebar (price range, bedrooms, location)
- Individual property pages at `/properties/[id]` with gallery
- Enquiry form that sends notification email
- Admin CMS to add/edit/delete properties
- SEO meta tags per property (title, description, og:image)
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
