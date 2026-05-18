const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blockout.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requireAdmin, ctrl.getBlockoutDates);
router.post('/', verifyToken, requireAdmin, ctrl.createBlockoutDate);
router.delete('/:id', verifyToken, requireAdmin, ctrl.deleteBlockoutDate);

module.exports = router;
