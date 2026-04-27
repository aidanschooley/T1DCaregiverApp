const messaging = require('./firebaseConfig');

async function sendNotification(deviceToken, title, body) {
  const message = {
    notification: { title, body },
    token: deviceToken
  };

  const response = await messaging.send(message);
  console.log('Sent:', response);
}

export default sendNotification;