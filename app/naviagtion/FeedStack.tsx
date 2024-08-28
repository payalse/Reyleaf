import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FeedStackParams} from './types';
import FeedScreen from '../screens/feed/FeedScreen';
import LikeScreen from '../screens/feed/LikeScreen';
import CommentScreen from '../screens/feed/CommentScreen';
import CreateFeedScreen from '../screens/feed/CreateFeedScreen';
import AppNotificationScreen from '../screens/AppNotificationScreen';
import ChatStack from './ChatStack';

const Stack = createNativeStackNavigator<FeedStackParams>();
const FeedStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="LikeScreen" component={LikeScreen} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="CreateFeed" component={CreateFeedScreen} />
      <Stack.Group>
        <Stack.Screen
          name="AppNotification"
          component={AppNotificationScreen}
        />
        <Stack.Screen name="ChatStack" component={ChatStack} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default FeedStack;
