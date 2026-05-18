const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z0-9_-]{3,20}$/,
    },
    type: { type: String, enum: ['percentage', 'flat'], required: true },
    value: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: function (v) {
          if (this.type === 'percentage') return v <= 100;
          return true;
        },
        message: 'Percentage discount cannot exceed 100',
      },
    },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validUntil: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
