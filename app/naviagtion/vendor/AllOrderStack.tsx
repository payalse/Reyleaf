import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VendorOrderDetailScreen from '../../screens/vendor/VendorOrderDetailScreen';
import {VendorAllOrdersStackStackParams} from '../types';
import AllOrderScreen from '../../screens/vendor/AllOrderScreen';

const Stack = createNativeStackNavigator<VendorAllOrdersStackStackParams>();
const AllOrderStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AllOrder" component={AllOrderScreen} />
      <Stack.Screen
        name="VendorOrderDetail"
        component={VendorOrderDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default AllOrderStack;
