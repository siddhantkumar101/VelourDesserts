const Order = require('../models/Order.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { getOrdersByCustomer } = require('../services/order.service');

exports.getMyOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await getOrdersByCustomer(req.user._id, { page: Number(page), limit: Number(limit) });
  sendSuccess(res, 200, 'Orders retrieved', { orders: result.orders }, {
    page: result.page, limit: result.limit, total: result.total, pages: result.pages,
  });
});

exports.getMyOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    orderId: req.params.orderId,
    'customer.userId': req.user._id,
  });
  if (!order) return next(new AppError('Order not found.', 404));
  sendSuccess(res, 200, 'Order retrieved', { order });
});
