import { composeNotification } from '../../services/jitai/composeNotification.js';
import { seedAlerts, clearSeededAlerts, clearPatientNotifications, pool } from './_helpers.js';

console.log('--- Scenario 10: recovering ---');
try {
  await clearPatientNotifications(1);
  await seedAlerts(1, 'low', 1);
  const result = await composeNotification({ value: 110, trend: 'flat' });
  await clearSeededAlerts();
  console.log(`✓ Event: ${result.event.name} | Priority: ${result.suggestion.priority} | Type: ${result.suggestion.notificationType}`);
} catch (err) {
  await clearSeededAlerts();
  console.error('✗', err.message);
}

await pool.end();
