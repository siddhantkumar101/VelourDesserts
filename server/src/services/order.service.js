const Order = require('../models/Order.model');
const Coupon = require('../models/Coupon.model');
const Product = require('../models/Product.model');
const generateOrderId = require('../utils/generateOrderId');
const AppError = require('../utils/AppError');

const DELIVERY_FEE = 100; // ₹100 flat delivery fee

const calculateOrderPricing = async ({ items, couponCode, fulfilmentType }) => {
  let subtotal = 0;
  let giftWrappingTotal = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) throw new AppError(`Product not found: ${item.productId}`, 404);

    const variant = product.variants.find((v) => v.label === item.variantLabel);
    if (!variant || !variant.isAvailable) throw new AppError(`Variant "${item.variantLabel}" not available`, 400);

    const unitPrice = variant.priceINR;
    const giftWrapping = item.hasGiftWrapping && product.hasGiftWrapping ? product.giftWrappingSurcharge : 0;
    const itemSubtotal = (unitPrice + giftWrapping) * item.quantity;

    subtotal += unitPrice * item.quantity;
    giftWrappingTotal += giftWrapping * item.quantity;

    processedItems.push({
      productId: product._id,
      productName: product.name,
      variantLabel: variant.label,
      flavour: item.flavour || '',
      dietaryOption: item.dietaryOption || '',
      quantity: item.quantity,
      unitPrice,
      customMessage: item.customMessage || '',
      specialInstructions: item.specialInstructions || '',
      hasGiftWrapping: !!item.hasGiftWrapping,
      giftWrappingSurcharge: giftWrapping,
      subtotal: itemSubtotal,
    });
  }

  // Coupon
  let discountAmount = 0;
  let couponId = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    });
    if (!coupon) throw new AppError('Invalid or expired coupon code.', 400);
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new AppError('Coupon usage limit reached.', 400);
    if (subtotal < coupon.minOrderValue) throw new AppError(`Minimum order value of ₹${coupon.minOrderValue} required for this coupon.`, 400);

    discountAmount = coupon.type === 'percentage'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);
    couponId = coupon._id;
  }

  const deliveryFee = fulfilmentType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + giftWrappingTotal - discountAmount + deliveryFee;

  return { processedItems, pricing: { subtotal, discountAmount, giftWrappingTotal, deliveryFee, total }, couponId };
};

const createOrder = async ({ orderData, paymentIntentId }) => {
  const orderId = await generateOrderId();
  const order = await Order.create({
    orderId,
    ...orderData,
    payment: { stripePaymentIntentId: paymentIntentId, status: 'pending' },
    status: 'Pending',
  });
  return order;
};

const getOrdersByCustomer = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({ 'customer.userId': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ 'customer.userId': userId }),
  ]);
  return { orders, total, pages: Math.ceil(total / limit), page, limit };
};

module.exports = { calculateOrderPricing, createOrder, getOrdersByCustomer };
