import { getCurrentBG } from '../dexcom/fetchLatestBg.js';
import { classifyPriority } from './classifyPriority.js';
import { sendNotification } from '../notifications/sendNotification.js';
import { getPatientGlucoseSettingsByTime } from '../settings/patientGlucoseSettings.js';
import { getPatientNameById } from '../patient/patientService.js';
import Alert from '../../models/Alert.js';

export async function composeNotification(bg) {
    const bgValue = bg ?? (await getCurrentBG()).value;
    const settings = await getPatientGlucoseSettingsByTime(1, "normal");
    const priority = await classifyPriority(bgValue, settings);
    const patientName = await getPatientNameById(1);

    const text = `${patientName}'s current blood sugar is ${bgValue} mg/dL`;
    const suggestion = `Priority: ${priority}`;

    // Log the clinical event (alert) before attempting delivery
    const alert = await Alert.create({
        settingId: settings.id,
        cgmId: null,
        priorityLevel: priority,
        eventClassification: null,
        text,
        suggestion,
        encouragment: null,
        caregiverId: 1,
    });

    // Send the push notification (delivery)
    try {
        await sendNotification(1, text, suggestion, priority);
        await Alert.updateDeliveryStatus(alert.id, 'sent');
    } catch (err) {
        await Alert.updateDeliveryStatus(alert.id, 'failed');
        throw err;
    }
}
