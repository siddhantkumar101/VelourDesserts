const { body } = require('express-validator');

const orderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().isMongoId().withMessage('Invalid product ID'),
  body('items.*.variantLabel').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('fulfilmentDate').isISO8601().withMessage('Invalid fulfilment date'),
  body('fulfilmentType').isIn(['delivery', 'pickup']).withMessage('Invalid fulfilment type'),
  body('customer.name').trim().notEmpty(),
  body('customer.email').isEmail().normalizeEmail(),
  body('customer.phone').notEmpty(),
];

module.exports = { orderValidator };
