import { Router } from 'express';
import { formatDexcomTime } from "../../config/dexcom_time.js"
import getValidAccessToken from "../../config/getValidAccessToken.js"
import pool from '../../config/db.js';
async function getCurrentBG() {
    try{
    const AuthToken = await getValidAccessToken()
    const [startDate, endDate] = await formatDexcomTime();
    const query = new URLSearchParams({ startDate, endDate }).toString();
 

    
    const resp = await fetch(
    `https://sandbox-api.dexcom.com/v3/users/self/egvs?${query}`,
    {
        method: 'GET',
        headers: {
        Authorization: 'Bearer ' + AuthToken
        }
    }
    );

    const data = await resp.text();

    if (!resp.ok) {
        throw new Error(`API error: ${resp.status} - ${data}`);
    }

    const parsedData = JSON.parse(data);
    const records = parsedData.records[0];

//     await pool.query(
//     `INSERT INTO cgm_reading (patient_id, bg_value, trend_arrow, created_at)
//      VALUES ($1, $2, $3, $4)`,
//     [
//       1,                  
//       records.value,         
//       records.trend,       
//       records.systemTime     
//     ]
//   );
    return records;

    } catch(err){
        console.error('BG fetch error:', err.message);
        throw err;
    }
}

export { getCurrentBG };