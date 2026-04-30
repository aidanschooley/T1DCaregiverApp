import pool from '../config/database.js';

// Alert queries the notification table for the clinical-event side of a record.
// Each row in notification represents both an alert (what happened: priority_level,
// event_classification) and a notification (how we told the caregiver: delivery_status,
// acknowledged_at). This model owns the alert half.

export default class Alert {
    static async create({ settingId, cgmId, priorityLevel, eventClassification, text, suggestion, encouragment, caregiverId }) {
        const query = `
            INSERT INTO notification
                (setting_id, cgm_id, priority_level, event_classification, text, suggestion, encouragment, delivery_status, caregiver_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
            RETURNING *
        `;
        const result = await pool.query(query, [
            settingId, cgmId ?? null, priorityLevel, eventClassification ?? null,
            text, suggestion ?? null, encouragment ?? null, caregiverId,
        ]);
        return result.rows[0];
    }

    // Join through patient_glucose_settings since cgm_id may be null
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
}
