import { getCurrentBG } from '../dexcom/fetchLatestBg.js';
import { classifyPriority } from './classifyPriority.js';
import { sendNotification } from '../notifications/sendNotification.js';
import { getPatientGlucoseSettingsByTime } from '../settings/patientGlucoseSettings.js';


export async function composeNotification() {
        const timestamp = new Date().toLocaleString();
        const dexcomData = await getCurrentBG();
        const settings = await getPatientGlucoseSettingsByTime(1, "normal");
        const priority = await classifyPriority(dexcomData.value, settings);
        await sendNotification(1, `Current BG: ${dexcomData.value} mg/dL`, priority);
        const logMessage = `${timestamp} Current BG: ${dexcomData.value}\n`;
        console.log('Success: ' + logMessage);
}


