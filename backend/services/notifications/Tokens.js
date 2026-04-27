import NotificationToken from '../../models/Notification.js';

export async function storeToken(userId, fcmToken) {
        const result = await NotificationToken.storeToken(userId, fcmToken);
        return result;
}

export async function getToken(userId) {
        return await NotificationToken.getToken(userId);
}