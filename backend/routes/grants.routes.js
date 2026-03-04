const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const mapGrant = (row) => ({
  id: row.id,
  title: row.title,
  org: row.org,
  status: row.status,
  amount: Number(row.amount || 0),
  deadline: row.deadline,
  propId: row.prop_id,
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM grants ORDER BY deadline ASC");
    res.json(rows.map(mapGrant));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, org, status, amount, deadline, propId } = req.body;
    if (!title || !org || !deadline || !propId) {
      return res.status(400).json({ message: "title, org, deadline, propId are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO grants (title, org, status, amount, deadline, prop_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, org, status || "Under Review", Number(amount || 0), deadline, propId]
    );

    const [rows] = await pool.query("SELECT * FROM grants WHERE id=?", [result.insertId]);
    res.status(201).json(mapGrant(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, org, status, amount, deadline, propId } = req.body;

    const [result] = await pool.query(
      `UPDATE grants
       SET title=?, org=?, status=?, amount=?, deadline=?, prop_id=?
       WHERE id=?`,
      [title, org, status, Number(amount || 0), deadline, propId, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });

    const [rows] = await pool.query("SELECT * FROM grants WHERE id=?", [req.params.id]);
    res.json(mapGrant(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM grants WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;