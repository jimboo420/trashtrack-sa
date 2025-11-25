const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all reports
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM REPORTS');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET report by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM REPORTS WHERE report_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// POST create new report
router.post('/', async (req, res) => {
  const { reporter_user_id, report_type, location_address, latitude, longitude, description, report_date, status, assigned_collector_id } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO REPORTS (reporter_user_id, report_type, location_address, latitude, longitude, description, report_date, status, assigned_collector_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [reporter_user_id, report_type, location_address, latitude, longitude, description, report_date, status, assigned_collector_id]
    );
    res.status(201).json({ report_id: result.insertId, message: 'Report created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Build dynamic SQL
    const setClause = Object.keys(fields)
      .map(key => `${key} = ?`)
      .join(', ');

    const values = Object.values(fields).map(v =>
      v === undefined ? null : v
    );

    values.push(req.params.id);

    const sql = `UPDATE REPORTS SET ${setClause} WHERE report_id = ?`;

    await db.execute(sql, values);

    res.json({ message: 'Report updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});


// DELETE report
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM REPORTS WHERE report_id = ?', [req.params.id]);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;