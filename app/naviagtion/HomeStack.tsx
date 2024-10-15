import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParams} from './types';
import HomeScreen from '../screens/home/HomeScreen';
import NewlyArrivalScreen from '../screens/home/NewlyArrivalScreen';
import BestSellingScreen from '../screens/home/BestSellingScreen';
import RecentlyViewedScreen from '../screens/home/RecentlyViewedScreen';
import TrendingProductsScreen from '../screens/home/TrendingProductsScreen';
import SimilarProductScreen from '../screens/home/SimilarProductScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AppNotificationScreen from '../screens/AppNotificationScreen';
import ChatStack from './ChatStack';
import SearchFilterScreen from '../screens/search/SearchFilterScreen';
import SearchResultScreen from '../screens/search/SearchResultScreen';
import ReviewsScreen from '../screens/ProductDetailScreen/Reviews';
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';

const Stack = createNativeStackNavigator<HomeStackParams>();
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="TrendingProduct" component={TrendingProductsScreen} />
      <Stack.Screen name="NewlyArrival" component={NewlyArrivalScreen} />
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />
      <Stack.Screen name="BestSelling" component={BestSellingScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="SimilarProducts" component={SimilarProductScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Group>
        <Stack.Screen
          name="AppNotification"
          component={AppNotificationScreen}
        />
        <Stack.Screen name="SearchFilter" component={SearchFilterScreen} />
        <Stack.Screen name="ChatStack" component={ChatStack} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
export default HomeStack;
