const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const AppError = require('./utils/AppError');
const { initSentry, initSentryErrorHandler } = require('./config/sentry');

const app = express();

// Initialize Sentry for request tracing (must be first)
initSentry(app);

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost origin in development, or the production CLIENT_URL
      if (!origin || origin.startsWith('http://localhost:') || origin === process.env.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing (note: webhook route uses raw body, so it must be handled before this or handled specifically in its route)
// In routes/checkout.routes.js, the webhook route uses express.raw() BEFORE global parsers hit it if we mount routes carefully.
// However, since we use app.use(express.json()) here globally, we need to ensure webhook route is either excluded or handles raw body properly.
// The easiest way is to mount the webhook route directly here, but we've already defined it in checkout routes.
// We will mount webhook separately here, or use a middleware to skip json parsing for it.
app.use(
  '/api/v1/checkout/webhook',
  express.raw({ type: 'application/json' })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Routes
app.use('/api/v1', routes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Sentry error handler (must be before other error handlers)
initSentryErrorHandler(app);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
