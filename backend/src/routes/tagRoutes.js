const router = require("express").Router();
const pool = require("../config/database");
const { verifyToken } = require("../middleware/auth");

// GET /api/tags — List semua tag
router.get("/", async (req, res, next) => {
  try {
    const [tags] = await pool.query(
      "SELECT id, name FROM tags ORDER BY name ASC",
    );
    res.json({ success: true, data: tags });
  } catch (err) {
    next(err);
  }
});

// POST /api/tags — Buat tag baru
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama tag wajib diisi",
        code: "VALIDATION_ERROR",
      });
    }

    const [existing] = await pool.query("SELECT id FROM tags WHERE name = ?", [name.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Tag sudah ada",
        code: "TAG_EXISTS",
        data: existing[0],
      });
    }

    const [result] = await pool.query("INSERT INTO tags (name) VALUES (?)", [name.trim()]);
    res.status(201).json({
      success: true,
      message: "Tag berhasil dibuat",
      data: { id: result.insertId, name: name.trim() },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tags/:id — Update tag
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama tag wajib diisi",
        code: "VALIDATION_ERROR",
      });
    }

    const [existing] = await pool.query("SELECT id FROM tags WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tag tidak ditemukan",
        code: "TAG_NOT_FOUND",
      });
    }

    await pool.query("UPDATE tags SET name = ? WHERE id = ?", [name.trim(), req.params.id]);
    res.json({ success: true, message: "Tag berhasil diperbarui" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tags/:id — Hapus tag
// ON DELETE CASCADE di news_tags akan menghapus relasi, tag tetap bisa dihapus
router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT id FROM tags WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tag tidak ditemukan",
        code: "TAG_NOT_FOUND",
      });
    }

    await pool.query("DELETE FROM tags WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Tag berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
