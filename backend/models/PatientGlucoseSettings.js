import pool from '../config/database.js';

export default class PatientGlucoseSettings {
    static async getSettings(patientId) {
        const query = `SELECT * FROM patient_glucose_settings WHERE patient_id = $1`;
        const values = [patientId];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) throw new Error(`No glucose settings found for patient ${patientId}`);
        return result.rows;
    }

    static async getSettingsByTime(patientId, time) {
        const query = `
            SELECT * FROM patient_glucose_settings
            WHERE patient_id = $1
            ORDER BY CASE WHEN time = $2 THEN 0 ELSE 1 END
            LIMIT 1
        `;
        const values = [patientId, time];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) throw new Error(`No glucose settings found for patient ${patientId}`);
        return result.rows[0];
    }
    
    static async updateSettings(patientId, lowThreshold, highThreshold, urgentHighThreshold, urgentLowThreshold, time) {
        const query = `INSERT INTO patient_glucose_settings (patient_id, low_threshold, high_threshold, urgent_high_threshold, urgent_low_threshold, time)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (patient_id, time) DO UPDATE
        SET low_threshold = EXCLUDED.low_threshold,
            high_threshold = EXCLUDED.high_threshold,
            urgent_high_threshold = EXCLUDED.urgent_high_threshold,
            urgent_low_threshold = EXCLUDED.urgent_low_threshold
        RETURNING *
        `;
        const values = [patientId, lowThreshold, highThreshold, urgentHighThreshold, urgentLowThreshold, time];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) throw new Error(`No glucose settings found for patient ${patientId}`);
        return result.rows;
    }
}