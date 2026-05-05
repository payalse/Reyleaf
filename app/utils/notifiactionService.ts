import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserFromLocal } from '../redux/features/auth/helper';
import { api_updateFcmToken } from '../api/user';
import { getLatestFcmTokenForAuth } from './fetchFcmTokenFromLocal';

export default function requestUserPermission(): Promise<string> {
  return getLatestFcmTokenForAuth();
}

export const getFcmToken = () => getLatestFcmTokenForAuth();

export const setupTokenRefreshListener = () => {
  return messaging().onTokenRefresh(async newToken => {
    await AsyncStorage.setItem('fcmToken', newToken);
    const user = await getUserFromLocal();
    if (user?.token) {
      api_updateFcmToken(user.token, newToken).catch(err =>
        console.log('Failed to update FCM token on server:', err),
      );
    }
  });
};
