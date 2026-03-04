const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const mapCM = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  raisedYtd: Number(row.raised_ytd || 0),
  activePartners: Number(row.active_partners || 0),
  status: row.status,
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cause_marketing ORDER BY created_at DESC");
    res.json(rows.map(mapCM));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, raisedYtd, activePartners, status } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const [result] = await pool.query(
      `INSERT INTO cause_marketing (title, description, raised_ytd, active_partners, status)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description || null, Number(raisedYtd || 0), Number(activePartners || 0), status || "Active"]
    );

    const [rows] = await pool.query("SELECT * FROM cause_marketing WHERE id=?", [result.insertId]);
    res.status(201).json(mapCM(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, description, raisedYtd, activePartners, status } = req.body;

    const [result] = await pool.query(
      `UPDATE cause_marketing
       SET title=?, description=?, raised_ytd=?, active_partners=?, status=?
       WHERE id=?`,
      [title, description || null, Number(raisedYtd || 0), Number(activePartners || 0), status, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });

    const [rows] = await pool.query("SELECT * FROM cause_marketing WHERE id=?", [req.params.id]);
    res.json(mapCM(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM cause_marketing WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;