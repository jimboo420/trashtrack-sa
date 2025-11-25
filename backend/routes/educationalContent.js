const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all educational content
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM EDUCATIONAL_CONTENT ORDER BY content_id');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch educational content' });
  }
});

// GET educational content by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM EDUCATIONAL_CONTENT WHERE content_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Educational content not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch educational content' });
  }
});

// POST create new educational content
router.post('/', async (req, res) => {
  const { author_user_id, title, topic, content_body, created_at } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO EDUCATIONAL_CONTENT (author_user_id, title, topic, content_body, created_at) VALUES (?, ?, ?, ?, ?)',
      [author_user_id, title, topic, content_body, created_at]
    );
    res.status(201).json({ content_id: result.insertId, message: 'Educational content created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create educational content' });
  }
});

// PUT update educational content
router.put('/:id', async (req, res) => {
  const { author_user_id, title, topic, content_body, created_at } = req.body;
  try {
    await db.execute(
      'UPDATE EDUCATIONAL_CONTENT SET author_user_id = ?, title = ?, topic = ?, content_body = ?, created_at = ? WHERE content_id = ?',
      [author_user_id, title, topic, content_body, created_at, req.params.id]
    );
    res.json({ message: 'Educational content updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update educational content' });
  }
});

// DELETE educational content
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM EDUCATIONAL_CONTENT WHERE content_id = ?', [req.params.id]);
    res.json({ message: 'Educational content deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete educational content' });
  }
});

module.exports = router;