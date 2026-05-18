const BlockoutDate = require('../models/BlockoutDate.model');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

/**
 * Returns the earliest available fulfilment date for a product.
 * Enforces leadTimeDays and skips blockout/sold-out dates.
 */
const getEarliestAvailableDate = async (product) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(today);
  candidate.setDate(candidate.getDate() + product.leadTimeDays);

  const blockouts = await BlockoutDate.find({
    date: { $gte: today },
  }).lean();
  const blockoutSet = new Set(blockouts.map((b) => b.date.toISOString().split('T')[0]));

  // Check up to 60 days ahead to find first open slot
  for (let i = 0; i < 60; i++) {
    const dateStr = candidate.toISOString().split('T')[0];
    if (!blockoutSet.has(dateStr)) {
      const soldOut = await isDateSoldOut(product, candidate);
      if (!soldOut) return candidate;
    }
    candidate.setDate(candidate.getDate() + 1);
  }
  return null;
};

/**
 * Check if any variant of a product is sold out on a given date.
 */
const isDateSoldOut = async (product, date) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const orders = await Order.find({
    fulfilmentDate: { $gte: dayStart, $lte: dayEnd },
    'payment.status': 'paid',
    status: { $nin: ['Cancelled'] },
  }).lean();

  // Aggregate quantities per variant
  const booked = {};
  for (const order of orders) {
    for (const item of order.items) {
      const key = `${item.productId}-${item.variantLabel}`;
      booked[key] = (booked[key] || 0) + item.quantity;
    }
  }

  // Check each variant cap
  for (const variant of product.variants) {
    if (!variant.isAvailable) continue;
    const key = `${product._id}-${variant.label}`;
    if ((booked[key] || 0) < variant.stockCapPerDay) return false; // At least one slot open
  }
  return true; // All variants sold out
};

/**
 * Get all unavailable dates for a product within the next 90 days.
 */
const getUnavailableDates = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return { unavailableDates: [], leadTimeDays: 3, earliestAvailableDate: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ninetyDaysOut = new Date(today);
  ninetyDaysOut.setDate(ninetyDaysOut.getDate() + 90);

  const blockouts = await BlockoutDate.find({
    date: { $gte: today, $lte: ninetyDaysOut },
  }).lean();

  const unavailable = new Set(blockouts.map((b) => ({ date: b.date.toISOString().split('T')[0], reason: 'blockout' })));

  // Check each day for sold-out
  const cursor = new Date(today);
  while (cursor <= ninetyDaysOut) {
    const dateStr = cursor.toISOString().split('T')[0];
    const soldOut = await isDateSoldOut(product, cursor);
    if (soldOut) unavailable.add({ date: dateStr, reason: 'sold-out' });
    cursor.setDate(cursor.getDate() + 1);
  }

  const unavailableDates = [...unavailable];
  const earliestAvailableDate = await getEarliestAvailableDate(product);

  return {
    unavailableDates: unavailableDates.map((u) => (typeof u === 'string' ? u : u.date)),
    leadTimeDays: product.leadTimeDays,
    earliestAvailableDate: earliestAvailableDate?.toISOString().split('T')[0] || null,
  };
};

/**
 * Validate that a fulfilment date respects lead time and is not blocked/sold-out.
 */
const validateFulfilmentDate = async (product, requestedDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + product.leadTimeDays);
  const requested = new Date(requestedDate);
  requested.setHours(0, 0, 0, 0);

  if (requested < minDate) {
    return { valid: false, reason: `This product requires at least ${product.leadTimeDays} days lead time.` };
  }

  const isBlocked = await BlockoutDate.findOne({ date: requested });
  if (isBlocked) return { valid: false, reason: 'This date is unavailable.' };

  const soldOut = await isDateSoldOut(product, requested);
  if (soldOut) return { valid: false, reason: 'This product is sold out on the selected date.' };

  return { valid: true };
};

module.exports = { getUnavailableDates, validateFulfilmentDate, getEarliestAvailableDate };
