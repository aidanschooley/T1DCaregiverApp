import { getToken } from './Tokens.js';
import sendNotificationFCM from '../../firebase/messaging.js';

export async function sendNotification(userId, title, body) {
  const fcmToken = await getToken(userId);
  if (!fcmToken) throw new Error(`No FCM token found for user ${userId}`);
  await sendNotificationFCM(fcmToken, title, body);
}
