import pool from '../config/database.js';

export default class NotificationToken {
    static async storeToken(userId, fcmToken) {
        const query = `UPDATE caregiver SET fcm_token = $1 WHERE id = $2 RETURNING *`;
        const values = [String(fcmToken), userId];
        const result = await pool.query(query, values);
    
        if (result.rowCount === 0) throw new Error(`No caregiver found with id ${userId}`);
        return result.rows[0];
    }
    static async getToken(userId) {
        const query = `SELECT fcm_token FROM caregiver WHERE id = $1`;
        const values = [userId];
        const result = await pool.query(query, values);
    
        if (result.rowCount === 0) throw new Error(`No caregiver found with id ${userId}`);
        return result.rows[0].fcm_token;
    }  
}