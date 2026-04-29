import { storeToken } from '../services/notifications/Tokens.js'
import { sendNotification } from '../services/notifications/sendNotification.js'
import { composeNotification } from '../services/jitai/composeNotification.js'

export async function registerFCMToken(req, res) {
  const { userId, fcmToken } = req.body;
  try {
    const result = await storeToken(userId, fcmToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function sendManualNotification(req, res) {
  const { userId, title, body } = req.body;
  try {
    await sendNotification(userId, title, body);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function sendComposedNotification(req, res) {
  try {
    await composeNotification();
    res.json({ success: true, message: 'Notification Composed and Sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function sendComposedNotificationWithBg(req, res) {
  try {
    await composeNotification(Number(req.params.bg));
    res.json({ success: true, message: 'Notification Composed and Sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
