import { Router } from 'express';
import { getAlerts, logAlert, acknowledgeAlert } from '../controllers/alertController.js';

const router = Router();

// /api/alerts
router.get('/:patientId', getAlerts);
router.post('/', logAlert);
router.patch('/:id/acknowledge', acknowledgeAlert);

export default router;
