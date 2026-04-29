import { Router } from 'express'
import {
  registerFCMToken,
  sendManualNotification,
  sendComposedNotification,
  sendComposedNotificationWithBg,
} from '../controllers/notificationController.js'

const router = Router()

router.post('/registerFCMToken', registerFCMToken)
router.post('/sendNotification', sendManualNotification)
router.post('/sendComposedNotification', sendComposedNotification)
router.post('/sendComposedNotification/:bg', sendComposedNotificationWithBg)

export default router
