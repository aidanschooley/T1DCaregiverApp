import { Router } from 'express';
import { formatDataRange } from "./formatDataRange.js"
import tokenService from './tokenService.js'
import pool from '../../config/database.js';
import CGMReading from '../../models/CGMReading.js';

async function fetchLatest() {
    try{
    const AuthToken = await tokenService()
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
        throw new Error(`API error: ${resp.status} - ${data}`);
    }

    const parsedData = JSON.parse(data);
    const records = parsedData.records;
    const history = []
    for (let i = 0; i < 20; i++) {
        const record = records[i];
        const value = record.value;
        const trend = record.trend;
        const systemTime = record.systemTime;
        history.push({ i, value, trend, systemTime });
    }

    return {history, suggestion: "No Suggestion", encouragement: "Keep up the great work!"};

    } catch(err){
        console.error('BG fetch error:', err.message);
        throw err;
    }
}

export { fetchLatest };