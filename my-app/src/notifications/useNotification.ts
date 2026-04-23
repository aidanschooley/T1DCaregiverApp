import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

const useNotification = () => {

  const requestPermission = async () => {
    if (Number(Platform.Version)  >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log('Notification permission result:', result);
    }
    // Android < 33 grants notification permission automatically
  };

  const getFCMToken = async () => {
    try {
      if (!firebase.apps.length) {
        console.warn('Firebase not initialized yet, skipping FCM token fetch');
        return;
      }

      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await requestPermission();
      await getFCMToken();
    };

    init();

    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
    });

    return unsubscribe;
  }, []);

};

export default useNotification;