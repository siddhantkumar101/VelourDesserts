const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const AppError = require('../utils/AppError');

/**
 * Create a Razorpay Order for the given total.
 * Amount must be in INR paise (multiply ₹ by 100).
 */
const createRazorpayOrder = async ({ amountINR, receipt }) => {
  try {
    const options = {
      amount: Math.round(amountINR * 100), // convert to paise
      currency: 'INR',
      receipt: receipt,
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new AppError(`Razorpay Order creation failed: ${error.message}`, 500);
  }
};

/**
 * Verify Razorpay payment signature
 */
const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret';
  const shasum = crypto.createHmac('sha256', keySecret);
  shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const digest = shasum.digest('hex');
  return digest === razorpaySignature;
};

module.exports = { createRazorpayOrder, verifyPaymentSignature };
