import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProductDetailParams} from './types';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ReviewsScreen from '../screens/ProductDetailScreen/Reviews';

const Stack = createNativeStackNavigator<ProductDetailParams>();
const ProductDetailStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
    </Stack.Navigator>
  );
};

export default ProductDetailStack;
