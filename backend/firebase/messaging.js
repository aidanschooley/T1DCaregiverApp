const messaging = require('./firebaseConfig');

async function sendNotification(deviceToken, title, body) {
  const message = {
    notification: { title, body },
    token: deviceToken,  // the FCM registration token from the Android device
  };

  const response = await messaging.send(message);
  console.log('Sent:', response);
}