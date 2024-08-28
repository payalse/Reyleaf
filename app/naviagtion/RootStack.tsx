import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// SCREENS
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';
import SetNewPasswordScreen from '../screens/auth/SetNewPasswordScreen';
import ForgetPasswordOtpVerificationScreen from '../screens/auth/ForgetPasswordOtpVerificationScreen';
import CompleteYourProfileScreen from '../screens/auth/CompleteYourProfileScreen';
import ChooseProfileImageScreen from '../screens/auth/ChooseProfileImageScreen';
import AccountCreatedSuccessScreen from '../screens/auth/AccountCreatedSuccessScreen';
import AddYourAddressScreen from '../screens/auth/AddYourAddressScreen';
import VendorLoginScreen from '../screens/auth/vendor/VendorLoginScreen';
import VendorSignupScreen from '../screens/auth/vendor/VendorSignupScreen';
import VendorSetNewPasswordScreen from '../screens/auth/vendor/VendorSetNewPasswordScreen';
import VendorOtpVerificationScreen from '../screens/auth/vendor/VendorOtpVerificationScreen';
import VendorForgetPasswordScreen from '../screens/auth/vendor/VendorForgetPasswordScreen';
import VendorForgetPasswordOtpVerificationScreen from '../screens/auth/vendor/VendorForgetPasswordOtpVerificationScreen';
import CompleteYourBusinessProfileScreen from '../screens/auth/vendor/CompleteYourBusinessProfileScreen';
import AddYourBusinessAddressScreen from '../screens/auth/vendor/AddYourBusinessAddressScreen';
import OnBoarding from '../screens/OnBoarding';
import SplashScreen from '../screens/Splash/SplashScreen';
import ApplicationUnderReviewScreen from '../screens/auth/vendor/ApplicationUnderReviewScreen';
import {RootStackParams} from './types';
import DrawerNavigator from './DrawerNavigator';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {useEffect, useState} from 'react';
import ConnectWithCalendarScreen from '../screens/auth/ConnectWithCalendarScreen';
import {requestNotificationPermission} from '../permissions/notification';

const Stack = createNativeStackNavigator<RootStackParams>();
const RootStack = () => {
  const {isAuthenticated} = useSelector((s: RootState) => s.auth);
  const {firstLaunched} = useSelector((s: RootState) => s.app);

  console.log({isAuthenticated});
  const [splashEnable, setSplashEnable] = useState(true);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (splashEnable) {
    return <SplashScreen onEnd={() => setSplashEnable(false)} />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        <>
          {firstLaunched && (
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
          )}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />

          {/* USER */}
          <Stack.Group>
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="OtpVerification"
              component={OtpVerificationScreen}
            />
            <Stack.Screen
              name="ForgetPassword"
              component={ForgetPasswordScreen}
            />
            <Stack.Screen
              name="SetNewPassword"
              component={SetNewPasswordScreen}
            />
            <Stack.Screen
              name="ForgetPasswordOtpVerification"
              component={ForgetPasswordOtpVerificationScreen}
            />
            <Stack.Screen
              name="CompleteYourProfile"
              component={CompleteYourProfileScreen}
            />
            <Stack.Screen
              name="ChooseProfileImage"
              component={ChooseProfileImageScreen}
            />
            <Stack.Screen
              name="AddYourAddress"
              component={AddYourAddressScreen}
            />
            <Stack.Screen
              name="ConnectWithCalendar"
              component={ConnectWithCalendarScreen}
            />
            <Stack.Screen
              name="AccountCreatedSuccess"
              component={AccountCreatedSuccessScreen}
            />
          </Stack.Group>
          {/* VENDOR */}
          <Stack.Group>
            <Stack.Screen name="VendorLogin" component={VendorLoginScreen} />
            <Stack.Screen name="VendorSignup" component={VendorSignupScreen} />
            <Stack.Screen
              name="VendorSetNewPassword"
              component={VendorSetNewPasswordScreen}
            />
            <Stack.Screen
              name="VendorOtpVerification"
              component={VendorOtpVerificationScreen}
            />
            <Stack.Screen
              name="VendorForgetPassword"
              component={VendorForgetPasswordScreen}
            />
            <Stack.Screen
              name="VendorForgetPasswordOtpVerification"
              component={VendorForgetPasswordOtpVerificationScreen}
            />
            <Stack.Screen
              name="CompleteYourBusinessProfile"
              component={CompleteYourBusinessProfileScreen}
            />
            <Stack.Screen
              name="AddYourBusinessAddress"
              component={AddYourBusinessAddressScreen}
            />

            <Stack.Screen
              name="ApplicationUnderReview"
              component={ApplicationUnderReviewScreen}
            />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="AppDrawer" component={DrawerNavigator} />
      )}

      {/* Rest */}
    </Stack.Navigator>
  );
};

export default RootStack;
