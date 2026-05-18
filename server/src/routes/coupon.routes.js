const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/coupon.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const { couponValidator } = require('../validators/coupon.validator');
const validate = require('../middleware/validate.middleware');

router.get('/', verifyToken, requireAdmin, ctrl.getCoupons);
router.post('/', verifyToken, requireAdmin, couponValidator, validate, ctrl.createCoupon);
router.patch('/:id', verifyToken, requireAdmin, ctrl.updateCoupon);

module.exports = router;
