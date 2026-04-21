import { Router } from 'express';
import { formatDataRange } from "../../services/dexcom/formatDataRange.js"
import tokenService from '../../services/dexcom/tokenService.js'
import pool from '../../config/database.js';
import {fetchDataRange} from '../../services/dexcom/fetchDataRange.js'

const router = Router();

router.get('/bg', async (req, res) => {
    try{
    const AuthToken = await tokenService()
    const LatestBGTime = await fetchDataRange(AuthToken);
    const query = await formatDataRange();

 
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
        return res.status(resp.status).send(data);
    }

    const parsedData = JSON.parse(data);
    const records = parsedData.records[0];
    console.log('Latest BG Record:', records);

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
    res.send(records);

    } catch(err){
        console.error('BG fetch error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router