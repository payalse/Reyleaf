import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './app/naviagtion/RootStack';
import LoadingScreen from './app/screens/Loading/LoadingScreen';
import { Provider, useDispatch } from 'react-redux';
import store, { AppDispatch } from './app/redux/store';
import { StorageHelper } from './app/utils/storage';
import {
  changeAppMode,
  setFirstLaunched,
  updateDefaultAvatar,
} from './app/redux/features/app/appSlice';
import { getUserFromLocal } from './app/redux/features/auth/helper';
import { login, setIsAuthenticated } from './app/redux/features/auth/authSlice';
import { SheetProvider } from 'react-native-actions-sheet';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { DefaultAvatar } from './app/utils/defaultAvatar';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AppAlertProvider } from './app/context/AppAlertContext';
import requestUserPermission from './app/utils/notifiactionService';
import './app/sheets/sheets';
import { AppConfig } from './app/config/env';

export const STRIPE_PK = AppConfig.STRIPE_KEY

const AppInit = () => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const run = async () => {
    try {
      const res = await StorageHelper.hasFirstLaunched();
      const loacalUser = await getUserFromLocal();
      const defaultAvatar = await DefaultAvatar.getDefaultAvatarFromLocal();

      if (res) {
        dispatch(setFirstLaunched(true));
      }

      if (loacalUser !== null) {
        if (loacalUser.role === 2) {
          dispatch(changeAppMode('VENDOR'));
        }
        dispatch(login(loacalUser));
        dispatch(setIsAuthenticated(true));
      }
      if (defaultAvatar?.img) {
        dispatch(updateDefaultAvatar(defaultAvatar));
      }
    } catch (error) {
      console.log("Error:AppInit");
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    run();
  }, []);

  if (isReady) {
    return <RootStack />;
  } else {
    return <LoadingScreen />;
  }
};

function App() {
  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <AppAlertProvider>
      <StripeProvider publishableKey={STRIPE_PK}>
        <Provider store={store}>
          <NavigationContainer>
            <SheetProvider>
              <AlertNotificationRoot>
                <AppInit />
              </AlertNotificationRoot>
            </SheetProvider>
          </NavigationContainer>
        </Provider>
      </StripeProvider>
    </AppAlertProvider>
  );
}

export default App;
