const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const s3Client = require('../config/s3');
const AppError = require('../utils/AppError');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new AppError('Only JPEG, PNG, and WebP images are allowed.', 400), false);
  }
  // Prevent path traversal
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return cb(new AppError('Invalid file extension.', 400), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueName = `products/${uuidv4()}${path.extname(file.originalname).toLowerCase()}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

module.exports = upload;
