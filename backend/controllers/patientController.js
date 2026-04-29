import pool from '../config/database.js'

export async function getAllPatients(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM patient');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Failed to fetch patients', details: err.message });
  }
}

export async function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM patient WHERE id = $1', [id]);
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Failed to fetch patient', details: err.message });
  }
}
