const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM patients')
  res.json(rows)
})

// router.post('/', async (req, res) => {
//   const { name, email } = req.body
//   const { rows } = await pool.query(
//     'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
//     [name, email]
//   )
//   res.json(rows[0])
// })

module.exports = router