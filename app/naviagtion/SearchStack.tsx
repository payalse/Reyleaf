import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartStackParams, SearchStackParams} from './types';
import SearchScreen from '../screens/search/SearchScreen';
import SearchFilterScreen from '../screens/search/SearchFilterScreen';
import SearchResultScreen from '../screens/search/SearchResultScreen';
import AppNotificationScreen from '../screens/AppNotificationScreen';
import ChatStack from './ChatStack';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createNativeStackNavigator<SearchStackParams>();
const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SearchFilter" component={SearchFilterScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      <Stack.Group>
        <Stack.Screen
          name="AppNotification"
          component={AppNotificationScreen}
        />
        <Stack.Screen name="ChatStack" component={ChatStack} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default SearchStack;
