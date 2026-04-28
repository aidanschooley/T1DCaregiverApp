import cron from 'node-cron';
import { composeNotification } from '../services/jitai/composeNotification.js';

function backgroundRetrieve() {
    console.log('Starting background retrieval task...');
    //Cron Minute Hour DayOfMonth Month DayOfWeek
    //Every 5 minutes: '*/5 * * * *'
    //Every minute: '* * * * *'
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running retrieval task every 5 minutes');
        await composeNotification();
});
};

export default backgroundRetrieve;
