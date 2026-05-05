import { composeNotification } from '../../services/jitai/composeNotification.js';
import { clearPatientNotifications, pool } from './_helpers.js';

console.log('--- Scenario 6: severe high ---');
try {
  await clearPatientNotifications(1);
  const result = await composeNotification({ value: 260, trend: 'flat' });
  console.log(`✓ Event: ${result.event.name} | Priority: ${result.suggestion.priority} | Type: ${result.suggestion.notificationType}`);
} catch (err) {
  console.error('✗', err.message);
}

await pool.end();
