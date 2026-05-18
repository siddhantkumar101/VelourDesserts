const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { calculateOrderPricing, createOrder } = require('../services/order.service');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/razorpay.service');
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
  const { items, couponCode, fulfilmentType, customer, paymentMethod } = req.body;
  const { processedItems, pricing, couponId } = await calculateOrderPricing({ items, couponCode, fulfilmentType });

  // 1. If explicit COD checkout is chosen, bypass Razorpay completely
  if (paymentMethod === 'COD') {
    const tempRef = `MOCK-COD-${Date.now()}`;
    return sendSuccess(res, 200, 'COD Checkout initialized', {
      pricing,
      processedItems,
      couponId,
      isCOD: true,
      paymentIntentId: tempRef,
    });
  }

  // 2. Otherwise create a real Razorpay Order, with a dummy fallback if keys are missing
  try {
    const receiptRef = `rcpt_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder({
      amountINR: pricing.total,
      receipt: receiptRef,
    });

    sendSuccess(res, 200, 'Razorpay Order created', {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      pricing,
      processedItems,
      couponId,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey',
    });
  } catch (error) {
    console.warn('Razorpay credentials unconfigured or failed, falling back to simulated sandbox:', error.message);
    const mockOrderId = `order_mock_${Date.now()}`;
    sendSuccess(res, 200, 'Razorpay Order Simulated (Sandbox)', {
      razorpayOrderId: mockOrderId,
      amount: Math.round(pricing.total * 100),
      currency: 'INR',
      pricing,
      processedItems,
      couponId,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey',
      isMock: true,
    });
  }
});

exports.confirmOrder = catchAsync(async (req, res, next) => {
  const {
    paymentIntentId, // maps to razorpay_order_id or mock order id
    razorpayPaymentId,
    razorpaySignature,
    items, couponCode, couponId, fulfilmentDate, fulfilmentType,
    deliveryAddress, customer, customerNotes, processedItems, pricing,
    isCOD,
  } = req.body;

  if (!paymentIntentId) return next(new AppError('Payment transaction ID required.', 400));

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
    payment: {
      stripePaymentIntentId: paymentIntentId,
      stripeChargeId: razorpayPaymentId || '',
      status: 'pending',
    },
  };

  const isMock = paymentIntentId.startsWith('order_mock_') || paymentIntentId.startsWith('MOCK-');

  // 1. Validate payment details
  if (!isCOD && !isMock) {
    if (!razorpayPaymentId || !razorpaySignature) {
      return next(new AppError('Razorpay Payment ID and Signature required for secure checkouts.', 400));
    }
    const isValid = verifyPaymentSignature({
      razorpayOrderId: paymentIntentId,
      razorpayPaymentId,
      razorpaySignature,
    });
    if (!isValid) {
      return next(new AppError('Payment signature verification failed. Transaction may be tampered.', 400));
    }
    // Signature is cryptographically verified!
    orderData.payment.status = 'paid';
    orderData.payment.paidAt = new Date();
    orderData.status = 'Confirmed';
    orderData.adminNotes = `Paid via Razorpay. Payment ID: ${razorpayPaymentId}`;
  } else if (isCOD) {
    orderData.payment.status = 'pending';
    orderData.status = 'Confirmed';
    orderData.adminNotes = 'Cash on Delivery order. Collect payment upon delivery/pickup.';
  } else {
    // Simulated checkout (Sandbox Mode)
    orderData.payment.status = 'paid';
    orderData.payment.paidAt = new Date();
    orderData.status = 'Confirmed';
    orderData.adminNotes = 'Simulated checkout (Sandbox Mode).';
  }

  const order = await createOrder({ orderData, paymentIntentId });

  // Mark coupon used
  if (couponId) {
    await Coupon.findByIdAndUpdate(couponId, {
      $inc: { usedCount: 1 },
      $push: { usedBy: req.user?._id },
    });
  }

  // Send Order Confirmation email
  try {
    await sendOrderConfirmation(order);
  } catch (e) {
    console.error('Email confirmation failed to send:', e.message);
  }

  sendSuccess(res, 201, 'Order placed successfully!', { orderId: order.orderId });
});

// Dummy webhook for backward compatibility
exports.stripeWebhook = catchAsync(async (req, res, next) => {
  res.status(200).json({ received: true });
});
