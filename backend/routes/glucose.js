const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/:patientId', async (req, res) => {
  try {
    const {patientId} = req.params
    const { rows } = await pool.query('SELECT * FROM cgm_reading where patient_id = $1 ORDER BY created_at DESC',
    [patientId])
    res.json(rows)
  } catch (err) {
    console.error('Database error:', err.message)
    res.status(500).json({ error: 'Failed to fetch glucose', details: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { patient_id, bg_value, trend_arrow, alert_name, alert_state } = req.body
    const { rows } = await pool.query(
      'INSERT INTO cgm_reading (patient_id, bg_value, trend_arrow, alert_name, alert_state) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patient_id, bg_value, trend_arrow, alert_name, alert_state]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('Database error:', err.message)
    res.status(500).json({ error: 'Failed to insert glucose reading', details: err.message })
  }
})

module.exports = router