import { Router } from 'express';
import NotificationToken from '../models/Notification.js';
import { storeToken, getToken } from '../services/notifications/Tokens.js';

const router = Router();

router.post('/registerFCMToken', async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
    const result = await storeToken(userId, fcmToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

router.get('/getFCMToken/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await getToken(userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
