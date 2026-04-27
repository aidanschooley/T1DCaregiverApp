import { Router } from 'express';
import NotificationToken from '../models/Notification.js';

const router = Router();

router.post('/registerFCMToken', async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
    const result = await NotificationToken.storeToken(userId, fcmToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
