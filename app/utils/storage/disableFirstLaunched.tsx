import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '.';
const disableFirstLaunched = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCHED, 'FALSE');
  } catch (err) {
    console.log(err);
  }
};

export default disableFirstLaunched;
