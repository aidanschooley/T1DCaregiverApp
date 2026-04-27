import { Router } from 'express';
import NotificationToken from '../models/Notification.js';
import { storeToken, getToken } from '../services/notifications/Tokens.js';
import admin from '../services/notifications/FirebaseAdmin.js';

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


router.post('/sendNotification', async (req, res) => {
  const { userId, title, body } = req.body;
  try {
    const fcmToken = await getToken(userId);
    if (!fcmToken) throw new Error(`No FCM token found for user ${userId}`);
    
    const message = {
            notification: {
                title: title,
                body: body
            },
            token: fcmToken
          };
          
    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
