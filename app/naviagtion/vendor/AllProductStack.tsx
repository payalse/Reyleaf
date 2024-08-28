import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AllProductStackParams} from '../types';
import AllProductScreen from '../../screens/vendor/AllProductScreen';
import ProductCreateScreen from '../../screens/vendor/ProductCreateScreen';

const Stack = createNativeStackNavigator<AllProductStackParams>();
const AllProductStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'AllProduct'} component={AllProductScreen} />
      <Stack.Screen name={'ProductCreate'} component={ProductCreateScreen} />
    </Stack.Navigator>
  );
};

export default AllProductStack;
