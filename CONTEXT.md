# Velour Desserts Co. Context

**Current Phase:** Phase 3 Complete (Storefront & UI) / Phase 4 Setup Next
**Date:** 2026-05-18

## Project Status
- **Milestone 1:** Completed. Server scaffold, DB models, routing, middleware, config, utilities, controllers, and services are fully built.
- **Milestone 2:** Completed. Client scaffold (Vite + React 18), Tailwind v3 design system, Redux Toolkit state management, React Router v6 setup, Axios API services.
- **Milestone 3:** Completed. Storefront UI, Navigation (Navbar/Footer), Pages (Home, Product Listing, Product Detail), and Redux Cart Sidebar.
- **In Progress:** Transitioning to Phase 4 (Checkout Flow & Auth UI).
- **Blocked:** None. 

## Completed Items
- **Backend:** Models, Routes, Controllers, Middleware, Services, DB/Stripe/AWS Config, Seed Scripts.
- **Frontend Core:** Vite init, Tailwind setup + Design Tokens, globals.css, `main.jsx`, `App.jsx`.
- **State & Data:** Redux Toolkit (`store.js`, `authSlice`, `cartSlice`, `uiSlice`), Axios interceptors (`api.js`), React Query Provider.
- **UI Components:** Navbar, Footer, PageWrapper, Badge, Input, Button, CartSidebar.
- **Storefront Pages:** Home, ProductListing, ProductDetail.
- `server/src/utils/` (apiResponse, AppError, catchAsync, generateOrderId)
- `server/src/services/` (availability, email, order, s3, stripe)
- `server/src/controllers/` & `server/src/routes/`
- `server/src/seed/` (seedAdmin, seedProducts)

## Next Actions
1. Build Auth Pages (Login, Register).
2. Build User Dashboard (Profile, Order History).
3. Implement Checkout Flow (Cart Validation, Fulfillment Details, Payment Intent, Stripe Elements).

## Environment Variables Needed (Keys Only)
- `PORT`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_FROM_NAME`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`, `AWS_CLOUDFRONT_URL`
- `SENTRY_DSN`
- `ADMIN_EMAIL`, `WHATSAPP_NUMBER`, `CLIENT_URL`
