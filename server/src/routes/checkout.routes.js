const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/checkout.controller');
const { checkoutLimiter } = require('../middleware/rateLimiter.middleware');

// Checkout endpoints
router.post('/validate-cart', checkoutLimiter, ctrl.validateCart);
router.post('/apply-coupon', checkoutLimiter, ctrl.applyCoupon);
router.post('/create-payment-intent', checkoutLimiter, ctrl.createPaymentIntent);
router.post('/confirm-order', checkoutLimiter, ctrl.confirmOrder);

module.exports = router;
