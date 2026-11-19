const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Multer untuk memory storage (file akan dikirim langsung ke Cloudinary)
const storage = multer.memoryStorage();

// Validasi file upload
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error('Tipe file tidak didukung. File harus berupa gambar (JPG, PNG, GIF, WebP, SVG) atau PDF'));
  }

  if (!allowedExts.includes(ext)) {
    return cb(new Error(`Ekstensi file tidak didukung. Gunakan: ${allowedExts.join(', ')}`));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter,
});

// POST /api/upload - Upload file gambar ke Cloudinary
router.post('/', verifyToken, (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    // Handle multer error
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Ukuran file terlalu besar. Maksimal 10MB',
          code: 'FILE_TOO_LARGE'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
        code: 'MULTER_ERROR'
      });
    }

    // Handle custom validation error
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        code: 'VALIDATION_ERROR'
      });
    }

    // Validasi bahwa file ada
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File wajib diupload',
        code: 'NO_FILE_PROVIDED'
      });
    }

    try {
      const isPdf = req.file.mimetype === 'application/pdf';

      // Upload ke Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: 'green-campus',
          resource_type: isPdf ? 'raw' : 'auto',
        };
        if (!isPdf) {
          uploadOptions.eager = [{ fetch_format: 'auto', quality: 'auto' }];
        }
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      const filename = path.basename(result.public_id);
      const [dbResult] = await pool.query(
        'INSERT INTO media (filename, url, mime_type) VALUES (?, ?, ?)',
        [filename, result.secure_url, req.file.mimetype]
      );

      console.log(`[UPLOAD] File berhasil diupload ke Cloudinary: "${filename}" (ID: ${dbResult.insertId})`);
      console.log(`[UPLOAD] Public ID: ${result.public_id}`);
      console.log(`[UPLOAD] Secure URL: ${result.secure_url}`);

      res.status(201).json({
        success: true,
        message: 'File berhasil diupload',
        data: {
          id: dbResult.insertId,
          filename,
          url: result.secure_url,
          public_id: result.public_id,
          mime_type: req.file.mimetype,
          size: result.bytes,
          width: result.width,
          height: result.height
        },
      });
    } catch (uploadErr) {
      console.error('[UPLOAD] Error saat upload ke Cloudinary:', uploadErr);
      
      res.status(400).json({
        success: false,
        message: `Gagal upload ke Cloudinary: ${uploadErr.message}`,
        code: 'CLOUDINARY_UPLOAD_ERROR'
      });
    }
  });
});

// GET /api/upload - Ambil daftar media
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [media] = await pool.query(
      'SELECT id, filename, url, mime_type, created_at FROM media ORDER BY created_at DESC'
    );

    console.log(`[UPLOAD] Daftar media diambil: ${media.length} file`);

    res.json({ success: true, data: media });
  } catch (err) {
    console.error('[UPLOAD] Error saat mengambil daftar media:', err);
    next(err);
  }
});

// GET /api/upload/:id - Ambil detail media
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const [media] = await pool.query(
      'SELECT id, filename, url, mime_type, created_at FROM media WHERE id = ?',
      [req.params.id]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan',
        code: 'MEDIA_NOT_FOUND'
      });
    }

    res.json({ success: true, data: media[0] });
  } catch (err) {
    console.error('[UPLOAD] Error saat mengambil detail media:', err);
    next(err);
  }
});

// DELETE /api/upload/:id - Hapus media dari Cloudinary
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const [media] = await pool.query(
      'SELECT id, filename, url FROM media WHERE id = ?',
      [req.params.id]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan',
        code: 'MEDIA_NOT_FOUND'
      });
    }

    const mediaFile = media[0];

    // Extract public_id dari URL Cloudinary
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
    let publicId = null;
    try {
      // Parsing public_id dari filename atau URL
      if (mediaFile.filename.includes('/')) {
        publicId = mediaFile.filename;
      } else {
        // Jika hanya nama file, coba reconstruct public_id
        publicId = `green-campus/${mediaFile.filename}`;
      }
    } catch (parseErr) {
      console.warn('[UPLOAD] Gagal parse public_id dari URL:', mediaFile.url);
    }

    // Hapus dari Cloudinary jika public_id tersedia
    if (publicId) {
      try {
        const destroyResult = await cloudinary.uploader.destroy(publicId);
        console.log(`[UPLOAD] File dihapus dari Cloudinary: "${publicId}"`, destroyResult);
      } catch (cloudErr) {
        console.warn(`[UPLOAD] Gagal menghapus file dari Cloudinary: ${publicId}`, cloudErr.message);
        // Lanjutkan meski gagal menghapus dari Cloudinary
      }
    }

    // Hapus record dari database
    await pool.query('DELETE FROM media WHERE id = ?', [req.params.id]);

    console.log(`[UPLOAD] Media dihapus dari database: "${mediaFile.filename}" (ID: ${req.params.id})`);

    res.json({
      success: true,
      message: 'File berhasil dihapus'
    });
  } catch (err) {
    console.error('[UPLOAD] Error saat menghapus media:', err);
    next(err);
  }
});

module.exports = router;
