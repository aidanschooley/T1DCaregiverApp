import { Router } from 'express';
import { getAlerts, logAlert, acknowledgeAlert, getNotifications } from '../controllers/alertController.js';
import {
  registerFCMToken,
  sendManualNotification,
  sendComposedNotification,
  sendComposedNotificationWithBg,
} from '../controllers/notificationController.js';

const router = Router();

// /api/alerts
router.get('/notifications/:id', getNotifications);
router.get('/:patientId', getAlerts);
router.post('/', logAlert);
router.patch('/:id/acknowledge', acknowledgeAlert);

// FCM / push notifications
router.post('/registerFCMToken', registerFCMToken);
router.post('/sendNotification', sendManualNotification);
router.post('/sendComposedNotification', sendComposedNotification);
router.post('/sendComposedNotification/:bg', sendComposedNotificationWithBg);

export default router;
