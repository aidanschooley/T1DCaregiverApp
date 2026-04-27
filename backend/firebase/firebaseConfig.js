const admin = require('firebase-admin');
const serviceAccount = require('./glucosecare-d91fe-firebase-adminsdk-fbsvc-a8c1e9d7d9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.messaging();