const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { sendDispatchedEmail } = require('../services/email.service');

exports.getAllOrders = catchAsync(async (req, res) => {
  const { status, from, to, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (from || to) {
    query.fulfilmentDate = {};
    if (from) query.fulfilmentDate.$gte = new Date(from);
    if (to) query.fulfilmentDate.$lte = new Date(to);
  }
  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.email': { $regex: search, $options: 'i' } },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments(query),
  ]);
  sendSuccess(res, 200, 'Orders retrieved', { orders }, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.params.orderId });
  if (!order) return next(new AppError('Order not found.', 404));
  sendSuccess(res, 200, 'Order retrieved', { order });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Pending','Confirmed','In Production','Ready','Dispatched','Completed','Cancelled'];
  if (!validStatuses.includes(status)) return next(new AppError('Invalid status.', 400));
  const order = await Order.findOneAndUpdate({ orderId: req.params.orderId }, { status }, { new: true });
  if (!order) return next(new AppError('Order not found.', 404));
  if (status === 'Dispatched' || status === 'Ready') {
    try { await sendDispatchedEmail(order); } catch (e) { console.error('Email error:', e.message); }
  }
  sendSuccess(res, 200, 'Order status updated', { order });
});

exports.updateAdminNotes = catchAsync(async (req, res, next) => {
  const order = await Order.findOneAndUpdate({ orderId: req.params.orderId }, { adminNotes: req.body.adminNotes }, { new: true });
  if (!order) return next(new AppError('Order not found.', 404));
  sendSuccess(res, 200, 'Notes updated', { order });
});

exports.getDashboard = catchAsync(async (req, res) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const todayEnd = new Date(today); todayEnd.setHours(23,59,59,999);
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 7);
  const [todayOrders, todayRevenue, weekFulfilments, pendingOrders] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: today, $lte: todayEnd }, 'payment.status': 'paid' }),
    Order.aggregate([{ $match: { createdAt: { $gte: today, $lte: todayEnd }, 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
    Order.find({ fulfilmentDate: { $gte: today, $lte: weekEnd }, status: { $nin: ['Cancelled'] } }).sort({ fulfilmentDate: 1 }).limit(50).lean(),
    Order.countDocuments({ status: 'Pending' }),
  ]);
  sendSuccess(res, 200, 'Dashboard data', { todayOrders, todayRevenue: todayRevenue[0]?.total || 0, weekFulfilments, pendingOrders });
});
