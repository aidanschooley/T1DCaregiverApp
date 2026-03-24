const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM patient')
    res.json(rows)
  } catch (err) {
    console.error('Database error:', err.message)
    res.status(500).json({ error: 'Failed to fetch patients', details: err.message })
  }
})

module.exports = router