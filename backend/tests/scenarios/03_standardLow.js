import { composeNotification } from '../../services/jitai/composeNotification.js';
import { clearPatientNotifications, pool } from './_helpers.js';

// Run between 6am–10pm to trigger standard low classification
console.log('--- Scenario 3: standard low (run between 6am–10pm) ---');
try {
  await clearPatientNotifications(1);
  const result = await composeNotification({ value: 65, trend: 'flat' });
  console.log(`✓ Event: ${result.event.name} | Priority: ${result.suggestion.priority} | Type: ${result.suggestion.notificationType}`);
} catch (err) {
  console.error('✗', err.message);
}

await pool.end();
