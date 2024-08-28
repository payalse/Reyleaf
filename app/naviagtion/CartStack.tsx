import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartStackParams} from './types';
import CartScreen from '../screens/cart/CartScreen';
import AddAddressScreen from '../screens/cart/AddAddressScreen';
import CheckOutScreen from '../screens/cart/CheckOutScreen';
import EditAddressScreen from '../screens/cart/EditAddressScreen';
import AddCardScreen from '../screens/cart/AddCardScreen';
import EditCardScreen from '../screens/cart/EditCardScreen';
import OrderSuccessScreen from '../screens/cart/OrderSuccessScreen';
import AppNotificationScreen from '../screens/AppNotificationScreen';
import ChatStack from './ChatStack';
import {OrderStackNavigator} from './DrawerNavigator';

const Stack = createNativeStackNavigator<CartStackParams>();
const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
      <Stack.Screen name="CheckOut" component={CheckOutScreen} />
      <Stack.Screen name="EditCard" component={EditCardScreen} />
      <Stack.Screen name="AddCard" component={AddCardScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Group>
        <Stack.Screen
          name="AppNotification"
          component={AppNotificationScreen}
        />
        <Stack.Screen name="ChatStack" component={ChatStack} />
        <Stack.Screen name="OrderStack" component={OrderStackNavigator} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default CartStack;
