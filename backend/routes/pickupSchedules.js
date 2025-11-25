const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all pickup schedules
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM PICKUP_SCHEDULES');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pickup schedules' });
  }
});

// GET pickup schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM PICKUP_SCHEDULES WHERE schedule_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pickup schedule not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pickup schedule' });
  }
});

// POST create new pickup schedule
router.post('/', async (req, res) => {
  const { day_of_week, time_slot, is_active } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO PICKUP_SCHEDULES (day_of_week, time_slot, is_active) VALUES (?, ?, ?)',
      [day_of_week, time_slot, is_active]
    );
    res.status(201).json({ schedule_id: result.insertId, message: 'Pickup schedule created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create pickup schedule' });
  }
});

// PUT update pickup schedule
router.put('/:id', async (req, res) => {
  const { day_of_week, time_slot, is_active } = req.body;
  try {
    await db.execute(
      'UPDATE PICKUP_SCHEDULES SET day_of_week = ?, time_slot = ?, is_active = ? WHERE schedule_id = ?',
      [day_of_week, time_slot, is_active, req.params.id]
    );
    res.json({ message: 'Pickup schedule updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update pickup schedule' });
  }
});

// DELETE pickup schedule
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM PICKUP_SCHEDULES WHERE schedule_id = ?', [req.params.id]);
    res.json({ message: 'Pickup schedule deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete pickup schedule' });
  }
});

module.exports = router;