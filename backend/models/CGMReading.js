import pool from '../config/database.js';

class CGMReading {
    static async create(patientId, bgValue, trendArrow, timestamp) {
        const query = 
        `INSERT INTO cgm_reading (patient_id, bg_value, trend_arrow, created_at)
        VALUES ($1, $2, $3, $4)`
        const values = [patientId, bgValue, trendArrow, timestamp];
        try {
            await pool.query(query, values);
        } catch (err) {
            console.error('Error inserting CGM reading:', err);
            throw err;
        }
        return { patientId, bgValue, trendArrow, timestamp };
    }
}
export default CGMReading;