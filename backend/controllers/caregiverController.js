import Caregiver from '../models/Caregiver.js'

export async function getCaregiverById(req, res) {
  const { id } = req.params;
  try {
    const caregiver = await Caregiver.getCaregiverById(id);
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }
    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
