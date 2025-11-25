const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all report schedules
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM REPORT_SCHEDULES');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch report schedules' });
  }
});

// GET report schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM REPORT_SCHEDULES WHERE report_schedule_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Report schedule not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch report schedule' });
  }
});

// POST create new report schedule
router.post('/', async (req, res) => {
  const { report_id, schedule_id } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO REPORT_SCHEDULES (report_id, schedule_id) VALUES (?, ?)',
      [report_id, schedule_id]
    );
    res.status(201).json({ report_schedule_id: result.insertId, message: 'Report schedule created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create report schedule' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    // Build the SQL SET clause dynamically
    const setClause = Object.keys(fields)
      .map(key => `${key} = ?`)
      .join(', ');

    // Replace undefined with null
    const values = Object.values(fields).map(v =>
      v === undefined ? null : v
    );

    // Append ID to the values array
    values.push(req.params.id);

    const sql =
      `UPDATE REPORT_SCHEDULES 
       SET ${setClause} 
       WHERE report_schedule_id = ?`;

    await db.execute(sql, values);

    res.json({ message: 'Report schedule updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update report schedule' });
  }
});


// DELETE report schedule
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM REPORT_SCHEDULES WHERE report_schedule_id = ?', [req.params.id]);
    res.json({ message: 'Report schedule deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete report schedule' });
  }
});

module.exports = router;