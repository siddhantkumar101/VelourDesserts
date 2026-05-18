const { body } = require('express-validator');

const couponValidator = [
  body('code')
    .trim()
    .notEmpty()
    .toUpperCase()
    .matches(/^[A-Z0-9_-]{3,20}$/)
    .withMessage('Coupon code must be 3-20 uppercase alphanumeric characters'),
  body('type').isIn(['percentage', 'flat']).withMessage('Type must be percentage or flat'),
  body('value').isFloat({ min: 1 }).withMessage('Value must be at least 1'),
  body('minOrderValue').optional().isFloat({ min: 0 }),
  body('maxUses').optional().isInt({ min: 1 }),
  body('validFrom').isISO8601().withMessage('Invalid validFrom date'),
  body('validUntil').isISO8601().withMessage('Invalid validUntil date'),
];

module.exports = { couponValidator };
