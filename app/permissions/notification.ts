import {PermissionsAndroid} from 'react-native';

export const requestNotificationPermission = async () => {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.warn('noti succcs');
  } catch (err) {
    if (__DEV__) {
      console.warn('requestNotificationPermission error: ', err);
    }
  }
};
