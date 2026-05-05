import 'dotenv/config.js';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const { rows } = await pool.query(
    'SELECT id, event_classification, priority_level, delivery_status, created_at FROM notification WHERE patient_id = 1 ORDER BY created_at DESC LIMIT 10'
  );
  console.log('Recent notifications:', rows.length ? rows : 'none found');
} catch (err) {
  console.error('DB error:', err.message);
} finally {
  await pool.end();
}
