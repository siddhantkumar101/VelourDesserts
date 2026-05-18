const Sentry = require('@sentry/node');

const initSentry = (app) => {
  if (!process.env.SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  });

  // Must be first middleware
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};

const initSentryErrorHandler = (app) => {
  if (!process.env.SENTRY_DSN) return;
  app.use(Sentry.Handlers.errorHandler());
};

module.exports = { initSentry, initSentryErrorHandler };
