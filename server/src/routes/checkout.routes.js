const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/checkout.controller');
const { checkoutLimiter } = require('../middleware/rateLimiter.middleware');

// Stripe webhook needs raw body — must be before express.json() in app.js
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.stripeWebhook);

router.post('/validate-cart', checkoutLimiter, ctrl.validateCart);
router.post('/apply-coupon', checkoutLimiter, ctrl.applyCoupon);
router.post('/create-payment-intent', checkoutLimiter, ctrl.createPaymentIntent);
router.post('/confirm-order', checkoutLimiter, ctrl.confirmOrder);

module.exports = router;
