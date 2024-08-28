import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchFcmTokenFromLocal = async () => {
  try {
    const token = await AsyncStorage.getItem('fcmToken');
    if (token) {
      return token;
    } else {
      return '';
    }
  } catch (err) {
    return '';
  }
};
