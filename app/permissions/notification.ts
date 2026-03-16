import {PermissionsAndroid} from 'react-native';

export const requestNotificationPermission = async () => {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  } catch (err) {
    if (__DEV__) {
    }
  }
};
