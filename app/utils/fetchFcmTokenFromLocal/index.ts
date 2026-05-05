import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

async function ensureAndroidNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 33) {
    return;
  }
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (!granted) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  } catch (e) {
    console.log('ensureAndroidNotificationPermission', e);
  }
}

export async function getLatestFcmTokenForAuth(): Promise<string> {
  try {
    await ensureAndroidNotificationPermission();
    await messaging().requestPermission();
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem('fcmToken', token);
      return token;
    }
  } catch (err) {
    console.log('getLatestFcmTokenForAuth', err);
  }
  return '';
}

export const fetchFcmTokenFromLocal = (): Promise<string> =>
  getLatestFcmTokenForAuth();
