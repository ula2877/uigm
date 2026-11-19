const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠ Cloudinary credentials not configured. File uploads will fail.');
  console.warn(`  CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME || '(missing)'}`);
  console.warn(`  CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '(set)' : '(missing)'}`);
  console.warn(`  CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '(set)' : '(missing)'}`);
}

module.exports = cloudinary;
