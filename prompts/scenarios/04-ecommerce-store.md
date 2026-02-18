# Ralph Loop: Versatility Test — E-commerce Store

## Simulated Client Request
"I sell handmade candles online. I need a beautiful store with product pages, a shopping cart, Stripe checkout, order tracking with email notifications, and an admin panel where I can manage products and orders. I don't know any code. Please make it pretty — think earthy tones, not tech dark mode."

## Your Task
1. **Interpret** — E-commerce: product catalog, cart, checkout, order management, light/warm theme
2. **Map to PRDs** — Payments (PRD8), Auth (PRD5), Database (PRD4), Notifications (PRD9), Admin (PRD11)
3. **Identify gaps** — Product model, cart state, order model, product pages, light theme option
4. **Build gaps** — Products/orders tables, cart (client state or DB), product grid page, checkout flow, order status page

## Success Criteria
- Products table: name, description, price_cents, images, stock, category
- Orders table: user_id, items (JSONB), total_cents, status, shipping_address
- Product listing page with grid layout
- Shopping cart (add/remove items, quantity)
- Checkout → Stripe payment → order created → confirmation email
- Admin: manage products (CRUD), view/update orders
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
