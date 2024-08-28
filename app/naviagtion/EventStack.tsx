import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EventStackParams} from './types';
import EventScreen from '../screens/event/EventScreen';
import EventDetailScreen from '../screens/event/EventDetailScreen';
import AppNotificationScreen from '../screens/AppNotificationScreen';
import ChatStack from './ChatStack';
import AddEventScreen from '../screens/event/AddEventScreen';

const Stack = createNativeStackNavigator<EventStackParams>();
const EventStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="AddEVent" component={AddEventScreen} />
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

export default EventStack;
