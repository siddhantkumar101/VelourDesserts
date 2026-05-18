const sgMail = require('../config/sendgrid');

const FROM = {
  email: process.env.SENDGRID_FROM_EMAIL,
  name: process.env.SENDGRID_FROM_NAME || 'Velour Desserts Co.',
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Velour Desserts</title>
</head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(44,24,16,0.08);">
        <!-- Header -->
        <tr><td style="background:#C9897B;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-family:Georgia,serif;letter-spacing:2px;">VELOUR</h1>
          <p style="margin:4px 0 0;color:#F0E8DF;font-size:13px;letter-spacing:4px;">DESSERTS CO.</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#F0E8DF;padding:24px 40px;text-align:center;">
          <p style="margin:0;color:#5C3D2E;font-size:13px;">
            📍 Mumbai, India &nbsp;|&nbsp; 📸 <a href="https://instagram.com/velourdesserts" style="color:#C9897B;">@velourdesserts</a> &nbsp;|&nbsp; 📧 ${process.env.SENDGRID_FROM_EMAIL}
          </p>
          <p style="margin:8px 0 0;color:#9E5E52;font-size:11px;">© ${new Date().getFullYear()} Velour Desserts Co. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const itemsTable = (items) => `
  <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
    <tr style="background:#F0E8DF;">
      <th style="text-align:left;color:#2C1810;font-size:13px;padding:10px 12px;">Item</th>
      <th style="text-align:right;color:#2C1810;font-size:13px;padding:10px 12px;">Qty</th>
      <th style="text-align:right;color:#2C1810;font-size:13px;padding:10px 12px;">Price</th>
    </tr>
    ${items.map((item) => `
      <tr style="border-bottom:1px solid #E8C5BC;">
        <td style="color:#2C1810;font-size:14px;padding:10px 12px;">
          <strong>${item.productName}</strong><br/>
          <span style="color:#5C3D2E;font-size:12px;">${item.variantLabel}${item.flavour ? ' · ' + item.flavour : ''}${item.dietaryOption ? ' · ' + item.dietaryOption : ''}</span>
          ${item.customMessage ? `<br/><span style="color:#9E5E52;font-size:12px;">Message: "${item.customMessage}"</span>` : ''}
        </td>
        <td style="text-align:right;color:#5C3D2E;font-size:14px;padding:10px 12px;">${item.quantity}</td>
        <td style="text-align:right;color:#B8965A;font-size:14px;font-weight:bold;padding:10px 12px;">₹${item.subtotal.toLocaleString('en-IN')}</td>
      </tr>
    `).join('')}
  </table>`;

const sendOrderConfirmation = async (order) => {
  const content = `
    <h2 style="color:#2C1810;font-family:Georgia,serif;margin:0 0 8px;">Your order is confirmed! 🎂</h2>
    <p style="color:#5C3D2E;font-size:15px;margin:0 0 24px;">Hi ${order.customer.name}, we've received your order and can't wait to bake for you.</p>
    <div style="background:#F0E8DF;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#2C1810;font-size:14px;"><strong>Order ID:</strong> <span style="font-family:monospace;color:#C9897B;">${order.orderId}</span></p>
      <p style="margin:8px 0 0;color:#2C1810;font-size:14px;"><strong>Fulfilment Date:</strong> ${new Date(order.fulfilmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p style="margin:8px 0 0;color:#2C1810;font-size:14px;"><strong>Type:</strong> ${order.fulfilmentType === 'delivery' ? '🚚 Home Delivery' : '🏪 Store Pickup'}</p>
    </div>
    <h3 style="color:#2C1810;font-size:16px;margin:0 0 8px;">Order Summary</h3>
    ${itemsTable(order.items)}
    <table width="100%" cellpadding="4" cellspacing="0" style="margin-top:16px;">
      <tr><td style="color:#5C3D2E;font-size:14px;">Subtotal</td><td style="text-align:right;color:#2C1810;font-size:14px;">₹${order.pricing.subtotal.toLocaleString('en-IN')}</td></tr>
      ${order.pricing.discountAmount > 0 ? `<tr><td style="color:#4A7C59;font-size:14px;">Discount</td><td style="text-align:right;color:#4A7C59;font-size:14px;">-₹${order.pricing.discountAmount.toLocaleString('en-IN')}</td></tr>` : ''}
      ${order.pricing.deliveryFee > 0 ? `<tr><td style="color:#5C3D2E;font-size:14px;">Delivery Fee</td><td style="text-align:right;color:#2C1810;font-size:14px;">₹${order.pricing.deliveryFee.toLocaleString('en-IN')}</td></tr>` : ''}
      <tr><td style="color:#2C1810;font-size:16px;font-weight:bold;padding-top:8px;border-top:2px solid #E8C5BC;">Total Paid</td><td style="text-align:right;color:#B8965A;font-size:16px;font-weight:bold;padding-top:8px;border-top:2px solid #E8C5BC;">₹${order.pricing.total.toLocaleString('en-IN')}</td></tr>
    </table>
    <div style="text-align:center;margin-top:32px;">
      <a href="${process.env.CLIENT_URL}/account/orders/${order.orderId}" style="background:#C9897B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:600;">Track Your Order →</a>
    </div>`;

  await sgMail.send({
    to: order.customer.email,
    from: FROM,
    subject: `Your Velour order is confirmed 🎂 (${order.orderId})`,
    html: baseTemplate(content),
  });
};

const sendDispatchedEmail = async (order) => {
  const content = `
    <h2 style="color:#2C1810;font-family:Georgia,serif;margin:0 0 8px;">Your order is ${order.fulfilmentType === 'delivery' ? 'on its way! 🚚' : 'ready for pickup! 🏪'}</h2>
    <p style="color:#5C3D2E;font-size:15px;margin:0 0 24px;">Hi ${order.customer.name}, exciting news — your Velour order is ${order.fulfilmentType === 'delivery' ? 'heading to you' : 'ready to be collected'}!</p>
    <div style="background:#F0E8DF;border-radius:8px;padding:16px 20px;">
      <p style="margin:0;color:#2C1810;font-size:14px;"><strong>Order ID:</strong> <span style="font-family:monospace;color:#C9897B;">${order.orderId}</span></p>
      <p style="margin:8px 0 0;color:#2C1810;font-size:14px;"><strong>Status:</strong> ${order.status}</p>
    </div>
    <div style="text-align:center;margin-top:32px;">
      <a href="${process.env.CLIENT_URL}/account/orders/${order.orderId}" style="background:#C9897B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:600;">View Order Details →</a>
    </div>`;

  await sgMail.send({
    to: order.customer.email,
    from: FROM,
    subject: `Your Velour order is ${order.fulfilmentType === 'delivery' ? 'on its way' : 'ready for pickup'} (${order.orderId})`,
    html: baseTemplate(content),
  });
};

const sendPaymentFailedEmail = async ({ email, name }) => {
  const content = `
    <h2 style="color:#C0392B;font-family:Georgia,serif;margin:0 0 8px;">We couldn't process your payment</h2>
    <p style="color:#5C3D2E;font-size:15px;margin:0 0 24px;">Hi ${name}, unfortunately your payment didn't go through. No charges have been made.</p>
    <p style="color:#5C3D2E;font-size:15px;">This can happen due to insufficient funds, incorrect card details, or a bank decline. Please try again with a different payment method.</p>
    <div style="text-align:center;margin-top:32px;">
      <a href="${process.env.CLIENT_URL}/checkout" style="background:#C9897B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:600;">Try Again →</a>
    </div>`;

  await sgMail.send({
    to: email,
    from: FROM,
    subject: "We couldn't process your payment — Velour Desserts",
    html: baseTemplate(content),
  });
};

const sendLowStockAlert = async ({ productName, todayBookings, cap }) => {
  const content = `
    <h2 style="color:#D4A017;font-family:Georgia,serif;margin:0 0 8px;">⚠️ Stock Alert: ${productName}</h2>
    <p style="color:#5C3D2E;font-size:15px;margin:0 0 24px;">This product is approaching its daily capacity.</p>
    <div style="background:#F0E8DF;border-radius:8px;padding:16px 20px;">
      <p style="margin:0;color:#2C1810;font-size:15px;"><strong>Today's bookings:</strong> ${todayBookings} / ${cap}</p>
      <p style="margin:8px 0 0;color:#C0392B;font-size:15px;"><strong>Remaining slots:</strong> ${cap - todayBookings}</p>
    </div>
    <div style="text-align:center;margin-top:32px;">
      <a href="${process.env.CLIENT_URL}/admin/products" style="background:#C9897B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:600;">Manage Products →</a>
    </div>`;

  await sgMail.send({
    to: process.env.ADMIN_EMAIL,
    from: FROM,
    subject: `⚠️ Stock alert: ${productName} nearly sold out`,
    html: baseTemplate(content),
  });
};

module.exports = { sendOrderConfirmation, sendDispatchedEmail, sendPaymentFailedEmail, sendLowStockAlert };
