import { getCurrentBG } from '../dexcom/fetchLatestBg.js';
import { classifyEvent, parseTrend, trendArrow } from './classifyEvent.js';
import { makeSuggestion } from './makeSuggestion.js';
import { sendNotification } from '../notifications/sendNotification.js';
import { getPatientGlucoseSettingsByTime } from '../settings/patientGlucoseSettings.js';
import { getPatientNameById } from '../patient/patientService.js';
import Alert from '../../models/Alert.js';

function isNocturnalHour() {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 6;
}

export async function composeNotification(bgReading) {
    const reading = bgReading ?? await getCurrentBG();
    const bgValue = reading.value ?? reading;
    const rawTrend = reading.trend ?? null;
    const numericTrend = parseTrend(rawTrend);

    const nocturnal = isNocturnalHour();
    const inRange = bgValue >= 70 && bgValue <= 180;

    const [settings, patientName, lowCountLastHour, highCountLastHour, isRecovering] = await Promise.all([
        getPatientGlucoseSettingsByTime(1, nocturnal ? "nocturnal" : "normal"),
        getPatientNameById(1),
        Alert.countRecentByType(1, 'low'),
        Alert.countRecentByType(1, 'high'),
        inRange ? Alert.wasRecentlyLow(1) : Promise.resolve(false),
    ]);

    const event = classifyEvent(bgValue, numericTrend, lowCountLastHour, highCountLastHour, nocturnal, isRecovering);
    const suggestion = makeSuggestion(event, bgValue, numericTrend);

    const arrow = trendArrow(rawTrend);
    const eventLabel = event.name.replace(/\b\w/g, c => c.toUpperCase());
    const title = `${patientName}'s BG: ${bgValue} mg/dL${arrow ? ' ' + arrow : ''} — ${eventLabel}`;
    const body = suggestion.followUp
        ? `${suggestion.action}\n\n${suggestion.followUp}`
        : suggestion.action;

    // Log the clinical event (alert) before attempting delivery
    const alert = await Alert.create({
        settingId: settings.id,
        patientId: 1,
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

    return { event, suggestion, title, body };
}
