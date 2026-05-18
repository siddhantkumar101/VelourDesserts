# Velour Desserts Co. Context

**Current Phase:** Phase 1 Complete (Backend Scaffold & Implementation) / Phase 2 Setup Next
**Date:** 2026-05-18

## Project Status
- **Milestone 1:** Completed. Server scaffold, DB models, routing, middleware, config, utilities, controllers, and services are fully built.
- **In Progress:** Transitioning to Phase 2 (Client Scaffold + Design System).
- **Blocked:** None. 

## Completed Items
- `server/package.json`, `.env.example`, `server.js`, `src/app.js`
- `server/src/models/` (User, Product, Order, Coupon, BlockoutDate, Counter)
- `server/src/config/` (db, s3, sendgrid, sentry, passport, stripe)
- `server/src/utils/` (apiResponse, AppError, catchAsync, generateOrderId)
- `server/src/services/` (availability, email, order, s3, stripe)
- `server/src/controllers/` & `server/src/routes/`
- `server/src/seed/` (seedAdmin, seedProducts)

## Next Actions
1. `npm install` inside `server/` to fetch all dependencies.
2. Initialize Git repository and commit Milestone 1.
3. Start Phase 2: Create `client/` Vite app and configure Tailwind + Redux Toolkit (instead of Zustand).

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
