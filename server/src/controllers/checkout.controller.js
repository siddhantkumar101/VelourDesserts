const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { calculateOrderPricing, createOrder } = require('../services/order.service');
const { createPaymentIntent, constructWebhookEvent } = require('../services/stripe.service');
const { validateFulfilmentDate } = require('../services/availability.service');
const { sendOrderConfirmation, sendPaymentFailedEmail } = require('../services/email.service');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const Coupon = require('../models/Coupon.model');

exports.validateCart = catchAsync(async (req, res, next) => {
  const { items, fulfilmentDate } = req.body;
  if (!items || !items.length) return next(new AppError('Cart is empty.', 400));

  const results = [];
  let maxLeadTime = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      results.push({ productId: item.productId, valid: false, reason: 'Product not available' });
      continue;
    }
    const variant = product.variants.find((v) => v.label === item.variantLabel);
    if (!variant || !variant.isAvailable) {
      results.push({ productId: item.productId, valid: false, reason: 'Variant not available' });
      continue;
    }
    if (product.leadTimeDays > maxLeadTime) maxLeadTime = product.leadTimeDays;
    results.push({ productId: item.productId, valid: true });
  }

  const invalid = results.filter((r) => !r.valid);
  if (invalid.length) return next(new AppError('Some cart items are unavailable.', 400));

  // Validate date if provided
  if (fulfilmentDate && items.length > 0) {
    const firstProduct = await Product.findById(items[0].productId);
    // Use max lead time product for date validation
    const mockProduct = { ...firstProduct.toObject(), leadTimeDays: maxLeadTime };
    const dateCheck = await validateFulfilmentDate(mockProduct, fulfilmentDate);
    if (!dateCheck.valid) return next(new AppError(dateCheck.reason, 400));
  }

  sendSuccess(res, 200, 'Cart validated', { valid: true, maxLeadTime, results });
});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  });

  if (!coupon) return next(new AppError('Invalid or expired coupon code.', 400));
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return next(new AppError('Coupon usage limit reached.', 400));
  if (subtotal < coupon.minOrderValue) return next(new AppError(`Minimum order value of ₹${coupon.minOrderValue} required.`, 400));

  const discount = coupon.type === 'percentage'
    ? Math.round((subtotal * coupon.value) / 100)
    : Math.min(coupon.value, subtotal);

  sendSuccess(res, 200, 'Coupon applied', {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount: discount,
  });
});

exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { items, couponCode, fulfilmentType, customer } = req.body;
  const { processedItems, pricing, couponId } = await calculateOrderPricing({ items, couponCode, fulfilmentType });

  // Generate a temp order ref for the PaymentIntent metadata
  const tempRef = `TEMP-${Date.now()}`;
  const paymentIntent = await createPaymentIntent({
    amountINR: pricing.total,
    orderId: tempRef,
    customerEmail: customer?.email || '',
  });

  sendSuccess(res, 200, 'PaymentIntent created', {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    pricing,
    processedItems,
    couponId,
  });
});

exports.confirmOrder = catchAsync(async (req, res, next) => {
  const {
    paymentIntentId, items, couponCode, couponId, fulfilmentDate, fulfilmentType,
    deliveryAddress, customer, customerNotes, processedItems, pricing,
  } = req.body;

  if (!paymentIntentId) return next(new AppError('Payment intent ID required.', 400));

  const orderData = {
    customer: {
      userId: req.user?._id || null,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
    items: processedItems,
    fulfilmentDate: new Date(fulfilmentDate),
    fulfilmentType,
    deliveryAddress: fulfilmentType === 'delivery' ? deliveryAddress : {},
    pricing,
    couponCode: couponCode || '',
    couponId: couponId || null,
    customerNotes: customerNotes || '',
  };

  const order = await createOrder({ orderData, paymentIntentId });

  // Mark coupon used
  if (couponId) {
    await Coupon.findByIdAndUpdate(couponId, {
      $inc: { usedCount: 1 },
      $push: { usedBy: req.user?._id },
    });
  }

  sendSuccess(res, 201, 'Order created. Awaiting payment confirmation.', { orderId: order.orderId });
});

// Stripe Webhook — raw body required
exports.stripeWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  if (!sig) return next(new AppError('Missing stripe-signature header.', 400));

  const event = constructWebhookEvent(req.body, sig);

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const order = await Order.findOneAndUpdate(
      { 'payment.stripePaymentIntentId': pi.id },
      {
        'payment.status': 'paid',
        'payment.stripeChargeId': pi.latest_charge,
        'payment.paidAt': new Date(),
        status: 'Confirmed',
        $push: { emailsSent: { type: 'order_confirmation', sentAt: new Date() } },
      },
      { new: true }
    );
    if (order) {
      try { await sendOrderConfirmation(order); } catch (e) { console.error('Email error:', e.message); }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    await Order.findOneAndUpdate(
      { 'payment.stripePaymentIntentId': pi.id },
      { 'payment.status': 'failed', status: 'Cancelled' }
    );
    const email = pi.receipt_email || pi.metadata?.customerEmail;
    if (email) {
      try { await sendPaymentFailedEmail({ email, name: 'Customer' }); } catch (e) {}
    }
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    await Order.findOneAndUpdate(
      { 'payment.stripeChargeId': charge.id },
      { 'payment.status': 'refunded', status: 'Cancelled' }
    );
  }

  res.status(200).json({ received: true });
});
