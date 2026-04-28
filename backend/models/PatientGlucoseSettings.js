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
        const query = `SELECT * FROM patient_glucose_settings WHERE patient_id = $1 AND time = $2`;
        const values = [patientId, time];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) throw new Error(`No glucose settings found for patient ${patientId} at time ${time}`);
        return result.rows[0];
    }
    
    static async updateSettings(patientId, lowThreshold, highThreshold, time) {
        const query = `INSERT INTO patient_glucose_settings (patient_id, low_threshold, high_threshold, time)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (patient_id, time) DO UPDATE
        SET low_threshold = EXCLUDED.low_threshold,
            high_threshold = EXCLUDED.high_threshold
        RETURNING *
        `;
        const values = [patientId, lowThreshold, highThreshold, time];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) throw new Error(`No glucose settings found for patient ${patientId}`);
        return result.rows;
    }
}