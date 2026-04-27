import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./glucosecare-d91fe-firebase-adminsdk-fbsvc-a8c1e9d7d9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin.messaging();
