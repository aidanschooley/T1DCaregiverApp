import express from 'express'
import {getPatientGlucoseSettings, updatePatientGlucoseSettings, getPatientGlucoseSettingsByTime} from '../services/settings/patientGlucoseSettings.js'
const router = express.Router()

router.get('/getSettings/:patientId', async (req, res) => {
  try {
    const settings = await getPatientGlucoseSettings(req.params.patientId);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get('/getSettingsByTime/:patientId/:time', async (req, res) => {
  try {
    const settings = await getPatientGlucoseSettingsByTime(req.params.patientId, req.params.time);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.post('/updateSettings', async (req, res) => {
    const { patientId, lowThreshold, highThreshold, time } = req.body
    try {
        const updatedSettings = await updatePatientGlucoseSettings(patientId, lowThreshold, highThreshold, time);
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router