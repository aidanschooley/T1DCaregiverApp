import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import api from '../../functions/api.js';

const useNotification = (userId: string | number = 1) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestPermission = async () => {
    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log('Notification permission result:', result);
    }
  };

  const registerToken = async (token: string, retries = 3) => {
    setFcmToken(token);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await api.post('/registerFCMToken', { userId, fcmToken: token });
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

    return () => unsubscribe?.();
  }, []);

  return { fcmToken };
};

export default useNotification;