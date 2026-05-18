const Product = require('../models/Product.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { getUnavailableDates } = require('../services/availability.service');
const { deleteFromS3 } = require('../services/s3.service');

exports.getProducts = catchAsync(async (req, res) => {
  const { category, dietary, sort, search, page = 1, limit = 20, featured } = req.query;
  const query = { isActive: true };

  if (category && category !== 'All') query.category = category;
  if (featured === 'true') query.isFeatured = true;
  if (dietary) query['dietaryOptions.label'] = { $regex: dietary, $options: 'i' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { basePrice: 1 },
    'price-desc': { basePrice: -1 },
    popularity: { isFeatured: -1, createdAt: -1 },
  };
  const sortObj = sortMap[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(query),
  ]);

  const pages = Math.ceil(total / Number(limit));
  sendSuccess(res, 200, 'Products retrieved', { products }, { page: Number(page), limit: Number(limit), total, pages });
});

exports.getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true }).limit(6).lean();
  sendSuccess(res, 200, 'Featured products retrieved', { products });
});

exports.getProductBySlug = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return next(new AppError('Product not found.', 404));
  sendSuccess(res, 200, 'Product retrieved', { product });
});

exports.getProductAvailability = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) return next(new AppError('Product not found.', 404));
  const availability = await getUnavailableDates(req.params.id);
  sendSuccess(res, 200, 'Availability retrieved', availability);
});

exports.createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  sendSuccess(res, 201, 'Product created', { product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return next(new AppError('Product not found.', 404));
  sendSuccess(res, 200, 'Product updated', { product });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return next(new AppError('Product not found.', 404));
  sendSuccess(res, 200, 'Product archived successfully');
});

exports.uploadProductImages = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  const newImages = req.files.map((file, index) => ({
    url: file.location || file.path || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600',
    altText: `${product.name} image ${index + 1}`,
    isPrimary: product.images.length === 0 && index === 0,
  }));

  product.images.push(...newImages);
  await product.save();
  sendSuccess(res, 200, 'Images uploaded', { images: product.images });
});

exports.deleteProductImage = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  const image = product.images.id(req.params.imageId);
  if (!image) return next(new AppError('Image not found.', 404));

  // Extract S3 key from URL and delete
  const urlParts = image.url.split('/');
  const s3Key = urlParts.slice(-2).join('/');
  try { await deleteFromS3(s3Key); } catch (_) {}

  image.deleteOne();
  await product.save();
  sendSuccess(res, 200, 'Image deleted');
});
