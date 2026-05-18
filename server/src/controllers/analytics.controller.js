const Order = require('../models/Order.model');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

exports.getAnalytics = catchAsync(async (req, res) => {
  const { days = 30 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - Number(days));
  since.setHours(0, 0, 0, 0);

  const [revenueByDay, ordersByDay, topProducts, topFlavours] = await Promise.all([
    Order.aggregate([
      { $match: { 'payment.status': 'paid', createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { 'payment.status': 'paid', createdAt: { $gte: since } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.productName', revenue: { $sum: '$items.subtotal' }, qty: { $sum: '$items.quantity' } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
    Order.aggregate([
      { $match: { 'payment.status': 'paid', createdAt: { $gte: since } } },
      { $unwind: '$items' },
      { $match: { 'items.flavour': { $ne: '' } } },
      { $group: { _id: '$items.flavour', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
  ]);

  sendSuccess(res, 200, 'Analytics retrieved', { revenueByDay, ordersByDay, topProducts, topFlavours });
});
