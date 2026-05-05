import Alert from '../models/Alert.js';

export async function getAlerts(req, res) {
    const { patientId } = req.params;
    try {
        const alerts = await Alert.getByPatient(patientId);
        res.json({ success: true, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function logAlert(req, res) {
    const { settingId, patientId, priorityLevel, eventClassification, text, suggestion, encouragment, caregiverId } = req.body;
    try {
        const alert = await Alert.create({ settingId, patientId, priorityLevel, eventClassification, text, suggestion, encouragment, caregiverId });
        res.status(201).json({ success: true, data: alert });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function acknowledgeAlert(req, res) {
    const { id } = req.params;
    try {
        const alert = await Alert.acknowledge(id);
        res.json({ success: true, data: alert });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function getNotifications(req, res) {
    const { id } = req.params;
    try {
        const alert = await Alert.getNotificatons(id);
        res.json({ success: true, data: alert });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


