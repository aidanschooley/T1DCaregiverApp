import { getToken } from './Tokens.js'
import messaging from '../../config/firebase.js'

export async function sendNotification(userId, title, body, priority) {
  const fcmToken = await getToken(userId);
  if (!fcmToken) throw new Error(`No FCM token found for user ${userId}`);

  const isUrgent = ["P0", "P1", "P2"].includes(priority);
  const message = isUrgent
    ? {
        notification: { title, body },
        token: fcmToken,
        android: {
          priority: "high",
          notification: {
            priority: "MAX",
            default_sound: true,
            default_vibrate_timings: true,
          },
        },
      }
    : {
        notification: { title, body },
        token: fcmToken,
      };
  const response = await messaging.send(message);
  console.log("Sent:", response, isUrgent ? "Priority High" : "Normal Priority");
}
