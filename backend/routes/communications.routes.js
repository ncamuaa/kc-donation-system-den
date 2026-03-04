const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");



const mapTemplate = (row) => ({
  id: row.id,
  name: row.name,
  subject: row.subject,
  content: row.content || "",
  lastEdited: row.updated_at
    ? new Date(row.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—",
});

router.get("/templates", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM comm_templates ORDER BY updated_at DESC");
    res.json(rows.map(mapTemplate));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/templates", requireAuth, async (req, res) => {
  try {
    const { name, subject, content } = req.body;
    if (!name || !subject) return res.status(400).json({ message: "name and subject are required" });

    const [result] = await pool.query(
      "INSERT INTO comm_templates (name, subject, content) VALUES (?, ?, ?)",
      [name, subject, content || ""]
    );
    const [rows] = await pool.query("SELECT * FROM comm_templates WHERE id = ?", [result.insertId]);
    res.status(201).json(mapTemplate(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/templates/:id", requireAuth, async (req, res) => {
  try {
    const { name, subject, content } = req.body;
    const [result] = await pool.query(
      "UPDATE comm_templates SET name=?, subject=?, content=?, updated_at=NOW() WHERE id=?",
      [name, subject, content || "", req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    const [rows] = await pool.query("SELECT * FROM comm_templates WHERE id = ?", [req.params.id]);
    res.json(mapTemplate(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/templates/:id", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM comm_templates WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


const mapWorkflow = (row) => ({
  id: row.id,
  name: row.name,
  trigger: row.trigger_event,
  status: row.status,
  steps: Number(row.steps),
});

router.get("/workflows", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM comm_workflows ORDER BY id ASC");
    res.json(rows.map(mapWorkflow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/workflows/:id", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await pool.query(
      "UPDATE comm_workflows SET status=? WHERE id=?",
      [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    const [rows] = await pool.query("SELECT * FROM comm_workflows WHERE id = ?", [req.params.id]);
    res.json(mapWorkflow(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



const mapHistory = (row) => ({
  id: row.id,
  recipient: row.recipient,
  template: row.template_name,
  date: new Date(row.sent_at).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }),
  status: row.status,
});

router.get("/history", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM comm_history ORDER BY sent_at DESC");
    res.json(rows.map(mapHistory));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/history", requireAuth, async (req, res) => {
  try {
    const { recipient, template_name, status } = req.body;
    if (!recipient || !template_name) return res.status(400).json({ message: "recipient and template_name are required" });

    const [result] = await pool.query(
      "INSERT INTO comm_history (recipient, template_name, status) VALUES (?, ?, ?)",
      [recipient, template_name, status || "Sent"]
    );
    const [rows] = await pool.query("SELECT * FROM comm_history WHERE id = ?", [result.insertId]);
    res.status(201).json(mapHistory(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;