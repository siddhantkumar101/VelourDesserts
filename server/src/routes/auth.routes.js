const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const ctrl = require('../controllers/auth.controller');
const { registerValidator, loginValidator, updateProfileValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const { verifyToken } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/register', authLimiter, registerValidator, validate, ctrl.register);
router.post('/login', authLimiter, loginValidator, validate, ctrl.login);
router.post('/logout', verifyToken, ctrl.logout);
router.post('/refresh', ctrl.refreshToken);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), ctrl.googleCallback);
router.get('/me', verifyToken, ctrl.getMe);
router.patch('/me', verifyToken, updateProfileValidator, validate, ctrl.updateMe);

module.exports = router;
