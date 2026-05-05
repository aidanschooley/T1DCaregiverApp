import { composeNotification } from '../services/jitai/composeNotification.js';
import pool from '../config/database.js';

async function seedAlerts(patientId, type, count) {
  for (let i = 0; i < count; i++) {
    await pool.query(
      `INSERT INTO notification (setting_id, patient_id, priority_level, event_classification, text, delivery_status, caregiver_id)
       VALUES ((SELECT id FROM patient_glucose_settings WHERE patient_id = $1 LIMIT 1), $1, 'P1', $2, 'seeded', 'sent', 1)`,
      [patientId, type]
    );
  }
}

async function clearSeededAlerts() {
  await pool.query(`DELETE FROM notification WHERE text = 'seeded'`);
}

async function clearPatientNotifications(patientId) {
  await pool.query(`DELETE FROM notification WHERE patient_id = $1`, [patientId]);
}

const scenarios = [
  { id: 1,  reading: { value: 50,  trend: 'flat' },       label: 'critical low' },
  { id: 2,  reading: { value: 65,  trend: 'flat' },       label: 'nocturnal low (run between 10pm–6am)' },
  { id: 3,  reading: { value: 65,  trend: 'flat' },       label: 'standard low (run between 6am–10pm)' },
  { id: 4,  reading: { value: 65,  trend: 'flat' },       label: 'repeated unresolved low', seed: { type: 'low', count: 3 } },
  { id: 5,  reading: { value: 100, trend: 'doubleDown' }, label: 'trending low' },
  { id: 6,  reading: { value: 260, trend: 'flat' },       label: 'severe high' },
  { id: 7,  reading: { value: 200, trend: 'flat' },       label: 'mild high' },
  { id: 8,  reading: { value: 200, trend: 'flat' },       label: 'repeated unresolved high', seed: { type: 'high', count: 3 } },
  { id: 9,  reading: { value: 120, trend: 'flat' },       label: 'repeated unresolved mild', seed: { type: 'high', count: 3 } },
  { id: 10, reading: { value: 110, trend: 'flat' },       label: 'recovering', seed: { type: 'low', count: 1 } },
  { id: 11, reading: { value: 100, trend: 'flat' },       label: 'in range' },
];

const target = process.argv[2] ? parseInt(process.argv[2]) : null;
const toRun = target ? scenarios.filter(s => s.id === target) : scenarios;

for (const scenario of toRun) {
  console.log(`\n--- Scenario ${scenario.id}: ${scenario.label} ---`);
  try {
    await clearPatientNotifications(1);
    if (scenario.seed) await seedAlerts(1, scenario.seed.type, scenario.seed.count);
    const result = await composeNotification(scenario.reading);
    if (scenario.seed) await clearSeededAlerts();
    console.log(`✓ Event: ${result.event.name} | Priority: ${result.suggestion.priority} | Type: ${result.suggestion.notificationType}`);
  } catch (err) {
    if (scenario.seed) await clearSeededAlerts();
    console.error('✗', err.message);
  }
}

await pool.end();
