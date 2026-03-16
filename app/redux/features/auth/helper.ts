import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUserType } from '../../../types';

const STORAGE_KEY = 'AUTH';

export const saveUserToLocal = async (user: AuthUserType): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('[saveUserToLocal] Failed to save user:', error);
    return false;
  }
};

export const getUserFromLocal = async (): Promise<AuthUserType | null> => {
  try {
    const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('[getUserFromLocal] Failed to retrieve user:', error);
    return null;
  }
};

export const removeUserFromLocal = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('[removeUserFromLocal] Failed to remove user:', error);
    return false;
  }
};
