import { getAllPatients as fetchAllPatients, getPatientById as fetchPatientById, getPatientNameById as fetchPatientNamebyId } from '../services/patient/patientService.js';

export async function getAllPatients(req, res) {
  try {
    const patients = await fetchAllPatients();
    res.json(patients);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Failed to fetch patients', details: err.message });
  }
}

export async function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const patient = await fetchPatientById(id);
    res.json(patient);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Failed to fetch patient', details: err.message });
  }
}

export async function getPatientNameById(req, res) {
  try {
    const { id } = req.params;
    const patient = await fetchPatientNamebyId(id);
    res.json(patient);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Failed to fetch patient', details: err.message });
  }
}

