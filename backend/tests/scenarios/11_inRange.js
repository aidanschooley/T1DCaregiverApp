import { composeNotification } from '../../services/jitai/composeNotification.js';
import { clearPatientNotifications, pool } from './_helpers.js';

console.log('--- Scenario 11: in range ---');
try {
  await clearPatientNotifications(1);
  const result = await composeNotification({ value: 100, trend: 'flat' });
  console.log(`✓ Event: ${result.event.name} | Priority: ${result.suggestion.priority} | Type: ${result.suggestion.notificationType}`);
} catch (err) {
  console.error('✗', err.message);
}

await pool.end();
