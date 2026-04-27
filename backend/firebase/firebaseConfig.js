import admin from 'firebase-admin';
import serviceAccount from './glucosecare-d91fe-firebase-adminsdk-fbsvc-a8c1e9d7d9.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin.messaging();
