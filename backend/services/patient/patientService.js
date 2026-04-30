import pool from '../../config/database.js';

export async function getAllPatients() {
  const { rows } = await pool.query('SELECT * FROM patient');
  return rows;
}

export async function getPatientById(id) {
  const { rows } = await pool.query('SELECT * FROM patient WHERE id = $1', [id]);
  return rows;
}

export async function getPatientNameById(id){
  const {rows} = await pool.query('SELECT first_name FROM patient WHERE id= $1', [id])
  const name = rows[0].first_name
  return name
}
