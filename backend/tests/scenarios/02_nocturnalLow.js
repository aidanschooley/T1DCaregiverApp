import { composeNotification } from '../../services/jitai/composeNotification.js';
import { clearPatientNotifications, pool } from './_helpers.js';

// Run between 10pm–6am to trigger nocturnal classification
console.log('--- Scenario 2: nocturnal low (run between 10pm–6am) ---');
try {
  await clearPatientNotifications(1);
  const result = await composeNotification({ value: 65, trend: 'flat' });
  console.log(`✓ Event: ${result.event.name} | Priority: ${result.suggestion.priority} | Type: ${result.suggestion.notificationType}`);
} catch (err) {
  console.error('✗', err.message);
}

await pool.end();
