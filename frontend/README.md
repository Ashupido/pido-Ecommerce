# Pido Frontend

This is the Vite + React frontend for the Pido e-commerce app.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Main features

- Product catalog and product detail pages
- Cart and checkout flow
- Order history
- Login and registration
- Admin dashboard entry points
- Seller dashboard entry points

## Structure

- `src/pages/` — route-level pages such as products, login, register, admin, seller, and orders
- `src/components/` — shared UI pieces like navbar, footer, spinner, and toast system
- `src/services/api.js` — API client and auth header handling

## Notes

- Auth data is stored in `localStorage`.
- Admin and seller routes are protected by frontend checks and backend role-based middleware.
- The frontend expects the backend to run on `http://localhost:5000`.
