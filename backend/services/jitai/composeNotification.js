import { getCurrentBG } from '../dexcom/fetchLatestBg.js';
import { classifyPriority } from './classifyPriority.js';
import { sendNotification } from '../notifications/sendNotification.js';
import { getPatientGlucoseSettingsByTime } from '../settings/patientGlucoseSettings.js';
import { getPatientNameById } from '../patient/patientService.js';


export async function composeNotification(bg) {
        const timestamp = new Date().toLocaleString();
        const bgValue = bg ?? (await getCurrentBG()).value;
        const settings = await getPatientGlucoseSettingsByTime(1, "normal");
        const priority = await classifyPriority(bgValue, settings);
        const patientName = await getPatientNameById(1);
        console.log(patientName)
        await sendNotification(1, `${patientName}'s current blood sugar is ${bgValue} mg/dL`, `Priority: ${priority}`, priority);
}
