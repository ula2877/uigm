const router = require("express").Router();
const pool = require("../config/database");
const { verifyToken } = require("../middleware/auth");

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function pick(obj, ...keys) {
  const result = {};
  for (const k of keys) {
    if (obj[k] !== undefined) result[k] = obj[k];
  }
  return result;
}

// Attach tags array to a news row
async function attachTags(newsItem) {
  if (!newsItem) return newsItem;
  const [rows] = await pool.query(
    `SELECT t.id, t.name FROM tags t
     JOIN news_tags nt ON nt.tag_id = t.id
     WHERE nt.news_id = ?`,
    [newsItem.id],
  );
  newsItem.tags = rows;
  newsItem.tag = rows.map((t) => t.name).join(",");
  return newsItem;
}

// Process tag names: ensure they exist in tags table, return tag ids
async function ensureTags(tagNames, conn) {
  const ids = [];
  for (const raw of tagNames || []) {
    const name = raw.trim();
    if (!name) continue;
    // Try insert ignore first, then select
    await conn.query("INSERT IGNORE INTO tags (name) VALUES (?)", [name]);
    const [rows] = await conn.query("SELECT id FROM tags WHERE name = ?", [name]);
    if (rows.length > 0) ids.push(rows[0].id);
  }
  return ids;
}

// ==================== PUBLIC / ADMIN ENDPOINTS ====================

// GET /api/news — List berita (public: only published, admin: all)
router.get("/", async (req, res, next) => {
  try {
    const isAdmin = req.query.admin === "true";
    const whereClause = isAdmin ? "" : "WHERE n.published = true";

    const [news] = await pool.query(`
      SELECT n.id, n.slug, n.title, n.excerpt, n.color, n.image, n.date,
             n.published, n.created_at, n.updated_at
      FROM news n
      ${whereClause}
      ORDER BY n.created_at DESC
    `);

    // Attach tags to each item
    for (const item of news) {
      await attachTags(item);
    }

    res.json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
});

// GET /api/news/:slug — Detail berita
router.get("/:slug", async (req, res, next) => {
  try {
    const [news] = await pool.query(
      `SELECT n.id, n.slug, n.title, n.excerpt, n.content, n.color, n.image,
              n.date, n.published, n.created_at, n.updated_at
       FROM news n
       WHERE n.slug = ?`,
      [req.params.slug],
    );
    if (news.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
        code: "NEWS_NOT_FOUND",
      });
    }

    await attachTags(news[0]);
    res.json({ success: true, data: news[0] });
  } catch (err) {
    next(err);
  }
});

// ==================== ADMIN-ONLY ENDPOINTS ====================

// POST /api/news — Buat berita baru
router.post("/", verifyToken, async (req, res, next) => {
  const { slug, title, excerpt, content, color, image, date, published, tags } = req.body;

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

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query("SELECT id FROM news WHERE slug = ?", [slug]);
    if (existing.length > 0) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({
        success: false,
        message: "Slug sudah digunakan",
        code: "SLUG_EXISTS",
      });
    }

    const [result] = await conn.query(
      `INSERT INTO news (slug, title, excerpt, content, color, image, date, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        excerpt || null,
        content || null,
        color || null,
        image || null,
        date || new Date().toISOString().split("T")[0],
        published ?? true,
      ],
    );

    const newsId = result.insertId;

    // Process tags
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagIds = await ensureTags(tags, conn);
      for (const tagId of tagIds) {
        await conn.query(
          "INSERT IGNORE INTO news_tags (news_id, tag_id) VALUES (?, ?)",
          [newsId, tagId],
        );
      }
    }

    await conn.commit();
    conn.release();

    res.status(201).json({
      success: true,
      message: "Berita berhasil dibuat",
      data: { id: newsId, slug },
    });
  } catch (err) {
    await conn.rollback();
    conn.release();
    next(err);
  }
});

// PUT /api/news/:slug — Update berita
router.put("/:slug", verifyToken, async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query("SELECT id FROM news WHERE slug = ?", [
      req.params.slug,
    ]);
    if (existing.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
        code: "NEWS_NOT_FOUND",
      });
    }

    const newsId = existing[0].id;

    // Dynamic UPDATE — only set fields that are provided in the body
    const updatableFields = ["title", "excerpt", "content", "color", "image", "date", "published"];
    const setClauses = [];
    const values = [];

    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(field === "published" ? req.body[field] : (req.body[field] || null));
      }
    }

    if (setClauses.length > 0) {
      setClauses.push("updated_at = NOW()");
      values.push(req.params.slug);
      await conn.query(
        `UPDATE news SET ${setClauses.join(", ")} WHERE slug = ?`,
        values,
      );
    }

    // Sync tags only when tags array is provided in the body
    if (req.body.tags !== undefined) {
      const tags = req.body.tags;
      await conn.query("DELETE FROM news_tags WHERE news_id = ?", [newsId]);

      if (Array.isArray(tags) && tags.length > 0) {
        const tagIds = await ensureTags(tags, conn);
        for (const tagId of tagIds) {
          await conn.query(
            "INSERT IGNORE INTO news_tags (news_id, tag_id) VALUES (?, ?)",
            [newsId, tagId],
          );
        }
      }
    }

    await conn.commit();
    conn.release();

    res.json({
      success: true,
      message: "Berita berhasil diperbarui",
    });
  } catch (err) {
    await conn.rollback();
    conn.release();
    next(err);
  }
});

// DELETE /api/news/:slug — Hapus berita (CASCADE handles news_tags)
router.delete("/:slug", verifyToken, async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT id FROM news WHERE slug = ?", [
      req.params.slug,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
        code: "NEWS_NOT_FOUND",
      });
    }

    await pool.query("DELETE FROM news WHERE slug = ?", [req.params.slug]);

    res.json({
      success: true,
      message: "Berita berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
