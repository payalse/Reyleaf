import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AllProductStackParams} from '../types';
import AllProductScreen from '../../screens/vendor/AllProductScreen';
import ProductCreateScreen from '../../screens/vendor/ProductCreateScreen';
import ProductEditScreen from '../../screens/vendor/ProductEditScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreen';
import ReviewsScreen from '../../screens/ProductDetailScreen/Reviews';

const Stack = createNativeStackNavigator<AllProductStackParams>();
const AllProductStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'AllProduct'} component={AllProductScreen} />
      <Stack.Screen name={'ProductCreate'} component={ProductCreateScreen} />
      <Stack.Screen name={'ProductEdit'} component={ProductEditScreen} />
      <Stack.Screen name={'ProductDetail'} component={ProductDetailScreen} />
      <Stack.Screen name={'Reviews'} component={ReviewsScreen} />
    </Stack.Navigator>
  );
};

export default AllProductStack;
