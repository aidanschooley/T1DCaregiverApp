import { getCurrentBG } from '../dexcom/fetchLatestBg.js';
import { classifyEvent } from './classifyEvent.js';
import { makeSuggestion } from './makeSuggestion.js';
import { sendNotification } from '../notifications/sendNotification.js';
import { getPatientGlucoseSettingsByTime } from '../settings/patientGlucoseSettings.js';
import { getPatientNameById } from '../patient/patientService.js';
import Alert from '../../models/Alert.js';

function isNocturnalHour() {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 6;
}

export async function composeNotification(bgReading, { lowCountLastHour = 0, highCountLastHour = 0, isRecovering = false } = {}) {
    const reading = bgReading ?? await getCurrentBG();
    const bgValue = reading.value ?? reading;
    const trend = reading.trend ?? null;

    const nocturnal = isNocturnalHour();
    const settings = await getPatientGlucoseSettingsByTime(1, nocturnal ? "nocturnal" : "normal");
    const patientName = await getPatientNameById(1);

    const event = classifyEvent(bgValue, trend, lowCountLastHour, highCountLastHour, nocturnal, isRecovering);
    const suggestion = makeSuggestion(event, bgValue, trend);

    const trendLabel = trend ? ` (${trend})` : '';
    const title = `${patientName}'s BG: ${bgValue} mg/dL${trendLabel}`;
    const body = suggestion.followUp
        ? `${suggestion.action}\n\n${suggestion.followUp}`
        : suggestion.action;

    // Log the clinical event (alert) before attempting delivery
    const alert = await Alert.create({
        settingId: settings.id,
        cgmId: null,
        priorityLevel: suggestion.priority,
        eventClassification: event.name,
        text: title,
        suggestion: body,
        encouragment: suggestion.notificationType === 'passive' ? suggestion.action : null,
        caregiverId: 1,
    });

    // Send the push notification (delivery)
    try {
        await sendNotification(1, title, body, suggestion.priority);
        await Alert.updateDeliveryStatus(alert.id, 'sent');
    } catch (err) {
        await Alert.updateDeliveryStatus(alert.id, 'failed');
        throw err;
    }
}
