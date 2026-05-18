const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/orders', require('./order.routes'));
router.use('/checkout', require('./checkout.routes'));
router.use('/coupons', require('./coupon.routes'));
router.use('/blockout', require('./blockout.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/admin/analytics', require('./analytics.routes'));

module.exports = router;
