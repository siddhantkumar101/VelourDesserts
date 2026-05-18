const Counter = require('../models/Counter.model');

/**
 * Generates a unique order ID in format: VD-YYYYMMDD-XXXX
 * Uses atomic MongoDB findOneAndUpdate to prevent race conditions.
 */
const generateOrderId = async () => {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  const counterId = `order_${dateStr}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.seq).padStart(4, '0');
  return `VD-${dateStr}-${seq}`;
};

module.exports = generateOrderId;
