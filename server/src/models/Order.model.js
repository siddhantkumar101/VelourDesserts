const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  variantLabel: { type: String, required: true },
  flavour: { type: String, default: '' },
  dietaryOption: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  customMessage: { type: String, maxlength: 60, default: '' },
  specialInstructions: { type: String, maxlength: 200, default: '' },
  hasGiftWrapping: { type: Boolean, default: false },
  giftWrappingSurcharge: { type: Number, default: 0 },
  subtotal: { type: Number, required: true, min: 0 },
});

const emailSentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['order_confirmation', 'dispatched', 'payment_failed', 'low_stock'],
    required: true,
  },
  sentAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      match: /^VD-\d{8}-\d{4}$/,
    },
    customer: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    fulfilmentDate: { type: Date, required: true },
    fulfilmentType: { type: String, enum: ['delivery', 'pickup'], required: true },
    deliveryAddress: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      giftWrappingTotal: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    couponCode: { type: String, default: '' },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    payment: {
      stripePaymentIntentId: { type: String, required: true },
      stripeChargeId: { type: String, default: '' },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Production', 'Ready', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    adminNotes: { type: String, default: '' },
    customerNotes: { type: String, default: '' },
    emailsSent: [emailSentSchema],
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, fulfilmentDate: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ 'customer.userId': 1 });
orderSchema.index({ 'payment.stripePaymentIntentId': 1 });

module.exports = mongoose.model('Order', orderSchema);
