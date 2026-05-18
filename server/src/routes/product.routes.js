const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/product.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const { productValidator } = require('../validators/product.validator');
const validate = require('../middleware/validate.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', ctrl.getProducts);
router.get('/featured', ctrl.getFeaturedProducts);
router.get('/:slug', ctrl.getProductBySlug);
router.get('/:id/availability', ctrl.getProductAvailability);

router.post('/', verifyToken, requireAdmin, productValidator, validate, ctrl.createProduct);
router.patch('/:id', verifyToken, requireAdmin, ctrl.updateProduct);
router.delete('/:id', verifyToken, requireAdmin, ctrl.deleteProduct);
router.post('/:id/images', verifyToken, requireAdmin, upload.array('images', 10), ctrl.uploadProductImages);
router.delete('/:id/images/:imageId', verifyToken, requireAdmin, ctrl.deleteProductImage);

module.exports = router;
