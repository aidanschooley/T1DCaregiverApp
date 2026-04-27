import NotificationToken from '../../models/NotificationToken';

async function storeToken(userId, fcmToken) {
        await NotificationToken.storeToken(userId, fcmToken);
}