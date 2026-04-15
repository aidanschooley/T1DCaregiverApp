import cron from 'node-cron';
import fs from 'fs';
import { getCurrentBG } from '../../routes/dexcomApi/fetchLatestBg.js'
import {classifyPriority} from './priorityClassifier.js';

console.log('Starting background retrieval task...');
//Cron Minute Hour DayOfMonth Month DayOfWeek
//Every 5 minutes: '*/5 * * * *'
//Every minute: '* * * * *'
cron.schedule('* * * * *', async () => {
    console.log('Running retrieval task every 5 minutes');
    const timestamp = new Date().toLocaleString();
    const dexcomData = await getCurrentBG();

    const logMessage = `${timestamp} Current BG: ${dexcomData.value}\n`;
    console.log('Success: ' + logMessage);
});
  
