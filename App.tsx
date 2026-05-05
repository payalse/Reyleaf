import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
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
import requestUserPermission, {
  setupTokenRefreshListener,
} from './app/utils/notifiactionService';
import { api_updateFcmToken } from './app/api/user';
import './app/sheets/sheets';
import { AppConfig } from './app/config/env';

export const STRIPE_PK = AppConfig.STRIPE_KEY;

const AppInit = () => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let cancelled = false;

    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      if (cancelled) {
        return;
      }
      void (async () => {
        try {
          const fcmToken = await requestUserPermission();
          if (cancelled || !fcmToken) {
            return;
          }
          const user = await getUserFromLocal();
          if (user?.token) {
            api_updateFcmToken(user.token, fcmToken).catch(() => {});
          }
        } catch {
          //
        }
      })();
    });

    void (async () => {
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
        console.log('Error:AppInit', error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      interactionHandle.cancel?.();
    };
  }, [dispatch]);

  if (isReady) {
    return <RootStack />;
  }
  return <LoadingScreen />;
};

function App() {
  useEffect(() => {
    const unsubscribeTokenRefresh = setupTokenRefreshListener();
    return () => unsubscribeTokenRefresh();
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
