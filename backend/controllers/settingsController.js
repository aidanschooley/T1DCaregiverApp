import {
  getPatientGlucoseSettings,
  updatePatientGlucoseSettings,
  getPatientGlucoseSettingsByTime,
} from '../services/settings/patientGlucoseSettings.js'

export async function getSettings(req, res) {
  try {
    const settings = await getPatientGlucoseSettings(req.params.patientId);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getSettingsByTime(req, res) {
  try {
    const settings = await getPatientGlucoseSettingsByTime(req.params.patientId, req.params.time);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateSettings(req, res) {
  const { patientId, lowThreshold, highThreshold, urgentHighThreshold, urgentLowThreshold, time } = req.body;
  try {
    const updatedSettings = await updatePatientGlucoseSettings(patientId, lowThreshold, highThreshold, urgentHighThreshold, urgentLowThreshold, time);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
