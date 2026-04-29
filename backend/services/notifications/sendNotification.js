import { getToken } from './Tokens.js';
import sendNotificationFCM from '../../firebase/messaging.js';

export async function sendNotification(userId, title, body, priority) {
  const fcmToken = await getToken(userId);
  if (!fcmToken) throw new Error(`No FCM token found for user ${userId}`);
  if (["P0", "P1", "P2"].includes(priority)) await sendNotificationFCM(fcmToken, title, body, "urgent");
}
