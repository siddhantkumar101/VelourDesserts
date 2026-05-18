const { body } = require('express-validator');

const productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 200 }),
  body('slug')
    .trim()
    .notEmpty()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must be lowercase alphanumeric with hyphens only'),
  body('description').trim().notEmpty().isLength({ max: 2000 }),
  body('category')
    .isIn(['Cakes', 'Tarts', 'Cookies', 'Gifting', 'Seasonal'])
    .withMessage('Invalid category'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('leadTimeDays').isInt({ min: 1 }).withMessage('Lead time must be at least 1 day'),
  body('variants').isArray({ min: 1 }).withMessage('At least one variant is required'),
  body('variants.*.label').notEmpty().withMessage('Variant label is required'),
  body('variants.*.priceINR').isFloat({ min: 0 }),
  body('variants.*.stockCapPerDay').isInt({ min: 1 }),
];

module.exports = { productValidator };
