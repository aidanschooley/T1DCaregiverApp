import pool from '../config/database.js';

class NotificationToken {
    static async storeToken(userId, fcmToken) {
        const query = `UPDATE caregiver SET fcm_token = $1 WHERE id = $2`;
        const values = [String(fcmToken), userId];
        const result = await pool.query(query, values);
    
        if (result.rowCount === 0) throw new Error(`No caregiver found with id ${userId}`);
        return result.rows[0];
    }
}

export default NotificationToken;