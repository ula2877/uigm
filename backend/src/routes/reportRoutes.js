const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const pool = require("../config/database");
const { verifyToken } = require("../middleware/auth");

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function toBool(val, defaultVal = true) {
  if (val === undefined || val === null) return defaultVal ? 1 : 0;
  if (val === true || val === 1 || val === "1" || val === "true") return 1;
  return 0;
}

function parsePublicId(url) {
  if (!url || !url.includes("cloudinary")) return null;
  const match = url.match(/\/upload\/v\d+\/(.+)\./);
  return match ? match[1] : null;
}

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error("Tipe file harus PDF atau gambar"));
    }
    cb(null, true);
  },
});

// POST /api/reports — Buat laporan baru + upload file ke Cloudinary
router.post("/", verifyToken, (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 20MB",
          code: "FILE_TOO_LARGE",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
        code: "MULTER_ERROR",
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        code: "VALIDATION_ERROR",
      });
    }

    const { slug, title, description, published, release_date } = req.body;

    if (!slug || !title) {
      return res.status(400).json({
        success: false,
        message: "Slug dan title wajib diisi",
        code: "VALIDATION_ERROR",
      });
    }

    if (!isValidSlug(slug)) {
      return res.status(400).json({
        success: false,
        message: "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung",
        code: "INVALID_SLUG_FORMAT",
      });
    }

    try {
      const [existing] = await pool.query(
        "SELECT id FROM reports WHERE slug = ?",
        [slug],
      );
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Slug sudah digunakan",
          code: "SLUG_EXISTS",
        });
      }

      let file_url, file_name, file_size, format;

      if (req.file) {
        // Upload file ke Cloudinary
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "green-campus/reports",
              resource_type: "raw",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          stream.end(req.file.buffer);
        });

        const fileExt = path.extname(req.file.originalname).toLowerCase();
        file_url = result.secure_url;
        file_name = req.file.originalname;
        file_size = result.bytes;
        format = fileExt === ".pdf" ? "PDF" : fileExt.replace(".", "").toUpperCase();

        // Simpan juga ke tabel media
        await pool.query(
          "INSERT INTO media (filename, url, mime_type) VALUES (?, ?, ?)",
          [file_name, file_url, req.file.mimetype],
        );
      } else if (req.body.file_url) {
        file_url = req.body.file_url;
        file_name = req.body.file_name || "Laporan";
        file_size = parseInt(req.body.file_size, 10) || 0;
        format = req.body.format || "LINK";
      } else {
        return res.status(400).json({
          success: false,
          message: "Upload file atau link URL wajib diisi",
          code: "NO_FILE_PROVIDED",
        });
      }

      const [dbResult] = await pool.query(
        `INSERT INTO reports (slug, title, description, file_url, file_name, file_size, format, published, release_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          slug,
          title,
          description || null,
          file_url,
          file_name,
          file_size,
          format,
          toBool(published, true),
          release_date || null,
        ],
      );

      console.log(
        `[REPORT] Laporan berhasil dibuat: "${title}" (ID: ${dbResult.insertId})`,
      );

      res.status(201).json({
        success: true,
        message: "Laporan berhasil dibuat",
        data: { id: dbResult.insertId, slug },
      });
    } catch (uploadErr) {
      console.error("[REPORT] Error:", uploadErr);
      res.status(400).json({
        success: false,
        message: `Gagal menyimpan laporan: ${uploadErr.message}`,
        code: "REPORT_CREATE_ERROR",
      });
    }
  });
});

// GET /api/reports — Ambil daftar laporan
router.get("/", async (req, res, next) => {
  try {
    const isAdmin = req.query.admin === "true";
    const whereClause = isAdmin ? "" : "WHERE published = true";

    const [reports] = await pool.query(
      `SELECT id, slug, title, description, file_url, file_name, file_size, format, published, release_date, created_at, updated_at
       FROM reports ${whereClause}
       ORDER BY created_at DESC`,
    );

    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
});

// GET /api/reports/view/:slug — Lihat PDF inline di browser (HARUS sebelum /download/:slug)
router.get("/view/:slug", async (req, res, next) => {
  try {
    const [reports] = await pool.query(
      "SELECT title, file_url, file_name FROM reports WHERE slug = ?",
      [req.params.slug],
    );

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan",
        code: "REPORT_NOT_FOUND",
      });
    }

    const report = reports[0];
    const https = require("https");

    https.get(report.file_url, (cloudRes) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(report.file_name)}"`,
      );
      res.setHeader("Content-Length", cloudRes.headers["content-length"] || "");
      res.setHeader("X-Content-Type-Options", "nosniff");

      cloudRes.pipe(res);
    }).on("error", (err) => {
      console.error("[REPORT] Gagal view dari Cloudinary:", err.message);
      res.status(502).json({
        success: false,
        message: "Gagal menampilkan file",
        code: "VIEW_ERROR",
      });
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/reports/download/:slug — Download file laporan
router.get("/download/:slug", async (req, res, next) => {
  try {
    const [reports] = await pool.query(
      "SELECT title, file_url, file_name FROM reports WHERE slug = ?",
      [req.params.slug],
    );

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan",
        code: "REPORT_NOT_FOUND",
      });
    }

    const report = reports[0];
    const https = require("https");

    https.get(report.file_url, (cloudRes) => {
      const contentType = cloudRes.headers["content-type"] || "application/pdf";

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(report.file_name)}"`,
      );
      res.setHeader("Content-Length", cloudRes.headers["content-length"] || "");

      cloudRes.pipe(res);
    }).on("error", (err) => {
      console.error("[REPORT] Gagal download dari Cloudinary:", err.message);
      res.status(502).json({
        success: false,
        message: "Gagal mengunduh file",
        code: "DOWNLOAD_ERROR",
      });
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/reports/:slug — Ambil detail laporan
router.get("/:slug", async (req, res, next) => {
  try {
    const [reports] = await pool.query(
      `SELECT id, slug, title, description, file_url, file_name, file_size, format, published, release_date, created_at, updated_at
       FROM reports WHERE slug = ?`,
      [req.params.slug],
    );

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan",
        code: "REPORT_NOT_FOUND",
      });
    }

    res.json({ success: true, data: reports[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /api/reports/:slug — Update laporan (opsional: ganti file)
router.put("/:slug", verifyToken, (req, res, next) => {
  const fileUpload = upload.single("file");

  fileUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.message,
        code: "MULTER_ERROR",
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        code: "VALIDATION_ERROR",
      });
    }

    try {
      const [existing] = await pool.query(
        "SELECT id, file_url, file_name FROM reports WHERE slug = ?",
        [req.params.slug],
      );
      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan",
          code: "REPORT_NOT_FOUND",
        });
      }

      const reportId = existing[0].id;
      const setClauses = [];
      const values = [];

      if (req.body.title !== undefined) {
        setClauses.push("title = ?");
        values.push(req.body.title);
      }
      if (req.body.description !== undefined) {
        setClauses.push("description = ?");
        values.push(req.body.description || null);
      }
      if (req.body.published !== undefined) {
        setClauses.push("published = ?");
        values.push(toBool(req.body.published, true));
      }
      if (req.body.release_date !== undefined) {
        setClauses.push("release_date = ?");
        values.push(req.body.release_date || null);
      }
      if (req.body.file_url !== undefined) {
        setClauses.push("file_url = ?");
        values.push(req.body.file_url);
        setClauses.push("file_name = ?");
        values.push(req.body.file_name || "Laporan");
        setClauses.push("file_size = ?");
        values.push(parseInt(req.body.file_size, 10) || 0);
        setClauses.push("format = ?");
        values.push(req.body.format || "LINK");
      }

      // Jika ada file baru, upload ke Cloudinary
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "green-campus/reports",
              resource_type: "raw",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          stream.end(req.file.buffer);
        });

        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const format = fileExt === ".pdf" ? "PDF" : fileExt.replace(".", "").toUpperCase();

        setClauses.push("file_url = ?");
        values.push(result.secure_url);
        setClauses.push("file_name = ?");
        values.push(req.file.originalname);
        setClauses.push("file_size = ?");
        values.push(result.bytes);
        setClauses.push("format = ?");
        values.push(format);

        // Hapus file lama dari Cloudinary
        const oldUrl = existing[0].file_url;
        const oldPublicId = parsePublicId(oldUrl);
        if (oldPublicId) {
          try {
            await cloudinary.uploader.destroy(oldPublicId, {
              resource_type: "raw",
            });
            console.log(`[REPORT] File lama dihapus dari Cloudinary: "${oldPublicId}"`);
          } catch (cloudErr) {
            console.warn("[REPORT] Gagal hapus file lama dari Cloudinary:", cloudErr.message);
          }
        }
      }

      if (setClauses.length > 0) {
        setClauses.push("updated_at = NOW()");
        values.push(req.params.slug);
        await pool.query(
          `UPDATE reports SET ${setClauses.join(", ")} WHERE slug = ?`,
          values,
        );
      }

      res.json({
        success: true,
        message: "Laporan berhasil diperbarui",
      });
    } catch (updateErr) {
      console.error("[REPORT] Error update:", updateErr);
      res.status(400).json({
        success: false,
        message: `Gagal memperbarui laporan: ${updateErr.message}`,
        code: "REPORT_UPDATE_ERROR",
      });
    }
  });
});

// DELETE /api/reports/:slug — Hapus laporan
router.delete("/:slug", verifyToken, async (req, res, next) => {
  try {
    const [existing] = await pool.query(
      "SELECT id, file_url FROM reports WHERE slug = ?",
      [req.params.slug],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan",
        code: "REPORT_NOT_FOUND",
      });
    }

    const report = existing[0];

    // Hapus file dari Cloudinary
    const publicId = parsePublicId(report.file_url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });
        console.log(`[REPORT] File dihapus dari Cloudinary: "${publicId}"`);
      } catch (cloudErr) {
        console.warn("[REPORT] Gagal hapus file dari Cloudinary:", cloudErr.message);
      }
    }

    await pool.query("DELETE FROM reports WHERE slug = ?", [req.params.slug]);

    res.json({
      success: true,
      message: "Laporan berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
