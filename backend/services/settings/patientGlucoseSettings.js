import PatientGlucoseSettings from '../../models/PatientGlucoseSettings.js';

async function getPatientGlucoseSettings(patientId) {
    try {
        const settings = await PatientGlucoseSettings.getSettings(patientId);
        return settings;
    } catch (error) {
        console.error(`Error fetching glucose settings for patient ${patientId}:`, error);
        throw error;
    }
}

async function getPatientGlucoseSettingsByTime(patientId, time) {
    try {
        const settings = await PatientGlucoseSettings.getSettingsByTime(patientId, time);
        return settings;
    } catch (error) {
        console.error(`Error fetching glucose settings for patient ${patientId} at time ${time}:`, error);
        throw error;
    }
}

async function updatePatientGlucoseSettings(patientId, lowThreshold, highThreshold, urgentHighThreshold, urgentLowThreshold, time) {
    try {
        const updatedSettings = await PatientGlucoseSettings.updateSettings(patientId, lowThreshold, highThreshold, urgentHighThreshold, urgentLowThreshold, time);
        return updatedSettings;
    } catch (error) {
        console.error(`Error updating glucose settings for patient ${patientId}:`, error);
        throw error;
    }
}

export { getPatientGlucoseSettings, updatePatientGlucoseSettings, getPatientGlucoseSettingsByTime };