import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import api from '../../functions/api.js';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const useNotification = (userId: string | number = 1) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log('Notification permission result:', status);
  };

  const registerToken = async (token: string, retries = 3) => {
    setFcmToken(token);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await api.post('api/alerts/registerFCMToken', { userId, fcmToken: token });
        console.log('FCM token registered successfully');
        return;
      } catch {
        if (attempt < retries) await new Promise(r => setTimeout(r, attempt * 3000));
      }
    }
    if (__DEV__) console.log('FCM token registration failed after retries');
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      await requestPermission();

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('glucose-alerts', {
          name: 'Glucose Alerts',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }

      try {
        const token = await messaging().getToken();
        console.log('FCM token obtained:', token);

        await registerToken(token);
        unsubscribe = messaging().onTokenRefresh(registerToken);
      } catch {
        console.log('Failed to get FCM token');
      }
    };

    init();

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification ?? {};
      await Notifications.scheduleNotificationAsync({
        content: { title: title ?? '', body: body ?? '', sound: true },
        trigger: null,
        ...(Platform.OS === 'android' && { channelId: 'glucose-alerts' }),
      });
    });

    return () => {
      unsubscribe?.();
      unsubscribeForeground();
    };
  }, []);

  return { fcmToken };
};

export default useNotification;