const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const { adminAuthLimiter } = require('../middleware/rateLimiter.middleware');

// All admin routes double-guarded
router.use(verifyToken, requireAdmin);

router.get('/dashboard', ctrl.getDashboard);
router.get('/orders', ctrl.getAllOrders);
router.get('/orders/:orderId', ctrl.getOrderById);
router.patch('/orders/:orderId/status', ctrl.updateOrderStatus);
router.patch('/orders/:orderId/notes', ctrl.updateAdminNotes);

module.exports = router;
