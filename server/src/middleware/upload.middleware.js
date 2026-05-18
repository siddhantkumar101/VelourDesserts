const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new AppError('Only JPEG, PNG, and WebP images are allowed.', 400), false);
  }
  cb(null, true);
};

// Fallback to local memory storage if Cloudinary keys are not set, so developers don't run into crashes!
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'velour_desserts',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: (req, file) => `product_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
    },
  });
} else {
  console.warn('Cloudinary not configured. Falling back to secure simulated memory storage.');
  storage = multer.memoryStorage();
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

module.exports = upload;
