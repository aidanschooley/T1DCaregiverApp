import express from 'express'
import { getSettings, getSettingsByTime, updateSettings } from '../controllers/settingsController.js'

const router = express.Router()

router.get('/getSettings/:patientId', getSettings)
router.get('/getSettingsByTime/:patientId/:time', getSettingsByTime)
router.post('/updateSettings', updateSettings)

export default router
