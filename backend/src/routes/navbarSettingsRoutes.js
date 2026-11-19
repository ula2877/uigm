const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const { verifyToken } = require("../middleware/auth");

function parseSettings(raw) {
  if (!raw) return { ...DEFAULT_SETTINGS };
  if (typeof raw === "string") return JSON.parse(raw);
  return raw;
}

const DEFAULT_SETTINGS = {
  site_name: "PPNS",
  logo_url: null,
  show_admin: true,
  admin_label: "Admin",
  admin_href: "/admin",
  show_info_akademik: true,
  info_akademik_label: "Info Akademik",
  info_akademik_href: "/program",
};

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS navbar_settings (
      id INT PRIMARY KEY DEFAULT 1,
      settings JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM navbar_settings",
  );
  if (rows[0].count === 0) {
    await pool.query(
      "INSERT INTO navbar_settings (id, settings) VALUES (1, ?)",
      [JSON.stringify(DEFAULT_SETTINGS)],
    );
  }
}

router.get("/settings", async (req, res, next) => {
  try {
    await ensureTable();
    const [rows] = await pool.query(
      "SELECT settings FROM navbar_settings WHERE id = 1",
    );
    const settings = parseSettings(rows[0]?.settings);
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.put("/settings", verifyToken, async (req, res, next) => {
  try {
    await ensureTable();
    console.log("[NAVBAR_SETTINGS] PUT body:", JSON.stringify(req.body));
    const allowedKeys = [
      "site_name",
      "logo_url",
      "show_admin",
      "admin_label",
      "admin_href",
      "show_info_akademik",
      "info_akademik_label",
      "info_akademik_href",
    ];

    const [existing] = await pool.query(
      "SELECT settings FROM navbar_settings WHERE id = 1",
    );
    console.log("[NAVBAR_SETTINGS] Existing raw:", typeof existing[0]?.settings, existing[0]?.settings);
    const current = parseSettings(existing[0]?.settings);
    console.log("[NAVBAR_SETTINGS] Parsed current:", JSON.stringify(current));

    const updated = { ...current };
    for (const key of allowedKeys) {
      if (key in req.body) {
        updated[key] = req.body[key];
      }
    }
    console.log("[NAVBAR_SETTINGS] Updated:", JSON.stringify(updated));

    await pool.query(
      "UPDATE navbar_settings SET settings = ? WHERE id = 1",
      [JSON.stringify(updated)],
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("[NAVBAR_SETTINGS] Error:", err);
    next(err);
  }
});

module.exports = router;
