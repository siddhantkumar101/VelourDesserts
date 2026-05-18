const stripe = require('../config/stripe');
const AppError = require('../utils/AppError');

/**
 * Create a Stripe PaymentIntent for the given order total.
 * Amount must be in INR paise (multiply ₹ by 100).
 */
const createPaymentIntent = async ({ amountINR, orderId, customerEmail }) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountINR * 100),
    currency: 'inr',
    metadata: { orderId, customerEmail },
    description: `Velour Desserts — Order ${orderId}`,
    receipt_email: customerEmail,
  });
  return paymentIntent;
};

const retrievePaymentIntent = async (paymentIntentId) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

const createRefund = async (chargeId, amountINR) => {
  return stripe.refunds.create({
    charge: chargeId,
    amount: amountINR ? Math.round(amountINR * 100) : undefined,
  });
};

const constructWebhookEvent = (payload, signature) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
  }
};

module.exports = { createPaymentIntent, retrievePaymentIntent, createRefund, constructWebhookEvent };
