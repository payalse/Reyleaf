import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AwarenessStackParams} from './types';
import AwarenessScreen from '../screens/awareness/AwarenessScreen';
import AddResourceScreen from '../screens/awareness/AddResourceScreen';
import ForumDetailScreen from '../screens/awareness/ForumDetailScreen';
import JoinedForumDetailScreen from '../screens/awareness/JoinedForumDetailScreen';
import AddContentScreen from '../screens/awareness/AddContentScreen';
import LikeScreen from '../screens/awareness/LikeScreen';
import CommentScreen from '../screens/awareness/CommentScreen';
import EditResourceScreen from '../screens/awareness/EditResourceScreen';
import ResourceDetailScreen from '../screens/awareness/ResourceDetailScreen';
import AppNotificationScreen from '../screens/AppNotificationScreen';
import ChatStack from './ChatStack';
import AddEventScreen from '../screens/event/AddEventScreen';

const Stack = createNativeStackNavigator<AwarenessStackParams>();
const AwarenessStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Awareness" component={AwarenessScreen} />
      <Stack.Screen name="AddResource" component={AddResourceScreen} />
      <Stack.Screen name="ForumDetail" component={ForumDetailScreen} />
      <Stack.Screen
        name="JoinedForumDetail"
        component={JoinedForumDetailScreen}
      />
      <Stack.Screen name="AddContent" component={AddContentScreen} />
      <Stack.Screen name="LikeScreen" component={LikeScreen} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="EditResource" component={EditResourceScreen} />
      <Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
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

export default AwarenessStack;
