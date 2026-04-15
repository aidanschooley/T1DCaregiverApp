import cron from 'node-cron';
import fs from 'fs';
import { getCurrentBG } from './fetchLatestBg.js';

console.log('Starting background retrieval task...');
//Cron Minute Hour DayOfMonth Month DayOfWeek
//Every 5 minutes: '*/5 * * * *'
//Every minute: '* * * * *'
cron.schedule('* * * * *', () => {
    console.log('Running retrieval task every 5 minutes');
    const timestamp = new Date().toLocaleString();
    const bgValue = getCurrentBG(); 
    const logMessage = `${timestamp} Current BG: ${bgValue}\n`;
   try {
    console.log('Attempting to write to file...');
    fs.appendFileSync('task-log.txt', logMessage, { mode: 0o666 });
    console.log('Success: ' + logMessage);
  } catch (err) {
    console.error('File Write Error:', err.message);
  }
});
  
