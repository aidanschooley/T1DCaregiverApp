import NotificationToken from '../../models/Notification.js';

export async function storeToken(userId, fcmToken) {
        const result = await NotificationToken.storeToken(userId, fcmToken);
        return result;
}

export async function getToken(userId) {
        const result = await NotificationToken.getToken(userId);
        return result[0].fcm_token;
}