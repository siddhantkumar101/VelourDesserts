const mongoose = require('mongoose');

// Used for atomic daily order ID counter: VD-YYYYMMDD-XXXX
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "order_20250520"
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', counterSchema);
