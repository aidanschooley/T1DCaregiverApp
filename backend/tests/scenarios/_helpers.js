import pool from '../../config/database.js';

export async function seedAlerts(patientId, type, count) {
  for (let i = 0; i < count; i++) {
    await pool.query(
      `INSERT INTO notification (setting_id, patient_id, priority_level, event_classification, text, delivery_status, caregiver_id)
       VALUES ((SELECT id FROM patient_glucose_settings WHERE patient_id = $1 LIMIT 1), $1, 'P1', $2, 'seeded', 'sent', 1)`,
      [patientId, type]
    );
  }
}

export async function clearSeededAlerts() {
  await pool.query(`DELETE FROM notification WHERE text = 'seeded'`);
}

export async function clearPatientNotifications(patientId) {
  await pool.query(`DELETE FROM notification WHERE patient_id = $1`, [patientId]);
}

export { pool };
