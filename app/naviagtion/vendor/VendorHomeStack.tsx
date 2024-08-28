import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VendorHomeScreen from '../../screens/vendor/VendorHomeScreen';
import VendorOrderDetailScreen from '../../screens/vendor/VendorOrderDetailScreen';
import {VendorHomeStackParams} from '../types';
import ChatStack from '../ChatStack';
import AppNotificationScreen from '../../screens/AppNotificationScreen';

const Stack = createNativeStackNavigator<VendorHomeStackParams>();
const VendorHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
      <Stack.Screen
        name="VendorOrderDetail"
        component={VendorOrderDetailScreen}
      />

      <Stack.Screen name="ChatStack" component={ChatStack} />
      <Stack.Screen name="AppNotification" component={AppNotificationScreen} />
    </Stack.Navigator>
  );
};

export default VendorHomeStack;
