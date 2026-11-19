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
  tagline: "Smart Maritime Campus",
  description: "Building Indonesia&apos;s Future Maritime Technology Ecosystem since 1996.",
  copyright_text: "PPNS Smart Maritime Campus. All rights reserved.",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  linkedin_url: "",
  youtube_url: "",
  privacy_label: "Kebijakan Privasi",
  privacy_url: "",
  terms_label: "Syarat & Ketentuan",
  terms_url: "",
  faq_label: "FAQ",
  faq_url: "",
};

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS footer_settings (
      id INT PRIMARY KEY DEFAULT 1,
      settings JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM footer_settings",
  );
  if (rows[0].count === 0) {
    await pool.query(
      "INSERT INTO footer_settings (id, settings) VALUES (1, ?)",
      [JSON.stringify(DEFAULT_SETTINGS)],
    );
  }
}

router.get("/settings", async (req, res, next) => {
  try {
    await ensureTable();
    const [rows] = await pool.query(
      "SELECT settings FROM footer_settings WHERE id = 1",
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
    const allowedKeys = [
      "site_name",
      "tagline",
      "description",
      "copyright_text",
      "facebook_url",
      "twitter_url",
      "instagram_url",
      "linkedin_url",
      "youtube_url",
      "privacy_label",
      "privacy_url",
      "terms_label",
      "terms_url",
      "faq_label",
      "faq_url",
    ];

    const [existing] = await pool.query(
      "SELECT settings FROM footer_settings WHERE id = 1",
    );
    const current = parseSettings(existing[0]?.settings);

    const updated = { ...current };
    for (const key of allowedKeys) {
      if (key in req.body) {
        updated[key] = req.body[key];
      }
    }

    await pool.query(
      "UPDATE footer_settings SET settings = ? WHERE id = 1",
      [JSON.stringify(updated)],
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("[FOOTER_SETTINGS] Error:", err);
    next(err);
  }
});

module.exports = router;
