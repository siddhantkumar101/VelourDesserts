const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
});

const variantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  size: { type: String, required: true },
  servings: { type: Number, required: true },
  priceINR: { type: Number, required: true, min: 0 },
  stockCapPerDay: { type: Number, required: true, default: 10, min: 1 },
  isAvailable: { type: Boolean, default: true },
});

const dietaryOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  surchargeINR: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: ['Cakes', 'Tarts', 'Cookies', 'Gifting', 'Seasonal'],
    },
    images: [imageSchema],
    variants: {
      type: [variantSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one variant is required',
      },
    },
    flavours: [{ type: String, trim: true }],
    dietaryOptions: [dietaryOptionSchema],
    basePrice: { type: Number, required: true, min: 0 },
    hasGiftWrapping: { type: Boolean, default: false },
    giftWrappingSurcharge: { type: Number, default: 0 },
    leadTimeDays: { type: Number, required: true, min: 1 },
    allowsCustomMessage: { type: Boolean, default: false },
    allowsSpecialInstructions: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isSeasonal: { type: Boolean, default: false },
    metaTitle: { type: String, maxlength: 70, default: '' },
    metaDescription: { type: String, maxlength: 160, default: '' },
    tags: [{ type: String, trim: true, lowercase: true }],
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ tags: 1 });

module.exports = mongoose.model('Product', productSchema);
