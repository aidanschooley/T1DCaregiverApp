import pool from '../config/database.js';

// Alert queries the notification table for the clinical-event side of a record.
// Each row in notification represents both an alert (what happened: priority_level,
// event_classification) and a notification (how we told the caregiver: delivery_status,
// acknowledged_at). This model owns the alert half.

export default class Alert {
    static async create({ settingId, patientId, priorityLevel, eventClassification, text, suggestion, encouragment, caregiverId }) {
        const query = `
            INSERT INTO notification
                (setting_id, patient_id, priority_level, event_classification, text, suggestion, encouragment, delivery_status, caregiver_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
            RETURNING *
        `;
        const result = await pool.query(query, [
            settingId, patientId ?? null, priorityLevel, eventClassification ?? null,
            text, suggestion ?? null, encouragment ?? null, caregiverId,
        ]);
        return result.rows[0];
    }

    // Join through patient_glucose_settings since patient_id may be null
    static async getByPatient(patientId) {
        const query = `
            SELECT n.*
            FROM notification n
            JOIN patient_glucose_settings s ON n.setting_id = s.id
            WHERE s.patient_id = $1
            ORDER BY n.created_at DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async acknowledge(alertId) {
        const query = `
            UPDATE notification
            SET acknowledged_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [alertId]);
        if (result.rowCount === 0) throw new Error(`No alert found with id ${alertId}`);
        return result.rows[0];
    }

    static async updateDeliveryStatus(alertId, status) {
        const query = `
            UPDATE notification SET delivery_status = $2 WHERE id = $1 RETURNING *
        `;
        const result = await pool.query(query, [alertId, status]);
        return result.rows[0];
    }

    static async wasRecentlyLow(patientId, windowMinutes = 30) {
        const query = `
            SELECT COUNT(*) FROM notification
            WHERE patient_id = $1
              AND event_classification ILIKE '%low%'
              AND created_at >= NOW() - ($2 || ' minutes')::INTERVAL
        `;
        const result = await pool.query(query, [patientId, windowMinutes]);
        return parseInt(result.rows[0].count, 10) > 0;
    }

    static async countRecentByType(patientId, type, windowMinutes = 60) {
        const query = `
            SELECT COUNT(*) FROM notification
            WHERE patient_id = $1
              AND event_classification ILIKE $2
              AND created_at >= NOW() - ($3 || ' minutes')::INTERVAL
        `;
        const result = await pool.query(query, [patientId, `%${type}%`, windowMinutes]);
        return parseInt(result.rows[0].count, 10);
    }

    static async getNotificatons(patientId){
        const query = `
            SELECT * from notification where patient_id = $1 and priority_level in ('P0', 'P1', 'P2')
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;

    }
}
