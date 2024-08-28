import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '.';
const hasFirstLaunched = async () => {
  try {
    const res = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCHED);
    if (res === null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

export default hasFirstLaunched;
