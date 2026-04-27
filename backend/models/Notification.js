import pool from '../config/database.js';

class NotificationToken {
    static async storeToken(userId, fcmToken) {
        const query = `UPDATE caregiver SET fcm_token = $1 WHERE id = $2`;
        const values = [String(fcmToken), userId];
        await pool.query(query, values);
    }
}

export default NotificationToken;