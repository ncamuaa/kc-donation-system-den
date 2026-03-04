const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM donors ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /donors error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('POST /api/donors body:', req.body);

    const {
      project,
      description,
      units,
      deliveryDate,
      dueDate, 
      sponsor,
      amount,
      type,
      status,
    } = req.body;

    if (!project || !description || !sponsor || !type || !status) {
      return res.status(400).json({
        message: 'Missing required fields.',
        received: { project, description, sponsor, type, status },
      });
    }

    const sql = `
      INSERT INTO donors
      (project, description, units, deliveryDate, dueDate, sponsor, amount, type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      project,
      description,
      Number(units || 0),
      deliveryDate || null,
      dueDate || null,
      sponsor,
      Number(amount || 0),
      type,
      status,
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      id: result.insertId,
      project,
      description,
      units: Number(units || 0),
      deliveryDate: deliveryDate || null,
      dueDate: dueDate || null, 
      sponsor,
      amount: Number(amount || 0),
      type,
      status,
    });
  } catch (err) {
    console.error('POST /api/donors error:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      project,
      description,
      units,
      deliveryDate,
      dueDate, 
      sponsor,
      amount,
      type,
      status,
    } = req.body;

    const sql = `
      UPDATE donors
      SET project=?, description=?, units=?, deliveryDate=?, dueDate=?, sponsor=?, amount=?, type=?, status=?
      WHERE id=?
    `;

    const values = [
      project,
      description,
      Number(units || 0),
      deliveryDate || null,
      dueDate || null,
      sponsor,
      Number(amount || 0),
      type,
      status,
      id,
    ];

    await db.query(sql, values);

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('PUT /donors/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM donors WHERE id=?', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /donors/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;