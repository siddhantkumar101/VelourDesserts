const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const SALT_ROUNDS = 12;

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

const sendTokens = async (user, statusCode, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, statusCode, 'Authentication successful', {
    accessToken,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return next(new AppError('An account with this email already exists.', 409));

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash, role: 'customer', emailVerified: false });
  await sendTokens(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash +refreshToken');
  if (!user || !user.passwordHash) return next(new AppError('Invalid email or password.', 401));

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return next(new AppError('Invalid email or password.', 401));

  await sendTokens(user, 200, res);
});

exports.logout = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  res.clearCookie('refreshToken');
  sendSuccess(res, 200, 'Logged out successfully');
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new AppError('No refresh token provided.', 401));

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) return next(new AppError('Invalid refresh token.', 401));

  const accessToken = signAccessToken(user._id);
  sendSuccess(res, 200, 'Token refreshed', { accessToken });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, 200, 'User retrieved', { user });
});

exports.updateMe = catchAsync(async (req, res) => {
  const { name, phone, avatar, addresses } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(phone && { phone }), ...(avatar && { avatar }), ...(addresses && { addresses }) },
    { new: true, runValidators: true }
  );
  sendSuccess(res, 200, 'Profile updated', { user });
});

exports.googleCallback = catchAsync(async (req, res) => {
  const accessToken = signAccessToken(req.user._id);
  const refreshToken = signRefreshToken(req.user._id);

  req.user.refreshToken = refreshToken;
  await req.user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Dynamically direct to Vercel/production client URL or local Vite server
  let clientUrl = process.env.CLIENT_URL || 'http://localhost:5175';
  
  // Clean up trailing slashes
  clientUrl = clientUrl.replace(/\/+$/, '');
  const userJson = encodeURIComponent(JSON.stringify({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar
  }));

  res.redirect(`${clientUrl}/login?token=${accessToken}&user=${userJson}`);
});
