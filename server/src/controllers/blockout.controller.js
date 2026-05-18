const BlockoutDate = require('../models/BlockoutDate.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

exports.getBlockoutDates = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const filter = {};
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  const dates = await BlockoutDate.find(filter).sort({ date: 1 }).populate('createdBy', 'name email').lean();
  sendSuccess(res, 200, 'Blockout dates retrieved', { dates });
});

exports.createBlockoutDate = catchAsync(async (req, res, next) => {
  const { date, reason } = req.body;
  const existing = await BlockoutDate.findOne({ date: new Date(date) });
  if (existing) return next(new AppError('This date is already blocked.', 409));

  const blockout = await BlockoutDate.create({ date: new Date(date), reason, createdBy: req.user._id });
  sendSuccess(res, 201, 'Date blocked', { blockout });
});

exports.deleteBlockoutDate = catchAsync(async (req, res, next) => {
  const blockout = await BlockoutDate.findByIdAndDelete(req.params.id);
  if (!blockout) return next(new AppError('Blockout date not found.', 404));
  sendSuccess(res, 200, 'Blockout date removed');
});
