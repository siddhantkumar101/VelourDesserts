const Coupon = require('../models/Coupon.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

exports.getCoupons = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const [coupons, total] = await Promise.all([
    Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Coupon.countDocuments(),
  ]);
  sendSuccess(res, 200, 'Coupons retrieved', { coupons }, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) });
});

exports.createCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  sendSuccess(res, 201, 'Coupon created', { coupon });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) return next(new AppError('Coupon not found.', 404));
  sendSuccess(res, 200, 'Coupon updated', { coupon });
});
