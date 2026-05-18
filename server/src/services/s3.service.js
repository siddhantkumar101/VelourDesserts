const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3');

const getCloudFrontUrl = (s3Key) => {
  const base = process.env.AWS_CLOUDFRONT_URL;
  if (base) return `${base}/${s3Key}`;
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
};

const deleteFromS3 = async (s3Key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
  });
  await s3Client.send(command);
};

module.exports = { getCloudFrontUrl, deleteFromS3 };
