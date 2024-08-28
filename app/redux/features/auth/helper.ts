import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthUserType} from '../../../types';
export const saveUserToLocal = async (user: AuthUserType) => {
  try {
    await AsyncStorage.setItem('AUTH', JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
};
export const getUserFromLocal = async (): Promise<AuthUserType | null> => {
  try {
    const user = await AsyncStorage.getItem('AUTH');
    if (!user) {
      return null;
    } else {
      return JSON.parse(user);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const removeUserFromLocal = async () => {
  try {
    await AsyncStorage.removeItem('AUTH');
  } catch (error) {
    console.log(error);
  }
};
