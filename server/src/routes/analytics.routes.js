const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analytics.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requireAdmin, ctrl.getAnalytics);

module.exports = router;
