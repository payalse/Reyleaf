import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FIRST_LAUNCHED: 'FIRST_LAUNCHED',
};

class StorageHelperClass {
  constructor() {}

  //disable flag for check if app is launched first time
  disableFirstLaunched = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCHED, 'FALSE');
    } catch (err) {
      console.log(err);
    }
  };
  // check if app is launched first time
  hasFirstLaunched = async () => {
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
}

const StorageHelper = new StorageHelperClass();

export {STORAGE_KEYS, StorageHelper};
