import NotificationToken from '../../models/NotificationToken';

export async function storeToken(userId, fcmToken) {
        await NotificationToken.storeToken(userId, fcmToken);
}

export async function getToken(userId) {
        return await NotificationToken.getToken(userId);
}