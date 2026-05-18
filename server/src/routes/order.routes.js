const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, ctrl.getMyOrders);
router.get('/:orderId', verifyToken, ctrl.getMyOrderById);

module.exports = router;
