import { Router } from 'express';
import { storeToken } from '../services/notifications/Tokens.js';
import { sendNotification } from '../services/notifications/sendNotification.js';
import { composeNotification } from '../services/jitai/composeNotification.js';

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

router.post('/sendNotification', async (req, res) => {
  const { userId, title, body } = req.body;
  try {
    await sendNotification(userId, title, body);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/sendComposedNotification', async (req, res) =>{
  try{
    await composeNotification()
    res.json({success: true, message: "Notification Composed and Sent"})
  } catch (error){
    res.status(500).json({success:false, error: error.message})
  }

})

router.post('/sendComposedNotification/:bg', async (req, res) =>{
  try{
    await composeNotification(req.params.bg)
    res.json({success: true, message: "Notification Composed and Sent"})
  }catch(error){
    res.status(500).json({success:false, error: error.message})
  }

})

export default router;
