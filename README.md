# Velour Desserts Co. — eCommerce Platform

A production-ready, mobile-first artisan dessert eCommerce platform replacing WhatsApp/DM-based order management with a fully automated pre-order engine, Stripe payments, and a no-code-required founder operations dashboard.

## Tech Stack
- **Frontend:** React 18 (Vite), Tailwind CSS v3, Redux Toolkit, TanStack Query, React Router v6
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + Google OAuth (Passport.js)
- **Payments:** Stripe
- **Email:** SendGrid
- **Storage:** AWS S3 + CloudFront
- **Monitoring:** Sentry

## Local Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/siddhantkumar101/VelourDesserts.git
   cd velourdesserts
   \`\`\`

2. **Backend Setup:**
   \`\`\`bash
   cd server
   npm install
   cp .env.example .env
   # Add your MONGODB_URI and other secrets to .env
   npm run dev
   \`\`\`

3. **Frontend Setup:**
   *(Instructions pending Phase 2 completion)*

## NPM Scripts (Server)
- `npm start`: Run production server
- `npm run dev`: Run server with Nodemon
- `npm run seed:products`: Seed the DB with 30 artisan products
- `npm run seed:admin`: Seed the admin user

## Deployment
*(Deployment instructions pending CI/CD setup)*
