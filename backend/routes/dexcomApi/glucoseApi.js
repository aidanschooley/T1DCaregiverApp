const { Router } = require('express');
const { formatDexcomTime } = require("../../function/dexcom_time.js")
const getValidAccessToken = require("../../function/getValidAccessToken.js")
const pool = require('../../db');

const router = Router();

router.get('/bg', async (req, res) => {
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
        return res.status(resp.status).send(data);
    }

    const parsedData = JSON.parse(data);
    const records = parsedData.records[0];

    await pool.query(
    `INSERT INTO cgm_reading (patient_id, bg_value, trend_arrow, created_at)
     VALUES ($1, $2, $3, $4)`,
    [
      1,                  
      records.value,         
      records.trend,       
      records.systemTime     
    ]
  );
    res.send(JSON.parse(data))

    } catch(err){
        console.error('BG fetch error:', err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router